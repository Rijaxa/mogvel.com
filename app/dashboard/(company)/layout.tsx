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
        // Redirect to login if not logged in (NextAuth handles loading state internally in context)
        // We add a small delay or check loading state in a real app, but for now:
        if (!isCompanyLoggedIn) {
            // router.push('/company/login'); // NextAuth middleware or client check should handle this better
            // For now, let the AuthContext handle the redirect if needed, or implement check here
        }
    }, [isCompanyLoggedIn, router]);

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
