'use client';

import { X, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PendingOrdersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PendingOrdersModal({ isOpen, onClose }: PendingOrdersModalProps) {
    const router = useRouter();
    if (!isOpen) return null;

    const pendingOrders = [
        { id: 'ORD-2847', client: 'Acme Corp', amount: '₾2.340' },
        { id: 'ORD-2844', client: 'Urban Retail Co', amount: '₾1.280' },
        { id: 'ORD-2843', client: 'BuildMart Ltd', amount: '₾1.980' },
    ];

    return (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold text-slate-900">Pending Orders — Next Actions</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mb-6">
                        <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            3 require urgent attention
                        </span>
                    </div>

                    <div className="space-y-3 mb-6">
                        {pendingOrders.map((order, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900">{order.id}</span>
                                        <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded border border-orange-200">Pending</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">{order.client}</p>
                                </div>
                                <span className="font-bold text-slate-900">{order.amount}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => router.push('/dashboard/vendor/orders?status=pending')}
                        className="w-full py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-brand/20"
                    >
                        <Eye className="w-5 h-5" />
                        View All Pending Orders
                    </button>
                </div>
            </div>
        </div>
    );
}
