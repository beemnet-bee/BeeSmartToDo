import { Category, Priority, Todo } from './types';

export const CATEGORIES: Category[] = [
    Category.Work,
    Category.Personal,
    Category.Shopping,
    Category.Health,
    Category.Other,
];

export const PRIORITIES: Priority[] = [
    Priority.High,
    Priority.Medium,
    Priority.Low,
];

const now = new Date();
const tomorrow = new Date();
tomorrow.setDate(now.getDate() + 1);
const yesterday = new Date();
yesterday.setDate(now.getDate() - 1);
const dayBefore = new Date();
dayBefore.setDate(now.getDate() - 2);
const threeDaysAgo = new Date();
threeDaysAgo.setDate(now.getDate() - 3);


export const defaultTodos: Todo[] = [
    { id: '1', text: 'Finish the project proposal', category: Category.Work, priority: Priority.High, completed: false, createdAt: now.toISOString(), dueDate: tomorrow.toISOString().split('T')[0] },
    { id: '2', text: 'Go for a 30-minute run', category: Category.Health, priority: Priority.Medium, completed: false, createdAt: yesterday.toISOString() },
    { id: '3', text: 'Buy groceries for the week', category: Category.Shopping, priority: Priority.Medium, completed: true, createdAt: dayBefore.toISOString() },
    { id: '4', text: 'Read a chapter of a book', category: Category.Personal, priority: Priority.Low, completed: false, createdAt: threeDaysAgo.toISOString(), dueDate: yesterday.toISOString().split('T')[0] },
  ];
