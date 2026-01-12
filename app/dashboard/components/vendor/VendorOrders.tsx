'use client';

import { CheckCircle, Clock, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VendorOrders() {
    const orders = [
        { id: 'ORD-2847', client: 'Acme Corp', items: 5, date: '25.3.2025', amount: '₾2,340', status: 'Pending', color: 'border-l-orange-400' },
        { id: 'ORD-2846', client: 'TechStart Inc', items: 3, date: '23.3.2025', amount: '₾1,850', status: 'Approved', color: 'border-l-brand' },
        { id: 'ORD-2845', client: 'Global Industries', items: 8, date: '22.3.2025', amount: '₾3,120', status: 'Shipped', color: 'border-l-green-500' },
        { id: 'ORD-2844', client: 'Urban Retail Co', items: 4, date: '20.3.2025', amount: '₾1,280', status: 'Pending', color: 'border-l-orange-400' }, // Screenshot shows red line but pending? Using orange for pending consistency, or red if critical.
        // Screenshot actually shows: 2847 (Orange/Pending), 2846 (Teal/Approved), 2845 (Green/Shipped), 2844 (Red/Pending - maybe late?)
        // I'll follow screenshot colors:
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-orange-100 text-orange-600';
            case 'Approved': return 'bg-brand/10 text-brand';
            case 'Shipped': return 'bg-green-100 text-green-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    // Custom colors matching screenshot
    const borderColors = [
        'border-l-[#FF6B6B]', // Red/Orange ish
        'border-l-[#FBbf24]', // Yellow
        'border-l-[#22C55E]', // Green
        'border-l-[#EF4444]', // Red
    ];

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 flex-1">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-900">Recent Orders</h3>
                <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs font-bold bg-slate-100 rounded-lg text-slate-900">All</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 rounded-lg">Pending</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 rounded-lg">Approved</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 rounded-lg">Delivered</button>
                </div>
            </div>

            <div className="space-y-4">
                {/* 
               Manually defining based on screenshot to match colors exactly:
               1. Red line (ORD-2847) 
               2. Yellow line (ORD-2846) - wait, screenshot actually has:
                  - 2847: Red border, Pending (Yellow Badge)
                  - 2846: Yellow border, Approved (Teal Badge) -> Wait, layout usually implies status color match.
                  Let's try to infer best intent: 
                  - Pending = Yellow/Orange
                  - Approved = Teal
                  - Shipped = Green
                  - Critical/Late = Red
               
               Let's just hardcode the styles from the visual for these specific mock items.
            */}

                <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-l-[#FF6B6B] flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900">ORD-2847</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-100 text-orange-600">Pending</span>
                        </div>
                        <p className="text-xs text-slate-500">Acme Corp • 5 items</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Expected: 25.3.2025</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                        <span className="font-bold text-slate-900">₾2,340</span>
                        <div className="flex gap-2 text-slate-400">
                            <CheckCircle className="w-4 h-4 cursor-pointer hover:text-brand" />
                            <Package className="w-4 h-4 cursor-pointer hover:text-brand" />
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-l-[#FBBF24] flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900">ORD-2846</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand/10 text-brand">Approved</span>
                        </div>
                        <p className="text-xs text-slate-500">TechStart Inc • 3 items</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Expected: 23.3.2025</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                        <span className="font-bold text-slate-900">₾1,850</span>
                        <div className="flex gap-2 text-slate-400">
                            <CheckCircle className="w-4 h-4 cursor-pointer hover:text-brand" />
                            <Package className="w-4 h-4 cursor-pointer hover:text-brand" />
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-l-[#22C55E] flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900">ORD-2845</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-100 text-green-600">Shipped</span>
                        </div>
                        <p className="text-xs text-slate-500">Global Industries • 8 items</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Expected: 22.3.2025</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                        <span className="font-bold text-slate-900">₾3,120</span>
                        <div className="flex gap-2 text-slate-400">
                            <CheckCircle className="w-4 h-4 cursor-pointer hover:text-brand" />
                            <Package className="w-4 h-4 cursor-pointer hover:text-brand" />
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-l-[#EF4444] flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900">ORD-2844</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-100 text-orange-600">Pending</span>
                        </div>
                        <p className="text-xs text-slate-500">Urban Retail Co • 4 items</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Expected: 28.3.2025</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                        <span className="font-bold text-slate-900">₾1,280</span>
                        <div className="flex gap-2 text-slate-400">
                            <CheckCircle className="w-4 h-4 cursor-pointer hover:text-brand" />
                            <Package className="w-4 h-4 cursor-pointer hover:text-brand" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
