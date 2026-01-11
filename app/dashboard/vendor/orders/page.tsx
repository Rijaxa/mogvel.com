'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import VendorOrderRow from '../../components/vendor/orders/VendorOrderRow';

export default function VendorOrdersPage() {
    const [activeTab, setActiveTab] = useState<'incoming' | 'progress' | 'completed'>('incoming');

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Orders & Deliveries</h1>
                <p className="text-slate-500">Manage incoming orders, invoicing, and delivery schedules</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-slate-50/50 p-1.5 rounded-xl inline-flex">
                {[
                    { id: 'incoming', label: 'Incoming Orders', count: 3, color: 'bg-brand' },
                    { id: 'progress', label: 'In Progress', count: 2, color: 'bg-yellow-400' },
                    { id: 'completed', label: 'Completed Orders', count: 1, color: 'bg-green-500' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
                            activeTab === tab.id
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                        )}
                    >
                        {tab.label}
                        <span className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white",
                            tab.color
                        )}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'incoming' && (
                    <>
                        <VendorOrderRow
                            id="VO-2024-007"
                            client="Acme Corporation Ltd"
                            date="16.11.2024"
                            amount="₾2456.80"
                            status="Incoming"
                            badgeText="Awaiting Response"
                        />
                        <VendorOrderRow
                            id="VO-2024-008"
                            client="TechFlow Solutions"
                            date="15.11.2024"
                            amount="₾3842.50"
                            status="Incoming"
                            badgeText="Accepted"
                            badgeColor="bg-green-100 text-green-700"
                        />
                        <VendorOrderRow
                            id="VO-2024-009"
                            client="BuildRight Construction"
                            date="14.11.2024"
                            amount="₾5678.90"
                            status="In Progress"
                            badgeText="Shipped"
                            badgeColor="bg-blue-50 text-blue-600"
                        />
                    </>
                )}

                {activeTab === 'progress' && (
                    <>
                        <VendorOrderRow
                            id="VO-2024-005"
                            client="SmartOffice Group"
                            date="12.11.2024"
                            amount="₾4567.30"
                            status="In Progress"
                            badgeText="Shipped"
                            badgeColor="bg-teal-50 text-brand"
                        />
                        <VendorOrderRow
                            id="VO-2024-006"
                            client="HealthPlus Clinics"
                            date="13.11.2024"
                            amount="₾2890.40"
                            status="In Progress"
                            badgeText="In Delivery"
                            badgeColor="bg-orange-50 text-orange-600"
                        />
                    </>
                )}

                {activeTab === 'completed' && (
                    <VendorOrderRow
                        id="VO-2024-001"
                        client="GreenLeaf Enterprises"
                        date="08.11.2024"
                        amount="₾1234.60"
                        status="Completed"
                        badgeText="Delivered"
                        badgeColor="bg-green-100 text-green-700"
                    />
                )}
            </div>

            {/* FAB for chat/help maybe? Not explicit in screenshot but bottom right component is consistent */}
        </div>
    );
}
