import React from 'react';
import { CategoryFilter, PriorityFilter } from '../types';
import { XCircleIcon } from './icons/XCircleIcon';

interface FilterControlsProps {
  categories: CategoryFilter[];
  selectedCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  priorities: PriorityFilter[];
  selectedPriority: PriorityFilter;
  onSelectPriority: (priority: PriorityFilter) => void;
  onClearFilters: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  priorities,
  selectedPriority,
  onSelectPriority,
  onClearFilters
}) => {
  const isFilterActive = selectedCategory !== 'All' || selectedPriority !== 'All';

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-400">Filter by:</span>
            <div className="flex items-center gap-1 p-1 bg-slate-800/60 rounded-lg">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        className={`px-3 py-1 text-sm font-semibold rounded-md transition-all duration-200 ${
                            selectedCategory === category
                                ? 'bg-fuchsia-600 text-white'
                                : 'text-slate-300 hover:bg-slate-700'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
             <div className="flex items-center gap-1 p-1 bg-slate-800/60 rounded-lg">
                {priorities.map(priority => (
                    <button
                        key={priority}
                        onClick={() => onSelectPriority(priority)}
                        className={`px-3 py-1 text-sm font-semibold rounded-md transition-all duration-200 ${
                            selectedPriority === priority
                                ? 'bg-fuchsia-600 text-white'
                                : 'text-slate-300 hover:bg-slate-700'
                        }`}
                    >
                        {priority}
                    </button>
                ))}
            </div>
        </div>
        
        {isFilterActive && (
          <button 
            onClick={onClearFilters}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-fuchsia-400 transition-colors"
          >
            <XCircleIcon />
            Clear
          </button>
        )}
    </div>
  );
};

export default FilterControls;