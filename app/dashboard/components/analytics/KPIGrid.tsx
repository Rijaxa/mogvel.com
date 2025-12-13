'use client';

import { DollarSign, Zap, Truck, CheckCircle } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string;
    subtext: string;
    trend?: string;
    icon: any;
    iconColor: string;
    iconBg: string;
}

function MetricCard({ label, value, subtext, trend, icon: Icon, iconColor, iconBg }: MetricCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between h-40">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
                <p className="text-slate-500 text-xs font-bold mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                    {trend && <span className="bg-green-50 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded">{trend}</span>}
                </div>
                <p className="text-slate-400 text-[10px] mt-1">{subtext}</p>
            </div>
        </div>
    );
}

interface KPIGridProps {
    metrics: {
        totalSpend: string;
        costEfficiency: string;
        deliverySpeed: string;
        supplierReliability: string;
    };
}

export default function KPIGrid({ metrics }: KPIGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
                label="Total Spend (This Quarter)"
                value={metrics.totalSpend}
                subtext=""
                trend="+5.6%"
                icon={DollarSign}
                iconColor="text-cyan-500"
                iconBg="bg-cyan-50"
            />
            <MetricCard
                label="Cost Efficiency"
                value={metrics.costEfficiency}
                subtext="above market avg"
                icon={Zap} // Dollar sign in cycle usually
                iconColor="text-yellow-500"
                iconBg="bg-yellow-50"
            />
            <MetricCard
                label="Delivery Speed"
                value={metrics.deliverySpeed}
                subtext="Faster than avg"
                icon={Truck}
                iconColor="text-blue-500"
                iconBg="bg-blue-50"
            />
            <MetricCard
                label="Supplier Reliability"
                value={metrics.supplierReliability}
                subtext="SLA compliance"
                icon={CheckCircle}
                iconColor="text-green-500"
                iconBg="bg-green-50"
            />
        </div>
    );
}
