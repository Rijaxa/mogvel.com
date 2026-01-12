'use client';

import { DollarSign, FileText, Calendar } from 'lucide-react';

interface OrderItem {
    id: string;
    invoiceRef: string;
    date: string;
    amount: string;
    products: string[];
    status: 'Delivered';
}

export default function ProcurementHistory() {
    const orders: OrderItem[] = [
        {
            id: 'PROC-2024-001',
            invoiceRef: 'INV-2024-001',
            date: '10.11.2024',
            amount: '₾2456.80',
            products: ['Hand Sanitizer 500ml (x100)', 'Disinfectant Spray 750ml (x80)', 'Paper Towels (x50)'],
            status: 'Delivered'
        },
        {
            id: 'PROC-2024-002',
            invoiceRef: 'INV-2024-002',
            date: '25.10.2024',
            amount: '₾1842.30',
            products: ['Office Paper A4 (x100)', 'Ballpoint Pens (x100)'],
            status: 'Delivered'
        },
        {
            id: 'PROC-2024-003',
            invoiceRef: 'INV-2024-003',
            date: '10.10.2024',
            amount: '₾3567.90',
            products: ['Multipurpose Cleaner 5L (x50)', 'Toilet Paper 24-pack (x20)', 'Hand Soap (x80)'],
            status: 'Delivered'
        },
        {
            id: 'PROC-2024-004',
            invoiceRef: 'INV-2024-004',
            date: '28.9.2024',
            amount: '₾1234.50',
            products: ['Industrial Gloves (x40)', 'Safety Goggles (x20)'],
            status: 'Delivered'
        }
    ];

    return (
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-brand" />
                    <h2 className="text-lg font-bold text-slate-900">Procurement History</h2>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase">Total Procurement Value</p>
                    <p className="text-xl font-bold text-slate-900">₾11992.10</p>
                </div>
            </div>

            <div className="space-y-6">
                {orders.map((order, idx) => (
                    <div key={idx} className="bg-slate-50/50 rounded-xl p-6 border border-slate-100 hover:border-brand/20 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-slate-900">{order.id}</h3>
                                <p className="text-xs text-slate-500 font-medium">Invoice: {order.invoiceRef}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-2 py-1 rounded border border-green-200 bg-green-50 text-green-700 text-[10px] font-bold uppercase">
                                    {order.status}
                                </span>
                                <button className="text-slate-400 hover:text-brand transition-colors">
                                    <FileText className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-4">
                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                <Calendar className="w-4 h-4" />
                                {order.date}
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 text-right">Amount</p>
                                <p className="text-lg font-bold text-slate-900">{order.amount}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs text-slate-400 font-medium mr-2">Products:</span>
                            {order.products.map((prod, i) => (
                                <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600">
                                    {prod}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
