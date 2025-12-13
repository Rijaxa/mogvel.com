'use client';

import { Eye, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface VendorRowProps {
    name: string;
    isVerified?: boolean;
    rating: number;
    stability: 'Stable' | 'Increasing' | 'Decreasing';
    stockLevel: 'High Stock' | 'Medium' | 'Low Stock';
    deliverySLA: string;
}

export default function VendorRow({
    name,
    isVerified,
    rating,
    stability,
    stockLevel,
    deliverySLA
}: VendorRowProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden transition-all hover:shadow-sm">
            {/* Main Row */}
            <div
                className={cn("p-4 grid grid-cols-12 gap-4 items-center cursor-pointer", isExpanded && "bg-slate-50/50")}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="col-span-3 flex items-center gap-2">
                    <span className="font-bold text-brand">{name}</span>
                    {isVerified && (
                        <span className="bg-cyan-50 text-brand text-[10px] font-bold px-2 py-0.5 rounded-full">Verified</span>
                    )}
                </div>

                <div className="col-span-1 flex items-center gap-1 font-bold text-slate-700">
                    <span className="text-yellow-400">★</span> {rating.toFixed(1)}
                </div>

                <div className="col-span-2">
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", {
                            'bg-green-500': stability === 'Stable',
                            'bg-none': stability !== 'Stable', // handled by icon usually but keeping simple
                        })}>
                            {stability === 'Increasing' && <span className="text-red-500 text-xs">↗</span>}
                            {stability === 'Decreasing' && <span className="text-green-500 text-xs">↘</span>}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{stability}</span>
                    </div>
                </div>

                <div className="col-span-2">
                    <span className={cn("text-xs font-bold px-2 py-1 rounded-lg", {
                        'bg-green-100 text-green-700': stockLevel === 'High Stock',
                        'bg-yellow-100 text-yellow-700': stockLevel === 'Medium',
                        'bg-red-100 text-red-700': stockLevel === 'Low Stock',
                    })}>
                        {stockLevel}
                    </span>
                </div>

                <div className="col-span-2 text-brand font-bold text-sm">
                    {deliverySLA}
                </div>

                <div className="col-span-2 flex justify-end gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-brand text-brand rounded-lg text-xs font-bold hover:bg-cyan-50 transition-colors">
                        <Eye className="w-3 h-3" />
                        View Offer
                    </button>
                    <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg">
                        <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
                    </button>
                </div>
            </div>

            {/* Expanded content placeholder if needed in future */}
            {isExpanded && (
                <div className="p-4 border-t border-slate-100 bg-slate-50/30 text-sm text-slate-500">
                    <p>Vendor details and catalog preview specific to {name} would appear here.</p>
                </div>
            )}
        </div>
    );
}
