'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, BarChart3, Maximize2 } from 'lucide-react';

const revenueData = [
    { month: 'Jan', actual: 45000, target: 48000 },
    { month: 'Feb', actual: 52000, target: 50000 },
    { month: 'Mar', actual: 49000, target: 51000 },
    { month: 'Apr', actual: 58000, target: 54000 },
    { month: 'May', actual: 56000, target: 55000 },
    { month: 'Jun', actual: 62000, target: 58000 },
];

const categoryData = [
    { name: 'Office', value: 35, color: '#17BEBB' },
    { name: 'Hygiene', value: 28, color: '#FCD569' }, // Using approximate yellow from screenshot
    { name: 'Industrial', value: 22, color: '#0F172A' },
    { name: 'Other', value: 15, color: '#94A3B8' },
];

export default function SalesCharts({ onOpenModal }: { onOpenModal: (type: string) => void }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Trend - 2/3 width */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-brand" />
                        <h3 className="font-bold text-slate-900">Sales Performance Analytics</h3>
                    </div>
                    <button
                        onClick={() => onOpenModal('revenue')}
                        className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-brand transition-colors"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData}>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line type="monotone" dataKey="actual" stroke="#17BEBB" strokeWidth={3} dot={{ r: 4, fill: '#17BEBB' }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="target" stroke="#FCD569" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Pie - 1/3 width */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900">Revenue by Category</h3>
                    <button
                        onClick={() => onOpenModal('category')}
                        className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-brand transition-colors"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="h-[250px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text mock */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-slate-900">100%</p>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {categoryData.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-xs text-slate-600 font-medium">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
