'use client';

import { Bell, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useState, useRef } from 'react';
import VendorNotifications from './popups/VendorNotifications';
import { useAuth } from '@/app/context/AuthContext';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function VendorTopBar() {
    const [showNotifications, setShowNotifications] = useState(false);
    const { user } = useAuth();

    return (
        <div className="h-16 px-8 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-20">

            {/* Search Bar - hidden on mobile, visible on large screens */}
            <div className="hidden lg:flex flex-1 max-w-xl relative mx-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border-none rounded-full leading-5 bg-slate-100 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-0 sm:text-sm"
                    placeholder="Search orders, products, or clients..."
                />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-6 ml-auto">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none"
                    >
                        <span className="sr-only">View notifications</span>
                        <Bell className="h-6 w-6" />
                        <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
                            3
                        </span>
                    </button>

                    <VendorNotifications
                        isOpen={showNotifications}
                        onClose={() => setShowNotifications(false)}
                    />
                </div>

                {/* User Profile */}
                <ProfileDropdown user={user} />
            </div>
        </div>
    );
}

function ProfileDropdown({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 500);
    };

    return (
        <div
            className="flex items-center gap-3 pl-6 border-l border-slate-200 relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="h-9 w-9 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm">
                {user?.companyName?.substring(0, 2).toUpperCase() || 'VN'}
            </div>
            <div className="hidden md:flex items-center cursor-pointer py-2">
                <span className="text-sm font-bold text-slate-700 mr-1">
                    {user?.companyName || 'Vendor Name'}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-0 w-56 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm text-slate-900 font-bold truncate">{user?.companyName || 'Vendor Name'}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                        <Link href="/dashboard/vendor/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors">
                            <User className="w-4 h-4" />
                            My Profile
                        </Link>
                        <Link href="/dashboard/vendor/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors">
                            <Settings className="w-4 h-4" />
                            Settings
                        </Link>
                    </div>

                    <div className="border-t border-slate-100 py-1">
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
