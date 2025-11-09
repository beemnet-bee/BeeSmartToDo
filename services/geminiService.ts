import { Category, Priority, Todo } from '../types';
import { CATEGORIES, PRIORITIES } from '../constants';

// This is a local, rule-based parser to replace the Gemini API call.
// It allows the "Smart Add" feature to work without an API key.
// It's less powerful than the AI model but handles simple cases.

/**
 * Parses dates and times from a string.
 * @param text The string to parse.
 * @returns An object with dueDate, reminderDate, and the remaining text.
 */
const parseDates = (text: string): { dueDate?: string; reminderDate?: string; remainingText: string } => {
    let remainingText = text;
    let dueDate: string | undefined;
    let reminderDate: string | undefined;
    const now = new Date();

    // Simple relative dates for due date
    if (/\b(due |by )?tomorrow\b/i.test(remainingText)) {
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        dueDate = tomorrow.toISOString().split('T')[0];
        remainingText = remainingText.replace(/\b(due |by )?tomorrow\b/i, '');
    } else if (/\b(due |by )?today\b/i.test(remainingText)) {
        dueDate = now.toISOString().split('T')[0];
        remainingText = remainingText.replace(/\b(due |by )?today\b/i, '');
    }

    // YYYY-MM-DD format for due date
    const dateRegex = /(\d{4}-\d{2}-\d{2})/;
    const dateMatch = remainingText.match(dateRegex);
    if (dateMatch) {
        dueDate = dateMatch[1];
        remainingText = remainingText.replace(dateRegex, '');
    }
    
    // HH:mm for reminder
    const timeRegex = /(\d{1,2}:\d{2}(\s?[ap]m)?)/i;
    const timeMatch = remainingText.match(timeRegex);
    if (timeMatch) {
        // Create a reminder for today at the specified time.
        // If a due date is also present, it could be smarter, but this is a simple mock.
        const reminder = new Date(dueDate || now);
        let [hoursStr, minutesStr] = timeMatch[1].replace(/\s?[ap]m/i, '').split(':');
        let hours = parseInt(hoursStr, 10);
        
        if (/pm/i.test(timeMatch[1]) && hours < 12) {
            hours += 12;
        }
        if (/am/i.test(timeMatch[1]) && hours === 12) { // Midnight case
            hours = 0;
        }

        reminder.setHours(hours);
        reminder.setMinutes(parseInt(minutesStr, 10));
        reminder.setSeconds(0);
        reminder.setMilliseconds(0);
        
        reminderDate = reminder.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM format
        remainingText = remainingText.replace(timeRegex, '');
    }
    
    return { dueDate, reminderDate, remainingText: remainingText.trim() };
};

export const parseTasksFromString = async (prompt: string): Promise<Omit<Todo, 'id' | 'completed' | 'createdAt'>[] | null> => {
    try {
        const lines = prompt.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) {
            return null;
        }

        const tasks = lines.map(line => {
            let text = line.trim();
            let category: Category = Category.Personal; // Default category
            let priority: Priority = Priority.Medium; // Default priority

            // Parse Category
            for (const cat of CATEGORIES) {
                const regex = new RegExp(`\\b${cat}\\b`, 'i');
                if (regex.test(text)) {
                    category = cat;
                    text = text.replace(regex, '');
                    break; 
                }
            }

            // Parse Priority
            if (/\b(high priority|high)\b/i.test(text)) {
                priority = Priority.High;
                text = text.replace(/\b(high priority|high)\b/i, '');
            } else if (/\b(low priority|low)\b/i.test(text)) {
                priority = Priority.Low;
                text = text.replace(/\b(low priority|low)\b/i, '');
            }

            // Parse Dates and Times
            const { dueDate, reminderDate, remainingText } = parseDates(text);
            text = remainingText;

            // Clean up common keywords and extra spaces
            text = text.replace(/\b(task|for|at|due by|due|by|remind me)\b/gi, '')
                       .replace(/\s\s+/g, ' ')
                       .trim();

            return {
                text: text || "Untitled Task",
                category,
                priority,
                dueDate,
                reminderDate,
            };
        });

        // Simulate async network request for better UX (shows loading spinner)
        await new Promise(resolve => setTimeout(resolve, 750));

        return tasks.length > 0 ? tasks : null;

    } catch (error) {
        console.error("Error parsing tasks locally:", error);
        throw new Error("Failed to parse tasks. Please check your phrasing or use the manual form.");
    }
};
