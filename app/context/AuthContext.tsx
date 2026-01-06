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
            console.log("🔹 AuthContext: Authenticated with NextAuth", session.user);
            setIsCompanyLoggedIn(true);
            setUser({
                companyName: session.user.name || 'NinoP',
                email: session.user.email || '',
            });
            // Force Clear Legacy Data silently to keep environment clean
            localStorage.removeItem('isCompanyLoggedIn');
            localStorage.removeItem('companyUser');
        } else if (status === 'unauthenticated') {
            setIsCompanyLoggedIn(false);
            setUser(null);
            // Ensure no legacy data remains
            localStorage.removeItem('isCompanyLoggedIn');
            localStorage.removeItem('companyUser');
        }
    }, [status, session]);

    const loginCompany = (userData: User) => {
        // Deprecated: Legacy login function. Now just warns.
        console.warn("loginCompany called but we are migrating to NextAuth.");
    };

    const logoutCompany = async () => {
        setIsCompanyLoggedIn(false);
        setUser(null);
        localStorage.removeItem('isCompanyLoggedIn');
        localStorage.removeItem('companyUser');

        // Always sign out of NextAuth
        await signOut({ redirect: true, callbackUrl: '/' });
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
