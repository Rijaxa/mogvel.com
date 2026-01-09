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


            </main>

            <PricingCTA />
        </div>
    );
}
