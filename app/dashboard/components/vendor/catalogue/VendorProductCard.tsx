'use client';

import { Package, Edit2, BarChart2, Eye, MoreHorizontal, Clock, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VendorProductCardProps {
    title: string;
    producer: string;
    description: string;
    quantity: string;
    price: string;
    imageColor?: string;
    status?: 'Active' | 'Draft' | 'Low Stock' | 'Out of Stock';
    lowStockWarning?: boolean;
    stockLevel?: number; // percentage
    stockCount?: string;
    deliveryTime?: string;
}

export default function VendorProductCard({
    title,
    producer,
    description,
    quantity,
    price,
    imageColor = 'bg-teal-50',
    status = 'Active',
    lowStockWarning = false,
    stockLevel,
    stockCount,
    deliveryTime = '2 days'
}: VendorProductCardProps) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
                {/* Product Image Placeholder */}
                <div className={cn("w-24 h-24 rounded-2xl flex items-center justify-center mx-auto", imageColor)}>
                    <Package className="w-10 h-10 text-brand/60" />
                </div>
                <span className={cn(
                    "px-2 py-1 text-[10px] font-bold uppercase rounded absolute top-6 right-6",
                    status === 'Active' ? "bg-teal-50 text-brand" :
                        status === 'Low Stock' ? "bg-yellow-50 text-yellow-600" :
                            "bg-slate-100 text-slate-500"
                )}>
                    {status}
                </span>
            </div>

            <div className="mb-4">
                <h3 className="font-bold text-slate-900 text-lg mb-1">{title}</h3>
                <p className="text-xs font-bold text-slate-500 mb-0.5">{producer}</p>
                <p className="text-xs text-slate-400 italic mb-2">{description}</p>
                <p className="text-xs text-slate-600 font-medium">{quantity}</p>
            </div>

            <div className="flex justify-between items-end mb-4 border-b border-slate-50 pb-4">
                <div>
                    <p className="text-xs text-slate-400 mb-1">Unit Price</p>
                    <p className="text-lg font-bold text-brand">{price}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 mb-1">Delivery</p>
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" /> {deliveryTime}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
                {(stockLevel !== undefined || lowStockWarning) ? (
                    <>
                        <span className={cn(
                            "text-[10px] font-bold px-2 py-1 rounded",
                            lowStockWarning ? "bg-red-50 text-red-500 border border-red-100" :
                                status === 'Low Stock' ? "bg-yellow-50 text-yellow-600 border border-yellow-100" :
                                    "bg-green-50 text-green-600 border border-green-100"
                        )}>
                            {lowStockWarning ? 'Out of Stock' : status === 'Low Stock' ? 'Low Stock' : 'In Stock'}
                        </span>
                        {stockCount && <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">{stockCount}</span>}
                    </>
                ) : (
                    <div className="h-6" /> // spacer
                )}
            </div>

            <div className="flex items-center gap-2">
                <button className="flex-1 p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex justify-center">
                    <Edit2 className="w-4 h-4" />
                </button>
                <button className="flex-1 p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex justify-center">
                    <BarChart2 className="w-4 h-4" />
                </button>
                <button className="flex-1 p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex justify-center">
                    <Eye className="w-4 h-4" />
                </button>
                <button className="flex-1 p-2 rounded-lg border border-brand text-brand bg-teal-50 hover:bg-teal-100 transition-colors flex justify-center">
                    <ChevronDown className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// Helper for the chevron down button icon to match existing imports
import { ChevronDown } from 'lucide-react';
