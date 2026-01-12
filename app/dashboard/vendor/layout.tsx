'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import TopBar from '../components/vendor/VendorTopBar';
import VendorSidebar from '../components/VendorSidebar';

export default function VendorDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <VendorSidebar
                isCollapsed={isCollapsed}
                toggleSidebar={() => setIsCollapsed(!isCollapsed)}
            />

            <div
                className={cn(
                    "transition-all duration-300 flex flex-col min-h-screen",
                    isCollapsed ? "pl-20" : "pl-64"
                )}
            >
                <TopBar />
                <main className="flex-1 p-8 pb-32 animate-in fade-in duration-500">
                    {children}
                </main>
            </div>
        </div>
    );
}
