'use client';

import { X, ShoppingCart } from 'lucide-react';

interface VendorLowStockModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function VendorLowStockModal({ isOpen, onClose }: VendorLowStockModalProps) {
    if (!isOpen) return null;

    const lowStockItems = [
        { name: 'Hand Sanitizer 500ml', stock: 25, leadTime: '2 days', color: 'bg-yellow-400' },
        { name: 'Industrial Gloves', stock: 12, leadTime: '3 days', color: 'bg-red-500' },
        { name: 'Safety Goggles', stock: 18, leadTime: '1 day', color: 'bg-yellow-400' },
    ];

    return (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Low Stock — Reorder</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {lowStockItems.map((item, index) => (
                            <div key={index} className="bg-slate-50 rounded-xl p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{item.name}</h3>
                                        <p className="text-xs text-slate-500">Lead time: {item.leadTime}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.color === 'bg-red-500' ? 'text-red-500 border-red-200 bg-red-50' : 'text-yellow-600 border-yellow-200 bg-yellow-50'}`}>
                                        {item.stock}% stock
                                    </span>
                                </div>

                                <div className="h-1.5 w-full bg-slate-200 rounded-full mb-4">
                                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.stock}%` }} />
                                </div>

                                <button
                                    onClick={() => console.log(`Reordering item: ${item.name}`)}
                                    className="w-full py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Reorder Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
