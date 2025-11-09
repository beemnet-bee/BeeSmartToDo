import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Todo, Category, Priority, CategoryFilter, PriorityFilter } from './types';
import { CATEGORIES, PRIORITIES } from './constants';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterControls from './components/FilterControls';
import Header from './components/Header';
import SplashScreen from './components/SplashScreen';
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
    return [];
  });
  
  const [showSplash, setShowSplash] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationHelpOpen, setIsNotificationHelpOpen] = useState(false);
  const [triggeredReminders, setTriggeredReminders] = useState<Set<string>>(new Set());
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
        const now = new Date();
        todos.forEach(todo => {
            if (todo.reminderDate && !todo.completed && !triggeredReminders.has(todo.id)) {
                const reminderTime = new Date(todo.reminderDate);
                if (now >= reminderTime) {
                    if (notificationPermission === 'granted') {
                        new Notification('Bee Smart To-Do Reminder', {
                            body: todo.text,
                            icon: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48c3R5bGU+LmJlZS1ib2R5e2ZpbGw6I2EzZTYzNTt9LmJlZS1zdHJpcGV7ZmlsbDojMGEwYTBmO30uYmVlLXdpbmd7ZmlsbDojRTVFN0VCO29wYWNpdHk6IDAuODt9LndpbmctbGVmdHthbmltYXRpb246IGZsYXAtbGVmdCAwLjJzIGluZmluaXRlIGFsdGVybmF0ZTt0cmFuc2Zvcm0tb3JpZ2luOiA1MHB4IDM1cHg7fS53aW5nLXJpZ2h0e2FuaW1hdGlvbjogZmxhcC1yaWdodCAwLjJzIGluZmluaXRlIGFsdGVybmF0ZTt0cmFuc2Zvcm0tb3JpZ2luOiA1MHB4IDM1cHg7fUBrZXlmcmFtZXMgZmxhcC1sZWZ0e2Zyb20te3RyYW5zZm9ybTpyb3RhdGUoLTE1ZGVnKX10b3t0cmFuc2Zvcm06cm90YXRlKDE1ZGVnKX19QGtleWZyYW1lcyBmbGFwLXJpZ2h0e2Zyb20te3RyYW5zZm9ybTpyb3RhdGUoMTVkZWcpfXRve3RyYW5zZm9ybTpyb3RhdGUoLTE1ZGVnKX19PC9zdHlsZT48Zz48cGF0aCBjbGFzcz0iYmVlLXdpbmcgwingLWxlZnQiIGQ9Ik0gNTAgMzUgQyAyMCAxMCwgMjAgNjAsIDUwIDM1IFoiLz48cGF0aCBjbGFzcz0iYmVlLXdpbmcgwingLXJpZ2h0IiBkPSJNIDUwIDM1IEMgODAgMTAsIDgwIDYwLCA1MCAzNSBaIi8+PC9nPjxlbGxpcHNlIGNsYXNzPSJiZWUtYm9keSIgY3g9IjUwIiBjeT0iNjAiIHJ4PSIyNSIgcnk9IjIwIi8+PHBhdGggY2xhc3M9ImJlZS1zdHJpcGUiIGQ9Ik0gNTAgNDUgQyA2NSA0NSwgNjUgNzUsIDUwIDc1IFMgMzUgNzUsIDM1IDQ1IiB0cmFuc2Zvcm09InNjYWxlKDAuOCwgMSkgdHJhbnNsYXRlKDEyLjUsIDApIi8+PHBhdGggY2xhc3M9ImJlZS1zdHJpcGUiIGQ9Ik0gNTAgNDUgQyA2NSA0NSwgNjUgNzUsIDUwIDc1IFMgMzUgNzUsIDM1IDQ1IiB0cmFuc2Zvcm09InNjYWxlKDAuNiwgMSkgdHJhbnNsYXRlKDMzLjMsIDApIi8+PGNpcmNsZSBmaWxsPSIjMGEwYTBmIiBjeD0iNDAiIGN5PSI1MCIgcHI9IjIiLz48Y2lyY2xlIGZpbGw9IiMwYTBhMGYiIGN4PSI2MCIgY3k9IjUwIiByPSIyIi8+PC9zdmc+'
                        });
                        setTriggeredReminders(prev => new Set(prev).add(todo.id));
                    }
                }
            }
        });
    }, 15000); 

    return () => clearInterval(interval);
  }, [todos, triggeredReminders, notificationPermission]);


  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error("Failed to save todos to localStorage", error);
    }
  }, [todos]);
  
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');

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

  const handleRequestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
        alert('This browser does not support desktop notifications.');
        return;
    }
    if (notificationPermission === 'denied') {
        setIsNotificationHelpOpen(true);
        return;
    }
    if (notificationPermission === 'default') {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
    }
  }, [notificationPermission]);

  const displayedTodos = useMemo(() => {
    return [...todos]
      .filter(todo => categoryFilter === 'All' || todo.category === categoryFilter)
      .filter(todo => priorityFilter === 'All' || todo.priority === priorityFilter)
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [todos, categoryFilter, priorityFilter]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen font-sans">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <Header 
            onAddTaskClick={() => setIsModalOpen(true)}
            notificationPermission={notificationPermission}
            onRequestNotificationPermission={handleRequestNotificationPermission}
        />

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

      <Modal isOpen={isNotificationHelpOpen} onClose={() => setIsNotificationHelpOpen(false)}>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-lime-400">Notifications Blocked</h2>
            <p className="text-slate-400 mt-4">
                You have previously blocked notifications for this site. To receive reminders, you'll need to manually enable them in your browser's settings.
            </p>
            <div className="text-left bg-slate-800/60 p-4 rounded-lg mt-6 space-y-2 text-sm">
                <p><strong>General Steps:</strong></p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Go to your browser's settings page.</li>
                    <li>Navigate to "Privacy and security" {'>'} "Site settings".</li>
                    <li>Find this page's URL in the list.</li>
                    <li>Change the "Notifications" permission to "Allow".</li>
                </ol>
            </div>
            <button 
                onClick={() => setIsNotificationHelpOpen(false)}
                className="mt-6 w-full bg-lime-500 hover:bg-lime-600 text-slate-900 font-bold py-3 px-4 rounded-md transition-all duration-300"
            >
                Got it
            </button>
        </div>
      </Modal>
    </div>
  );
};

export default App;