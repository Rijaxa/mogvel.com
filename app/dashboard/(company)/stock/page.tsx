'use client';

import { useState } from 'react';
import StockStats from '../../components/stock/StockStats';
import FilterSortBar from '../../components/stock/FilterSortBar';
import ProductCard from '../../components/stock/ProductCard';
import ReorderModal from '../../components/stock/ReorderModal';
import ManageStockModal from '../../components/stock/ManageStockModal';
import BulkReorderModal from '../../components/stock/BulkReorderModal';

const products = [
    {
        title: 'Disposable Gloves (Box)',
        category: 'Safety Equipment',
        currentStock: 6,
        maxStock: 60,
        consumption: 18,
        lastOrder: '12/10/2025',
        vendor: 'SafetyFirst Supply', // Matching default vendor in modal
        isCritical: true,
        minStock: 15,
        unitPrice: 15.00,
        recommendedQuantity: 54
    },
    {
        title: 'Office Paper A4 (Box of 10)',
        category: 'Office Equipment',
        currentStock: 8,
        maxStock: 50,
        consumption: 15,
        lastOrder: '10/10/2025',
        vendor: 'OfficeMax Direct',
        isCritical: true,
        minStock: 10,
        unitPrice: 50.36,
        recommendedQuantity: 42
    },
    {
        title: 'Trash Bags (Heavy Duty)',
        category: 'Cleaning Supply',
        currentStock: 10,
        maxStock: 75,
        consumption: 12,
        lastOrder: '18/10/2025',
        vendor: 'CleanPro',
        isCritical: true,
        minStock: 20,
        unitPrice: 8.50,
        recommendedQuantity: 65
    },
    {
        title: 'Hand Sanitizer (5L)',
        category: 'Cleaning Supply',
        currentStock: 12,
        maxStock: 100,
        consumption: 20,
        lastOrder: '15/10/2025',
        vendor: 'CleanPro',
        isCritical: true,
        minStock: 25,
        unitPrice: 24.50,
        recommendedQuantity: 88
    },
    {
        title: 'Cleaning Wipes (Industrial)',
        category: 'Cleaning Supply',
        currentStock: 45,
        maxStock: 80,
        consumption: 10,
        lastOrder: '20/10/2025',
        vendor: 'HygieneCo',
        isCritical: false,
        minStock: 15,
        unitPrice: 12.00,
        recommendedQuantity: 50
    },
];

export default function StockPage() {
    const [modalState, setModalState] = useState<{
        type: 'reorder' | 'manage' | 'bulk' | 'add' | null;
        product?: any;
    }>({ type: null });

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
                        period: 'Weekly'
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
                onReorderAll={handleBulkReorder}
                onAddStock={handleAddStock}
            />

            <FilterSortBar />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                    <ProductCard
                        key={index}
                        {...product}
                        onReorder={() => handleReorder(product)}
                        onManage={() => handleManage(product)}
                    />
                ))}
            </div>
        </div>
    );
}
