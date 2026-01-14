import { Megaphone, Tag, TrendingUp, Calendar } from 'lucide-react';

export default function ExplorePromotionsPage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Explore Promotions</h1>
                <p className="text-slate-600">Discover exclusive discounts and loyalty programs from our verified vendors</p>
            </div>

            {/* Placeholder Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sample Promotion Card 1 */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <Tag className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                            Active
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        15% Off Office Supplies
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                        Get 15% discount on all office supplies for orders above $500
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>Valid until: Dec 31, 2026</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2">Vendor</p>
                        <p className="font-medium text-slate-900">OfficeMax Direct</p>
                    </div>
                </div>

                {/* Sample Promotion Card 2 */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                            Active
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Loyalty Rewards Program
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                        Earn 2% cashback on all purchases. Redeem points for future orders
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <Megaphone className="w-4 h-4" />
                        <span>Ongoing Program</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2">Vendor</p>
                        <p className="font-medium text-slate-900">Supply Chain Pro</p>
                    </div>
                </div>

                {/* Sample Promotion Card 3 */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-orange-50 rounded-lg">
                            <Tag className="w-6 h-6 text-orange-600" />
                        </div>
                        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">
                            Limited Time
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Bulk Order Discount
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                        Save up to 25% on bulk orders of cleaning supplies
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>Valid until: Jan 31, 2026</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2">Vendor</p>
                        <p className="font-medium text-slate-900">CleanPro Solutions</p>
                    </div>
                </div>
            </div>

            {/* Empty State (can be shown when no promotions) */}
            {/* <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                    <Tag className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Promotions Available</h3>
                <p className="text-slate-600">Check back later for exclusive vendor promotions and loyalty programs</p>
            </div> */}
        </div>
    );
}
