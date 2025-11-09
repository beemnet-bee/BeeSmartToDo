import { GoogleGenAI, Type } from "@google/genai";
import { Category, Priority, Todo } from '../types';
import { CATEGORIES, PRIORITIES } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const taskSchema = {
    type: Type.OBJECT,
    properties: {
        task: {
            type: Type.STRING,
            description: "The main action or to-do item, concisely described.",
        },
        category: {
            type: Type.STRING,
            enum: CATEGORIES,
            description: "The most relevant category for the task."
        },
        priority: {
            type: Type.STRING,
            enum: PRIORITIES,
            description: "The inferred priority of the task. Default to Medium if unsure."
        },
        dueDate: {
            type: Type.STRING,
            description: "The due date for the task in 'YYYY-MM-DD' format, if specified. Otherwise, omit this field."
        },
        reminderDate: {
            type: Type.STRING,
            description: "The reminder date and time in 'YYYY-MM-DDTHH:MM' format, if specified. Otherwise, omit this field."
        }
    },
    required: ["task", "category", "priority"]
};

const responseSchema = {
    type: Type.ARRAY,
    items: taskSchema
};

export const parseTasksFromString = async (prompt: string): Promise<Omit<Todo, 'id' | 'completed' | 'createdAt'>[] | null> => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const fullPrompt = `Analyze the following user request, which may contain multiple to-do items separated by newlines. For each item, extract a structured to-do object. Infer category, priority, and due date. The current date is ${today}. If a relative date like "tomorrow" or "next Friday" is mentioned, convert it to an absolute 'YYYY-MM-DD' format. If a specific time is mentioned, include it and format the reminder date as 'YYYY-MM-DDTHH:MM'. Return an array of these objects. Request:\n\n"${prompt}"`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson: any[] = JSON.parse(jsonText);

        if (Array.isArray(parsedJson)) {
            const validatedTasks = parsedJson.filter(item => 
                item.task && item.category && item.priority &&
                CATEGORIES.includes(item.category) && PRIORITIES.includes(item.priority)
            ).map(item => ({
                text: item.task,
                category: item.category as Category,
                priority: item.priority as Priority,
                dueDate: item.dueDate || undefined,
                reminderDate: item.reminderDate || undefined,
            }));
            
            return validatedTasks.length > 0 ? validatedTasks : null;
        }
        
        console.error("Parsed JSON is not an array:", parsedJson);
        return null;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to parse tasks with AI. Please check your phrasing or use the manual form.");
    }
};