import { X, Box, Info } from 'lucide-react';
import { useState } from 'react';

interface ReorderModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    category: string;
    currentStock: number;
    minStock: number;
    maxStock: number;
    recommendedQuantity: number;
    unitPrice: number;
    defaultVendor: string;
    image?: string;
}

const vendors = [
    { name: 'SafetyFirst Supply', price: 15.00 },
    { name: 'CleanPro Supplies', price: 14.80 },
    { name: 'EcoTrade Ltd', price: 14.50 },
];

export default function ReorderModal({
    isOpen,
    onClose,
    productName,
    category,
    currentStock,
    minStock,
    maxStock,
    recommendedQuantity,
    unitPrice,
    defaultVendor,
    image
}: ReorderModalProps) {
    const [quantity, setQuantity] = useState(recommendedQuantity);
    const [selectedVendor, setSelectedVendor] = useState(defaultVendor);

    if (!isOpen) return null;

    const currentVendorPrice = vendors.find(v => v.name === selectedVendor)?.price || unitPrice;
    const totalCost = (quantity * currentVendorPrice).toFixed(2);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-50 rounded-full">
                            <Box className="w-5 h-5 text-brand" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Reorder Product</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-slate-500 text-sm mb-6">
                        Confirm reorder details and review supplier options.
                    </p>

                    <div className="flex gap-4 mb-6">
                        {image && (
                            <img
                                src={image}
                                alt={productName}
                                className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                            />
                        )}
                        <div>
                            <h3 className="font-bold text-slate-900 mb-1">{productName}</h3>
                            <p className="text-sm text-slate-500">{category}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 rounded-xl">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Current Stock</p>
                            <p className="font-bold text-slate-900">{currentStock} units</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Min Stock</p>
                            <p className="font-bold text-red-500">{minStock} units</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Max Stock</p>
                            <p className="font-bold text-slate-900">{maxStock} units</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-900 mb-2">Reorder Quantity</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                        />
                        <p className="text-xs text-brand font-medium mt-1">Recommended: {recommendedQuantity} units</p>
                    </div>

                    <div className="flex justify-between items-center py-4 border-t border-b border-slate-100 mb-6">
                        <span className="text-slate-500 text-sm">Unit Price</span>
                        <span className="font-bold text-slate-900">£{currentVendorPrice.toFixed(2)}</span>
                    </div>

                    <div className="bg-cyan-50/50 p-4 rounded-xl mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-600">Selected Vendor</span>
                            <span className="font-bold text-brand">{selectedVendor}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 font-bold">Total Cost</span>
                            <span className="font-bold text-slate-900">£{totalCost}</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-3">Suggested Vendors:</h4>
                        <div className="space-y-2">
                            {vendors.map((vendor, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedVendor(vendor.name)}
                                    className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-all ${selectedVendor === vendor.name
                                        ? 'border-brand bg-cyan-50/30'
                                        : 'border-slate-100 hover:bg-slate-50'
                                        }`}
                                >
                                    <span className="font-bold text-slate-900 text-sm">{vendor.name}</span>
                                    <span className="text-brand font-bold text-sm">£{vendor.price.toFixed(2)}/unit</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="p-6 border-t border-slate-100 flex justify-between gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 border border-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 py-2.5 bg-brand text-white rounded-lg font-bold hover:bg-brand/90 transition-colors shadow-sm"
                    >
                        Confirm Reorder
                    </button>
                </div>
            </div>
        </div>
    );
}
