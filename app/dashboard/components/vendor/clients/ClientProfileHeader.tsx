'use client';

import { Building2, CheckCircle2 } from 'lucide-react';

interface ClientProfileHeaderProps {
    name: string;
    legalName: string;
    idNumber: string;
    factualAddress: string;
    officialAddress: string;
    status: 'Verified' | 'Pending';
}

export default function ClientProfileHeader({
    name,
    legalName,
    idNumber,
    factualAddress,
    officialAddress,
    status
}: ClientProfileHeaderProps) {
    return (
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                <Building2 className="w-6 h-6 text-brand" />
                <h2 className="text-lg font-bold text-slate-900">Company Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Trademark Name</p>
                    <p className="font-bold text-slate-900">{name}</p>
                </div>

                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Legal Name</p>
                    <p className="font-bold text-slate-900">{legalName}</p>
                </div>

                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Identification Number</p>
                    <p className="font-bold text-slate-900">{idNumber}</p>
                </div>

                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Status</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        {status}
                    </span>
                </div>

                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Factual Address</p>
                    <p className="font-bold text-slate-900">{factualAddress}</p>
                </div>

                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Official Address</p>
                    <p className="font-bold text-slate-900">{officialAddress}</p>
                </div>
            </div>
        </div>
    );
}
