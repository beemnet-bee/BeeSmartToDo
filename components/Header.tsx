import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import Logo from './Logo';
import NotificationButton from './NotificationButton';

interface HeaderProps {
  onAddTaskClick: () => void;
  notificationPermission: NotificationPermission;
  onRequestNotificationPermission: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddTaskClick, notificationPermission, onRequestNotificationPermission }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <Logo />
      <div className="w-full sm:w-auto flex items-stretch sm:items-center justify-center gap-2">
        <NotificationButton
          status={notificationPermission}
          onClick={onRequestNotificationPermission}
        />
        <button
          onClick={onAddTaskClick}
          className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 bg-lime-500 hover:bg-lime-600 text-slate-900 font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-lime-500/30 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-lime-500"
        >
          <PlusIcon />
          Add New Task
        </button>
      </div>
    </header>
  );
};

export default Header;