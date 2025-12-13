import StatsCard from '../components/StatsCard';
import { BenchmarkingChart, ForecastingChart } from '../components/Charts';
import ActiveVendorsTable from '../components/ActiveVendorsTable';
import { Box, Users, DollarSign, Star } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
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
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-cyan-50 rounded">
                                <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full" />
                            </div>
                            <h3 className="font-bold text-slate-900">Procurement Benchmarking</h3>
                        </div>
                        <span className="text-green-500 text-sm font-bold flex items-center gap-1">
                            ↘ 15% better than market avg
                        </span>
                    </div>
                    <BenchmarkingChart />

                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="p-4 bg-green-50 rounded-xl">
                            <p className="text-xs text-green-700 font-bold mb-1">Cost Efficiency</p>
                            <p className="text-sm font-bold text-slate-900">23% above avg</p>
                        </div>
                        <div className="p-4 bg-cyan-50 rounded-xl">
                            <p className="text-xs text-brand font-bold mb-1">Delivery Speed</p>
                            <p className="text-sm font-bold text-slate-900">40% faster</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs text-slate-600 font-bold mb-1">Vendor Network</p>
                            <p className="text-sm font-bold text-slate-900">26% smaller</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-cyan-50 rounded">
                                <div className="w-4 h-4 border-2 border-brand rounded-sm rotate-45" />
                            </div>
                            <h3 className="font-bold text-slate-900">Demand Forecasting</h3>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mb-4">
                        <p className="text-sm text-slate-500">Forecast for Next Month</p>
                        <p className="font-bold text-slate-900">Expected: ₾4,800</p>
                    </div>

                    <ForecastingChart />

                    <div className="mt-8">
                        <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
                            <Users className="w-4 h-4 text-brand" /> Alternative Vendors
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="border border-slate-100 rounded-xl p-3">
                                <div className="font-bold text-sm text-slate-900 mb-1">BulkSupply Pro</div>
                                <div className="text-green-500 text-xs font-bold mb-2">12% discount</div>
                                <div className="text-xs text-slate-400 flex items-center gap-1">★ 4.6</div>
                            </div>
                            <div className="border border-slate-100 rounded-xl p-3">
                                <div className="font-bold text-sm text-slate-900 mb-1">DirectSource Inc</div>
                                <div className="text-green-500 text-xs font-bold mb-2">8% discount</div>
                                <div className="text-xs text-slate-400 flex items-center gap-1">★ 4.7</div>
                            </div>
                            <div className="border border-slate-100 rounded-xl p-3">
                                <div className="font-bold text-sm text-slate-900 mb-1">Global Hygiene</div>
                                <div className="text-green-500 text-xs font-bold mb-2">15% discount</div>
                                <div className="text-xs text-slate-400 flex items-center gap-1">★ 4.4</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
