'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isCompanyLoggedIn: boolean;
    loginCompany: () => void;
    logoutCompany: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isCompanyLoggedIn, setIsCompanyLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check local storage on mount
        const storedAuth = localStorage.getItem('isCompanyLoggedIn');
        if (storedAuth === 'true') {
            setIsCompanyLoggedIn(true);
        }
    }, []);

    const loginCompany = () => {
        setIsCompanyLoggedIn(true);
        localStorage.setItem('isCompanyLoggedIn', 'true');
        // We will handle redirection in the components or pages logic, 
        // but typically login happens on the login page which then redirects.
    };

    const logoutCompany = () => {
        setIsCompanyLoggedIn(false);
        localStorage.removeItem('isCompanyLoggedIn');
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ isCompanyLoggedIn, loginCompany, logoutCompany }}>
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
