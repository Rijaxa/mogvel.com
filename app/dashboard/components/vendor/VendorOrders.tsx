'use client';

import { CheckCircle, Clock, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function VendorOrders() {
    const [filter, setFilter] = useState('All');

    const orders = [
        {
            id: 'ORD-2847',
            client: 'Acme Corp',
            items: 5,
            date: '25.3.2025',
            amount: '₾2,340',
            status: 'Pending',
            color: 'border-l-[#FF6B6B]',
            badgeColor: 'bg-orange-100 text-orange-600'
        },
        {
            id: 'ORD-2846',
            client: 'TechStart Inc',
            items: 3,
            date: '23.3.2025',
            amount: '₾1,850',
            status: 'Approved',
            color: 'border-l-[#FBBF24]',
            badgeColor: 'bg-brand/10 text-brand'
        },
        {
            id: 'ORD-2845',
            client: 'Global Industries',
            items: 8,
            date: '22.3.2025',
            amount: '₾3,120',
            status: 'Shipped',
            color: 'border-l-[#22C55E]',
            badgeColor: 'bg-green-100 text-green-600'
        },
        {
            id: 'ORD-2844',
            client: 'Urban Retail Co',
            items: 4,
            date: '28.3.2025',
            amount: '₾1,280',
            status: 'Pending',
            color: 'border-l-[#EF4444]',
            badgeColor: 'bg-orange-100 text-orange-600'
        }
    ];

    const filteredOrders = orders.filter(order => {
        if (filter === 'All') return true;
        if (filter === 'Delivered') return order.status === 'Shipped';
        return order.status === filter;
    });

    const filters = ['All', 'Pending', 'Approved', 'Delivered'];

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-900">Recent Orders</h3>
                <div className="flex gap-2">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded-lg transition-colors",
                                filter === f
                                    ? "font-bold bg-slate-100 text-slate-900"
                                    : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <div key={order.id} className={`p-4 rounded-xl bg-slate-50 border-l-4 ${order.color} flex items-center justify-between`}>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-slate-900">{order.id}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${order.badgeColor}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500">{order.client} • {order.items} items</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Expected: {order.date}</p>
                            </div>
                            <div className="text-right flex items-center gap-4">
                                <span className="font-bold text-slate-900">{order.amount}</span>
                                <div className="flex gap-2 text-slate-400">
                                    <CheckCircle className="w-4 h-4 cursor-pointer hover:text-brand" />
                                    <Package className="w-4 h-4 cursor-pointer hover:text-brand" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-500 text-sm">
                        No orders found.
                    </div>
                )}
            </div>
        </div>
    );
}
