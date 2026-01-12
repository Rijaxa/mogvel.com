import { X, AlertCircle } from 'lucide-react';

interface LowStockModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const lowStockItems = [
    {
        name: 'Hand Sanitizer (5L)',
        vendor: 'CleanPro Supplies',
        current: 12,
        recommended: 50,
    },
    {
        name: 'Office Paper A4 (Box of 10)',
        vendor: 'OfficeMax Direct',
        current: 8,
        recommended: 30,
    },
    {
        name: 'Cleaning Wipes (Industrial)',
        vendor: 'HygieneCo',
        current: 15,
        recommended: 40,
    },
    {
        name: 'Disposable Gloves (Box)',
        vendor: 'SafetyFirst Supply',
        current: 6,
        recommended: 25,
    },
];

export default function LowStockModal({ isOpen, onClose }: LowStockModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-full">
                            <AlertCircle className="w-5 h-5 text-orange-500" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Low Stock Alerts</h2>
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
                        The following products are running low on stock and need attention.
                        Click "Reorder" to replenish inventory.
                    </p>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                        {lowStockItems.map((item, index) => (
                            <div key={index} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">{item.name}</h3>
                                    <p className="text-xs text-slate-500 mb-3">Vendor: {item.vendor}</p>

                                    <div className="flex gap-4 text-xs">
                                        <div>
                                            <span className="text-slate-500">Current Stock: </span>
                                            <span className="font-bold text-red-500">{item.current} units</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">Recommended: </span>
                                            <span className="font-bold text-brand">{item.recommended} units</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pl-4">
                                    <button className="px-4 py-2 bg-brand text-white text-sm font-bold rounded-lg hover:bg-brand/90 transition-colors shadow-sm">
                                        Reorder
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                    <p className="text-xs text-slate-500 font-medium text-center">
                        <span className="font-bold">Trash Bags (Heavy Duty)</span> is also approaching reorder level.
                    </p>
                </div>
            </div>
        </div>
    );
}
