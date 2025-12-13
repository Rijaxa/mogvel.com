import { Check, Activity, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderProgressProps {
    status: string;
    paymentProofUrl?: string; // Mock URL for the download button
}

const steps = [
    { label: 'Order Placed', status: 'completed' },
    { label: 'Verified', status: 'completed' },
    { label: 'Dispatched', status: 'active' },
    { label: 'Delivered', status: 'pending' },
    { label: 'Completed', status: 'pending' },
];

export default function OrderProgress({ status, paymentProofUrl }: OrderProgressProps) {
    // Logic to determine active step based on status string (simplification for demo)
    // In a real app, this would be more robust
    const getStepStatus = (index: number) => {
        if (status === 'Completed' || status === 'Delivered') return 'completed';
        if (status === 'Shipped' && index <= 2) return 'completed';
        if (status === 'Payment Sent' && index <= 1) return 'completed';

        // Fallback for visual demo based on screenshots
        if (index === 0) return 'completed';
        if (index === 1 && status !== 'Awaiting Response') return 'completed';

        return 'pending';
    };

    return (
        <div className="bg-white rounded-xl border border-slate-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-8">
                <Activity className="w-5 h-5 text-brand" />
                <h4 className="font-bold text-slate-900 text-sm">Order Progress</h4>
            </div>

            <div className="flex items-center justify-between px-10 mb-8 relative">
                {/* Line Background - Simplified visual */}
                <div className="absolute left-10 right-10 top-4 h-1 bg-slate-100 -z-0" />

                {[1, 2, 3, 4, 5].map((step, index) => {
                    const stepStatus = getStepStatus(index);
                    return (
                        <div key={index} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                stepStatus === 'completed' ? "bg-brand text-white" : "bg-slate-200 text-slate-400"
                            )}>
                                <Check className="w-5 h-5" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {paymentProofUrl && (
                <div className="bg-green-50 rounded-lg p-3 inline-flex items-center gap-3 border border-green-100 cursor-pointer hover:bg-green-100 transition-colors">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold text-green-700">payment-proof-ORD-2024-005.pdf</span>
                </div>
            )}
        </div>
    );
}
