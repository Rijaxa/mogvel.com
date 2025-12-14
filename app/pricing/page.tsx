'use client';

import { CheckSquare } from 'lucide-react';
import Pricing from '../components/Pricing';
import PricingHeader from './components/PricingHeader';
import PricingCTA from './components/PricingCTA';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <PricingHeader />

            <main className="flex-1">
                {/* Removed py-24 from Pricing component in our mind, but it has it. We can wrap it or let it be. 
              The screenshot shows title "Choose the plan..." which is in Pricing component. 
          */}
                <Pricing />

                {/* Trust Indicators Section */}
                <div className="bg-white py-16">
                    <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center">
                                <CheckSquare className="w-6 h-6 text-brand" strokeWidth={2.5} />
                            </div>
                            <h3 className="font-bold text-slate-900">14-day free trial</h3>
                            <p className="text-sm text-slate-500 max-w-xs">
                                Try Starter or Growth plans with no commitment
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center">
                                <CheckSquare className="w-6 h-6 text-brand" strokeWidth={2.5} />
                            </div>
                            <h3 className="font-bold text-slate-900">No credit card required</h3>
                            <p className="text-sm text-slate-500 max-w-xs">
                                Start your trial without payment details
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center">
                                <CheckSquare className="w-6 h-6 text-brand" strokeWidth={2.5} />
                            </div>
                            <h3 className="font-bold text-slate-900">Vendors join free</h3>
                            <p className="text-sm text-slate-500 max-w-xs">
                                Vendors pay only 1% transaction fee
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <PricingCTA />
        </div>
    );
}
