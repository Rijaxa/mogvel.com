'use client';

import { cn } from '@/lib/utils';
import { ArrowUpRight, TrendingUp, Zap, ThumbsUp, Map, Briefcase, RotateCw, Maximize2 } from 'lucide-react';

export default function AnalyticsSections({ onOpenModal }: { onOpenModal: (type: string) => void }) {
    return (
        <div className="space-y-8">
            {/* Top Selling Products */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900">Top-Selling Products</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { name: 'Hand Sanitizer 500ml', revenue: '₾12,500', growth: '+18%' },
                        { name: 'Office Paper A4', revenue: '₾9,800', growth: '+12%' },
                        { name: 'Cleaning Wipes', revenue: '₾8,400', growth: '-3%' },
                        { name: 'Safety Gloves', revenue: '₾7,200', growth: '+25%' },
                    ].map((prod, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                                <span className={cn(
                                    "text-[10px] font-bold px-1.5 py-0.5 rounded",
                                    prod.growth.startsWith('+') ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"
                                )}>{prod.growth}</span>
                            </div>
                            <p className="font-bold text-slate-900 text-sm mb-1 truncate">{prod.name}</p>
                            <p className="text-brand font-bold">{prod.revenue}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Client & Market Insights */}
            <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <Briefcase className="w-5 h-5 text-brand" />
                    <h3 className="font-bold text-slate-900">Client & Market Insights</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Horizontal Bar Chart Mock */}
                    <div>
                        <p className="text-sm font-bold text-slate-500 mb-4">Repeat Order Rate by Client</p>
                        <div className="space-y-3">
                            {[
                                { client: 'Acme Corp', val: 90 },
                                { client: 'TechStart', val: 75 },
                                { client: 'Global Ind', val: 60 },
                                { client: 'Urban', val: 40 },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <span className="text-xs font-medium text-slate-500 w-20 text-right">{item.client}</span>
                                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand rounded-full" style={{ width: `${item.val}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Radial / Donut Mock for Retention */}
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-sm font-bold text-slate-500 mb-4 self-start">New vs Returning Clients</p>
                        <div className="w-40 h-40 rounded-full border-[12px] border-emerald-100 border-t-emerald-500 border-r-emerald-500 flex items-center justify-center rotate-45">
                            <div className="text-center -rotate-45">
                                <p className="text-3xl font-bold text-slate-900">78%</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Retention</p>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-xs text-slate-600">Returning (78%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-100" />
                                <span className="text-xs text-slate-600">New (22%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Operational Efficiency */}
            <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-brand" />
                        <h3 className="font-bold text-slate-900">Operational Efficiency Analytics</h3>
                    </div>
                    <button
                        onClick={() => onOpenModal('delivery')}
                        className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-brand transition-colors"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Speed */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Order Fulfillment Speed</p>
                        <p className="text-3xl font-bold text-slate-900 mb-2">2.9 <span className="text-sm text-slate-400 font-normal">days avg</span></p>
                        <div className="h-10 flex items-end gap-1">
                            {[40, 60, 50, 80, 70, 90, 85].map((h, i) => (
                                <div key={i} className="flex-1 bg-brand/20 rounded-t-sm" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </div>

                    {/* Accuracy - Bar */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Delivery Accuracy</p>
                        <div className="h-20 flex items-end gap-4 px-4 pt-4">
                            <div className="w-8 bg-brand/20 h-[20%] rounded-t-lg mx-auto" />
                            <div className="w-8 bg-brand h-[80%] rounded-t-lg mx-auto" />
                            <div className="w-8 bg-brand/10 h-[5%] rounded-t-lg mx-auto" />
                        </div>
                    </div>

                    {/* Stock Turnover - Radial */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2 self-start w-full">Stock Turnover Rate</p>
                        <div className="w-20 h-20 rounded-full border-4 border-slate-200 border-t-brand flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-lg font-bold text-slate-900">22</p>
                                <p className="text-[8px] text-slate-500">days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
