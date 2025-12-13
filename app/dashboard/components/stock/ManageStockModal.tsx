import { X, Info } from 'lucide-react';

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
    }
}

export default function ManageStockModal({ isOpen, onClose, type, initialData }: ManageStockModalProps) {
    if (!isOpen) return null;

    const title = type === 'add' ? 'Add New Stock' : 'Manage Stock';
    const subtitle = type === 'add'
        ? 'Enter details for an existing or new product in your company\'s inventory.'
        : 'Update the details for this product in your inventory.';
    const btnLabel = type === 'add' ? 'Save Stock' : 'Update Stock';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">{title}</h2>
                        <p className="text-slate-500 text-xs">{subtitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-1">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                defaultValue={initialData?.name}
                                placeholder="Search or select a product..."
                                className="w-full border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                            />
                            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Products use unique names provided by vendors.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white">
                            <option>Select category...</option>
                            <option selected={initialData?.category === 'Safety Equipment'}>Safety Equipment</option>
                            <option selected={initialData?.category === 'Office Equipment'}>Office Equipment</option>
                            <option selected={initialData?.category === 'Cleaning Supply'}>Cleaning Supply</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="flex items-center gap-1 text-xs font-bold text-slate-900 mb-1">
                                Min Stock <span className="text-red-500">*</span> <Info className="w-3 h-3 text-slate-300" />
                            </label>
                            <input
                                type="number"
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
                                defaultValue={initialData?.currentStock}
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
                                defaultValue={initialData?.consumption}
                                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                            />
                            <select className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white">
                                <option>Weekly</option>
                                <option>Monthly</option>
                            </select>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Example: 15 units per week</p>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 flex justify-between gap-4 sticky bottom-0 bg-white">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 border border-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 py-2.5 bg-brand text-white rounded-lg font-bold hover:bg-brand/90 transition-colors shadow-sm"
                    >
                        {btnLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
