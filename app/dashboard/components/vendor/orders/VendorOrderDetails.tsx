'use client';

import { Check, User, X, MessageCircle, FileText, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import OrderProgress from '../../orders/OrderProgress';

interface VendorOrderDetailsProps {
    status: 'Incoming' | 'In Progress' | 'Completed';
    onClose?: () => void;
}

export default function VendorOrderDetails({ status, onClose }: VendorOrderDetailsProps) {
    const isIncoming = status === 'Incoming';
    const isCompleted = status === 'Completed';

    return (
        <div className="bg-slate-50/50 p-6 rounded-b-2xl animate-in slide-in-from-top-2 duration-200 border-t border-slate-100">
            {/* Items Table */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-brand rounded-sm" />
                    </div>
                    <h3 className="font-bold text-slate-900">Order Items</h3>
                </div>

                <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-slate-50">
                            <tr className="hover:bg-slate-50/50">
                                <td className="p-4 w-12">
                                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-slate-300 rounded-sm" />
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-slate-900">
                                    Hand Sanitizer 500ml
                                </td>
                                <td className="p-4 text-center">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Quantity</div>
                                    <div className="font-bold text-slate-900">100</div>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Unit Price</div>
                                    <div className="font-bold text-slate-900">£7.90</div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total</div>
                                    <div className="font-bold text-slate-900">£790.00</div>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50/50">
                                <td className="p-4 w-12">
                                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-slate-300 rounded-sm" />
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-slate-900">
                                    Disinfectant Spray 750ml
                                </td>
                                <td className="p-4 text-center">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Quantity</div>
                                    <div className="font-bold text-slate-900">80</div>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Unit Price</div>
                                    <div className="font-bold text-slate-900">£5.80</div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total</div>
                                    <div className="font-bold text-slate-900">£464.00</div>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50/50">
                                <td className="p-4 w-12">
                                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-slate-300 rounded-sm" />
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-slate-900">
                                    Paper Towels (12-pack)
                                </td>
                                <td className="p-4 text-center">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Quantity</div>
                                    <div className="font-bold text-slate-900">50</div>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Unit Price</div>
                                    <div className="font-bold text-slate-900">£14.50</div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total</div>
                                    <div className="font-bold text-slate-900">£725.00</div>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot className="bg-slate-50 border-t border-slate-100">
                            <tr>
                                <td colSpan={2} className="p-4">
                                    <div className="text-xs text-slate-500">Total Items</div>
                                    <div className="font-bold text-slate-900">230 units</div>
                                </td>
                                <td colSpan={3} className="p-4 text-right">
                                    <div className="text-xs text-slate-500">Total Amount</div>
                                    <div className="text-xl font-bold text-slate-900">£2456.80</div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Order Progress */}
            <div className="mb-8">
                <OrderProgress
                    status={isIncoming ? 'Order Received' : status}
                    role="vendor"
                    onAcceptOrder={() => alert("Order Accepted")}
                    onRejectOrder={() => alert("Order Rejected")}
                    onViewInvoice={() => alert("Viewing Invoice")}
                />
            </div>

            {/* Actions or Activity */}
            {/* Activities are now handled within OrderProgress or below it */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-brand" />
                    </div>
                    <h3 className="font-bold text-slate-900">Order Activity Feed</h3>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-4">
                    <div className="relative pl-6 pb-6 border-l-2 border-brand ml-2">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand border-4 border-white" />
                        <p className="font-bold text-slate-900 text-sm">Order marked as Delivered</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-400">2024-11-12 16:00</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">Vendor</span>
                        </div>
                    </div>
                    <div className="relative pl-6 border-l-2 border-slate-200 ml-2">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 border-4 border-white" />
                        <p className="font-bold text-slate-500 text-sm">Order Dispatched</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-400">2024-11-12 09:00</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-200">
                <button className="flex items-center gap-2 text-slate-600 font-bold text-sm hover:text-slate-900 border border-slate-200 bg-white px-4 py-2 rounded-lg hover:bg-slate-50">
                    <User className="w-4 h-4" />
                    View Contact
                </button>

                {onClose && (
                    <button onClick={onClose} className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 font-bold text-sm">
                        Close
                    </button>
                )}
            </div>
        </div>
    );
}
