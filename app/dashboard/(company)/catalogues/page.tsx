'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import CatalogueView from '../../components/catalogues/CatalogueView';
import VendorView from '../../components/catalogues/VendorView';

export default function CataloguesPage() {
    const [activeTab, setActiveTab] = useState<'products' | 'vendors'>('products');

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Catalogues & Vendors</h1>
                    <p className="text-slate-500">Browse and order products or explore verified vendors</p>
                </div>

                {activeTab === 'products' && (
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 transition-colors shadow-sm">
                        <ShoppingCart className="w-4 h-4" />
                        View Basket
                        <span className="bg-yellow-400 text-slate-900 text-xs px-1.5 py-0.5 rounded font-bold ml-1">12</span>
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="bg-slate-100 p-1 rounded-xl inline-flex w-full md:w-auto mb-8">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`flex-1 md:flex-none px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'products'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Search by Products
                </button>
                <button
                    onClick={() => setActiveTab('vendors')}
                    className={`flex-1 md:flex-none px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'vendors'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Search by Vendors
                </button>
            </div>

            {/* Content */}
            <div className="animate-in fade-in duration-300">
                {activeTab === 'products' ? <CatalogueView /> : <VendorView />}
            </div>
        </div>
    );
}
