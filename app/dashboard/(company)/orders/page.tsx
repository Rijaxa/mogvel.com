'use client';

import { useState, useEffect } from 'react';
import OrderCard from '../../components/orders/OrderCard';
import OrderTabs from '../../components/orders/OrderTabs';
import { getOrders } from '@/actions/orders';
import { exportToCSV } from '@/lib/export';
import { Download } from 'lucide-react';

export default function OrderPage() {
    const [activeTab, setActiveTab] = useState('ongoing');
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const handleExport = () => {
        exportToCSV(orders, 'orders_report');
    };

    useEffect(() => {
        getOrders()
            .then((data) => {
                if (!data) {
                    window.location.href = '/login';
                    return;
                }
                setOrders(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch orders", err);
                setLoading(false);
            });
    }, []);


    const getStatusCategory = (status: string) => {
        if (['Awaiting Response', 'Vendor Response', 'Invoice Generated'].includes(status)) return 'ongoing';
        if (['Payment Sent', 'Proof Uploaded', 'Payment Verified', 'Dispatched'].includes(status)) return 'inProgress';
        if (['Completed', 'Delivered'].includes(status)) return 'completed';
        return 'ongoing';
    };

    const filteredOrders = orders.filter(order => getStatusCategory(order.status) === activeTab);

    const counts = {
        ongoing: orders.filter(o => getStatusCategory(o.status) === 'ongoing').length,
        inProgress: orders.filter(o => getStatusCategory(o.status) === 'inProgress').length,
        completed: orders.filter(o => getStatusCategory(o.status) === 'completed').length
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
                    <p className="text-slate-500">Monitor ongoing, in-progress, and completed orders in one place</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            <OrderTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                counts={counts}
            />

            <div className="space-y-4">
                {loading ? (
                    <div className="p-12 text-center bg-white rounded-xl border border-slate-100">
                        <p className="text-slate-500">Loading orders...</p>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                        <OrderCard key={index} {...order} />
                    ))
                ) : (
                    <div className="p-12 text-center bg-white rounded-xl border border-slate-100">
                        <p className="text-slate-500">No orders found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
