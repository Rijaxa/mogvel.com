'use client';

import { Plus, Tag, Eye, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QuickActions() {
    const router = useRouter();

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-6">Quick Actions</h3>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => router.push('/dashboard/vendor/catalogue?action=add')}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-brand text-white rounded-xl font-bold text-sm hover:bg-brand/90 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
                <button
                    onClick={() => router.push('/dashboard/vendor/promotions?action=create')}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                    <Tag className="w-5 h-5" />
                    Create Promo
                </button>
                <button
                    onClick={() => router.push('/dashboard/vendor/orders')}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                    <Eye className="w-5 h-5" />
                    View Orders
                </button>
                <button
                    onClick={() => router.push('/dashboard/vendor/catalogue')}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                    <FileText className="w-5 h-5" />
                    Catalogue
                </button>
            </div>
        </div>
    );
}
