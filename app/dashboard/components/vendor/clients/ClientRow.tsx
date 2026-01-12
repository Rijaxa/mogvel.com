'use client';

import { Star, Eye, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ClientRowProps {
    id: string;
    name: string;
    initials: string;
    initialsColor: string;
    tier: 'Gold' | 'Silver' | 'Bronze';
    orders: string; // e.g., "45 orders"
    avgOrder: string; // e.g., "₾2,500 avg. order"
    rating: number;
    isActive: boolean;
}

export default function ClientRow({
    id,
    name,
    initials,
    initialsColor,
    tier,
    orders,
    avgOrder,
    rating,
    isActive
}: ClientRowProps) {
    const tierColors = {
        Gold: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        Silver: 'bg-slate-100 text-slate-600 border-slate-200',
        Bronze: 'bg-orange-50 text-orange-700 border-orange-200'
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg", initialsColor)}>
                    {initials}
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-slate-900 text-lg">{name}</h3>
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border uppercase", tierColors[tier])}>
                            {tier}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span>{orders}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>{avgOrder}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <div className="flex items-center gap-1 text-orange-400">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="font-bold text-slate-600">{rating}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {isActive && (
                    <div className="flex items-center gap-1.5 text-green-500 font-bold text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>Active</span>
                    </div>
                )}

                <Link
                    href={`/dashboard/vendor/clients/${id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-brand text-brand font-bold text-sm hover:bg-teal-50 transition-colors"
                >
                    <Eye className="w-4 h-4" />
                    View Details
                </Link>
            </div>
        </div>
    );
}
