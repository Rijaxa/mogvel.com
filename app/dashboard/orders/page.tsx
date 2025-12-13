import OrderTabs from '../components/orders/OrderTabs';
import OrderCard from '../components/orders/OrderCard';

const orders = [
    {
        id: 'ORD-2024-007',
        date: '16.11.2024',
        vendor: 'OfficeMax Direct',
        status: 'Awaiting Response',
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
        status: 'Dispatched',
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
        status: 'Completed',
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
];

export default function OrderPage() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
                <p className="text-slate-500">Monitor ongoing, in-progress, and completed orders in one place</p>
            </div>

            <OrderTabs />

            <div className="space-y-4">
                {orders.map((order, index) => (
                    <OrderCard key={index} {...order} />
                ))}
            </div>
        </div>
    );
}
