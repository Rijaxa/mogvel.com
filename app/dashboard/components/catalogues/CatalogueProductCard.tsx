'use client';

import { useState } from 'react';
import { Box, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CatalogueProductCardProps {
    title: string;
    description: string;
    price: number;
    vendor: string;
    category: string;
    inStock?: boolean;
    minOrder?: number;
    deliveryTime?: string;
    fullDescription?: string;
    onAddToCart?: () => void;
}

export default function CatalogueProductCard({
    title,
    description,
    price,
    vendor,
    category,
    inStock = true,
    minOrder = 10,
    deliveryTime = '1-2 days',
    fullDescription,
    onAddToCart
}: CatalogueProductCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isInBasket, setIsInBasket] = useState(false);

    const handleAdd = () => {
        setIsInBasket(true);
        if (onAddToCart) onAddToCart();
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 transition-all hover:shadow-md h-fit">
            {/* Image Placeholder */}
            <div className="bg-slate-50 rounded-xl h-48 flex items-center justify-center mb-6">
                <Box className="w-16 h-16 text-slate-200" />
            </div>

            <div className="mb-4">
                <h3 className="font-bold text-slate-900 text-lg mb-2 leading-tight">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                    {description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-cyan-50 text-brand text-xs font-bold px-3 py-1 rounded-full">{category}</span>
                    {inStock && (
                        <span className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full">In Stock</span>
                    )}
                    {!inStock && (
                        <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full">Low Stock</span>
                    )}
                </div>

                <div className="flex items-end justify-between mb-6">
                    <div>
                        <p className="text-sm text-slate-400 mb-1">Price</p>
                        <p className="text-xl font-bold text-slate-900">₾{Number(price || 0).toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-400 mb-1">Vendor</p>
                        <p className="text-brand font-bold text-sm">{vendor}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="py-2.5 rounded-lg border border-brand text-brand font-bold text-sm hover:bg-cyan-50 transition-colors"
                    >
                        {isExpanded ? 'Hide Details' : 'Show More'}
                    </button>
                    <button
                        onClick={handleAdd}
                        className={cn(
                            "py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors text-white",
                            isInBasket ? "bg-green-500 hover:bg-green-600" : "bg-brand hover:bg-brand/90"
                        )}
                    >
                        {isInBasket ? (
                            <>
                                <Check className="w-4 h-4" />
                                In Basket
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                Add
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="pt-6 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-slate-500 text-sm mb-1">Delivery Time</p>
                            <p className="font-bold text-slate-900">{deliveryTime}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm mb-1">Min. Order</p>
                            <p className="font-bold text-slate-900">{minOrder} units</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-slate-500 text-sm mb-2">Full Description</p>
                        <p className="text-slate-900 text-sm leading-relaxed font-medium">
                            {fullDescription || description}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
