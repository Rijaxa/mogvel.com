import OrderTabs from '../components/orders/OrderTabs';
import OrderCard from '../components/orders/OrderCard';

const orders = [
    {
        id: 'ORD-2024-007',
        date: '16.11.2024',
        vendor: 'OfficeMax Direct',
        status: 'Awaiting Response',
        amount: '£459.50',
    },
    {
        id: 'ORD-2024-008',
        date: '15.11.2024',
        vendor: 'CleanPro Ltd',
        status: 'Invoice Generated',
        amount: '£632.00',
    },
    {
        id: 'ORD-2024-009',
        date: '14.11.2024',
        vendor: 'SafetyFirst Co',
        status: 'Payment Sent',
        amount: '£825.00',
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
