'use client';

import { UploadCloud } from 'lucide-react';

export default function ContractUploadZone() {
    return (
        <div className="mt-8 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand hover:bg-brand/5 transition-all group">
            <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-white transition-colors group-hover:shadow-md">
                <UploadCloud className="w-7 h-7 text-slate-400 group-hover:text-brand transition-colors" />
            </div>
            <h4 className="font-bold text-slate-900 mb-1">Upload New Contract</h4>
            <p className="text-slate-500 text-sm mb-4">Drag and drop your PDF here, or browse files</p>
            <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
                Browse Files
            </button>
        </div>
    );
}
