'use client';

import { FileCheck, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ContractStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-xs font-bold mb-1">Active Contracts</p>
                    <h3 className="text-2xl font-bold text-slate-900">14</h3>
                    <p className="text-[10px] text-green-500 font-bold mt-1">+2 New this month</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-blue-500" />
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-xs font-bold mb-1">Expiring Soon</p>
                    <h3 className="text-2xl font-bold text-slate-900">3</h3>
                    <p className="text-[10px] text-red-500 font-bold mt-1">Action required</p>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-xs font-bold mb-1">Compliance Rate</p>
                    <h3 className="text-2xl font-bold text-slate-900">98%</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Fully audit ready</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                </div>
            </div>
        </div>
    );
}
