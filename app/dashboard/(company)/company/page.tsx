'use client';

import { useState } from 'react';
import StatsCard from '../../components/StatsCard';
import ActiveVendorsTable from '../../components/ActiveVendorsTable';
import LowStockModal from '../../components/LowStockModal';
import { Box, Users, DollarSign } from 'lucide-react';

export default function DashboardPage() {
    const [isLowStockModalOpen, setIsLowStockModalOpen] = useState(false);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <LowStockModal
                isOpen={isLowStockModalOpen}
                onClose={() => setIsLowStockModalOpen(false)}
            />

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Company Dashboard</h1>
                <p className="text-slate-500">Welcome back! Here's your procurement overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Spend"
                    metric="₾124,580"
                    trend="8.2% vs last month"
                    trendUp={true}
                    icon={DollarSign}
                />
                <StatsCard
                    title="Active Vendors"
                    metric="23"
                    trend="2 new this month"
                    trendUp={true}
                    icon={Users}
                />
                <StatsCard
                    title="Deliveries in Progress"
                    metric="7"
                    trend="Est. delivery: 2-3 days"
                    trendUp={false} // Neutral
                    icon={Box}
                    className="text-slate-600"
                />
                <StatsCard
                    title="Low Stock Alerts"
                    metric="5"
                    alert={true}
                    alertText="Needs attention"
                    onClick={() => setIsLowStockModalOpen(true)}
                />
            </div>

            {/* Charts Section Removed */}

            {/* Active Vendors Table */}
            <div className="bg-white rounded-2xl border border-slate-100 mb-8">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Box className="w-5 h-5 text-brand" />
                        <h3 className="font-bold text-slate-900">Active Vendors</h3>
                    </div>

                    <button className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        View All Vendors
                    </button>
                </div>
                <ActiveVendorsTable />
            </div>

        </div>
    );
}
