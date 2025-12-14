'use client';

import { Search, Plus, ChevronDown } from 'lucide-react';

export default function CatalogueHeader() {
    return (
        <div className="space-y-6 mb-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Product Catalogue</h1>
                    <p className="text-slate-500">Manage your product inventory</p>
                </div>
                <button className="flex items-center gap-2 bg-brand text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-brand/90 transition-colors shadow-sm shadow-brand/20">
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-slate-100 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-0"
                        placeholder="Search by name, producer, or SKU..."
                    />
                </div>

                <div className="relative">
                    <button className="flex items-center gap-2 bg-slate-100 text-slate-700 font-medium px-4 py-3 rounded-xl hover:bg-slate-200 transition-colors w-40 justify-between">
                        <span>All Categories</span>
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                    </button>
                </div>
            </div>
        </div>
    );
}
