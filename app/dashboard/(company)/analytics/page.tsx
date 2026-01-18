'use client';

import {
    getKPIMetrics,
    getMonthlySpend,
    getSpendByCategory,
    getSpendByDepartment,
    getOrderFrequency
} from '@/app/dashboard/lib/mockAnalyticsData';

import KPIGrid from '@/app/dashboard/components/analytics/KPIGrid';
import SpendingCharts from '@/app/dashboard/components/analytics/SpendingCharts';
import { Download } from 'lucide-react';
import { exportToCSV } from '@/lib/export';
import { rawOrders } from '@/app/dashboard/lib/mockAnalyticsData';

export default function AnalyticsPage() {
    const metrics = getKPIMetrics();
    const monthlySpend = getMonthlySpend();
    const spendByCategory = getSpendByCategory();
    const spendByDepartment = getSpendByDepartment();
    const orderFrequency = getOrderFrequency();

    const handleExport = () => {
        exportToCSV(rawOrders, 'company_analytics_report');
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
                    <p className="text-slate-500">Track procurement performance, spending trends, and supplier efficiency.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 text-sm shadow-sm transition-colors">
                        Compare Vendors
                    </button>
                </div>
            </div>

            <div className="animate-in fade-in duration-500">
                <KPIGrid metrics={metrics} />

                <h3 className="text-sm font-bold text-brand flex items-center gap-2 mb-4">
                    <span className="w-1 h-4 bg-brand rounded-full" /> Operating Analytics
                </h3>
                <SpendingCharts
                    monthlySpend={monthlySpend}
                    spendByCategory={spendByCategory}
                    spendByDepartment={spendByDepartment}
                    orderFrequency={orderFrequency}
                />
            </div>
        </div>
    );
}
