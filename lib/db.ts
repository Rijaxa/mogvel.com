import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'users.json');

export interface User {
    id: string; // 6-digit company ID
    email: string;
    password?: string; // Optional for existing Google users, required for new email users
    name: string;
    role: 'user' | 'admin';
    companyDetails?: {
        organisationName?: string; // Organisation name/Trademark
        legalName?: string;
        registrationNumber?: string;
        country?: string; // Default: Georgia
        city?: string;
        address?: string; // Company address
        currency?: string; // Default: GEL
        contactPerson?: string;
        phone?: string; // Contact phone
        contactEmail?: string;
        logoUrl?: string;
        numberOfOffices?: string; // Changed to string to handle "1-5", "10+" etc if needed, or simple number input. User just said "Number of offices". Let's stick to string for flexibility in form data or number. Form data is string. Let's use string.
        vatPayerStatus?: 'vat_payer' | 'not_vat_payer';
        businessScale?: 'small' | 'medium' | 'large';
        serviceAreas?: string;
        website?: string; // Keeping as legacy or extra
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
        return users.find(u => u.email.toLowerCase() === email.toLowerCase());
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
        const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

        if (index === -1) return null;

        users[index] = { ...users[index], ...updates };
        fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
        return users[index];
    }
};
