'use client';

import { X, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';

interface RevenueGrowthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const data = [
    { name: 'Last Month', value: 38420, fill: '#17BEBB', opacity: 0.8 },
    { name: 'This Month', value: 43240, fill: '#17BEBB' },
];

export default function RevenueGrowthModal({ isOpen, onClose }: RevenueGrowthModalProps) {
    const router = useRouter();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Revenue Change vs Last Month</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="h-48 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} barSize={60}>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
                                    dy={10}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-xs text-slate-500 font-medium mb-1">Last Month</p>
                            <p className="text-lg font-bold text-slate-900">₾38,420</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <p className="text-xs text-green-600 font-medium mb-1">This Month</p>
                            <p className="text-lg font-bold text-green-700">₾43,240</p>
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 flex items-center justify-center gap-2 mb-6">
                        <span className="text-2xl font-bold text-green-600">+12.5%</span>
                        <span className="text-green-600 font-medium">increase (₾4,820)</span>
                    </div>

                    <button
                        onClick={() => router.push('/dashboard/vendor/analytics?view=revenue')}
                        className="w-full py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-brand/20"
                    >
                        <TrendingUp className="w-5 h-5" />
                        Open Revenue Trend
                    </button>
                </div>
            </div>
        </div>
    );
}
