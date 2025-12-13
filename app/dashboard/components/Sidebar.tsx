'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    RotateCw,
    ClipboardList,
    Users,
    BarChart3,
    FileText,
    HelpCircle,
    Settings,
    LogOut,
    MessageSquare,
    LayoutGrid, // Added
    Package, // Added
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard/company' },
    { icon: Package, label: 'Stock and Reorder', href: '/dashboard/stock' },
    { icon: ClipboardList, label: 'Order Management', href: '/dashboard/orders' },
    { icon: Users, label: 'Catalogues & Vendors', href: '/dashboard/catalogues' },
    { icon: BarChart3, label: 'Analytics & Benchmarking', href: '/dashboard/analytics' },
    { icon: FileText, label: 'Contracts & Compliance', href: '/dashboard/contracts' },
    { icon: MessageSquare, label: 'Requests (RFQs / RFPs)', href: '/dashboard/requests' },
];

const bottomItems = [
    { icon: Settings, label: 'Settings', href: '#' },
    { icon: Users, label: 'Team Management', href: '#' },
    { icon: HelpCircle, label: 'Help', href: '#' },
];

export default function Sidebar({
    isCollapsed,
    toggleSidebar
}: {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 bg-white border-r border-slate-200 flex flex-col z-50 transition-all duration-300",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className={cn("p-6 border-b border-slate-100 flex items-center", isCollapsed ? "justify-center" : "justify-start gap-2")}>
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-white font-bold text-lg shrink-0">
                        M
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-bold text-slate-900 animate-in fade-in duration-300">Mogvel</span>
                    )}
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative",
                                isActive
                                    ? "bg-brand text-white"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                                isCollapsed && "justify-center"
                            )}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!isCollapsed && (
                                <span className="animate-in fade-in duration-300">{item.label}</span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="p-3 border-t border-slate-100 space-y-1">
                {bottomItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative",
                                isActive
                                    ? "bg-brand text-white"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                                isCollapsed && "justify-center"
                            )}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!isCollapsed && (
                                <span className="animate-in fade-in duration-300">{item.label}</span>
                            )}
                            {isCollapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    )
                })}

                <button
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors group relative",
                        isCollapsed && "justify-center"
                    )}
                    title={isCollapsed ? "Logout" : undefined}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="animate-in fade-in duration-300">Logout</span>}
                </button>

                {/* Collapse Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="w-full mt-4 flex items-center justify-center p-2 rounded-lg bg-teal-50 text-brand hover:bg-teal-100 transition-colors"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <ChevronLeft className="w-5 h-5" />
                    )}
                </button>
            </div>
        </aside>
    );
}
