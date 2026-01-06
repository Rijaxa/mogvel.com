'use client';

import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/app/context/AuthContext'; // Using alias path if possible, or relative
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { isCompanyLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Simple check: if not logged in, redirect.
        // NOTE: In a real app this might flash before checking local storage if context initializes slowly.
        // But since our context checks localStorage synchronously in useEffect (or quickly), it should be okay for a demo.
        // Better: Context could have an 'isLoading' state.
        const storedAuth = localStorage.getItem('isCompanyLoggedIn');
        if (!storedAuth) {
            router.push('/company/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Sidebar
                isCollapsed={isCollapsed}
                toggleSidebar={() => setIsCollapsed(!isCollapsed)}
            />

            <div className={cn(
                "transition-all duration-300 ease-in-out",
                isCollapsed ? "ml-20" : "ml-64"
            )}>
                <TopBar />
                <main className="p-8 pb-32">
                    {children}
                </main>
            </div>
        </div>
    );
}
