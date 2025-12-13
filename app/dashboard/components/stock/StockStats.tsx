import { Box, Download, Plus, AlertTriangle } from 'lucide-react';

interface StockStatsProps {
    onReorderAll?: () => void;
    onAddStock?: () => void;
}

export default function StockStats({ onReorderAll, onAddStock }: StockStatsProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8">
            {/* Metrics Row */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
                <div className="flex gap-12">
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Total Products</p>
                        <div className="flex items-center gap-2">
                            <Box className="w-5 h-5 text-brand" />
                            <span className="text-2xl font-bold text-slate-900">5</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Low Stock</p>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            <span className="text-2xl font-bold text-slate-900">4</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Critical</p>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <span className="text-2xl font-bold text-slate-900">4</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Stock Health</p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-slate-900">20% Healthy</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button
                        onClick={onReorderAll}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                    >
                        <AlertTriangle className="w-4 h-4" />
                        Reorder All Critical (4)
                    </button>
                    <button
                        onClick={onAddStock}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-brand rounded-lg hover:bg-brand/90 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Stock
                    </button>
                </div>
            </div>

            {/* Insight Banner */}
            <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <p className="text-slate-900 text-sm">
                    <span className="font-bold">Usage Insight:</span> 4 items likely to deplete within 7 days based on usage trends
                </p>
            </div>
        </div>
    );
}
