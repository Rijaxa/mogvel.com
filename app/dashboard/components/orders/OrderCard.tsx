import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderCardProps {
    id: string;
    date: string;
    vendor: string;
    status: string;
    amount: string;
}

export default function OrderCard({
    id,
    date,
    vendor,
    status,
    amount
}: OrderCardProps) {

    let statusColor = "bg-slate-100 text-slate-600";
    if (status === "Invoice Generated") statusColor = "bg-cyan-50 text-cyan-500";
    if (status === "Payment Sent") statusColor = "bg-orange-50 text-orange-400";

    return (
        <div className="bg-white rounded-xl border border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div>
                <h3 className="text-slate-900 font-bold mb-1">{id}</h3>
                <p className="text-slate-400 text-xs">{date}</p>
            </div>

            <div className="flex-1 md:ml-12">
                <span className={cn(
                    "font-bold",
                    vendor === "CleanPro Ltd" ? "text-brand" : // Just varying colors based on screenshot if needed, but standardizing to brand or specific logic
                        vendor === "OfficeMax Direct" ? "text-brand" :
                            "text-brand"
                )}>
                    {vendor}
                </span>
            </div>

            <div className="flex-1">
                <span className={cn("px-3 py-1.5 rounded-lg text-xs font-bold", statusColor)}>
                    {status}
                </span>
            </div>

            <div className="flex items-center gap-12">
                <span className="font-bold text-slate-900">{amount}</span>
                <ChevronDown className="w-5 h-5 text-brand" />
            </div>
        </div>
    );
}
