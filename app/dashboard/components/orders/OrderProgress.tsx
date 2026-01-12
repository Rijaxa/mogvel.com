import { Check, ThumbsUp, ThumbsDown, Banknote, Clock, CreditCard, CheckCircle2, Truck, XCircle, ShoppingCart, Activity, FileText, Upload, Eye, FileDown, FileUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderProgressProps {
    status: string;
    role: 'buyer' | 'vendor';
    paymentProofUrl?: string;
    onViewInvoice?: () => void;
    onUploadProof?: () => void;
    onCancelOrder?: () => void;
    onAcceptOrder?: () => void;
    onRejectOrder?: () => void;
    vendorName?: string;
}

const getSteps = (role: 'buyer' | 'vendor', status: string, vendorName?: string) => {
    const isAccepted = status === 'Vendor Accepted' || status === 'Invoice Generated' || status === 'Payment Sent' || status === 'Proof Uploaded' || status === 'Payment Verified' || status === 'Dispatched' || status === 'Delivered' || status === 'Completed';
    const isRejected = status === 'Vendor Rejected';

    let responseLabel = role === 'buyer' ? 'Vendor Response' : 'Accept / Reject';
    let responseTooltip = role === 'buyer' ? 'Waiting for vendor acceptance' : 'Vendor action required';

    // Icon logic: Buyer sees Activity, Vendor sees ThumbsUp (unless rejected)
    const responseIcon = isRejected ? ThumbsDown : (role === 'buyer' ? Activity : ThumbsUp);

    if (isAccepted) {
        responseLabel = 'Order Accepted';
        responseTooltip = role === 'buyer'
            ? `Vendor ${vendorName ? `(${vendorName})` : ''} has accepted your order`
            : 'You have accepted this order';
    } else if (isRejected) {
        responseLabel = 'Order Rejected';
        responseTooltip = role === 'buyer'
            ? 'Vendor has declined the order'
            : 'You have rejected this order';
    }

    return [
        { id: 'submitted', label: role === 'buyer' ? 'Order Submitted' : 'Order Received', icon: Check, tooltip: 'Initial order placement' },
        { id: 'response', label: responseLabel, icon: responseIcon, tooltip: responseTooltip },
        { id: 'invoice', label: 'Invoice Generated', icon: Banknote, tooltip: 'Vendor uploads invoice' },
        {
            id: 'payment',
            label: role === 'buyer' ? 'Proof Upload' : 'Payment Proof',
            icon: role === 'buyer' ? FileUp : FileText,
            tooltip: role === 'buyer'
                ? { title: 'Payment Sent', body: 'Company marks payment as done' }
                : { title: 'Awaiting Payment', body: 'Waiting for client payment' }
        },
        { id: 'verified', label: 'Payment Verified', icon: CreditCard, tooltip: 'Payment confirmed by vendor' },
        { id: 'delivered', label: 'Order Shipped', icon: Truck, tooltip: 'Items are on their way' },
        { id: 'completed', label: 'Delivered', icon: CheckCircle2, tooltip: 'Order successfully received' }
    ];
};

export default function OrderProgress({
    status,
    role,
    paymentProofUrl,
    onViewInvoice,
    onUploadProof,
    onCancelOrder,
    onAcceptOrder,
    onRejectOrder,
    vendorName
}: OrderProgressProps) {
    const steps = getSteps(role, status, vendorName);

    // Determine current step index based on status string (7 steps)
    let currentStepIndex = 0;
    if (status === 'Order Placed' || status === 'Order Submitted' || status === 'Order Received' || status === 'Incoming') currentStepIndex = 0;
    else if (status === 'Awaiting Response' || status === 'Vendor Response' || status === 'Vendor Rejected') currentStepIndex = 1;
    else if (status === 'Vendor Accepted' || status === 'Invoice Generated') currentStepIndex = 3; // Step 2 (Invoice) is done
    else if (status === 'Payment Sent' || status === 'Awaiting Payment' || status === 'In Progress' || status === 'Proof Uploaded') currentStepIndex = 4; // Step 3 (Proof) is done
    else if (status === 'Payment Verified') currentStepIndex = 5; // Step 4 (Verified) is done
    else if (status === 'Dispatched' || status === 'Shipped') currentStepIndex = 6; // Step 5 (Shipped) is done
    else if (status === 'Delivered' || status === 'Completed') currentStepIndex = 7; // All done

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
                {/* Progress Bar Background - constrained between first and last step centers */}
                <div className="absolute left-0 right-0 top-[19px] h-0.5 -z-0 flex items-center px-4">
                    <div className="h-full bg-slate-100 flex-1" style={{ marginLeft: '20px', marginRight: '20px' }} />
                </div>

                {/* Active Progress Fill - same constraints as background */}
                <div className="absolute left-0 right-0 top-[19px] h-0.5 -z-0 pointer-events-none flex items-center px-4">
                    <div
                        className="h-full bg-brand transition-all duration-500 ease-out"
                        style={{
                            width: `calc(${(currentStepIndex / (steps.length - 1)) * 100}% - ${20 - (currentStepIndex / (steps.length - 1)) * 20}px)`,
                            marginLeft: '20px'
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
                                        isActive ? (status === 'Vendor Rejected' ? "bg-white border-red-500 text-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.1)] scale-110" : "bg-white border-brand text-brand shadow-[0_0_0_4px_rgba(45,212,191,0.1)] scale-110") :
                                            "bg-white border-slate-200 text-slate-300 shadow-none"
                                )}>
                                    {isCompleted ? <Check className="w-5 h-5" /> :
                                        <step.icon className={cn("w-5 h-5", isActive ? "text-brand" : "text-slate-300")} />
                                    }
                                </div>

                                {/* Permanent Label */}
                                <div className="text-center w-full px-1">
                                    <span className={cn(
                                        "text-xs font-medium block leading-tight truncate w-full",
                                        isActive ? (status === 'Vendor Rejected' ? "text-red-500 font-bold" : "text-brand font-bold") :
                                            isCompleted ? "text-slate-900" : "text-slate-400"
                                    )} title={typeof step.tooltip === 'string' ? step.tooltip : step.tooltip.title}>
                                        {step.label}
                                    </span>
                                </div>

                                {/* Hover Tooltip for Dots */}
                                <div className="absolute -top-12 scale-0 group-hover:scale-100 transition-all bg-slate-900 text-white text-[10px] px-2 py-1.5 rounded z-50 pointer-events-none shadow-xl border border-slate-800">
                                    {typeof step.tooltip === 'string' ? (
                                        <p className="font-bold text-white whitespace-nowrap">{step.tooltip}</p>
                                    ) : (
                                        <div className="min-w-[120px] space-y-0.5">
                                            <p className="font-bold text-white border-b border-slate-700 pb-0.5 mb-1">{step.tooltip.title}</p>
                                            <p className="text-slate-400 leading-tight">{step.tooltip.body}</p>
                                        </div>
                                    )}
                                    <div className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-slate-900" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-slate-100">
                {/* Role-based actions */}
                {role === 'buyer' ? (
                    <>
                        {/* Cancel Button - Only active early for buyer */}
                        {currentStepIndex < 2 && (
                            <button
                                onClick={onCancelOrder}
                                className="flex items-center gap-2 px-5 py-2 border border-red-200 text-red-500 rounded-full text-sm font-bold hover:bg-red-50 transition-all mr-auto shadow-sm"
                            >
                                <XCircle className="w-4 h-4" />
                                <span>Cancel Order</span>
                            </button>
                        )}

                        {/* Status specific actions for buyer */}
                        {status === 'Invoice Generated' && (
                            <div className="flex items-center gap-3 mr-auto">
                                <button
                                    onClick={onViewInvoice}
                                    className="flex items-center gap-2 px-4 py-2 border border-brand text-brand rounded-lg text-sm font-bold hover:bg-cyan-50 transition-colors"
                                >
                                    <FileDown className="w-4 h-4" />
                                    View Invoice
                                </button>
                                <button
                                    onClick={() => alert("Uploading Payment Proof...")}
                                    className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg text-sm font-bold hover:bg-brand/90 transition-colors shadow-sm"
                                >
                                    <FileUp className="w-4 h-4" />
                                    Upload Payment Proof
                                </button>
                            </div>
                        )}

                        {(status === 'Shipped' || status === 'Dispatched') && (
                            <div className="flex items-center gap-3 mr-auto">
                                <button
                                    onClick={() => {
                                        alert("Marking as Delivered... \nNotification sent to Vendor!");
                                        console.log("Email sent to Vendor: Order Delivered");
                                    }}
                                    className="flex items-center gap-2 px-6 py-2 bg-brand text-white rounded-lg text-sm font-bold hover:bg-brand/90 transition-all shadow-md shadow-brand/20"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Mark as Delivered
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {/* Vendor Actions - Accept/Reject */}
                        {currentStepIndex === 0 && (
                            <>
                                <button
                                    onClick={onAcceptOrder}
                                    className="flex items-center gap-2 px-6 py-2 bg-brand text-white rounded-full text-sm font-bold hover:bg-brand/90 transition-all shadow-md shadow-brand/20"
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Accept Order</span>
                                </button>
                                <button
                                    onClick={onRejectOrder}
                                    className="flex items-center gap-2 px-6 py-2 border border-red-200 text-red-500 rounded-full text-sm font-bold hover:bg-red-50 transition-all"
                                >
                                    <ThumbsDown className="w-4 h-4" />
                                    <span>Reject Order</span>
                                </button>
                            </>
                        )}

                        {/* Status specific actions for vendor */}
                        {(status === 'Invoice Generated' || status === 'Awaiting Payment') && (
                            <div className="flex items-center gap-3 mr-auto">
                                <button
                                    onClick={onViewInvoice}
                                    className="flex items-center gap-2 px-4 py-2 bg-cyan-50 border border-cyan-200 text-brand rounded-lg text-sm font-bold hover:bg-cyan-100 transition-colors"
                                >
                                    <FileDown className="w-4 h-4" />
                                    invoice-VO-2024-009.pdf
                                </button>
                            </div>
                        )}

                        {status === 'Proof Uploaded' && (
                            <div className="flex items-center gap-3 mr-auto">
                                <button
                                    onClick={onViewInvoice}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors"
                                >
                                    <FileDown className="w-4 h-4" />
                                    invoice-VO-2024-009.pdf
                                </button>
                                <button
                                    onClick={() => {
                                        alert("Confirming Payment... \nNotification sent to Buyer!");
                                        console.log("Email sent to Buyer: Payment Confirmed");
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg text-sm font-bold hover:bg-brand/90 transition-all shadow-md shadow-brand/20"
                                >
                                    <Check className="w-4 h-4" />
                                    Confirm Payment
                                </button>
                            </div>
                        )}

                        {status === 'Payment Verified' && (
                            <div className="flex items-center gap-3 mr-auto">
                                <button
                                    onClick={onViewInvoice}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors"
                                >
                                    <FileDown className="w-4 h-4" />
                                    invoice-VO-2024-009.pdf
                                </button>
                                <button
                                    onClick={() => {
                                        alert("Marking as Shipped... \nNotification sent to Buyer!");
                                        console.log("Email sent to Buyer: Order Shipped");
                                    }}
                                    className="flex items-center gap-2 px-6 py-2 bg-brand text-white rounded-lg text-sm font-bold hover:bg-brand/90 transition-all shadow-md shadow-brand/20"
                                >
                                    <Truck className="w-4 h-4" />
                                    Mark as Shipped
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Common actions */}
                <div className="flex-1" />

                {(currentStepIndex >= 3) && (
                    <button
                        onClick={onViewInvoice}
                        className="flex items-center gap-2 px-4 py-2 border border-brand text-brand rounded-lg text-sm font-bold hover:bg-cyan-50 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        View Invoice
                    </button>
                )}

                {(role === 'buyer' && currentStepIndex >= 2 && currentStepIndex < 5 && status !== 'Payment Verified' && status !== 'Proof Uploaded' && status !== 'Invoice Generated') && (
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
