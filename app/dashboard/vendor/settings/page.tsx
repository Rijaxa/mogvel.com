'use client';

import { useState } from 'react';
import { User, CreditCard, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import ProfileForm from '../profile/ProfileForm';

type Tab = 'profile' | 'billing' | 'theme';

export default function VendorSettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const { data: session } = useSession();
    const user = session?.user;
    const details = (user as any)?.companyDetails || {};

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account preferences and billing</p>
            </div>

            {/* Tabs */}
            <div className="bg-slate-100/50 p-1 rounded-xl flex gap-1">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-all duration-200",
                        activeTab === 'profile'
                            ? "bg-white text-brand shadow-sm ring-1 ring-black/5"
                            : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                    )}
                >
                    <User className={cn("w-4 h-4", activeTab === 'profile' ? "text-brand" : "text-slate-400")} />
                    Company Profile
                </button>
                <button
                    onClick={() => setActiveTab('billing')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-all duration-200",
                        activeTab === 'billing'
                            ? "bg-white text-brand shadow-sm ring-1 ring-black/5"
                            : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                    )}
                >
                    <CreditCard className={cn("w-4 h-4", activeTab === 'billing' ? "text-brand" : "text-slate-400")} />
                    Billing & Payments
                </button>
                <button
                    onClick={() => setActiveTab('theme')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-all duration-200",
                        activeTab === 'theme'
                            ? "bg-white text-brand shadow-sm ring-1 ring-black/5"
                            : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                    )}
                >
                    <Palette className={cn("w-4 h-4", activeTab === 'theme' ? "text-brand" : "text-slate-400")} />
                    Theme Preferences
                </button>
            </div>

            {/* Tab Content */}
            <div className={activeTab === 'profile' ? "" : "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"}>
                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 flex items-start gap-3">
                            <span className="text-xl">ℹ️</span>
                            <div>
                                <p className="text-sm text-blue-800 font-bold">Company Profile Settings</p>
                                <p className="text-xs text-blue-600 mt-1">Manage your organisation details, contact info, and operational settings here.</p>
                            </div>
                        </div>
                        <ProfileForm user={user} details={details} />
                    </div>
                )}
                {activeTab === 'billing' && <BillingSettings />}
                {activeTab === 'theme' && <ThemeSettings />}
            </div>

            {/* Save Button for non-profile tabs */}
            {activeTab !== 'profile' && (
                <div className="flex justify-end">
                    <button className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-8 rounded-lg w-full sm:w-auto shadow-sm transition-colors">
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
}

function BillingSettings() {
    return (
        <div className="p-8 space-y-8">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Billing & Payments</h3>

            <div className="bg-teal-50 border border-teal-100 rounded-xl p-6 flex justify-between items-center">
                <div>
                    <p className="text-sm font-bold text-teal-800">Current Plan: Growth</p>
                    <p className="text-xs text-teal-600 mt-1">₾180/month • Next billing: April 1, 2025</p>
                </div>
                <button className="bg-white text-teal-700 text-xs font-bold px-4 py-2 rounded-lg shadow-sm border border-teal-100 hover:bg-teal-50">
                    Upgrade
                </button>
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium text-slate-700">Payment Method</label>
                <div className="p-4 bg-slate-50 rounded-lg flex items-center gap-3">
                    <div className="w-10 h-6 bg-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-500">VISA</div>
                    <span className="text-sm text-slate-700 font-medium">•••• •••• •••• 4242</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Expiry Date</label>
                    <div className="relative">
                        <input
                            type="text"
                            defaultValue="MM/YY"
                            className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-lg text-slate-700 font-medium focus:ring-0"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">CVV</label>
                    <div className="relative">
                        <input
                            type="text"
                            defaultValue="..."
                            className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-lg text-slate-700 font-medium focus:ring-0"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Recent Invoices</h3>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-colors cursor-pointer">
                        <div>
                            <p className="font-medium text-slate-700 text-sm">Invoice #2025-03</p>
                            <p className="text-xs text-slate-500">March 1, 2025</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-slate-900">₾180.00</span>
                            <span className="text-xs font-medium text-brand hover:underline">Download</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-colors cursor-pointer">
                        <div>
                            <p className="font-medium text-slate-700 text-sm">Invoice #2025-02</p>
                            <p className="text-xs text-slate-500">February 1, 2025</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-slate-900">₾180.00</span>
                            <span className="text-xs font-medium text-brand hover:underline">Download</span>
                        </div>
                    </div>
                </div>
            </div>
            <button className="w-full py-3 bg-brand text-white font-bold rounded-lg hover:bg-teal-600 transition-colors shadow-sm">
                Update Payment Method
            </button>
        </div>
    );
}

function ThemeSettings() {
    return (
        <div className="p-8 space-y-8">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Theme Preferences</h3>

            <div className="bg-slate-50 rounded-xl p-6 flex justify-between items-center">
                <div>
                    <p className="text-sm font-bold text-slate-900">Dark Mode</p>
                    <p className="text-xs text-slate-500 mt-1">Switch to dark theme for reduced eye strain</p>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 cursor-pointer">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
                </div>
            </div>

            <div className="p-4 bg-teal-50 text-teal-800 text-xs rounded-lg border border-teal-100">
                <strong>Note:</strong> Theme changes will be applied across all your devices and branches.
            </div>
        </div>
    );
}
