import React from 'react';
import { BellIcon } from './icons/BellIcon';

interface NotificationButtonProps {
  status: NotificationPermission;
  onClick: () => void;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({ status, onClick }) => {
  const getButtonProps = () => {
    switch (status) {
      case 'granted':
        return {
          title: 'Notifications are enabled',
          className: 'text-lime-400 cursor-default',
          disabled: true,
          label: 'Reminders On'
        };
      case 'denied':
        return {
          title: 'Notifications are blocked. Click for instructions on how to enable them.',
          className: 'text-yellow-400 hover:text-yellow-300',
          disabled: false,
          label: 'Reminders Blocked'
        };
      default: // 'default'
        return {
          title: 'Click to enable notifications for reminders',
          className: 'text-slate-400 hover:text-lime-400',
          disabled: false,
          label: 'Enable Reminders'
        };
    }
  };

  const { title, className, disabled, label } = getButtonProps();

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={title}
      className={`flex items-center justify-center gap-2 bg-slate-800/60 hover:bg-slate-700/80 font-semibold py-3 px-4 rounded-lg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-lime-500 ${className}`}
      aria-label={title}
    >
      <BellIcon className="h-5 w-5"/>
      <span className="hidden sm:inline text-sm">{label}</span>
    </button>
  );
};

export default NotificationButton;