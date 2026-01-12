'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const radarData = [
    { subject: 'Price Stability', A: 120, fullMark: 150 },
    { subject: 'Quality Factor', A: 98, fullMark: 150 },
    { subject: 'On-Time Delivery', A: 86, fullMark: 150 },
    { subject: 'Response Speed', A: 99, fullMark: 150 },
    { subject: 'SLA Compliance', A: 85, fullMark: 150 },
    { subject: 'ESG Score', A: 65, fullMark: 150 },
];

const COLORS = ['#17BEBB', '#1e293b', '#cbd5e1', '#94a3b8'];
const networkData = [
    { name: 'OfficeMax', value: 400 },
    { name: 'CleanPro', value: 300 },
    { name: 'SafetyFirst', value: 100 },
    { name: 'Others', value: 100 },
];

export default function VendorAnalytics() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Vendor Performance Index (Radar) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h4 className="font-bold text-slate-900 text-sm mb-4">Vendor Performance Index</h4>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fill: '#64748b' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                            <Radar name="Vendor Score" dataKey="A" stroke="#17BEBB" fill="#17BEBB" fillOpacity={0.6} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Vendor Network (Donut) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h4 className="font-bold text-slate-900 text-sm mb-4">Vendor Network Overview</h4>
                <div className="h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={networkData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {networkData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center text manually positioned often easier than SVG text for simple donut centers */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

                    </div>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-4 justify-center mt-2">
                    {networkData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-[10px] font-bold text-slate-500">{entry.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Supplier Diversity (Bars) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h4 className="font-bold text-slate-900 text-sm mb-6">Supplier Diversity</h4>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                            <span>Local Support</span>
                            <span className="text-brand">85%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-brand rounded-full h-2" style={{ width: '85%' }} />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                            <span>Minority Suppliers</span>
                            <span className="text-yellow-500">30%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-yellow-400 rounded-full h-2" style={{ width: '30%' }} />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                            <span>International</span>
                            <span className="text-slate-500">15%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-slate-800 rounded-full h-2" style={{ width: '15%' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
