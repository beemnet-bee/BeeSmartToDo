import React from 'react';
import { CheckIcon } from './icons/CheckIcon';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  id?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, id }) => {
  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`h-5 w-5 flex-shrink-0 rounded-sm border-2 flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-lime-500 ${
        checked
          ? 'bg-lime-500 border-lime-500 shadow-lg shadow-lime-500/30'
          : 'bg-slate-800/70 border-slate-700/80 hover:border-lime-500/50'
      }`}
    >
      <div className={`transition-transform duration-200 transform ${checked ? 'scale-100' : 'scale-0'}`}>
        <CheckIcon className="h-4 w-4 text-slate-900" />
      </div>
    </button>
  );
};

export default Checkbox;