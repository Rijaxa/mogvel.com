import { X, AlertTriangle } from 'lucide-react';

interface BulkReorderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const criticalItems = [
    { name: 'Hand Sanitizer (5L)', current: 12, cost: 2156.00, units: 88 },
    { name: 'Office Paper A4 (Box of 10)', current: 8, cost: 503.58, units: 42 },
    { name: 'Disposable Gloves (Box)', current: 6, cost: 810.00, units: 54 },
    { name: 'Trash Bags (Heavy Duty)', current: 10, cost: 552.50, units: 65 },
];

export default function BulkReorderModal({ isOpen, onClose }: BulkReorderModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-full">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Reorder All Critical Items</h2>
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
                        The following 4 products are at critical stock levels. Review and confirm bulk reorder:
                    </p>

                    <div className="space-y-3 mb-6">
                        {criticalItems.map((item, index) => (
                            <div key={index} className="border border-slate-100 rounded-xl p-4 flex justify-between items-center bg-white shadow-sm">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                                    <p className="text-xs text-slate-500">Current: {item.current} units</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">£{item.cost.toFixed(2)}</p>
                                    <p className="text-xs text-slate-500">{item.units} units</p>
                                </div>
                            </div>
                        ))}
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
                        className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors shadow-sm"
                    >
                        Confirm Bulk Reorder
                    </button>
                </div>
            </div>
        </div>
    );
}
