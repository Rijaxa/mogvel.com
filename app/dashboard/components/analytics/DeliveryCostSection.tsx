'use client';

import { BarChart, Bar, ResponsiveContainer, XAxis } from 'recharts';

const deliveryData = [
    { name: 'OfficeMax', val: 95 },
    { name: 'CleanPro', val: 82 },
    { name: 'SafetyFirst', val: 88 },
    { name: 'TechHub', val: 91 },
];

export default function DeliveryCostSection() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Delivery/Logistics */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 col-span-1 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold text-slate-900 text-sm">Delivery Quality Analysis</h4>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">98.5%</p>
                        <p className="text-[10px] text-green-500 font-bold">On Time Deliveries</p>
                    </div>
                </div>

                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={deliveryData} layout="vertical">
                            <XAxis type="number" hide />
                            <Bar dataKey="val" fill="#ef4444" background={{ fill: '#f1f5f9' }} radius={[0, 4, 4, 0]} barSize={20} />
                            {/* Using dummy axis for layout */}
                            <XAxis type="category" dataKey="name" hide />
                        </BarChart>
                    </ResponsiveContainer>
                    {/* Recharts vertical layout labels can be tricky, using manual HTML overlay is often cleaner for "Label.......Bar" look, 
                     but here keeping simple block */}
                    <div className="grid grid-cols-1 gap-2 mt-4">
                        {deliveryData.map((d, i) => (
                            <div key={i} className="flex items-center text-xs">
                                <span className="w-24 font-bold text-slate-600 truncate">{d.name}</span>
                                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${d.val > 90 ? 'bg-green-500' : 'bg-red-500'}`}
                                        style={{ width: `${d.val}%` }}
                                    />
                                </div>
                                <span className="ml-2 font-bold text-slate-700">{d.val}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Savings Opportunity */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h4 className="font-bold text-slate-900 text-sm mb-4">Cost Savings Opportunities</h4>

                <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-100">
                    <div className="flex gap-3">
                        <div className="text-yellow-600 text-lg">⚠️</div>
                        <div>
                            <p className="text-xs font-bold text-yellow-800 mb-1">5 Products detected</p>
                            <p className="text-[10px] text-yellow-700 leading-tight">
                                Could be 10-15% cheaper via alternative vendors.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Potential Savings</p>
                    <p className="text-3xl font-bold text-brand">€12,400</p>
                </div>
            </div>
        </div>
    );
}
