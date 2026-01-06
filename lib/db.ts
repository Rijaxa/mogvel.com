import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'users.json');

export interface User {
    id: string; // 6-digit company ID
    email: string;
    name: string;
    role: 'user' | 'admin';
    companyDetails?: {
        businessName?: string;
        address?: string;
        phone?: string;
        website?: string;
        isProfileComplete: boolean;
    };
    createdAt: string;
}

// Ensure DB exists
function ensureDb() {
    if (!fs.existsSync(path.dirname(DB_PATH))) {
        fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, '[]');
    }
}

export const db = {
    getAllUsers: (): User[] => {
        ensureDb();
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        try {
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    },

    getUserByEmail: (email: string): User | undefined => {
        const users = db.getAllUsers();
        return users.find(u => u.email === email);
    },

    createUser: (user: Omit<User, 'createdAt' | 'id'>): User => {
        const users = db.getAllUsers();

        // Generate unique 6-digit ID
        let id: string;
        do {
            id = Math.floor(100000 + Math.random() * 900000).toString();
        } while (users.some(u => u.id === id));

        const newUser: User = {
            ...user,
            id,
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
        return newUser;
    },

    updateUser: (email: string, updates: Partial<User>): User | null => {
        const users = db.getAllUsers();
        const index = users.findIndex(u => u.email === email);

        if (index === -1) return null;

        users[index] = { ...users[index], ...updates };
        fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
        return users[index];
    }
};
