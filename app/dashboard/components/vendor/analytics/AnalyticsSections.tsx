'use client';

import { cn } from '@/lib/utils';
import { ArrowUpRight, TrendingUp, Zap, ThumbsUp, Map, Briefcase, RotateCw, Maximize2, DollarSign } from 'lucide-react';

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

            {/* Pricing & Profitability Insights */}
            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-brand" />
                    <h3 className="font-bold text-slate-900">Pricing & Profitability Insights</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Avg Margin by Category */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1">
                        <p className="text-lg font-bold text-slate-900 mb-6">Avg Margin by Category</p>
                        <div className="h-48 flex items-end gap-4 px-2">
                            {[
                                { name: 'Hygiene', val: 75 },
                                { name: 'Industrial', val: 100 },
                                { name: 'Office', val: 55 },
                                { name: 'Other', val: 45 }
                            ].map((item, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full bg-green-500 rounded-t-md hover:opacity-90 transition-opacity" style={{ height: `${item.val}%` }} />
                                    <span className="text-[10px] text-slate-500 font-medium truncate w-full text-center">{item.name === 'Office' ? 'Office Supplies' : item.name}</span>
                                </div>
                            ))}
                        </div>
                        {/* Y-Axis Labels Mock */}
                        <div className="absolute left-6 top-24 h-40 flex flex-col justify-between text-[10px] text-slate-400 pointer-events-none opacity-0">
                            <span>36</span><span>27</span><span>18</span><span>9</span><span>0</span>
                        </div>
                    </div>

                    {/* Discount Impact */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1">
                        <p className="text-lg font-bold text-slate-900 mb-6">Discount Impact</p>

                        <div className="mb-6">
                            <p className="text-sm text-slate-500 mb-1">Avg Discount Applied</p>
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-slate-900">7%</span>
                                <span className="px-2 py-1 bg-orange-50 text-orange-400 text-xs font-bold rounded">↑ 2% QoQ</span>
                            </div>
                        </div>

                        <div className="bg-green-50 rounded-xl p-4">
                            <p className="text-sm font-bold text-green-600 mb-1">Promotion Uplift</p>
                            <p className="text-2xl font-bold text-slate-900 mb-1">₾4,200</p>
                            <p className="text-xs text-slate-500">From active promotions</p>
                        </div>
                    </div>

                    {/* Price Competitiveness */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1 flex flex-col items-center justify-center text-center">
                        <p className="text-lg font-bold text-slate-900 mb-6 self-start w-full text-left">Price Competitiveness</p>

                        <div className="w-40 h-40 rounded-full border-[10px] border-slate-100 flex items-center justify-center relative">
                            <div className="absolute inset-0 border-[10px] border-green-500 rounded-full border-l-transparent border-b-transparent -rotate-45" />
                            <div>
                                <p className="text-3xl font-bold text-green-500">-5%</p>
                                <p className="text-sm font-medium text-green-500">Better</p>
                            </div>
                        </div>
                        <p className="mt-4 text-slate-500 font-medium">Below market median</p>
                    </div>
                </div>
            </section>

            {/* Forecasting & Growth Indicators */}
            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand" />
                    <h3 className="font-bold text-slate-900">Forecasting & Growth Indicators</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Projected Revenue */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-lg font-bold text-slate-900 mb-6">Projected Revenue (Next Quarter)</p>

                        <div className="mb-8">
                            <p className="text-sm text-slate-500 font-bold mb-1">Expected Revenue</p>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-slate-900">₾86,000</span>
                                <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded">+9% QoQ</span>
                            </div>
                        </div>

                        <div className="h-32 bg-orange-50/50 rounded-lg border-b border-l border-slate-200 relative overflow-hidden">
                            {/* Mock dotted line chart */}
                            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                <path d="M0,80 Q50,75 100,70 T200,60 T300,50" fill="none" stroke="#FCD569" strokeWidth="2" strokeDasharray="5,5" />
                                <path d="M0,80 Q50,75 100,70 T200,60 T300,50 V150 H0 Z" fill="#FFFBEB" opacity="0.5" />
                            </svg>
                            <div className="absolute bottom-0 w-full flex justify-between px-2 text-[10px] text-slate-400 py-1">
                                <span>Feb</span><span>Mar</span><span>Apr</span>
                            </div>
                        </div>
                    </div>

                    {/* Demand Growth */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-lg font-bold text-slate-900 mb-4">Demand Growth by Category</p>

                        <div className="space-y-4 pt-4">
                            {[
                                { name: 'Hygiene', width: '100%' },
                                { name: 'Office Supplies', width: '75%' },
                                { name: 'Industrial', width: '50%' },
                                { name: 'Other', width: '25%' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-xs font-medium text-slate-500 w-24 text-right leading-tight">{item.name}</span>
                                    <div className="flex-1 h-8 bg-brand rounded-r-lg" style={{ width: item.width }} />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between pl-24 pr-4 pt-2 text-[10px] text-slate-400 border-t border-slate-100 mt-4 border-dashed">
                            <span>0</span><span>6</span><span>12</span><span>18</span><span>24</span>
                        </div>
                    </div>

                    {/* Potential Lost Sales */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                        <p className="text-lg font-bold text-slate-900 mb-6 text-left">Potential Lost Sales</p>

                        <div className="bg-red-50 rounded-xl p-6 mb-6 flex items-center justify-center gap-4 text-left">
                            <div className="text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-red-500">₾2,300</p>
                                <p className="text-sm font-medium text-slate-600">Lost due to stock-outs</p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Affected SKUs</p>
                        <p className="text-xl font-bold text-slate-900 mb-1">4 products</p>
                        <p className="text-xs text-slate-400">Out of stock &gt;3 days</p>
                    </div>
                </div>
            </section>

            {/* Client Feedback & Satisfaction */}
            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-brand" />
                    <h3 className="font-bold text-slate-900">Client Feedback & Satisfaction</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Rating Distribution */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-lg font-bold text-slate-900 mb-6">Client Rating Distribution</p>

                        <div className="space-y-3 mb-6">
                            {[
                                { star: 5, val: 52, w: '60%' },
                                { star: 4, val: 28, w: '35%' },
                                { star: 3, val: 5, w: '10%' },
                                { star: 2, val: 2, w: '5%' },
                                { star: 1, val: 0, w: '0%' }
                            ].map((s, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs">
                                    <span className="font-medium text-slate-600 w-10">{s.star} Stars</span>
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: s.w }} />
                                    </div>
                                    <span className="text-slate-400 w-6 text-right">{s.val}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-yellow-50/50 rounded-xl p-4 text-center">
                            <p className="text-sm text-slate-500 font-bold mb-1">Average Rating</p>
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <div className="text-yellow-400 text-xl">★</div>
                                <span className="text-2xl font-bold text-slate-900">4.6</span>
                            </div>
                            <p className="text-xs text-slate-400">Based on 87 reviews</p>
                        </div>
                    </div>

                    {/* Feedback Keywords */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                        <p className="text-lg font-bold text-slate-900 mb-6">Top Feedback Keywords</p>

                        <div className="flex-1 flex flex-wrap content-center justify-center gap-3 px-4">
                            <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold">Quality</span>
                            <span className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg text-xs font-bold">Fast Delivery</span>
                            <span className="bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-sm font-bold">Reliable</span>
                            <span className="bg-orange-50 text-orange-400 px-3 py-1.5 rounded-lg text-xs font-bold">Pricing</span>
                            <span className="bg-teal-100 text-teal-800 px-4 py-2 rounded-lg text-base font-bold">Professional</span>
                            <span className="bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold">Stock Issues</span>
                            <span className="bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-bold">Responsive</span>
                        </div>
                    </div>

                    {/* Response Time */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center">
                        <p className="text-lg font-bold text-slate-900 mb-6 self-start w-full text-left">Response Time to Queries</p>

                        <div className="w-32 h-32 rounded-full border-4 border-slate-100 flex items-center justify-center relative mb-4">
                            <div className="absolute inset-0 border-4 border-brand rounded-full border-r-transparent -rotate-45" />
                            <div className="text-center">
                                <p className="text-xl font-bold text-slate-900">1h 24m</p>
                            </div>
                        </div>

                        <p className="text-xs font-medium text-slate-500 mb-2">Average response time</p>
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">24% faster than last quarter</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
