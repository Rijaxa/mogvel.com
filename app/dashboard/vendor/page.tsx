'use client';

import VendorStats from '../components/vendor/VendorStats';
import QuickActions from '../components/vendor/QuickActions';
import VendorOrders from '../components/vendor/VendorOrders';
import TopProducts from '../components/vendor/TopProducts';
import InsightsBanner from '../components/vendor/InsightsBanner';

export default function VendorDashboard() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    Vendor Dashboard
                    <span className="px-3 py-1 bg-[#FCD34D] text-[#112338] text-xs font-bold uppercase rounded-full">
                        Verified
                    </span>
                </h1>
                <p className="text-slate-500">Your business control center</p>
            </div>

            <VendorStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-1">
                    <QuickActions />
                </div>
                {/* 
                Looking at screenshot:
                - Col 1: Quick Actions (Top Right in screenshot? No, it's 2 cols. 
                Wait, screenshot layout is:
                Row 1: Stats
                Row 2: 
                   Left: Quick Actions (Wide? No looks like 1/3) -> Actually "Quick Actions" is top right in screenshot.
                   
                Let's re-examine screenshot:
                - Top Row: 4 Stats Cards
                - Row 2:
                   - Left Column (2/3 width): Recent Orders
                   - Right Column (1/3 width): 
                       - Quick Actions (Top)
                       - Top Products (Bottom)
                       
                Wait, looking at the crop:
                "Quick Actions" is ABOVE "Top Products" on the right side.
                "Recent Orders" is on the LEFT side.
            */}

                {/* Layout Attempt: */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Orders) */}
                <div className="lg:col-span-2">
                    <VendorOrders />
                </div>

                {/* Right Column (Actions + Products) */}
                <div className="space-y-6">
                    <QuickActions />
                    <TopProducts />
                </div>
            </div>

            <InsightsBanner />
        </div>
    );
}
