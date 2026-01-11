'use client';

import { useState } from 'react';
import OrderCard from '../../components/orders/OrderCard';
import OrderTabs from '../../components/orders/OrderTabs';

import { getOrders } from '@/actions/orders';
import { useEffect } from 'react';

// Removed hardcoded orders array
export default function OrderPage() {
    const [activeTab, setActiveTab] = useState('ongoing');
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOrders()
            .then((data) => {
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
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
                <p className="text-slate-500">Monitor ongoing, in-progress, and completed orders in one place</p>
            </div>

            <OrderTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                counts={counts}
            />

            <div className="space-y-4">
                {filteredOrders.length > 0 ? (
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
