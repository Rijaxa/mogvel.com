'use client';

import { ArrowRight } from 'lucide-react';

export default function PricingCTA() {
    return (
        <section className="py-24 bg-[#112338] text-center px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to streamline your procurement?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
                Join hundreds of companies already using Mogvel. Book a personalized demo or start your<br className="hidden md:block" /> free trial today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
                <button className="flex items-center gap-2 px-6 py-3.5 bg-[#FCD34D] text-[#112338] rounded-xl font-bold hover:bg-[#FBBF24] transition-colors shadow-lg">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                </button>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full sm:w-72 px-5 py-3.5 rounded-xl border border-transparent bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                />
            </div>

            <p className="text-slate-500 text-xs">
                © 2025 Mogvel. All rights reserved.
            </p>
        </section>
    );
}
