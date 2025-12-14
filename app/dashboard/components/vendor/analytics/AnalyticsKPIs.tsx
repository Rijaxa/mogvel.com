'use client';

import { DollarSign, ShoppingCart, Users, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnalyticsKPIs() {
    const kpis = [
        {
            label: 'Total Revenue (This Month)',
            value: '£72,450',
            change: '+12%',
            trend: 'up',
            icon: DollarSign,
            color: 'text-brand',
            bgColor: 'bg-teal-50',
            chart: 'bg-teal-100' // Placeholder for mini chart line
        },
        {
            label: 'Average Order Value',
            value: '£340',
            sub: 'per order',
            change: '+12% vs prior quarter',
            trend: 'up',
            icon: ShoppingCart,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50',
            chart: 'bg-orange-100'
        },
        {
            label: 'Client Retention Rate',
            value: '78%',
            sub: 'repeat clients',
            change: 'Stable',
            trend: 'neutral',
            icon: Users,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            chart: 'bg-blue-100'
        },
        {
            label: 'On-Time Delivery Rate',
            value: '96.4%',
            sub: 'SLA compliance',
            change: '+2% vs last month', // inferred
            trend: 'up',
            icon: Truck,
            color: 'text-green-500',
            bgColor: 'bg-green-50',
            chart: 'bg-green-100'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", kpi.bgColor)}>
                        <kpi.icon className={cn("w-5 h-5", kpi.color)} />
                    </div>
                    <p className="text-xs text-slate-500 font-medium mb-1">{kpi.label}</p>
                    <div className="flex items-baseline gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
                        {kpi.sub && <span className="text-xs text-slate-400">{kpi.sub}</span>}
                    </div>
                    <div className={cn(
                        "inline-flex px-2 py-1 rounded text-[10px] font-bold",
                        kpi.trend === 'up' ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"
                    )}>
                        {kpi.change}
                    </div>

                    {/* Visual spacer for mini-chart */}
                    <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div className={cn("h-full w-2/3 rounded-full", kpi.color.replace('text-', 'bg-'))} />
                    </div>
                </div>
            ))}
        </div>
    );
}
