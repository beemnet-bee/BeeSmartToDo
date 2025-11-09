import React from 'react';
import { PlusIcon } from './icons/PlusIcon';

interface HeaderProps {
  onAddTaskClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddTaskClick }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-lime-400 to-cyan-400 bg-clip-text text-transparent pb-2">
          Bee Smart To-Do
        </h1>
        <p className="text-slate-400 mt-1 text-lg">Your hive of productivity</p>
      </div>
      <button 
        onClick={onAddTaskClick}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-lime-500 hover:bg-lime-600 text-slate-900 font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-lime-500/30 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-lime-500"
      >
        <PlusIcon />
        Add New Task
      </button>
    </header>
  );
};

export default Header;