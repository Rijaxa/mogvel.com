'use client';

import { FileText, Download, RotateCw, AlertCircle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContractCardProps {
    vendor: string;
    title: string;
    startDate: string;
    expiryDate: string;
    status: 'Active' | 'Expiring' | 'Expired';
    value: number;
}

export default function ContractCard({
    vendor,
    title,
    startDate,
    expiryDate,
    status,
    value
}: ContractCardProps) {

    // Calculate mock progress based on dates (simplified logic)
    const start = new Date(startDate).getTime();
    const end = new Date(expiryDate).getTime();
    const now = new Date().getTime();
    const totalDuration = end - start;
    const elapsed = now - start;
    let progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

    // Format dates
    const formattedExpiry = new Date(expiryDate).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
    });

    return (
        <div className={cn(
            "bg-white rounded-2xl border p-6 transition-all hover:shadow-md",
            status === 'Expiring' ? "border-red-100 bg-red-50/20" : "border-slate-100"
        )}>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                        status === 'Expiring' ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"
                    )}>
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">{vendor}</h3>
                        <p className="text-xs text-slate-500">{title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {status === 'Expiring' && (
                        <div className="flex items-center gap-1.5 bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold animate-pulse">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Expiring Soon
                        </div>
                    )}
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Contract Value</p>
                        <p className="text-sm font-bold text-slate-900">€{value.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Timeline Progress */}
            <div className="mb-6">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2">
                    <span>Started: {startDate}</span>
                    <span className={status === 'Expiring' ? 'text-red-500' : 'text-slate-500'}>
                        Expires: {formattedExpiry}
                    </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={cn("h-full rounded-full transition-all duration-1000",
                            status === 'Expiring' ? "bg-red-500" : "bg-brand"
                        )}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex border-t border-slate-100 pt-4 gap-3">
                <button className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Download
                </button>
                <button className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                </button>
                {status === 'Expiring' && (
                    <button className="flex-1 py-2 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 flex items-center justify-center gap-2 transition-colors shadow-sm">
                        <RotateCw className="w-3.5 h-3.5" />
                        Renew Now
                    </button>
                )}
            </div>
        </div>
    );
}
