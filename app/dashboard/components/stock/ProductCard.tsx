import { Edit3, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ProductCardProps {
    title: string;
    category: string;
    currentStock: number;
    maxStock: number;
    consumption: number;
    lastOrder: string;
    vendor: string;
    image: string;
    onReorder?: () => void;
    onManage?: () => void;
    onImageClick?: () => void;
}

export default function ProductCard({
    title,
    category,
    currentStock,
    maxStock,
    consumption,
    lastOrder,
    vendor,
    image,
    onReorder,
    onManage,
    onImageClick
}: ProductCardProps) {
    const stockPercentage = (currentStock / maxStock) * 100;

    // Logic: Critical < 10%, Low < 30%
    const isCritical = stockPercentage < 10;
    const isLow = stockPercentage >= 10 && stockPercentage < 30;

    let statusColor = "bg-brand";
    let progressColor = "bg-brand";
    let borderColor = "border-slate-100";
    let statusIcon = null;

    if (isCritical) {
        statusColor = "text-red-500";
        progressColor = "bg-red-500";
        borderColor = "border-red-200 bg-red-50/30";
        statusIcon = <AlertTriangle className="w-5 h-5 text-red-500" />;
    } else if (isLow) {
        statusColor = "text-yellow-500";
        progressColor = "bg-yellow-500";
        borderColor = "border-yellow-200 bg-yellow-50/30";
        statusIcon = <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }

    return (
        <div className={cn(
            "bg-white rounded-2xl border p-5 transition-all hover:shadow-lg flex flex-col gap-4",
            borderColor
        )}>
            <div className="flex gap-4">
                <div
                    className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 cursor-zoom-in"
                    onClick={onImageClick}
                >
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-500"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{category}</p>
                            <h3 className="text-slate-900 font-bold text-base leading-tight truncate pr-2" title={title}>{title}</h3>
                        </div>
                        {statusIcon}
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-sm font-bold text-slate-700 mb-1.5">
                        <span>Stock Level</span>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full bg-slate-100", isCritical ? "bg-red-100 text-red-700" : isLow ? "bg-yellow-100 text-yellow-700" : "bg-emerald-100 text-emerald-700")}>
                            {currentStock} / {maxStock} units
                        </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full rounded-full transition-all duration-500", progressColor)}
                            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 bg-white/50 p-2 rounded-lg border border-slate-100/50">
                    <div className="flex flex-col">
                        <span>Last Order</span>
                        <span className="font-bold text-slate-700">{lastOrder}</span>
                    </div>
                    <div className="h-4 w-px bg-slate-200" />
                    <div className="flex flex-col text-right">
                        <span>Vendor</span>
                        <span className="font-bold text-slate-700 truncate max-w-[100px]">{vendor}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto pt-2">
                <button
                    onClick={onReorder}
                    className={cn(
                        "py-2.5 px-4 rounded-lg text-sm font-bold text-white transition-colors shadow-sm active:scale-95",
                        isCritical ? "bg-red-500 hover:bg-red-600" : "bg-brand hover:bg-teal-600"
                    )}>
                    Reorder
                </button>
                <button
                    onClick={onManage}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors active:scale-95"
                >
                    <Edit3 className="w-4 h-4" />
                    Manage
                </button>
            </div>
        </div>
    );
}
