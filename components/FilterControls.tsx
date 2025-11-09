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
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-400 shrink-0">Category:</span>
                <div className="flex items-center gap-1 p-1 bg-slate-800/60 rounded-lg">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => onSelectCategory(category)}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-all duration-200 ${
                                selectedCategory === category
                                    ? 'bg-lime-500 text-slate-900'
                                    : 'text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
             <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-400 shrink-0">Priority:</span>
                <div className="flex items-center gap-1 p-1 bg-slate-800/60 rounded-lg">
                    {priorities.map(priority => (
                        <button
                            key={priority}
                            onClick={() => onSelectPriority(priority)}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-all duration-200 ${
                                selectedPriority === priority
                                    ? 'bg-lime-500 text-slate-900'
                                    : 'text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            {priority}
                        </button>
                    ))}
                </div>
            </div>
        </div>
        
        {isFilterActive && (
          <button 
            onClick={onClearFilters}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-lime-400 transition-colors"
          >
            <XCircleIcon />
            Clear Filters
          </button>
        )}
    </div>
  );
};

export default FilterControls;