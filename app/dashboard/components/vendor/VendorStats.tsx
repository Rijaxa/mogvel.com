'use client';

import { DollarSign, Package, AlertCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VendorStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Sales */}
            <div className="bg-[#F0FAFA] rounded-2xl p-6 relative">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <DollarSign className="w-5 h-5 text-brand" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-brand" />
                </div>
                <p className="text-sm text-slate-500 mb-1">Today's Sales</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">£12,480</h3>

                {/* Simple sparkline visual */}
                <div className="h-1 w-full bg-brand/20 rounded-full overflow-hidden">
                    <div className="h-full bg-brand w-[70%]" />
                </div>
                <p className="text-right text-xs font-bold text-brand mt-1">+18%</p>
            </div>

            {/* Pending Orders */}
            <div className="bg-[#FFF8F0] rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Package className="w-5 h-5 text-orange-500" />
                    </div>
                    <span className="px-2 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold uppercase rounded">Action</span>
                </div>
                <p className="text-sm text-slate-500 mb-1">Pending Orders</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">3</h3>
                <p className="text-sm text-slate-500">3 require urgent attention</p>
            </div>

            {/* Low Stock */}
            <div className="bg-[#FFF0F0] rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold uppercase rounded">Critical</span>
                </div>
                <p className="text-sm text-slate-500 mb-1">Low Stock</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">3</h3>
                <p className="text-sm text-slate-500">Restock needed soon</p>
            </div>

            {/* Growth */}
            <div className="bg-[#F0FFF4] rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-sm text-slate-500 mb-1">vs Last Month</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">+12.5%</h3>
                <p className="text-sm text-green-600 font-medium">Revenue growth trend</p>
            </div>
        </div>
    );
}
