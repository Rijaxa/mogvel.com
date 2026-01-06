'use client';

import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Pricing() {

    const features = [
        "Unified Vendor Space: Access all suppliers and detailed catalogues in one centralized area.",
        "Smart Ordering & Tracking: Streamlined product selection, online ordering, and real-time delivery tracking.",
        "Inventory & Automated Reordering: Real-time stock monitoring with automated low-stock alerts and reorder flows.",
        "Smart Promotions: Receive instant notifications about discounts and promotions by vendors on specific products.",
        "Full Procurement Dashboard: One-view visibility into total spend, vendor activity, and inventory health.",
        "Full scale analytics: Total spent, cost efficiency, delivery speed, monthly spending, and cost saving opportunities.",
        "Sourcing & RFQ Management: Tooling for managing sourcing requests and exporting detailed RFQ reports.",
        "Governance & Compliance Hub: Centralized management for all procurement contracts and compliance documents.",
        "Multi-Branch & Team Support: Multi-location management with internal user roles and team controls.",
        "Advanced Search & Notifications: Instant search across items/invoices with integrated in-app alerts."
    ];

    return (
        <section id="pricing" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-brand text-sm font-bold mb-6">
                        <Sparkles className="w-4 h-4" />
                        Simple, unified pricing
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Everything you need in one plan
                    </h2>
                    <p className="text-slate-500 mb-8">
                        Get access to the full Mogvel procurement platform for a flat monthly rate.
                    </p>
                </div>

                {/* Single Plan Card */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl relative overflow-hidden">
                        {/* Decorative background accent */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-50 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2 opacity-50" />

                        <div className="flex flex-col md:flex-row gap-12 relative z-10">
                            {/* Left Side: Pricing & CTA */}
                            <div className="flex-1 md:max-w-sm flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-2xl mb-2">Pro License</h3>
                                    <p className="text-slate-500 mb-6 font-medium">Full access to all platform features</p>

                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-5xl font-bold text-slate-900">299</span>
                                        <span className="text-2xl font-bold text-slate-900">GEL</span>
                                        <span className="text-slate-500 font-medium ml-2">/month</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mb-8 font-medium">
                                        Billed monthly, cancel anytime.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <button className="w-full py-4 rounded-xl bg-brand text-white text-lg font-bold hover:bg-brand/90 shadow-lg shadow-brand/20 transition-all hover:-translate-y-1">
                                        Start Free Trial
                                    </button>
                                    <p className="text-xs text-center text-slate-400 font-medium">
                                        No credit card required for 14-day trial
                                    </p>
                                </div>
                            </div>

                            {/* Divider on mobile / Vertical line on desktop */}
                            <div className="h-px w-full md:w-px md:h-auto bg-slate-100" />

                            {/* Right Side: Features List */}
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Full Platform Access:</h4>
                                <ul className="space-y-5">
                                    {features.map((feature, idx) => {
                                        const [title, description] = feature.split(': ');
                                        return (
                                            <li key={idx} className="flex items-start gap-3 text-sm">
                                                <div className="w-5 h-5 rounded-full bg-cyan-50 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Check className="w-3 h-3 text-brand" strokeWidth={3} />
                                                </div>
                                                <div className="leading-snug">
                                                    <span className="font-bold text-slate-900">{title}</span>
                                                    {description && <span className="text-slate-500">: {description}</span>}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
