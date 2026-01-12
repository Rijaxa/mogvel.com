'use client';

import { X, BarChart3, ShoppingCart, TrendingUp, Percent, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface PromotionAnalyticsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const data = [
    { day: 'Mon', sales: 4200, baseline: 2500 },
    { day: 'Tue', sales: 4800, baseline: 2800 },
    { day: 'Wed', sales: 6800, baseline: 3000 },
    { day: 'Thu', sales: 5900, baseline: 2800 },
    { day: 'Fri', sales: 7200, baseline: 3500 },
    { day: 'Sat', sales: 8400, baseline: 4200 },
    { day: 'Sun', sales: 6200, baseline: 3800 },
];

export default function PromotionAnalyticsModal({ isOpen, onClose }: PromotionAnalyticsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-50 rounded-lg text-brand">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Summer Sale 2025 - Analytics</h2>
                            <p className="text-slate-500 text-sm">Performance insights and revenue impact analysis</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-8">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        <div className="p-4 border border-slate-100 rounded-2xl">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 mb-3">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900 mb-1">312</p>
                            <p className="text-xs text-slate-500 font-medium">Products Sold</p>
                        </div>
                        <div className="p-4 border border-slate-100 rounded-2xl">
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500 mb-3">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900 mb-1">18.250 ₾</p>
                            <p className="text-xs text-slate-500 font-medium">Revenue Impact</p>
                        </div>
                        <div className="p-4 border border-slate-100 rounded-2xl">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 mb-3">
                                <Percent className="w-5 h-5" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900 mb-1">12.4%</p>
                            <p className="text-xs text-slate-500 font-medium">Avg Discount Used</p>
                        </div>
                        <div className="p-4 border border-slate-100 rounded-2xl">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 mb-3">
                                <Users className="w-5 h-5" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900 mb-1">83%</p>
                            <p className="text-xs text-slate-500 font-medium">Customer Engagement</p>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="p-6 border border-slate-100 rounded-2xl">
                        <h3 className="font-bold text-slate-900 mb-6">Daily Sales Trend During Promotion</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line type="monotone" name="Promotion Sales" dataKey="sales" stroke="#17BEBB" strokeWidth={3} dot={{ r: 4, fill: '#17BEBB' }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" name="Baseline Sales" dataKey="baseline" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: '#94a3b8' }} />
                                </LineChart>
                            </ResponsiveContainer>

                            <div className="flex justify-center gap-6 mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-brand" />
                                    <span className="text-xs text-brand font-bold">Promotion Sales</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-400" />
                                    <span className="text-xs text-slate-400 font-bold">Baseline Sales</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
