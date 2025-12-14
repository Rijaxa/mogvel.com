'use client';

import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingPlan {
    name: string;
    price: { monthly: number; annual: number };
    description: string;
    features: string[];
    cta: string;
    popular?: boolean;
}

const plans: PricingPlan[] = [
    {
        name: 'Starter',
        price: { monthly: 80, annual: 816 },
        description: 'Small cafés, offices',
        features: [
            'Manual orders',
            'Basic analytics',
            '1 branch',
            'Email support',
            'Standard delivery tracking',
            'Mobile app access'
        ],
        cta: 'Start Free Trial'
    },
    {
        name: 'Growth',
        price: { monthly: 180, annual: 1836 },
        description: 'Restaurants, hotels',
        features: [
            'Smart auto-reorder',
            'Advanced analytics',
            '3 branches',
            'Price alerts',
            'Delivery tracking',
            'Priority email support',
            'Vendor comparison tools',
            'Mobile app access'
        ],
        cta: 'Start Free Trial',
        popular: true
    },
    {
        name: 'Business',
        price: { monthly: 380, annual: 3876 },
        description: 'Multi-branch companies',
        features: [
            'Everything in Growth, plus:',
            'Demand forecasting',
            'Contract management',
            'RFQ/RFP system',
            'Unlimited branches',
            'Vendor comparison',
            'Phone support',
            'Custom reports',
            'API access (beta)'
        ],
        cta: 'Start Free Trial'
    },
    {
        name: 'Enterprise',
        price: { monthly: 650, annual: 6630 },
        description: 'Chains or factories',
        features: [
            'Everything in Business, plus:',
            'Unlimited branches',
            'ERP integration',
            'Route optimization',
            'Dedicated account manager',
            '24/7 phone support',
            'Custom integrations',
            'Advanced security',
            'SLA guarantee'
        ],
        cta: 'Contact Sales'
    }
];

export default function Pricing() {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <section id="pricing" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-brand text-sm font-bold mb-6">
                        <Sparkles className="w-4 h-4" />
                        Simple, transparent pricing
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Choose the plan that fits your business
                    </h2>
                    <p className="text-slate-500 mb-8">
                        All plans include core features: analytics, benchmarking, auto-reorder, and payments. Start with a 14-day free trial.
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={cn("text-sm font-bold", !isAnnual ? "text-slate-900" : "text-slate-500")}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="relative w-14 h-8 bg-brand rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand/20"
                        >
                            <div className={cn(
                                "absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-200",
                                isAnnual ? "translate-x-6" : "translate-x-0"
                            )} />
                        </button>
                        <span className={cn("text-sm font-bold flex items-center gap-2", isAnnual ? "text-slate-900" : "text-slate-500")}>
                            Annual
                            <span className="bg-yellow-400 text-yellow-900 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold">
                                Save 15%
                            </span>
                        </span>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={cn(
                                "relative bg-white rounded-2xl p-6 border flex flex-col transition-all hover:shadow-xl hover:-translate-y-1",
                                plan.popular ? "border-brand shadow-md ring-1 ring-brand/20" : "border-slate-200"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="font-bold text-slate-900 text-lg mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-3xl font-bold text-slate-900">
                                        €{isAnnual ? plan.price.annual : plan.price.monthly}
                                    </span>
                                    <span className="text-sm text-slate-500 font-medium">
                                        /{isAnnual ? 'year' : 'month'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="flex-1 space-y-3 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                                        <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={cn(
                                "w-full py-3 rounded-xl text-sm font-bold transition-colors",
                                plan.popular
                                    ? "bg-brand text-white hover:bg-brand/90 shadow-sm"
                                    : "bg-slate-900 text-white hover:bg-slate-800"
                            )}>
                                {plan.cta}
                            </button>
                            <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">
                                + 1% transaction fee
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
