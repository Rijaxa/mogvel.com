import { Check, Activity, FileText, Upload, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderProgressProps {
    status: string;
    paymentProofUrl?: string;
    onViewInvoice?: () => void;
    onUploadProof?: () => void;
    onCancelOrder?: () => void;
}

const steps = [
    { id: 'response', label: 'Vendor Response' },
    { id: 'invoice', label: 'Invoice Generated' },
    { id: 'payment', label: 'Payment Sent' },
    { id: 'proof', label: 'Proof Uploaded' },
    { id: 'verified', label: 'Payment Verified' },
    { id: 'delivered', label: 'Delivered' }
];

export default function OrderProgress({
    status,
    paymentProofUrl,
    onViewInvoice,
    onUploadProof,
    onCancelOrder
}: OrderProgressProps) {

    // Determine current step index based on status string
    let currentStepIndex = 0;
    if (status === 'Awaiting Response' || status === 'Vendor Response') currentStepIndex = 0;
    else if (status === 'Vendor Accepted') currentStepIndex = 1;
    else if (status === 'Invoice Generated') currentStepIndex = 2;
    else if (status === 'Payment Sent') currentStepIndex = 3;
    else if (status === 'Proof Uploaded') currentStepIndex = 4;
    else if (status === 'Payment Verified' || status === 'Dispatched') currentStepIndex = 5;
    else if (status === 'Delivered' || status === 'Completed') currentStepIndex = 6;

    // Helper to check step state
    const getStepState = (index: number) => {
        if (index < currentStepIndex) return 'completed';
        if (index === currentStepIndex) return 'active';
        return 'pending';
    };

    return (
        <div className="bg-white rounded-xl border border-slate-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-8">
                <Activity className="w-5 h-5 text-brand" />
                <h4 className="font-bold text-slate-900 text-sm">Order Progress</h4>
            </div>

            <div className="relative mb-8 px-4">
                {/* 
                    Progress Bar Background 
                    - Top: 19px (20px center - 1px half-height)
                    - Left/Right: 50% of one flex item's width (1 part of 6) approx? 
                    - Actually, relying on exact centers with flex is tricky.
                    - Better approach: Using absolute padding based on container size.
                    - With flex-1, the center of the first item depends on the container width.
                    - Let's assume standard spacing.
                */}
                <div className="absolute left-0 right-0 top-[19px] h-0.5 w-full -z-0">
                    <div className="h-full bg-slate-100 w-[calc(100%-4rem)] mx-auto" />
                </div>

                {/* 
                    Active Progress Fill 
                    We'll float this over the background.
                    Math: (index / max) * width.
                */}
                <div className="absolute left-8 right-8 top-[19px] h-0.5 -z-0 pointer-events-none">
                    <div
                        className="h-full bg-brand transition-all duration-500 ease-out"
                        style={{
                            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`
                        }}
                    />
                </div>

                <div className="flex justify-between relative z-10 w-full">
                    {steps.map((step, index) => {
                        const stepState = getStepState(index);
                        const isCompleted = stepState === 'completed';
                        const isActive = stepState === 'active';

                        return (
                            <div key={step.id} className="flex-1 flex flex-col items-center group relative min-w-0">
                                {/* Circle Indicator */}
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-20 mb-3 bg-white",
                                    isCompleted ? "bg-brand border-brand text-white shadow-none" :
                                        isActive ? "bg-white border-brand text-brand shadow-[0_0_0_4px_rgba(45,212,191,0.1)] scale-110" :
                                            "bg-white border-slate-200 text-slate-300 shadow-none"
                                )}>
                                    {isCompleted ? <Check className="w-5 h-5" /> :
                                        isActive ? <div className="w-3 h-3 bg-brand rounded-full" /> :
                                            <div className="w-2 h-2 bg-slate-200 rounded-full" />
                                    }
                                </div>

                                {/* Permanent Label */}
                                <div className="text-center w-full px-1">
                                    <span className={cn(
                                        "text-xs font-medium block leading-tight truncate w-full",
                                        isActive ? "text-brand font-bold" :
                                            isCompleted ? "text-slate-900" : "text-slate-400"
                                    )} title={step.label}>
                                        {step.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-slate-100">
                {/* Cancel Button - Only active early */}
                {currentStepIndex < 2 && (
                    <button
                        onClick={onCancelOrder}
                        className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors mr-auto"
                    >
                        <span>Cancel Order</span>
                    </button>
                )}

                {/* View Invoice - Available after invoice generation */}
                {(currentStepIndex >= 2 || status === 'Invoice Generated') && (
                    <button
                        onClick={onViewInvoice}
                        className="flex items-center gap-2 px-4 py-2 border border-brand text-brand rounded-lg text-sm font-bold hover:bg-cyan-50 transition-colors ml-auto sm:ml-0"
                    >
                        <Eye className="w-4 h-4" />
                        View Invoice
                    </button>
                )}

                {/* Upload Proof - Available after invoice gen until verified */}
                {(currentStepIndex >= 2 && currentStepIndex < 5 && status !== 'Payment Verified' && status !== 'Proof Uploaded') && (
                    <button
                        onClick={onUploadProof}
                        className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg text-sm font-bold hover:bg-brand/90 transition-colors shadow-sm"
                    >
                        <Upload className="w-4 h-4" />
                        Upload Payment Proof
                    </button>
                )}
            </div>
        </div>
    );
}
