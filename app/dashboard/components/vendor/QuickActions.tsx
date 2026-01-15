'use client';

import { Plus, Tag, Eye, FileText } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import AddProductModal from './catalogue/AddProductModal';
import CreatePromotionModal from './promotions/CreatePromotionModal';

export default function QuickActions() {
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [isCreatePromoModalOpen, setIsCreatePromoModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-6">Quick Actions</h3>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setIsAddProductModalOpen(true)}
                        className="flex flex-col items-center justify-center gap-2 p-4 bg-brand text-white rounded-xl font-bold text-sm hover:bg-brand/90 transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Add Product
                    </button>
                    <button
                        onClick={() => setIsCreatePromoModalOpen(true)}
                        className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                        <Tag className="w-5 h-5" />
                        Create Promo
                    </button>
                    <Link
                        href="/dashboard/vendor/orders"
                        className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                        <Eye className="w-5 h-5" />
                        View Orders
                    </Link>
                    <Link
                        href="/dashboard/vendor/catalogue"
                        className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                        <FileText className="w-5 h-5" />
                        Catalogue
                    </Link>
                </div>
            </div>

            <AddProductModal
                isOpen={isAddProductModalOpen}
                onClose={() => setIsAddProductModalOpen(false)}
            />

            <CreatePromotionModal
                isOpen={isCreatePromoModalOpen}
                onClose={() => setIsCreatePromoModalOpen(false)}
                mode="create"
            />
        </>
    );
}
