import { X, Info } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { getAllProducts } from '@/actions/company/catalogue';
import { upsertCompanyStock } from '@/actions/company/stock';

interface ManageStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'add' | 'edit';
    // Optional initial data for edit mode
    initialData?: {
        name: string;
        category: string;
        minStock: number;
        maxStock: number;
        currentStock: number;
        consumption: number;
        period: string;
        image?: string;
        productId?: string;
    }
}

export default function ManageStockModal({ isOpen, onClose, type, initialData }: ManageStockModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(initialData?.name || '');
    const [availableProducts, setAvailableProducts] = useState<any[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(initialData?.productId || null);
    const [isSearching, setIsSearching] = useState(false);

    if (!isOpen) return null;

    const title = type === 'add' ? 'Add New Stock' : 'Manage Stock';
    const subtitle = type === 'add'
        ? 'Enter details for an existing or new product in your company\'s inventory.'
        : 'Update the details for this product in your inventory.';
    const btnLabel = type === 'add' ? 'Save Stock' : 'Update Stock';

    const handleProductSearch = async (query: string) => {
        setSearchQuery(query);
        setAvailableProducts([]);

        if (query.length > 0) {
            setIsSearching(true);
            try {
                const result = await getAllProducts(query);
                if (result.products) {
                    setAvailableProducts(result.products);
                }
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setIsSearching(false);
            }
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const currentStock = parseInt(formData.get('currentStock') as string);
        const minStock = parseInt(formData.get('minStock') as string);

        if (!selectedProductId) {
            setError('Please select a product');
            setIsLoading(false);
            return;
        }

        if (isNaN(currentStock) || currentStock < 0) {
            setError('Please enter a valid current stock');
            setIsLoading(false);
            return;
        }

        try {
            const result = await upsertCompanyStock({
                productId: selectedProductId,
                currentStock,
                reorderPoint: minStock || undefined,
                stockStatus: currentStock <= minStock ? 'low' : currentStock <= minStock * 2 ? 'medium' : 'high',
            });

            if (result.error) {
                setError(result.error);
            } else {
                onClose();
            }
        } catch (err) {
            console.error('Stock save error:', err);
            setError('Failed to save stock. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div className="flex gap-4 items-center">
                        {initialData?.image && (
                            <img
                                src={initialData.image}
                                alt={initialData.name}
                                className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                            />
                        )}
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-1">{title}</h2>
                            <p className="text-slate-500 text-xs">{subtitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-5">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-1">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleProductSearch(e.target.value)}
                                    placeholder="Search for a product..."
                                    disabled={type === 'edit'}
                                    className="w-full border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-slate-50"
                                />
                                <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                            </div>
                            {type === 'add' && searchQuery.length > 0 && (
                                <div className="mt-2 border border-slate-200 rounded-lg max-h-40 overflow-y-auto">
                                    {isSearching ? (
                                        <div className="px-3 py-4 text-center text-sm text-slate-400">
                                            Searching...
                                        </div>
                                    ) : availableProducts.length > 0 ? (
                                        availableProducts.map((product) => (
                                            <button
                                                key={product.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedProductId(product.id);
                                                    setSearchQuery(product.title);
                                                    setAvailableProducts([]);
                                                    setError(null); // Clear error when product selected
                                                }}
                                                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm border-b border-slate-100 last:border-0"
                                            >
                                                <div className="font-medium text-slate-900">{product.title}</div>
                                                <div className="text-xs text-slate-500">by {product.vendor} • ₾{product.price}</div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-3 py-4 text-center text-sm text-slate-500">
                                            No products found. Make sure vendors have added products first.
                                        </div>
                                    )}
                                </div>
                            )}
                            <p className="text-[10px] text-slate-400 mt-1">Search from available vendor products.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"
                                defaultValue={initialData?.category || ''}
                            >
                                <option value="" disabled>Select category...</option>
                                <option value="Safety Equipment">Safety Equipment</option>
                                <option value="Office Equipment">Office Equipment</option>
                                <option value="Cleaning Supply">Cleaning Supply</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="flex items-center gap-1 text-xs font-bold text-slate-900 mb-1">
                                    Min Stock <span className="text-red-500">*</span> <Info className="w-3 h-3 text-slate-300" />
                                </label>
                                <input
                                    type="number"
                                    name="minStock"
                                    defaultValue={initialData?.minStock}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                                />
                                <span className="text-[10px] text-slate-400">units</span>
                            </div>
                            <div>
                                <label className="flex items-center gap-1 text-xs font-bold text-slate-900 mb-1">
                                    Max Stock <span className="text-red-500">*</span> <Info className="w-3 h-3 text-slate-300" />
                                </label>
                                <input
                                    type="number"
                                    name="maxStock"
                                    defaultValue={initialData?.maxStock}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                                />
                                <span className="text-[10px] text-slate-400">units</span>
                            </div>
                            <div>
                                <label className="flex items-center gap-1 text-xs font-bold text-slate-900 mb-1">
                                    Current Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="currentStock"
                                    defaultValue={initialData?.currentStock}
                                    required
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                                />
                                <span className="text-[10px] text-slate-400">units</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-1">Consumption Rate</label>
                            <div className="flex gap-4">
                                <input
                                    type="number"
                                    name="consumption"
                                    defaultValue={initialData?.consumption}
                                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                                />
                                <select
                                    name="period"
                                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"
                                >
                                    <option>Weekly</option>
                                    <option>Monthly</option>
                                </select>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">Example: 15 units per week</p>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 flex justify-between gap-4 sticky bottom-0 bg-white">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-2.5 border border-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-2.5 bg-brand text-white rounded-lg font-bold hover:bg-brand/90 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : btnLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
