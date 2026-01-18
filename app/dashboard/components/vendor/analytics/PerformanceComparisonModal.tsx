'use client';

import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getVendorComparisonData } from '@/app/dashboard/lib/mockAnalyticsData';
import { cn } from '@/lib/utils';

interface PerformanceComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PerformanceComparisonModal({ isOpen, onClose }: PerformanceComparisonModalProps) {
    if (!isOpen) return null;

    const data = getVendorComparisonData();

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Performance Comparison</h3>
                        <p className="text-sm text-slate-500 mt-1">Benchmarking against market standards and top performers</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="space-y-8">
                        {data.map((metric, index) => (
                            <div key={index} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-slate-800">{metric.category}</h4>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className={cn(
                                            "font-bold px-2 py-0.5 rounded-full text-xs",
                                            metric.user >= metric.marketAvg
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-amber-100 text-amber-700"
                                        )}>
                                            {metric.user >= metric.marketAvg ? "Above Average" : "Below Average"}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* User Stat */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-semibold text-brand">You</span>
                                            <span className="font-bold text-slate-900">{metric.user}{metric.unit}</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-brand rounded-full"
                                                style={{ width: `${Math.min((metric.user / (metric.topPerformers * 1.2)) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Market Average */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Market Average</span>
                                            <span className="font-medium text-slate-600">{metric.marketAvg}{metric.unit}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-slate-400 rounded-full opacity-60"
                                                style={{ width: `${Math.min((metric.marketAvg / (metric.topPerformers * 1.2)) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Top Performers */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-emerald-600 font-medium">Top 10% Vendors</span>
                                            <span className="font-medium text-emerald-700">{metric.topPerformers}{metric.unit}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-400 rounded-full opacity-60"
                                                style={{ width: `${Math.min((metric.topPerformers / (metric.topPerformers * 1.2)) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <h4 className="font-bold text-slate-900 text-sm mb-2">Improvement Recommendations</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <Minus className="w-1.5 h-1.5 mt-2 bg-brand rounded-full flex-shrink-0" />
                                <span>Your response time is excellent, keep maintaining instant communication.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Minus className="w-1.5 h-1.5 mt-2 bg-brand rounded-full flex-shrink-0" />
                                <span>Review delivery logistics to improve on-time ratings closer to top performers.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-brand text-white font-bold rounded-xl hover:bg-brand/90 transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
