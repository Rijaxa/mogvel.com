import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    metric: string;
    trend?: string;
    trendUp?: boolean;
    icon?: LucideIcon;
    alert?: boolean;
    alertText?: string;
    className?: string;
    onClick?: () => void;
}

export default function StatsCard({
    title,
    metric,
    trend,
    trendUp,
    icon: Icon,
    alert,
    alertText,
    className,
    onClick
}: StatsCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-white p-6 rounded-2xl border border-slate-100 flex flex-col justify-between h-40 transition-shadow",
                className,
                onClick && "cursor-pointer hover:shadow-md hover:border-brand/20"
            )}
        >
            <div className="flex justify-between items-start">
                <span className="text-slate-500 font-medium text-sm">{title}</span>
                {Icon && <Icon className="w-5 h-5 text-brand" />}
                {alert && <div className="w-5 h-5 rounded-full border-2 border-orange-400 text-orange-400 font-bold flex items-center justify-center text-xs">!</div>}
            </div>

            <div>
                <div className="text-2xl font-bold text-slate-900 mb-2">{metric}</div>

                {trend && (
                    <div className={cn("text-xs font-medium flex items-center gap-1", trendUp ? "text-green-500" : "text-red-500")}>
                        {trendUp ? '↗' : '↘'} {trend}
                    </div>
                )}

                {alertText && (
                    <div className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                        {alertText}
                    </div>
                )}
            </div>
        </div>
    );
}
