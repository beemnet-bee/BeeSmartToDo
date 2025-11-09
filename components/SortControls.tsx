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
    { value: 'due_date', label: 'By Due Date' },
    { value: 'priority', label: 'By Priority' },
];

const SortControls: React.FC<SortControlsProps> = ({ selectedSort, onSelectSort }) => {
    return (
        <div className="flex items-center gap-2 flex-shrink-0">
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
