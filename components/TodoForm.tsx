import React, { useState } from 'react';
import { Todo, Category, Priority } from '../types';
import { CATEGORIES, PRIORITIES } from '../constants';
import { parseTasksFromString } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { PlusIcon } from './icons/PlusIcon';
import CustomSelect from './CustomSelect';

interface TodoFormProps {
  onAddTodo: (todo: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => void;
  onAddTodos: (todos: Omit<Todo, 'id' | 'completed' | 'createdAt'>[]) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo, onAddTodos }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>(Category.Personal);
  const [priority, setPriority] = useState<Priority>(Priority.Medium);
  const [dueDate, setDueDate] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [isSmartAdd, setIsSmartAdd] = useState(false);
  const [smartText, setSmartText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo({ text, category, priority, dueDate: dueDate || undefined, reminderDate: reminderDate || undefined });
      setText('');
      setDueDate('');
      setReminderDate('');
    }
  };

  const handleSmartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smartText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const parsedTasks = await parseTasksFromString(smartText);
      if (parsedTasks && parsedTasks.length > 0) {
        onAddTodos(parsedTasks);
        setSmartText('');
      } else {
        throw new Error('Could not parse any tasks. Please check your phrasing.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-lime-400">Add New Task(s)</h2>
        <button
          onClick={() => setIsSmartAdd(!isSmartAdd)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-lime-500 ${
            isSmartAdd
              ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50'
              : 'bg-lime-500 text-slate-900 hover:bg-lime-600 shadow-lg shadow-lime-500/30'
          }`}
        >
          <SparklesIcon />
          {isSmartAdd ? 'Use Manual Form' : 'Use Smart Add'}
        </button>
      </div>

      {isSmartAdd ? (
        <form onSubmit={handleSmartSubmit} className="space-y-4">
          <div>
            <label htmlFor="smart-task" className="block text-sm font-medium text-slate-400 mb-1">
              Describe your task(s), one per line. (e.g., "Finish report by 5pm Friday")
            </label>
            <textarea
              id="smart-task"
              value={smartText}
              onChange={(e) => setSmartText(e.target.value)}
              placeholder="e.g., 'Buy milk and eggs from the store'\n'Call the doctor for next Tuesday at 10am'"
              className="w-full bg-slate-800/70 border border-slate-700/80 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition placeholder:text-slate-500"
              rows={4}
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading || !smartText.trim()}
            className="w-full flex justify-center items-center gap-2 bg-lime-500 hover:bg-lime-600 disabled:bg-lime-500/50 disabled:text-gray-800 disabled:cursor-not-allowed text-slate-900 font-bold py-3 px-4 rounded-md transition-all duration-300 shadow-lg shadow-lime-500/30"
          >
            {isLoading ? 'Parsing...' : <><SparklesIcon/> Add Smart Tasks</>}
          </button>
        </form>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
                 <label htmlFor="task-text" className="block text-sm font-medium text-slate-400 mb-1">Task Description</label>
                <input
                    id="task-text"
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full bg-slate-800/70 border border-slate-700/80 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition placeholder:text-slate-500"
                />
            </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="task-category" className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                <CustomSelect
                    id="task-category"
                    options={CATEGORIES.map(c => ({ value: c, label: c }))}
                    value={category}
                    onChange={(val) => setCategory(val as Category)}
                />
            </div>
            <div>
                <label htmlFor="task-priority" className="block text-sm font-medium text-slate-400 mb-1">Priority</label>
                <CustomSelect
                    id="task-priority"
                    options={PRIORITIES.map(p => ({ value: p, label: p }))}
                    value={priority}
                    onChange={(val) => setPriority(val as Priority)}
                />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="due-date" className="block text-sm font-medium text-slate-400 mb-1">Due Date (Optional)</label>
                <input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-800/70 border border-slate-700/80 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition"
                />
            </div>
            <div>
                <label htmlFor="reminder-date" className="block text-sm font-medium text-slate-400 mb-1">Reminder (Optional)</label>
                <input
                  id="reminder-date"
                  type="datetime-local"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full bg-slate-800/70 border border-slate-700/80 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition"
                />
            </div>
          </div>
          <button type="submit" className="w-full flex justify-center items-center gap-2 bg-lime-500 hover:bg-lime-600 text-slate-900 font-bold py-3 px-4 rounded-md transition-all duration-300 shadow-lg shadow-lime-500/30">
            <PlusIcon /> Add Task
          </button>
        </form>
      )}
      {isLoading && (
         <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
             <div className="flex items-center gap-2 text-lime-400">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Parsing Tasks...</span>
             </div>
         </div>
      )}
    </div>
  );
};

export default TodoForm;