'use client';

import { DollarSign, Package, AlertTriangle, TrendingUp, Info, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import SalesDetailsModal from './popups/SalesDetailsModal';
import PendingOrdersModal from './popups/PendingOrdersModal';
import VendorLowStockModal from './popups/VendorLowStockModal';
import RevenueGrowthModal from './popups/RevenueGrowthModal';
import AverageOrderValueModal from './popups/AverageOrderValueModal';

export default function VendorStats() {
    const [openModal, setOpenModal] = useState<string | null>(null);
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    // Mock orders for calculation (mirrors VendorOrders data)
    const orders = [
        { amount: 2340 },
        { amount: 1850 },
        { amount: 3120 },
        { amount: 1280 }
    ];

    const totalValue = orders.reduce((acc, order) => acc + order.amount, 0);
    const averageOrderValue = Math.round(totalValue / orders.length);

    const stats = [
        {
            title: `${currentMonth} Sales`,
            value: "₾12,480",
            trend: "+18%",
            trendType: "positive",
            icon: DollarSign,
            color: "bg-teal-50 text-brand",
            modalId: 'sales'
        },
        {
            title: "Pending Orders",
            value: "3",
            subtext: "3 require urgent attention",
            icon: Package,
            color: "bg-yellow-50 text-yellow-600",
            action: "Action",
            modalId: 'pending'
        },
        {
            title: "Average Order Value",
            value: `₾${averageOrderValue}`,
            subtext: "per order",
            trend: "12% vs last month",
            trendType: "positive",
            icon: ShoppingCart,
            color: "bg-orange-50 text-orange-400",
            modalId: 'aov'
        },
        {
            title: "vs Last Month",
            value: "+12.5%",
            subtext: "Revenue growth trend",
            subtextColor: "text-green-500",
            icon: TrendingUp,
            color: "bg-green-50 text-green-500",
            modalId: 'growth'
        }
    ];

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.map((stat: any, index) => (
                    <div
                        key={index}
                        onClick={() => setOpenModal(stat.modalId)}
                        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
                    >
                        {stat.action && (
                            <span className="absolute top-5 right-5 bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-1 rounded">
                                Action
                            </span>
                        )}
                        {stat.alert && (
                            <span className="absolute top-5 right-5 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                Critical
                            </span>
                        )}
                        {stat.trend && (
                            <span className="absolute bottom-5 right-5 text-green-500 font-bold text-sm">
                                {stat.trend}
                            </span>
                        )}
                        {index === 3 && (
                            <span className="absolute top-5 right-5 text-green-500">
                                <TrendingUp className="w-4 h-4" />
                            </span>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.color)}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>

                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{stat.value}</h3>
                            {stat.subtext && (
                                <p className={cn("text-xs font-medium", stat.subtextColor || "text-slate-500")}>
                                    {stat.subtext}
                                </p>
                            )}
                            {index === 0 && (
                                <div className="h-1 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                                    <div className="h-full bg-brand w-[65%] rounded-full" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            <SalesDetailsModal isOpen={openModal === 'sales'} onClose={() => setOpenModal(null)} />
            <PendingOrdersModal isOpen={openModal === 'pending'} onClose={() => setOpenModal(null)} />
            <VendorLowStockModal isOpen={openModal === 'stock'} onClose={() => setOpenModal(null)} />
            <RevenueGrowthModal isOpen={openModal === 'growth'} onClose={() => setOpenModal(null)} />
            <AverageOrderValueModal isOpen={openModal === 'aov'} onClose={() => setOpenModal(null)} />
        </>
    );
}
