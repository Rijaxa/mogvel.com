'use client';

import { useState } from 'react';
import OrderCard from '../../components/orders/OrderCard';
import OrderTabs from '../../components/orders/OrderTabs';

const orders = [
    {
        id: 'ORD-2024-007',
        date: '16.11.2024',
        vendor: 'OfficeMax Direct',
        status: 'Vendor Response', // Ongoing
        amount: '₾459.50',
        items: [
            { name: 'Office Paper A4 (500 sheets)', quantity: 20, unitPrice: 12.99, image: '/products/paper.png' },
            { name: 'Ballpoint Pens (Box of 50)', quantity: 15, unitPrice: 8.50 },
            { name: 'Stapler Heavy Duty', quantity: 8, unitPrice: 15.99 },
        ],
        activity: [
            { title: 'Order submitted successfully', date: '2024-11-16 09:30', actor: 'System' }
        ]
    },
    {
        id: 'ORD-2024-009',
        date: '14.11.2024',
        vendor: 'OfficeMax Direct',
        status: 'Proof Uploaded',
        amount: '₾5,678.90',
        items: [
            { name: 'Cleaning Wipes (Tub)', quantity: 150, unitPrice: 12.50, image: '/products/wipes.png' }
        ],
        activity: [
            {
                title: 'Payment marked as sent by Acme Corp',
                date: '2024-11-14 15:30',
                actor: 'Company',
                file: { name: 'payment-proof-ORD-2024-009.pdf', url: '#' }
            },
            {
                title: 'Invoice uploaded by OfficeMax Direct – ₾5,678.90 (PDF available)',
                date: '2024-11-14 14:30',
                actor: 'Vendor',
                file: { name: 'invoice-VO-2024-009.pdf', url: '#' }
            },
            { title: 'Order accepted by OfficeMax Direct', date: '2024-11-14 10:15', actor: 'Vendor' },
            { title: 'Order submitted successfully', date: '2024-11-14 09:00', actor: 'System' }
        ]
    },
    {
        id: 'ORD-2024-012',
        date: '17.11.2024',
        vendor: 'SpeedyOffice',
        status: 'Vendor Rejected',
        amount: '₾120.00',
        items: [
            { name: 'Printer Ink (Black)', quantity: 4, unitPrice: 30.00 }
        ],
        activity: [
            { title: 'Order rejected by Vendor', date: '2024-11-17 10:00', actor: 'Vendor' },
            { title: 'Order submitted successfully', date: '2024-11-17 09:30', actor: 'System' }
        ]
    },
    {
        id: 'ORD-2024-010',
        date: '16.11.2024',
        vendor: 'SafetyFirst Co',
        status: 'Invoice Generated', // Ongoing/In Progress
        amount: '₾825.00',
        items: [
            { name: 'Disposable Gloves (Box)', quantity: 55, unitPrice: 15.00, image: '/products/gloves.png' }
        ],
        activity: [
            {
                title: 'Invoice uploaded by SafetyFirst Co – ₾825.00 (PDF available)',
                date: '2024-11-16 12:00',
                actor: 'Vendor',
                file: { name: 'invoice-ORD-2024-010.pdf', url: '#' }
            },
            { title: 'Vendor accepted the order', date: '2024-11-16 10:30', actor: 'Vendor' },
            { title: 'Order submitted successfully', date: '2024-11-16 09:00', actor: 'System' }
        ]
    },
    {
        id: 'ORD-2024-005',
        date: '12.11.2024',
        vendor: 'TechSupply Hub',
        status: 'Shipped', // In Progress
        amount: '₾1125.00',
        paymentProofUrl: 'example.pdf',
        items: [
            { name: 'Wireless Mouse', quantity: 50, unitPrice: 22.50 }
        ],
        activity: [
            { title: 'Order shipped by Vendor', date: '2024-11-13 09:00', actor: 'Vendor' },
            { title: 'Payment verified by Vendor', date: '2024-11-12 14:30', actor: 'Vendor' },
            { title: 'Proof uploaded', date: '2024-11-12 12:00', actor: 'Company' },
            { title: 'Invoice generated', date: '2024-11-12 10:00', actor: 'Vendor' }
        ]
    },
    {
        id: 'ORD-2024-001',
        date: '10.11.2024',
        vendor: 'OfficeMax Direct',
        status: 'Delivered', // Completed
        amount: '₾1249.50',
        paymentProofUrl: 'example.pdf',
        items: [
            { name: 'Office Paper A4 (500 sheets)', quantity: 50, unitPrice: 12.99, image: '/products/paper.png' },
            { name: 'Ballpoint Pens (Box of 50)', quantity: 10, unitPrice: 8.50 },
        ],
        activity: [
            { title: 'Order delivered successfully', date: '2024-11-15 16:00', actor: 'Vendor' },
            { title: 'Payment verified', date: '2024-11-12 10:00', actor: 'Vendor' },
        ]
    },
    {
        id: 'ORD-2024-009',
        date: '17.11.2024',
        vendor: 'CleanPro Ltd',
        status: 'Payment Sent', // In Progress
        amount: '₾632.00',
        items: [{ name: 'Trash Bags', quantity: 20, unitPrice: 31.60, image: '/products/bags.png' }],
        activity: [{ title: 'Payment marked as sent', date: '2024-11-17 11:00', actor: 'Company' }, { title: 'Invoice generated', date: '2024-11-17 10:00', actor: 'System' }]
    },
    {
        id: 'ORD-2024-011',
        date: '18.11.2024',
        vendor: 'HygieneCo',
        status: 'Proof Uploaded', // In Progress
        amount: '₾250.00',
        items: [{ name: 'Cleaning Wipes', quantity: 20, unitPrice: 12.50, image: '/products/wipes.png' }],
        activity: [{ title: 'Proof uploaded', date: '2024-11-18 13:00', actor: 'Company' }]
    },
    {
        id: 'ORD-2024-002',
        date: '08.11.2024',
        vendor: 'CleanPro Ltd',
        status: 'Delivered', // Completed
        amount: '₾842.00',
        items: [{ name: 'Hand Sanitizer', quantity: 10, unitPrice: 84.20, image: '/products/sanitizer.png' }],
        activity: [{ title: 'Delivered', date: '2024-11-10 14:00', actor: 'Vendor' }]
    },
    {
        id: 'ORD-2024-001',
        date: '01.11.2024',
        vendor: 'TechSupply Hub',
        status: 'Delivered',
        amount: '₾250.00',
        items: [
            { name: 'Ergonomic Keyboard', quantity: 5, unitPrice: 50.00 }
        ],
        activity: [
            { title: 'Order delivered and confirmed', date: '2024-11-05 10:00', actor: 'System' },
            { title: 'Order shipped by Vendor', date: '2024-11-03 09:00', actor: 'Vendor' },
            { title: 'Payment verified by Vendor', date: '2024-11-02 14:30', actor: 'Vendor' },
            { title: 'Order accepted by Vendor', date: '2024-11-01 10:15', actor: 'Vendor' },
            { title: 'Order submitted successfully', date: '2024-11-01 09:00', actor: 'System' }
        ]
    }
];

export default function OrderPage() {
    const [activeTab, setActiveTab] = useState('ongoing');

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
