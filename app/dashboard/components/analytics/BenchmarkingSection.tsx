'use client';

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Zap, Clock, Share2 } from 'lucide-react';

const benchmarkData = [
    { metric: 'Avg Spend', company: 85, market: 120 },
    { metric: 'Delivery Time', company: 7, market: 14 }, // Days
    { metric: 'Order freq', company: 42, market: 35 },
    { metric: 'Reject Count', company: 2, market: 5 },
];

export default function BenchmarkingSection() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-slate-900 text-sm">Procurement Benchmarking</h4>
                <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                    15% better than market avg
                </span>
            </div>

            <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={benchmarkData} barGap={8}>
                        <XAxis dataKey="metric" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        <Bar dataKey="company" name="Your Company" fill="#17BEBB" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="market" name="Market Average" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Benchmark Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-green-600" />
                        <span className="text-green-800 font-bold text-xs">Cost Efficiency</span>
                    </div>
                    <p className="font-bold text-slate-900">23% above avg</p>
                </div>

                <div className="bg-cyan-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-cyan-600" />
                        <span className="text-cyan-800 font-bold text-xs">Delivery Speed</span>
                    </div>
                    <p className="font-bold text-slate-900">40% faster</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Share2 className="w-4 h-4 text-slate-600" />
                        <span className="text-slate-800 font-bold text-xs">Vendor Network</span>
                    </div>
                    <p className="font-bold text-slate-900">20% smaller</p>
                </div>
            </div>
        </div>
    );
}
