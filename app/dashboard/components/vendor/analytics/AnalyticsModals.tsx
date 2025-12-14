'use client';

import { X, Download, FileText, BarChart3, PieChart, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import SalesCharts from './SalesCharts';

// Reusing charts or creating simplified versions for the modals
// For simplicity in this demo, we'll re-render similar structures or placeholders

interface AnalyticsModalsProps {
    type: string | null;
    onClose: () => void;
}

export default function AnalyticsModals({ type, onClose }: AnalyticsModalsProps) {
    if (!type) return null;

    const renderContent = () => {
        switch (type) {
            case 'category':
                return (
                    <>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-teal-50 rounded-lg text-brand">
                                <PieChart className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Category Sales Detail</h2>
                                <p className="text-slate-500 text-sm">Subcategory breakdown and performance metrics</p>
                            </div>
                        </div>

                        {/* Large Pie Chart Placeholder */}
                        <div className="flex justify-center mb-8 relative">
                            <div className="w-64 h-64 rounded-full border-[24px] border-slate-100 flex items-center justify-center relative">
                                {/* Custom CSS Donut Segment mockup */}
                                <div className="absolute inset-0 border-[24px] border-brand rounded-full " style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 50% 50%)' }} />
                                <div className="absolute inset-0 border-[24px] border-yellow-400 rounded-full " style={{ clipPath: 'polygon(0 0, 0 100%, 40% 100%, 50% 50%)', transform: 'rotate(-90deg)' }} />

                                <div className="text-center">
                                    <p className="font-bold text-slate-900">Breakdown</p>
                                </div>
                            </div>

                            {/* Floating Labels Mockup */}
                            <div className="absolute top-0 right-10 text-brand font-bold">Office Supplies: 35%</div>
                            <div className="absolute left-0 top-20 text-yellow-500 font-bold">Hygiene: 28%</div>
                        </div>

                        {/* Breakdown Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border border-slate-200 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 rounded-full bg-brand" />
                                    <h4 className="font-bold text-slate-900">Office Supplies</h4>
                                </div>
                                <p className="text-slate-500 text-sm">Share: 35%</p>
                            </div>
                            <div className="p-4 border border-slate-200 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <h4 className="font-bold text-slate-900">Hygiene Products</h4>
                                </div>
                                <p className="text-slate-500 text-sm">Share: 28%</p>
                            </div>
                        </div>
                    </>
                );
            case 'delivery':
                return (
                    <>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-teal-50 rounded-lg text-brand">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Delivery Accuracy Details</h2>
                                <p className="text-slate-500 text-sm">SLA compliance breakdown</p>
                            </div>
                        </div>

                        <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center mb-8">
                            <BarChart3 className="w-12 h-12 text-slate-300" />
                            <p className="text-slate-400 ml-2">Detailed analytics visualization...</p>
                        </div>
                    </>
                );
            default: // revenue
                return (
                    <>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-teal-50 rounded-lg text-brand">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Monthly Revenue Breakdown</h2>
                                <p className="text-slate-500 text-sm">Revenue by product category, client, and region</p>
                            </div>
                        </div>

                        <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center mb-8">
                            <BarChart3 className="w-12 h-12 text-slate-300" />
                            <p className="text-slate-400 ml-2">Detailed analytics visualization...</p>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-slate-500" />
                </button>

                <div className="p-8">
                    {renderContent()}

                    <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">
                            <Download className="w-4 h-4" />
                            Export PDF
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">
                            <FileText className="w-4 h-4" />
                            Export CSV
                        </button>
                        <button
                            onClick={onClose}
                            className="ml-auto px-6 py-2 bg-brand text-white rounded-xl font-bold text-sm hover:bg-brand/90 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
