'use client';

import { ArrowUpRight } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, AreaChart, Area
} from 'recharts';

interface SpendingChartsProps {
    monthlySpend: any[];
    spendByCategory: any[];
    spendByDepartment: any[];
    orderFrequency: any[];
}

export default function SpendingCharts({
    monthlySpend,
    spendByCategory,
    spendByDepartment,
    orderFrequency
}: SpendingChartsProps) {

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-slate-100 shadow-lg rounded-lg text-xs">
                    <p className="font-bold">{label}</p>
                    <p className="text-brand">€{payload[0].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Row 1: Monthly Spend & Category */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h4 className="font-bold text-slate-900 text-sm mb-6">Monthly Spending Trend</h4>
                <div className="h-64 mb-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlySpend}>
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="value" stroke="#17BEBB" strokeWidth={2} dot={{ fill: '#17BEBB', r: 3 }} activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h4 className="font-bold text-slate-900 text-sm mb-6">Spend by Category</h4>
                <div className="h-64 mb-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={spendByCategory.slice(0, 5)}>
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={0} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="value" fill="#17BEBB" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Row 2: Department & Order Frequency */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h4 className="font-bold text-slate-900 text-sm mb-6">Spending by Department</h4>
                <div className="space-y-4">
                    {spendByDepartment.map((dept, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>{dept.name}</span>
                                <span>€{dept.value.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div
                                    className="bg-brand rounded-full h-2 transition-all duration-500"
                                    style={{ width: `${(dept.value / spendByDepartment[0].value) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h4 className="font-bold text-slate-900 text-sm mb-2">Order Frequency Trends</h4>
                <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-2xl font-bold text-slate-900">42</span>
                    <span className="text-xs text-slate-400">Avg. Orders/Month</span>
                    <span className="text-[10px] text-green-500 font-bold flex items-center bg-green-50 px-1 rounded">
                        +12.5% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                    </span>
                </div>

                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={orderFrequency}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#17BEBB" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#17BEBB" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#17BEBB" fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
