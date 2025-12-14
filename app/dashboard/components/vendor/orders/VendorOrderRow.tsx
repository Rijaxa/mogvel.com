'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import VendorOrderDetails from './VendorOrderDetails';

interface VendorOrderRowProps {
    id: string;
    client: string;
    date: string;
    amount: string;
    status: 'Incoming' | 'In Progress' | 'Completed';
    badgeText?: string;
    badgeColor?: string;
}

export default function VendorOrderRow({
    id,
    client,
    date,
    amount,
    status,
    badgeText,
    badgeColor
}: VendorOrderRowProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Default badge logic if not provided
    const getBadgeStyle = () => {
        if (badgeText) return badgeColor || 'bg-slate-100 text-slate-600';

        switch (status) {
            case 'Incoming': return 'bg-slate-100 text-slate-500';
            case 'In Progress': return 'bg-green-100 text-green-700';
            case 'Completed': return 'bg-teal-50 text-teal-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const getBadgeLabel = () => {
        if (badgeText) return badgeText;
        switch (status) {
            case 'Incoming': return 'Awaiting Response';
            case 'In Progress': return 'Accepted';
            case 'Completed': return 'Delivered';
            default: return status;
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md overflow-hidden">
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-6 cursor-pointer flex items-center justify-between"
            >
                <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{id}</h3>
                    <p className="text-xs text-slate-400 font-medium">{date}</p>
                </div>

                <div className="flex-1 px-12">
                    <span className="font-bold text-brand">{client}</span>
                </div>

                <div className="flex items-center gap-12">
                    <span className={cn(
                        "px-4 py-1.5 rounded-lg text-xs font-bold min-w-[140px] text-center",
                        getBadgeStyle()
                    )}>
                        {getBadgeLabel()}
                    </span>

                    <span className="font-bold text-slate-900 text-lg w-24 text-right">
                        {amount}
                    </span>

                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 transition-colors",
                        isExpanded && "bg-brand text-white"
                    )}>
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <VendorOrderDetails status={status} onClose={() => setIsExpanded(false)} />
            )}
        </div>
    );
}
