import React from 'react';
import { SortOrder } from '../types';
import CustomSelect from './CustomSelect';

interface SortControlsProps {
    selectedSort: SortOrder;
    onSelectSort: (sort: SortOrder) => void;
}

const sortOptions: { value: SortOrder, label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'due_date_asc', label: 'Due Date (Soonest)' },
    { value: 'due_date_desc', label: 'Due Date (Latest)' },
    { value: 'priority_desc', label: 'Priority (High-Low)' },
    { value: 'priority_asc', label: 'Priority (Low-High)' },
];

const SortControls: React.FC<SortControlsProps> = ({ selectedSort, onSelectSort }) => {
    return (
        <div className="relative z-50 flex items-center gap-2 flex-shrink-0">
            <label htmlFor="sort-select" className="text-sm font-medium text-slate-400">Sort by:</label>
            <CustomSelect 
                id="sort-select"
                options={sortOptions}
                value={selectedSort}
                onChange={(value) => onSelectSort(value as SortOrder)}
            />
        </div>
    );
};

export default SortControls;