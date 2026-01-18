'use client';

import VendorStats from '../components/vendor/VendorStats';
import QuickActions from '../components/vendor/QuickActions';
import VendorOrders from '../components/vendor/VendorOrders';
import TopProducts from '../components/vendor/TopProducts';

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



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Stats + Orders) */}
                <div className="lg:col-span-2 space-y-8">
                    <VendorStats />
                    <VendorOrders />
                </div>

                {/* Right Column (Separate Cards) */}
                <div className="lg:col-span-1 space-y-6">
                    <QuickActions />
                    <TopProducts />
                </div>
            </div>
        </div>
    );
}
