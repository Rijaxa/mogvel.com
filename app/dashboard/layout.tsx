'use client';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

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
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
