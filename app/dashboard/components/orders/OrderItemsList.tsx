import { Box } from 'lucide-react';

interface OrderItem {
    name: string;
    quantity: number;
    unitPrice: number;
    image?: string;
}

interface OrderItemsListProps {
    items: OrderItem[];
    totalAmount: string;
}

export default function OrderItemsList({ items, totalAmount }: OrderItemsListProps) {
    const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden mb-6">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <Box className="w-5 h-5 text-brand" />
                <h4 className="font-bold text-slate-900 text-sm">Order Items</h4>
            </div>

            <div className="divide-y divide-slate-100">
                {items.map((item, index) => (
                    <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Box className="w-5 h-5 text-slate-400" />
                                )}
                            </div>
                            <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-12 text-sm">
                            <div className="text-right">
                                <p className="text-xs text-slate-500 mb-1">Quantity</p>
                                <p className="font-bold text-slate-900">{item.quantity}</p>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-slate-500 mb-1">Unit Price</p>
                                <p className="font-bold text-slate-900">£{item.unitPrice.toFixed(2)}</p>
                            </div>
                            <div className="text-right w-20">
                                <p className="text-xs text-slate-500 mb-1">Total</p>
                                <p className="font-bold text-slate-900">£{(item.quantity * item.unitPrice).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-cyan-50/20 p-4 flex justify-between items-center">
                <div>
                    <p className="text-xs text-slate-500 mb-1">Total Items</p>
                    <p className="font-bold text-slate-900">{totalUnits} units</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500 mb-1">Total Amount</p>
                    <p className="font-bold text-slate-900 text-xl">{totalAmount}</p>
                </div>
            </div>
        </div>
    );
}
