import React, { useState, useRef, useEffect } from 'react';
import { Todo, Category, Priority } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';
import { CATEGORIES, PRIORITIES } from '../constants';
import { CalendarIcon } from './icons/CalendarIcon';
import { BellIcon } from './icons/BellIcon';
import CustomSelect from './CustomSelect';
import Checkbox from './Checkbox';

interface TodoItemProps {
  todo: Todo;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodo: (id: string, newTodoData: Partial<Omit<Todo, 'id' | 'completed' | 'createdAt'>>) => void;
}

const categoryColors: { [key in Category]: string } = {
  [Category.Work]: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20',
  [Category.Personal]: 'bg-teal-500/10 text-teal-300 border border-teal-500/20',
  [Category.Shopping]: 'bg-sky-500/10 text-sky-300 border border-sky-500/20',
  [Category.Health]: 'bg-green-500/10 text-green-300 border border-green-500/20',
  [Category.Other]: 'bg-slate-500/10 text-slate-300 border border-slate-500/20',
};

// Use specific border-t-* classes for better purging and clarity
const priorityBorderColors: { [key in Priority]: string } = {
  [Priority.High]: 'border-t-red-500',
  [Priority.Medium]: 'border-t-yellow-500',
  [Priority.Low]: 'border-t-sky-400',
};

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleTodo, onDeleteTodo, onUpdateTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editCategory, setEditCategory] = useState(todo.category);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');
  const [editReminderDate, setEditReminderDate] = useState(todo.reminderDate || '');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);
  
  const handleUpdate = () => {
    if (editText.trim()) {
      onUpdateTodo(todo.id, { 
          text: editText, 
          category: editCategory, 
          priority: editPriority, 
          dueDate: editDueDate || undefined,
          reminderDate: editReminderDate || undefined,
        });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditCategory(todo.category);
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate || '');
    setEditReminderDate(todo.reminderDate || '');
    setIsEditing(false);
  };

  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  if (isEditing) {
    const today = new Date().toISOString().split('T')[0];
    const getMinDateTimeLocal = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };
    const minDateTime = getMinDateTimeLocal();

    return (
      <div className={`bg-slate-900/80 p-4 rounded-lg space-y-3 border border-slate-700 border-t-4 ${priorityBorderColors[todo.priority]}`}>
        <input
          ref={editInputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <CustomSelect
                options={CATEGORIES.map(c => ({ value: c, label: c }))}
                value={editCategory}
                onChange={val => setEditCategory(val as Category)}
            />
            <CustomSelect
                options={PRIORITIES.map(p => ({ value: p, label: p }))}
                value={editPriority}
                onChange={val => setEditPriority(val as Priority)}
            />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
             <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              min={today}
              className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition"
            />
            <input
              type="datetime-local"
              value={editReminderDate}
              onChange={(e) => setEditReminderDate(e.target.value)}
              min={minDateTime}
              className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition"
            />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={handleCancel} className="px-4 py-2 text-sm bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 transition">Cancel</button>
          <button onClick={handleUpdate} className="px-4 py-2 text-sm bg-lime-500 text-slate-900 rounded-md hover:bg-lime-600 transition">Save</button>
        </div>
      </div>
    )
  }

  return (
    <div className={`
      group relative 
      bg-slate-800/40 backdrop-blur-md 
      p-4 rounded-lg 
      border border-slate-700/50 hover:border-slate-600 
      transition-all duration-300 
      border-t-4 ${priorityBorderColors[todo.priority]} 
      ${todo.completed ? 'opacity-50 saturate-50' : ''}
    `}>
      <div className="absolute top-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <button onClick={() => setIsEditing(true)} aria-label="Edit task" className="p-2 rounded-full text-slate-400 hover:text-lime-400 bg-slate-900/50 hover:bg-slate-800/80 transition">
          <PencilIcon />
        </button>
        <button onClick={() => onDeleteTodo(todo.id)} aria-label="Delete task" className="p-2 rounded-full text-slate-400 hover:text-red-500 bg-slate-900/50 hover:bg-slate-800/80 transition">
          <TrashIcon />
        </button>
      </div>

      <div className="flex items-start">
        <div className="flex-shrink-0 pt-1">
          <Checkbox
            checked={todo.completed}
            onChange={() => onToggleTodo(todo.id)}
          />
        </div>
        <div className="ml-4 flex-grow pr-16">
          <p className={`text-lg font-semibold task-text ${todo.completed ? 'completed' : 'text-slate-100'}`}>
            {todo.text}
          </p>
        </div>
      </div>

      <div className="my-3 h-px bg-slate-700/60" />
      
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[todo.category]}`}>
          {todo.category}
        </span>
        
        <div className="flex items-center gap-4">
            {todo.dueDate && (
                <div className={`flex items-center gap-1.5 transition-colors duration-300 ${isOverdue ? 'text-red-400 font-semibold' : 'text-slate-400'}`}>
                    <CalendarIcon />
                    <span>{new Date(todo.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</span>
                    {isOverdue && <span className="text-xs">(Overdue)</span>}
                </div>
            )}
             {todo.reminderDate && (
                <div className="flex items-center gap-1.5 text-slate-400">
                    <BellIcon />
                    <span>{new Date(todo.reminderDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;