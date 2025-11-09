export enum Category {
    Work = 'Work',
    Personal = 'Personal',
    Shopping = 'Shopping',
    Health = 'Health',
    Other = 'Other',
}

export enum Priority {
    High = 'High',
    Medium = 'Medium',
    Low = 'Low',
}

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    category: Category;
    priority: Priority;
    createdAt: string;
    dueDate?: string;
    reminderDate?: string;
}

export type CategoryFilter = Category | 'All';
export type PriorityFilter = Priority | 'All';

// FIX: Export the SortOrder type to fix an import error in SortControls.tsx.
export type SortOrder = 
  | 'newest'
  | 'oldest'
  | 'due_date_asc'
  | 'due_date_desc'
  | 'priority_desc'
  | 'priority_asc';
