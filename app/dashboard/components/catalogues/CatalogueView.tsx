'use client';

import { Search, ShoppingCart } from 'lucide-react';
import CatalogueProductCard from './CatalogueProductCard';
import { useEffect, useState } from 'react';

const categories = [
    'All Products', 'Office Supplies', 'Hygiene Products', 'Safety Equipment', 'Office Equipment', 'Cleaning Supplies'
];

const products = [
    {
        title: 'Office Paper A4 (500 sheets)',
        description: 'High-quality white office paper, 80gsm, suitable for all printers',
        fullDescription: 'Premium quality A4 multipurpose paper. Ideal for high volume printing, copying, and everyday office use. Features ColorLok technology for bolder blacks and faster drying.',
        price: 12.99,
        vendor: 'OfficeMax Direct',
        category: 'Office Supplies',
        tags: ['Office Supplies', 'In Stock']
    },
    {
        title: 'Hand Sanitizer 500ml',
        description: '70% alcohol-based hand sanitizer with moisturizer',
        price: 7.90,
        vendor: 'CleanPro Ltd',
        category: 'Hygiene Products',
        inStock: false // Low Stock demo
    },
    {
        title: 'Industrial Gloves (Box of 100)',
        description: 'Nitrile gloves, powder-free, suitable for food handling',
        price: 16.50,
        vendor: 'SafetyFirst Co',
        category: 'Safety Equipment',
    },
    {
        title: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with 2.4GHz connectivity',
        price: 22.50,
        vendor: 'TechSupply Hub',
        category: 'Office Equipment',
        tags: ['Office Equipment', 'Limited Stock'] // Logic handled in card ideally, here simple
    },
    {
        title: 'Multipurpose Cleaner 5L',
        description: 'All-purpose cleaning solution, eco-friendly formula',
        price: 12.75,
        vendor: 'HygieniX Supply',
        category: 'Cleaning Supplies',
    },
    {
        title: 'Ballpoint Pens (Box of 50)',
        description: 'Blue ink ballpoint pens, smooth writing',
        price: 8.50,
        vendor: 'OfficeMax Direct',
        category: 'Office Supplies',
    },
    {
        title: 'Safety Goggles',
        description: 'Anti-fog safety goggles with adjustable strap',
        price: 12.45,
        vendor: 'SafetyFirst Co',
        category: 'Safety Equipment',
    },
    {
        title: 'Paper Towels (12-pack)',
        description: 'Absorbent paper towels, 2-ply thickness',
        price: 14.50,
        vendor: 'HygieniX Supply',
        category: 'Hygiene Products',
    },
    {
        title: 'USB Flash Drive 32GB',
        description: 'High-speed USB 3.0 flash drive',
        price: 18.99,
        vendor: 'TechSupply Hub',
        category: 'Office Equipment',
    }
];

export default function CatalogueView() {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        // Dynamic import to avoid server action issues if any, or just direct call
        import('@/actions/products').then(mod => {
            mod.getProducts().then(setProducts);
        });
    }, []);

    return (
        <div>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                    <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                </div>
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat, idx) => (
                    <button
                        key={idx}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors ${idx === 0
                            ? 'bg-brand text-white border-brand'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-brand hover:text-brand'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length > 0 ? products.map((product, index) => (
                    <CatalogueProductCard
                        key={index}
                        {...product}
                    />
                )) : (
                    <div className="col-span-full text-center py-10 text-slate-500">
                        No products found.
                    </div>
                )}
            </div>
        </div>
    );
}
