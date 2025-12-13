'use client';

import { useState } from 'react';
import OrderTabs from '../components/orders/OrderTabs';
import OrderCard from '../components/orders/OrderCard';

const orders = [
    {
        id: 'ORD-2024-007',
        date: '16.11.2024',
        vendor: 'OfficeMax Direct',
        status: 'Awaiting Response', // Ongoing
        amount: '£459.50',
        items: [
            { name: 'Office Paper A4 (500 sheets)', quantity: 20, unitPrice: 12.99 },
            { name: 'Ballpoint Pens (Box of 50)', quantity: 15, unitPrice: 8.50 },
            { name: 'Stapler Heavy Duty', quantity: 8, unitPrice: 15.99 },
        ],
        activity: [
            { title: 'Order submitted successfully', date: '2024-11-16 09:30', actor: 'System' }
        ]
    },
    {
        id: 'ORD-2024-005',
        date: '12.11.2024',
        vendor: 'TechSupply Hub',
        status: 'Dispatched', // In Progress
        amount: '£1125.00',
        paymentProofUrl: 'example.pdf',
        items: [
            { name: 'Wireless Mouse', quantity: 50, unitPrice: 22.50 }
        ],
        activity: [
            { title: 'Order dispatched by vendor - tracking code #X2045', date: '2024-11-13 10:00', actor: 'Vendor' },
            { title: 'Payment verified by TechSupply Hub', date: '2024-11-12 14:30', actor: 'Vendor' },
            { title: 'Order submitted successfully', date: '2024-11-12 09:00', actor: 'System' },
        ]
    },
    {
        id: 'ORD-2024-001',
        date: '10.11.2024',
        vendor: 'OfficeMax Direct',
        status: 'Completed', // Completed
        amount: '£1249.50',
        paymentProofUrl: 'example.pdf',
        items: [
            { name: 'Office Paper A4 (500 sheets)', quantity: 50, unitPrice: 12.99 },
            { name: 'Ballpoint Pens (Box of 50)', quantity: 10, unitPrice: 8.50 },
        ],
        activity: [
            { title: 'Order delivered successfully', date: '2024-11-15 16:00', actor: 'Vendor' },
            { title: 'Order dispatched', date: '2024-11-12 10:00', actor: 'System' },
        ]
    },
    // Added more mock data to fill out categories
    {
        id: 'ORD-2024-009',
        date: '17.11.2024',
        vendor: 'CleanPro Ltd',
        status: 'Invoice Generated', // In Progress
        amount: '£632.00',
        items: [{ name: 'Trash Bags', quantity: 20, unitPrice: 31.60 }],
        activity: [{ title: 'Invoice generated', date: '2024-11-17 10:00', actor: 'System' }]
    },
    {
        id: 'ORD-2024-002',
        date: '08.11.2024',
        vendor: 'CleanPro Ltd',
        status: 'Delivered', // Completed
        amount: '£842.00',
        items: [{ name: 'Hand Sanitizer', quantity: 10, unitPrice: 84.20 }],
        activity: [{ title: 'Delivered', date: '2024-11-10 14:00', actor: 'Vendor' }]
    }
];

export default function OrderPage() {
    const [activeTab, setActiveTab] = useState('ongoing');

    const getStatusCategory = (status: string) => {
        if (['Awaiting Response', 'Order Placed'].includes(status)) return 'ongoing';
        if (['Dispatched', 'Shipped', 'Invoice Generated', 'Payment Sent'].includes(status)) return 'inProgress';
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
