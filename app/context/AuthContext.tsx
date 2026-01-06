'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    companyName: string;
    email: string;
}

interface AuthContextType {
    isCompanyLoggedIn: boolean;
    user: User | null;
    loginCompany: (userData: User) => void;
    logoutCompany: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isCompanyLoggedIn, setIsCompanyLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check local storage on mount
        const storedAuth = localStorage.getItem('isCompanyLoggedIn');
        const storedUser = localStorage.getItem('companyUser');

        if (storedAuth === 'true') {
            setIsCompanyLoggedIn(true);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    const loginCompany = (userData: User) => {
        setIsCompanyLoggedIn(true);
        setUser(userData);
        localStorage.setItem('isCompanyLoggedIn', 'true');
        localStorage.setItem('companyUser', JSON.stringify(userData));
    };

    const logoutCompany = () => {
        setIsCompanyLoggedIn(false);
        setUser(null);
        localStorage.removeItem('isCompanyLoggedIn');
        localStorage.removeItem('companyUser');
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ isCompanyLoggedIn, user, loginCompany, logoutCompany }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
