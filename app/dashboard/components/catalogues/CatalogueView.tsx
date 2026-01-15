'use client';

import { Search } from 'lucide-react';
import CatalogueProductCard from './CatalogueProductCard';
import { useEffect, useState } from 'react';
import { getAllProducts } from '@/actions/company/catalogue';
// import { useDebounce } from '@/hooks/use-debounce'; // If we had it

const categories = [
    'All Products', 'Office Supplies', 'Hygiene Products', 'Safety Equipment', 'Office Equipment', 'Cleaning Supplies'
];

export default function CatalogueView() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Products');

    const fetchProducts = async () => {
        setIsLoading(true);
        const result = await getAllProducts(searchQuery, selectedCategory);
        if (result && result.products) {
            setProducts(result.products);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        // Debounce simple implementation
        const timer = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory]);

    return (
        <div>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors ${selectedCategory === cat
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
                {isLoading ? (
                    <div className="col-span-full py-20 text-center text-slate-400">Loading products...</div>
                ) : products.length > 0 ? (
                    products.map((product, index) => (
                        <CatalogueProductCard
                            key={index}
                            {...product}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-slate-500">
                        No products found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}
