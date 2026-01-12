'use client';

import { FileText, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RequestCardProps {
    id: string;
    title: string;
    status: 'active' | 'pending' | 'completed';
    quantity: number;
    dueDate: string;
    responseCount: number;
}

export default function RequestCard({
    id,
    title,
    status,
    quantity,
    dueDate,
    responseCount
}: RequestCardProps) {

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'active': return 'bg-slate-900 text-white';
            case 'pending': return 'bg-slate-100 text-slate-600';
            case 'completed': return 'bg-slate-100 text-slate-800 border border-slate-200';
            default: return 'bg-slate-100';
        }
    };

    const getStatusIcon = (s: string) => {
        switch (s) {
            case 'active': return <Clock className="w-3 h-3 mr-1" />;
            case 'pending': return null;
            case 'completed': return <CheckCircle className="w-3 h-3 mr-1" />;
            default: return null;
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center justify-between transition-all hover:shadow-sm">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-brand" />
                </div>

                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-slate-500 font-bold text-sm tracking-wide">{id}</span>
                        <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold flex items-center", getStatusColor(status))}>
                            {getStatusIcon(status)}
                            {status}
                        </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>

                    <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
                        <span>Quantity: <span className="text-slate-900">{quantity}</span></span>
                        <span>Due: <span className="text-slate-900">{dueDate}</span></span>
                        <span className="text-brand font-bold">{responseCount} vendor responses</span>
                    </div>
                </div>
            </div>

            <button className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                View Responses
            </button>
        </div>
    );
}
