'use client';

import { X, ExternalLink, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const data = [
    { time: '0h', sales: 150 },
    { time: '4h', sales: 100 },
    { time: '8h', sales: 450 },
    { time: '12h', sales: 600 },
    { time: '16h', sales: 950 },
    { time: '20h', sales: 300 },
];

export default function SalesDetailsModal({ isOpen, onClose }: SalesDetailsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Today's Sales — Details</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-xs text-slate-500 font-medium mb-1">Gross Sales</p>
                            <p className="text-lg font-bold text-slate-900">₾12,480</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-xs text-slate-500 font-medium mb-1"># Orders</p>
                            <p className="text-lg font-bold text-slate-900">24</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-xs text-slate-500 font-medium mb-1">Avg Order</p>
                            <p className="text-lg font-bold text-slate-900">₾520</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="text-sm font-bold text-slate-500 mb-4">24-Hour Trend</p>
                        <div className="h-40 w-full relative">
                            {/* Grid lines manually simulated or allow recharts default */}
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <XAxis
                                        dataKey="time"
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
                                        dataKey="sales"
                                        stroke="#17BEBB"
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#17BEBB' }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex-1 py-2.5 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-brand/20 text-sm">
                            <ExternalLink className="w-4 h-4" />
                            View Sales Analytics
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
