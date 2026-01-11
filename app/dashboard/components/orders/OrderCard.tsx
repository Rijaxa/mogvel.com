'use client';

import { ChevronDown, RefreshCw, FileText, X, User } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import OrderItemsList from './OrderItemsList';
import OrderProgress from './OrderProgress';
import OrderActivityFeed from './OrderActivityFeed';

interface OrderCardProps {
    id: string;
    date: string;
    vendor: string;
    status: string;
    amount: string;
    items?: any[];
    activity?: any[];
    paymentProofUrl?: string; // Mock for download
}

export default function OrderCard({
    id,
    date,
    vendor,
    status,
    amount,
    items,
    activity,
    paymentProofUrl
}: OrderCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    let statusColor = "bg-slate-100 text-slate-600";
    if (status === "Invoice Generated") statusColor = "bg-cyan-50 text-cyan-500";
    if (status === "Payment Sent" || status === "Proof Uploaded") statusColor = "bg-orange-50 text-orange-400";
    if (status === "Payment Verified") statusColor = "bg-blue-50 text-blue-500";
    if (status === "Completed" || status === "Delivered") statusColor = "bg-green-50 text-green-600";
    if (status === "Awaiting Response" || status === "Vendor Response" || status === "Order Placed") statusColor = "bg-yellow-50 text-yellow-600";
    if (status === "Vendor Rejected") statusColor = "bg-red-50 text-red-600";

    const handleCancel = () => {
        if (confirm("Are you sure you want to cancel this order?")) {
            // Mock cancel logic
            alert("Order cancellation requested.");
        }
    };

    const handleViewInvoice = () => {
        alert("Opening invoice viewer...");
    };

    const handleUploadProof = () => {
        alert("Opening file uploader...");
    };

    return (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden transition-all hover:shadow-md">
            {/* Header Row */}
            <div
                className={cn("p-6 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer", isExpanded && "border-b border-slate-100 bg-slate-50/50")}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div>
                    <h3 className="text-slate-900 font-bold mb-1">{id}</h3>
                    <p className="text-slate-400 text-xs">{date}</p>
                </div>

                <div className="flex-1 md:ml-12 text-center md:text-left">
                    <span className="font-bold text-brand">{vendor}</span>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <span className={cn("px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap", statusColor)}>
                        {status}
                    </span>
                </div>

                <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                    <span className="font-bold text-slate-900">{amount}</span>
                    <button className="p-1 rounded-full hover:bg-slate-100 transition-colors">
                        <ChevronDown className={cn("w-5 h-5 text-brand transition-transform", isExpanded && "rotate-180")} />
                    </button>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="p-6 animate-in slide-in-from-top-4 duration-300">
                    {/* Items and Progress */}
                    <OrderItemsList items={items || []} totalAmount={amount} />

                    <OrderProgress
                        status={status}
                        role="buyer"
                        vendorName={vendor}
                        paymentProofUrl={paymentProofUrl}
                        onCancelOrder={handleCancel}
                        onViewInvoice={handleViewInvoice}
                        onUploadProof={handleUploadProof}
                    />

                    <OrderActivityFeed events={activity || []} />

                    {/* Actions Footer */}
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
                        <button
                            className="flex items-center gap-2 px-4 py-2 border border-brand text-brand rounded-lg text-sm font-bold hover:bg-cyan-50 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reorder
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            Download Invoice
                        </button>
                        <button
                            onClick={() => alert(`Contact Person: John Doe\nRole: Warehouse Manager\nEmail: john@officemax.com\nPhone: +44 20 7123 4567`)}
                            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                        >
                            <User className="w-4 h-4" />
                            Contact Person
                        </button>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
