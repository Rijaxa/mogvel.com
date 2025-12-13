import { Edit3, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
    title: string;
    category: string;
    currentStock: number;
    maxStock: number;
    consumption: number;
    lastOrder: string;
    vendor: string;
    isCritical?: boolean;
    onReorder?: () => void;
    onManage?: () => void;
}

export default function ProductCard({
    title,
    category,
    currentStock,
    maxStock,
    consumption,
    lastOrder,
    vendor,
    isCritical,
    onReorder,
    onManage
}: ProductCardProps) {
    const stockPercentage = (currentStock / maxStock) * 100;

    return (
        <div className={cn(
            "bg-white rounded-2xl border p-6 transition-shadow hover:shadow-md",
            isCritical ? "border-red-100 bg-red-50/10" : "border-slate-100"
        )}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-slate-900 font-bold text-base mb-1">{title}</h3>
                    <p className="text-slate-500 text-xs font-medium">{category}</p>
                </div>
                {isCritical && (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                )}
            </div>

            <div className="mb-6">
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                    <span>Stock Level:</span>
                    <span>{currentStock} / {maxStock} units</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                        className={cn("h-full rounded-full", isCritical ? "bg-red-400" : "bg-brand")}
                        style={{ width: `${stockPercentage}%` }}
                    />
                </div>
                <p className="text-xs text-slate-500 italic">
                    Consumption: {consumption} units/weekly
                </p>
            </div>

            <div className="flex justify-between items-end mb-6 text-sm">
                <div>
                    <p className="text-slate-500 mb-1">Last Order:</p>
                    <p className="font-bold text-slate-900">{lastOrder}</p>
                </div>
                <div className="text-right">
                    <p className="text-slate-500 mb-1">Vendor:</p>
                    <p className={cn("font-bold", isCritical ? "text-brand" : "text-brand")}>{vendor}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={onReorder}
                    className={cn(
                        "py-2 px-4 rounded-lg text-sm font-bold text-white transition-colors shadow-sm",
                        isCritical
                            ? "bg-brand hover:bg-brand/90"
                            : "bg-brand hover:bg-brand/90"
                    )}>
                    Reorder
                </button>
                <button
                    onClick={onManage}
                    className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-bold text-orange-500 border border-orange-200 hover:bg-orange-50 transition-colors"
                >
                    <Edit3 className="w-4 h-4" />
                    Manage
                </button>
            </div>
        </div>
    );
}
