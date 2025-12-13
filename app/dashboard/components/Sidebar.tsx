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
    Package // Added
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

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col z-50">
            <div className="p-6 border-b border-slate-100">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-white font-bold text-lg">
                        M
                    </div>
                    <span className="text-xl font-bold text-slate-900">Mogvel</span>
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
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-brand text-white"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            <div className="p-3 border-t border-slate-100 space-y-1">
                {bottomItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                ))}

                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
