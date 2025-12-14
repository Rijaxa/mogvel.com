'use client';

import { Bell, Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import VendorNotifications from './popups/VendorNotifications';

export default function VendorTopBar() {
    const [showNotifications, setShowNotifications] = useState(false);

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
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="h-9 w-9 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm">
                        CL
                    </div>
                    <div className="hidden md:flex items-center cursor-pointer">
                        <span className="text-sm font-bold text-slate-700 mr-1">CleanPro Ltd</span>
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
