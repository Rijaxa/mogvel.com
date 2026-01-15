'use client';

import { useState } from 'react';
import { X, Upload, ChevronDown, RefreshCw } from 'lucide-react';
import { createProduct } from '@/actions/vendor/products';

export default function AddProductModal({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        // Map form fields to expected server action parameters
        const productData = new FormData();
        productData.append('name', formData.get('productName') as string || formData.get('uniqueName') as string);
        productData.append('description', formData.get('description') as string || '');
        productData.append('price', formData.get('price') as string);
        productData.append('stock', '0'); // Default stock, can be updated later
        productData.append('sku', `SKU-${Date.now()}`); // Generate SKU
        productData.append('unit', formData.get('unitSize') as string || 'unit');

        const result = await createProduct(productData);

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            onClose();
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Add New Product</h3>
                        <p className="text-slate-500 text-sm">Enter product details to add to your vendor catalogue.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Product Unique Name */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Product Unique Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="uniqueName"
                                placeholder="Select from global product list..."
                                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/20"
                            />
                            <div className="absolute right-4 top-3 text-slate-400 pointer-events-none">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Select from standardized product names</p>
                    </div>

                    {/* Producer & Product Name */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Producer Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="producerName"
                            type="text"
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20"
                            placeholder="e.g., PaperCo Industries"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Product Name (Given by Producer)
                        </label>
                        <input
                            name="productName"
                            type="text"
                            className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20"
                            placeholder="e.g., A4 Paper 80gsm White Premium"
                        />
                    </div>

                    {/* Unit Type & Size */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">
                                Unit Type <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="unitType"
                                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-brand/20 pr-10"
                                >
                                    <option value="">Select type...</option>
                                    <option value="Volume">Volume</option>
                                    <option value="Weight">Weight</option>
                                    <option value="Length">Length</option>
                                    <option value="Quantity">Quantity</option>
                                    <option value="Area">Area</option>
                                </select>
                                <div className="absolute right-4 top-3 text-slate-400 pointer-events-none">
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">
                                Unit Size <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="unitSize"
                                type="text"
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20"
                                placeholder="e.g., 500ml, 5kg, Box of 100"
                            />
                        </div>
                    </div>

                    {/* MOQ */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Minimum Order Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="moq"
                            type="number"
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20"
                            placeholder="e.g., 10"
                        />
                    </div>

                    {/* Unit Price */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Unit Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-2.5 text-slate-500 font-bold">
                                <RefreshCw className="w-4 h-4" /> {/* Using Refresh icon as pseudo-currency symbol based on screenshot, or assume it's a currency symbol */}
                            </div>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20"
                                placeholder="12.99"
                            />
                        </div>
                    </div>

                    {/* Delivery Time */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Delivery Time <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4">
                            <input
                                name="deliveryTimeValue"
                                type="number"
                                required
                                className="flex-1 px-4 py-2.5 bg-slate-50 border-none rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20"
                                placeholder="2"
                            />
                            <div className="relative flex-1">
                                <select
                                    name="deliveryTimeUnit"
                                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-brand/20 pr-10"
                                >
                                    <option value="Days">Days</option>
                                    <option value="Weeks">Weeks</option>
                                </select>
                                <div className="absolute right-4 top-3 text-slate-400 pointer-events-none">
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 resize-none"
                            placeholder="Describe product features, quality standards, or packaging details..."
                        />
                    </div>

                    {/* Upload Photos */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Upload Photos
                        </label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 hover:bg-slate-50 transition-colors cursor-pointer text-center group">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-white border border-slate-100">
                                <Upload className="w-5 h-5 text-brand" />
                            </div>
                            <p className="text-sm font-medium text-slate-700">Drag and drop images here, or click to browse</p>
                            <p className="text-xs text-slate-500 mt-1">Max 5 images, up to 5MB each</p>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3 justify-end sticky bottom-0 bg-white pb-2 border-t border-slate-100 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-brand hover:bg-brand/90 rounded-xl transition-colors shadow-lg shadow-brand/20"
                        >
                            {isLoading ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
