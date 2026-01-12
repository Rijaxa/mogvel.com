import { RefreshCw, BarChart3, ShieldCheck, Box, Bell, Zap } from 'lucide-react';

const features = [
    {
        title: 'Smart Auto-Reorder',
        description: 'AI-powered predictions for automatic inventory replenishment',
        icon: RefreshCw,
        color: 'bg-brand/10 text-brand',
    },
    {
        title: 'Analytics Dashboard',
        description: 'Real-time insights into spending, trends, and vendor performance',
        icon: BarChart3,
        color: 'bg-slate-100 text-slate-600',
    },
    {
        title: 'Verified Vendors',
        description: 'Pre-screened, trusted suppliers for reliable procurement',
        icon: ShieldCheck,
        color: 'bg-orange-50 text-orange-400',
    },
    {
        title: 'Delivery Pooling',
        description: 'Optimize routes and reduce costs with shared deliveries',
        icon: Box,
        color: 'bg-green-50 text-green-500',
    },
    {
        title: 'Price Alerts',
        description: 'Instant notifications on price changes and market opportunities',
        icon: Bell,
        color: 'bg-red-50 text-red-400',
    },
    {
        title: 'Payment Automation',
        description: 'Streamlined invoicing and automated payment processing',
        icon: Zap,
        color: 'bg-blue-50 text-blue-400',
    },
];

export default function Features() {
    return (
        <section className="px-6 py-20 mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Everything you need for modern procurement
                </h2>
                <p className="text-slate-600">
                    Powerful features designed to streamline your B2B procurement workflow and drive efficiency
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="p-8 border border-slate-100 rounded-2xl hover:shadow-lg transition-shadow duration-300">
                        <div className={`w - 12 h - 12 rounded - xl ${feature.color} flex items - center justify - center mb - 6`}>
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-3">
                            {feature.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
