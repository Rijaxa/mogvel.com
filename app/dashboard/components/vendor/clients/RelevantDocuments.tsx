'use client';

import { FileText } from 'lucide-react';

export default function RelevantDocuments() {
    const docs = [
        { name: 'INV-2024-001', date: '10.11.2024', size: '254.9KB' },
        { name: 'INV-2024-002', date: '25.10.2024', size: '184.2KB' },
        { name: 'INV-2024-003', date: '10.10.2024', size: '358.7KB' },
        { name: 'INV-2024-004', date: '28.9.2024', size: '124.5KB' },
        { name: 'INV-2024-005', date: '15.8.2024', size: '289.0KB' },
    ];

    return (
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                <FileText className="w-6 h-6 text-brand" />
                <h2 className="text-lg font-bold text-slate-900">Relevant Documents</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {docs.map((doc, idx) => (
                    <div key={idx} className="flex items-center p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-brand mr-4">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm mb-0.5 group-hover:text-brand transition-colors">{doc.name}</h4>
                            <p className="text-xs text-slate-500">{doc.date} • {doc.size}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
