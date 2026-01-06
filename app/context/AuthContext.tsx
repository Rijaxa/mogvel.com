'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";

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

function AuthContent({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [isCompanyLoggedIn, setIsCompanyLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            setIsCompanyLoggedIn(true);
            setUser({
                companyName: session.user.name || 'Company User',
                email: session.user.email || '',
            });
            localStorage.setItem('isCompanyLoggedIn', 'true');
        } else if (status === 'unauthenticated') {
            // Check for legacy local storage mock auth if not authenticated via NextAuth
            // This preserves the "demo" functionality if NextAuth isn't configured yet
            const storedAuth = localStorage.getItem('isCompanyLoggedIn');
            const storedUser = localStorage.getItem('companyUser');

            if (storedAuth === 'true' && storedUser) {
                setIsCompanyLoggedIn(true);
                setUser(JSON.parse(storedUser));
            } else {
                setIsCompanyLoggedIn(false);
                setUser(null);
            }
        }
    }, [status, session]);

    const loginCompany = (userData: User) => {
        // Fallback for non-Google login (demo/mock)
        setIsCompanyLoggedIn(true);
        setUser(userData);
        localStorage.setItem('isCompanyLoggedIn', 'true');
        localStorage.setItem('companyUser', JSON.stringify(userData));
    };

    const logoutCompany = async () => {
        setIsCompanyLoggedIn(false);
        setUser(null);
        localStorage.removeItem('isCompanyLoggedIn');
        localStorage.removeItem('companyUser');

        if (status === 'authenticated') {
            await signOut({ redirect: false });
        }
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ isCompanyLoggedIn, user, loginCompany, logoutCompany }}>
            {children}
        </AuthContext.Provider>
    );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthContent>{children}</AuthContent>
        </SessionProvider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
