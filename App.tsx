import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Todo, Category, Priority, SortOrder, CategoryFilter, PriorityFilter } from './types';
import { CATEGORIES, PRIORITIES } from './constants';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterControls from './components/FilterControls';
import Header from './components/Header';
import { defaultTodos } from './constants';
import SplashScreen from './components/SplashScreen';
import SortControls from './components/SortControls';
import Modal from './components/Modal';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        return JSON.parse(storedTodos).map((todo: any) => ({
          ...todo,
          createdAt: todo.createdAt || new Date().toISOString(),
        }));
      }
    } catch (error) {
      console.error("Failed to parse todos from localStorage", error);
    }
    return defaultTodos;
  });
  
  const [showSplash, setShowSplash] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggeredReminders, setTriggeredReminders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
        const now = new Date();
        todos.forEach(todo => {
            if (todo.reminderDate && !todo.completed && !triggeredReminders.has(todo.id)) {
                const reminderTime = new Date(todo.reminderDate);
                if (now >= reminderTime) {
                    if (Notification.permission === 'granted') {
                        new Notification('Bee Smart To-Do Reminder', {
                            body: todo.text,
                            icon: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48c3R5bGU+LmJlZS1ib2R5e2ZpbGw6I2EzZTYzNTt9LmJlZS1zdHJpcGV7ZmlsbDojMGEwYTBmO30uYmVlLXdpbmd7ZmlsbDojRTVFN0VCO29wYWNpdHk6IDAuODt9LndpbmctbGVmdHthbmltYXRpb246IGZsYXAtbGVmdCAwLjJzIGluZmluaXRlIGFsdGVybmF0ZTt0cmFuc2Zvcm0tb3JpZ2luOiA1MHB4IDM1cHg7fS53aW5nLXJpZ2h0e2FuaW1hdGlvbjogZmxhcC1yaWdodCAwLjJzIGluZmluaXRlIGFsdGVybmF0ZTt0cmFuc2Zvcm0tb3JpZ2luOiA1MHB4IDM1cHg7fUBrZXlmcmFtZXMgZmxhcC1sZWZ0e2Zyb20te3RyYW5zZm9ybTpyb3RhdGUoLTE1ZGVnKX10b3t0cmFuc2Zvcm06cm90YXRlKDE1ZGVnKX19QGtleWZyYW1lcyBmbGFwLXJpZ2h0e2Zyb20te3RyYW5zZm9ybTpyb3RhdGUoMTVkZWcpfXRve3RyYW5zZm9ybTpyb3RhdGUoLTE1ZGVnKX19PC9zdHlsZT48Zz48cGF0aCBjbGFzcz0iYmVlLXdpbmcgwingLWxlZnQiIGQ9Ik0gNTAgMzUgQyAyMCAxMCwgMjAgNjAsIDUwIDM1IFoiLz48cGF0aCBjbGFzcz0iYmVlLXdpbmcgwingLXJpZ2h0IiBkPSJNIDUwIDM1IEMgODAgMTAsIDgwIDYwLCA1MCAzNSBaIi8+PC9nPjxlbGxpcHNlIGNsYXNzPSJiZWUtYm9keSIgY3g9IjUwIiBjeT0iNjAiIHJ4PSIyNSIgcnk9IjIwIi8+PHBhdGggY2xhc3M9ImJlZS1zdHJpcGUiIGQ9Ik0gNTAgNDUgQyA2NSA0NSwgNjUgNzUsIDUwIDc1IFMgMzUgNzUsIDM1IDQ1IiB0cmFuc2Zvcm09InNjYWxlKDAuOCwgMSkgdHJhbnNsYXRlKDEyLjUsIDApIi8+PHBhdGggY2xhc3M9ImJlZS1zdHJpcGUiIGQ9Ik0gNTAgNDUgQyA2NSA0NSwgNjUgNzUsIDUwIDc1IFMgMzUgNzUsIDM1IDQ1IiB0cmFuc2Zvcm09InNjYWxlKDAuNiwgMSkgdHJhbnNsYXRlKDMzLjMsIDApIi8+PGNpcmNsZSBmaWxsPSIjMGEwYTBmIiBjeD0iNDAiIGN5PSI1MCIgcHI9IjIiLz48Y2lyY2xlIGZpbGw9IiMwYTBhMGYiIGN4PSI2MCIgY3k9IjUwIiByPSIyIi8+PC9zdmc+'
                        });
                    }
                    setTriggeredReminders(prev => new Set(prev).add(todo.id));
                }
            }
        });
    }, 15000); 

    return () => clearInterval(interval);
  }, [todos, triggeredReminders]);


  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error("Failed to save todos to localStorage", error);
    }
  }, [todos]);
  
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const addTodo = useCallback((todo: Omit<Todo, 'id' | 'completed' | 'createdAt'>, closeModal?: () => void) => {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos(prevTodos => [newTodo, ...prevTodos]);
    if (closeModal) closeModal();
  }, []);
  
  const addTodos = useCallback((todosToAdd: Omit<Todo, 'id' | 'completed' | 'createdAt'>[], closeModal?: () => void) => {
    const newTodos: Todo[] = todosToAdd.map((todo, index) => ({
      ...todo,
      id: Date.now().toString() + index + Math.random().toString(36).substr(2, 9),
      completed: false,
      createdAt: new Date().toISOString(),
    }));
    setTodos(prevTodos => [...newTodos, ...prevTodos]);
    if (closeModal) closeModal();
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    setTriggeredReminders(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
    });
  }, []);

  const updateTodo = useCallback((id: string, newTodoData: Partial<Omit<Todo, 'id' | 'completed' | 'createdAt'>>) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, ...newTodoData } : todo
      )
    );
    if (newTodoData.reminderDate !== undefined) {
         setTriggeredReminders(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    }
  }, []);

  const clearFilters = useCallback(() => {
    setCategoryFilter('All');
    setPriorityFilter('All');
  }, []);

  const displayedTodos = useMemo(() => {
    const priorityValues: Record<Priority, number> = { [Priority.High]: 3, [Priority.Medium]: 2, [Priority.Low]: 1 };
    
    return [...todos]
      .filter(todo => categoryFilter === 'All' || todo.category === categoryFilter)
      .filter(todo => priorityFilter === 'All' || todo.priority === priorityFilter)
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        switch (sortOrder) {
          case 'due_date':
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          case 'priority':
            return priorityValues[b.priority] - priorityValues[a.priority];
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [todos, categoryFilter, priorityFilter, sortOrder]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen font-sans">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <Header onAddTaskClick={() => setIsModalOpen(true)} />

        <main className="mt-8">
            <div className="p-4 rounded-xl bg-slate-900/50 backdrop-blur-xl border border-lime-400/20 mb-6">
                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <FilterControls
                        categories={['All', ...CATEGORIES]}
                        selectedCategory={categoryFilter}
                        onSelectCategory={setCategoryFilter}
                        priorities={['All', ...PRIORITIES]}
                        selectedPriority={priorityFilter}
                        onSelectPriority={setPriorityFilter}
                        onClearFilters={clearFilters}
                    />
                    <SortControls selectedSort={sortOrder} onSelectSort={setSortOrder} />
                </div>
            </div>
          
            <TodoList
              todos={displayedTodos}
              onToggleTodo={toggleTodo}
              onDeleteTodo={deleteTodo}
              onUpdateTodo={updateTodo}
            />
        </main>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TodoForm 
          onAddTodo={(todo) => addTodo(todo, () => setIsModalOpen(false))} 
          onAddTodos={(todos) => addTodos(todos, () => setIsModalOpen(false))} 
        />
      </Modal>
    </div>
  );
};

export default App;