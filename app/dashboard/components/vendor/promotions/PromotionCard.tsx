'use client';

import { Tags, Calendar, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromotionCardProps {
    id: string;
    title: string;
    status: 'Active' | 'Upcoming' | 'Completed';
    discount: string;
    scope: string; // e.g., "All Products" or "2 Products"
    dates: string; // e.g., "20/11/2025 – 31/12/2025"
    onEdit?: () => void;
    onViewAnalytics?: () => void;
}

export default function PromotionCard({
    id,
    title,
    status,
    discount,
    scope,
    dates,
    onEdit,
    onViewAnalytics
}: PromotionCardProps) {
    const statusStyles = {
        Active: "bg-green-100 text-green-700",
        Upcoming: "bg-blue-100 text-blue-700",
        Completed: "bg-slate-100 text-slate-700"
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-brand shrink-0">
                    <Tags className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
                        {/* Toggle Switch Mockup logic primarily for active state */}
                        {status === 'Active' && (
                            <button className="w-10 h-6 rounded-full bg-slate-900 relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                            </button>
                        )}
                    </div>
                    <span className={cn("inline-block px-2 py-0.5 rounded textxs font-bold uppercase text-[10px]", statusStyles[status])}>
                        {status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-6 pb-6 border-b border-slate-50">
                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Discount</p>
                    <p className="text-xl font-bold text-brand">{discount}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Scope</p>
                    <p className="text-sm font-bold text-slate-900">{scope}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-6">
                <Calendar className="w-4 h-4" />
                {dates}
            </div>

            {status === 'Active' && (
                <div className="flex gap-3">
                    <button
                        onClick={onEdit}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                        Edit
                    </button>
                    <button className="flex items-center justify-center w-10 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                        <Tags className="w-4 h-4 rotate-45" /> {/* Using Tags as generic delete icon replacement or specific icon if needed */}
                    </button>
                </div>
            )}

            {status === 'Completed' && (
                <button
                    onClick={onViewAnalytics}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand text-white font-bold text-sm hover:bg-brand/90 transition-colors shadow-sm shadow-brand/20"
                >
                    <BarChart3 className="w-4 h-4" />
                    View Analytics
                </button>
            )}

            {status === 'Upcoming' && (
                <div className="flex gap-3">
                    <button
                        onClick={onEdit}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                        Edit
                    </button>
                </div>
            )}
        </div>
    );
}
