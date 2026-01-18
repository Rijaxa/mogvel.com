'use client';

import { useState, useEffect } from 'react';
import CatalogueHeader from '../../components/vendor/catalogue/CatalogueHeader';
import VendorProductCard from '../../components/vendor/catalogue/VendorProductCard';
import AddProductModal from '../../components/vendor/catalogue/AddProductModal';
import { MessageCircle, Plus } from 'lucide-react';
import { getProducts } from '@/actions/vendor/products';
import CatalogueHeader from '@/app/dashboard/components/vendor/catalogue/CatalogueHeader';
import VendorProductCard from '@/app/dashboard/components/vendor/catalogue/VendorProductCard';
import { MessageCircle } from 'lucide-react';

export default function VendorCataloguePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        loadProducts();
    }, [isAddModalOpen]);

    const loadProducts = async () => {
        setLoading(true);
        const res = await getProducts();
        if (res.products) {
            setProducts(res.products);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 relative">
            {/* Custom Header with Add Button injection if needed, or we just put a button below/above */}
            {/* Custom Header with Add Button injection */}
            <CatalogueHeader onAddProduct={() => setIsAddModalOpen(true)} />

            {loading ? (
                <div className="text-center py-20 text-slate-500">Loading products...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 mb-4">No products in your catalogue.</p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="text-brand font-medium hover:underline"
                    >
                        Add your first product
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                    {products.map((product) => {
                        const pricing = product.pricing[0]; // Assuming first price is the main one for now
                        const stock = product.stock[0]; // Assuming first location stock
                        const currentStock = stock ? parseFloat(stock.currentStock) : 0;
                        const price = pricing ? parseFloat(pricing.basePrice).toFixed(2) : '0.00';

                        return (
                            <VendorProductCard
                                key={product.id}
                                title={product.name}
                                producer="Your Company" // We could fetch org name if needed
                                description={product.description || 'No description'}
                                quantity={`Unit: ${product.unitOfMeasure || 'N/A'}`}
                                price={`₾${price}`}
                                status={product.status === 'active' ? 'Active' : 'Draft'}
                                stockCount={`${currentStock} units`}
                                stockLevel={currentStock > 0 ? 100 : 0} // visual placeholder
                                lowStockWarning={currentStock <= 5}
                            />
                        );
                    })}
                </div>
            )}

            {/* Floating Action Button - Maybe keep for support or secondary actions */}
            <div className="fixed bottom-8 right-8">
                <button className="bg-[#005f73] text-white p-4 rounded-full shadow-lg hover:bg-[#0a9396] transition-colors">
                    <MessageCircle className="w-6 h-6" />
                </button>
            </div>

            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}
