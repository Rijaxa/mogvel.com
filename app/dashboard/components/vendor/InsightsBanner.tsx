'use client';

import { TrendingUp } from 'lucide-react';

export default function InsightsBanner() {
    return (
        <div className="mt-8 bg-[#112338] rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FCD34D] rounded-full flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-[#112338]" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">Insights & Trends</h3>
                    <p className="text-slate-400 text-sm">AI-powered business intelligence</p>
                </div>
            </div>

            <button className="px-4 py-2 bg-[#FCD34D] text-[#112338] text-xs font-bold uppercase rounded-lg hover:bg-[#FBBF24] transition-colors">
                Premium
            </button>
        </div>
    );
}
