'use client';

import { exportToCSV } from '@/lib/export';
import { useState, useMemo, useEffect } from 'react';
import StockStats from '../../components/stock/StockStats';
import FilterSortBar from '../../components/stock/FilterSortBar';
import ProductCard from '../../components/stock/ProductCard';
import ReorderModal from '../../components/stock/ReorderModal';
import ManageStockModal from '../../components/stock/ManageStockModal';
import BulkReorderModal from '../../components/stock/BulkReorderModal';
import { useState, useMemo } from 'react';
import StockStats from '@/app/dashboard/components/stock/StockStats';
import FilterSortBar from '@/app/dashboard/components/stock/FilterSortBar';
import ProductCard from '@/app/dashboard/components/stock/ProductCard';
import ReorderModal from '@/app/dashboard/components/stock/ReorderModal';
import ManageStockModal from '@/app/dashboard/components/stock/ManageStockModal';
import BulkReorderModal from '@/app/dashboard/components/stock/BulkReorderModal';
import { X } from 'lucide-react';
import { getCompanyStock } from '@/actions/company/stock';

export default function StockPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOption, setSortOption] = useState("stockLevel");
    const [modalState, setModalState] = useState<{
        type: 'reorder' | 'manage' | 'bulk' | 'add' | null;
        product?: any;
    }>({ type: null });
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    // Fetch stock data from database
    useEffect(() => {
        async function loadStock() {
            setIsLoading(true);
            const result = await getCompanyStock();

            if (result.stock) {
                // Transform database stock to UI format
                const formattedProducts = result.stock.map((item: any) => {
                    const pricing = item.product.pricing[0];
                    const currentStock = parseFloat(item.currentStock);
                    const reorderPoint = item.reorderPoint ? parseFloat(item.reorderPoint) : 15;
                    const maxStock = reorderPoint * 4; // Estimate max as 4x reorder point

                    return {
                        title: item.product.name,
                        category: item.product.category || 'General',
                        currentStock,
                        maxStock,
                        consumption: 15, // Default, could be tracked separately
                        lastOrder: new Date().toLocaleDateString(),
                        vendor: item.product.vendor.name,
                        minStock: reorderPoint,
                        unitPrice: pricing ? parseFloat(pricing.basePrice) : 0,
                        recommendedQuantity: Math.max(0, maxStock - currentStock),
                        image: '/products/default.png',
                        productId: item.product.id,
                        stockId: item.id,
                    };
                });
                setProducts(formattedProducts);
            }
            setIsLoading(false);
        }

        loadStock();
    }, []);

    const handleExport = () => {
        exportToCSV(products, 'inventory_stock_report');
    };

    // Filter and Sort Logic
    const filteredProducts = useMemo(() => {
        let result = [...products];
        if (selectedCategory !== "All") {
            result = result.filter(p => p.category === selectedCategory);
        }

        result.sort((a, b) => {
            if (sortOption === "name") {
                return a.title.localeCompare(b.title);
            } else if (sortOption === "stockLevel") {
                // Percentage ascending (Critical first)
                const aPct = a.currentStock / a.maxStock;
                const bPct = b.currentStock / b.maxStock;
                return aPct - bPct;
            } else if (sortOption === "stockLevelDesc") {
                const aPct = a.currentStock / a.maxStock;
                const bPct = b.currentStock / b.maxStock;
                return bPct - aPct;
            }
            return 0;
        });

        return result;
    }, [products, selectedCategory, sortOption]);

    const categories = Array.from(new Set(products.map(p => p.category)));

    const handleReorder = (product: any) => {
        setModalState({ type: 'reorder', product });
    };

    const handleManage = (product: any) => {
        setModalState({ type: 'manage', product });
    };

    const handleAddStock = () => {
        setModalState({ type: 'add' });
    };

    const handleBulkReorder = () => {
        setModalState({ type: 'bulk' });
    };

    const closeModal = () => setModalState({ type: null });

    return (
        <div className="max-w-7xl mx-auto">
            {/* Image Expansion Lightbox */}
            {expandedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setExpandedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        onClick={() => setExpandedImage(null)}
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        <img
                            src={expandedImage}
                            alt="Expanded Product"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            )}

            {/* Modals */}
            {modalState.type === 'reorder' && modalState.product && (
                <ReorderModal
                    isOpen={true}
                    onClose={closeModal}
                    productName={modalState.product.title}
                    category={modalState.product.category}
                    currentStock={modalState.product.currentStock}
                    minStock={modalState.product.minStock || 10}
                    maxStock={modalState.product.maxStock}
                    recommendedQuantity={modalState.product.recommendedQuantity || 50}
                    unitPrice={modalState.product.unitPrice || 15.00}
                    defaultVendor={modalState.product.vendor}
                    image={modalState.product.image}
                />
            )}

            {(modalState.type === 'manage' || modalState.type === 'add') && (
                <ManageStockModal
                    isOpen={true}
                    onClose={closeModal}
                    type={modalState.type === 'add' ? 'add' : 'edit'}
                    initialData={modalState.type === 'manage' ? {
                        name: modalState.product.title,
                        category: modalState.product.category,
                        minStock: modalState.product.minStock || 15,
                        maxStock: modalState.product.maxStock,
                        currentStock: modalState.product.currentStock,
                        consumption: modalState.product.consumption,
                        period: 'Weekly',
                        image: modalState.product.image
                    } : undefined}
                />
            )}

            <BulkReorderModal
                isOpen={modalState.type === 'bulk'}
                onClose={closeModal}
            />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Stock and Reorder</h1>
                <p className="text-slate-500">Monitor inventory levels and manage reorders efficiently</p>
            </div>

            <StockStats
                products={products}
                onReorderAll={handleBulkReorder}
                onAddStock={handleAddStock}
                onExport={handleExport}
            />

            <FilterSortBar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                sortOption={sortOption}
                onSortChange={setSortOption}
                totalCount={products.length}
                shownCount={filteredProducts.length}
            />

            {isLoading ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <p className="text-slate-500 font-medium">Loading stock items...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                    <p className="text-slate-500 font-medium">
                        {products.length === 0
                            ? "No stock items yet. Click 'Add Stock' to get started."
                            : "No products match your filter."}
                    </p>
                    {products.length > 0 && (
                        <button onClick={() => setSelectedCategory('All')} className="text-brand font-bold mt-2 hover:underline">Clear Filter</button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product, index) => (
                        <ProductCard
                            key={index}
                            {...product}
                            onReorder={() => handleReorder(product)}
                            onManage={() => handleManage(product)}
                            onImageClick={() => setExpandedImage(product.image)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
