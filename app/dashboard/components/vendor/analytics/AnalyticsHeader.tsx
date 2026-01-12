'use client';

import { Download, SlidersHorizontal } from 'lucide-react';
import { exportToCSV } from '@/lib/export';
import { rawOrders } from '../../lib/mockAnalyticsData';

export default function AnalyticsHeader() {
    const handleExport = () => {
        exportToCSV(rawOrders, 'vendor_analytics_report');
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
                <p className="text-slate-500">Monitor sales performance, client engagement, and operational efficiency</p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl font-bold text-sm hover:bg-brand/90 transition-colors shadow-sm shadow-brand/20">
                    <SlidersHorizontal className="w-4 h-4" />
                    Compare Performance
                </button>
            </div>
        </div>
    );
}
