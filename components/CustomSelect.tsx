import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find(opt => opt.value === value)?.label;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newValue: string) => {
    onChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={selectRef}>
      <button
        id={id}
        type="button"
        className="w-full flex justify-between items-center bg-slate-800/70 border border-slate-700/80 rounded-md p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedLabel}</span>
        <ChevronDownIcon className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-700 rounded-md shadow-lg">
          <ul role="listbox">
            {options.map(option => (
              <li
                key={option.value}
                className={`p-3 text-sm cursor-pointer hover:bg-lime-500/50 ${value === option.value ? 'bg-lime-500 text-slate-900' : 'text-slate-200'}`}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={value === option.value}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;