'use client';

import { Plus } from 'lucide-react';

export default function TopProducts() {
    const products = [
        { name: 'Office Paper A4', sold: 1250, stock: 85, stockColor: 'bg-green-500', alert: null },
        { name: 'Hand Sanitizer 500ml', sold: 980, stock: 25, stockColor: 'bg-yellow-400', alert: 'Low Stock' },
        { name: 'Industrial Gloves', sold: 650, stock: 12, stockColor: 'bg-red-500', alert: 'Critical Stock' },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-900">Top Products</h3>
                <button className="flex items-center gap-1 text-xs font-bold text-brand hover:text-brand/80">
                    <Plus className="w-3 h-3" />
                    Add
                </button>
            </div>

            <div className="space-y-6">
                {products.map((p, i) => (
                    <div key={i}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-sm font-bold text-slate-900">{p.name}</p>
                                <p className="text-xs text-slate-500">{p.sold} sold <span className="text-green-500">↗</span></p>
                            </div>
                            {p.alert && (
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${p.alert === 'Critical Stock' ? 'bg-red-500 text-white' : 'bg-yellow-400 text-yellow-900'}`}>
                                    {p.alert}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span>Stock Level</span>
                            <span>{p.stock}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${p.stockColor}`}
                                style={{ width: `${p.stock}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
