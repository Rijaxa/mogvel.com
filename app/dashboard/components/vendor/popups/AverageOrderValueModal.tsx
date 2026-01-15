'use client';

import { X, ExternalLink, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AverageOrderValueModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Mock data (Monthly)
const trendData = [
    { month: 'Jan', value: 450 },
    { month: 'Feb', value: 520 },
    { month: 'Mar', value: 480 },
    { month: 'Apr', value: 610 },
    { month: 'May', value: 590 },
    { month: 'Jun', value: 750 },
];

export default function AverageOrderValueModal({ isOpen, onClose }: AverageOrderValueModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Average Order Value — Details</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-xs text-slate-500 font-medium mb-1">Highest Order</p>
                            <p className="text-lg font-bold text-slate-900">₾3,120</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-xs text-slate-500 font-medium mb-1">Lowest Order</p>
                            <p className="text-lg font-bold text-slate-900">₾120</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-xs text-slate-500 font-medium mb-1">Total Orders</p>
                            <p className="text-lg font-bold text-slate-900">428</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="text-sm font-bold text-slate-500 mb-4">6-Month Trend</p>
                        <div className="h-40 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        width={40}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#F59E0B" // Orange for AOV to distinguish from Teal sales
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#F59E0B' }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex-1 py-2.5 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-brand/20 text-sm">
                            <ExternalLink className="w-4 h-4" />
                            View Full Report
                        </button>
                        <button className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm">
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
