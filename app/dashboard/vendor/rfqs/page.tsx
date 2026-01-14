import { MessageSquare, Building2, Calendar, DollarSign, FileText } from 'lucide-react';

export default function ExploreRFQsPage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Explore RFQs</h1>
                <p className="text-slate-600">Browse and respond to Request for Quotations from companies</p>
            </div>

            {/* Placeholder Content */}
            <div className="grid grid-cols-1 gap-6">
                {/* Sample RFQ Card 1 */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <MessageSquare className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Office Furniture - Bulk Order
                                </h3>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Building2 className="w-4 h-4" />
                                <span>Acme Corp</span>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                            Open
                        </span>
                    </div>

                    <p className="text-sm text-slate-600 mb-4">
                        Looking for quotes on ergonomic office chairs (50 units) and standing desks (25 units).
                        Delivery required by end of Q1 2026.
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-500">Deadline</p>
                                <p className="font-medium text-slate-900">Jan 25, 2026</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-500">Budget</p>
                                <p className="font-medium text-slate-900">$15,000 - $20,000</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-500">Responses</p>
                                <p className="font-medium text-slate-900">3 quotes</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex gap-3">
                        <button className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors text-sm font-medium">
                            Submit Quote
                        </button>
                        <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                            View Details
                        </button>
                    </div>
                </div>

                {/* Sample RFQ Card 2 */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <MessageSquare className="w-5 h-5 text-purple-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Cleaning Supplies - Monthly Contract
                                </h3>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Building2 className="w-4 h-4" />
                                <span>Tech Innovations Ltd</span>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                            Open
                        </span>
                    </div>

                    <p className="text-sm text-slate-600 mb-4">
                        Seeking vendor for monthly supply of cleaning products for 3 office locations.
                        12-month contract with option to extend.
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-500">Deadline</p>
                                <p className="font-medium text-slate-900">Jan 20, 2026</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-500">Budget</p>
                                <p className="font-medium text-slate-900">$2,000/month</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-500">Responses</p>
                                <p className="font-medium text-slate-900">5 quotes</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex gap-3">
                        <button className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors text-sm font-medium">
                            Submit Quote
                        </button>
                        <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                            View Details
                        </button>
                    </div>
                </div>
            </div>

            {/* Empty State (can be shown when no RFQs) */}
            {/* <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                    <MessageSquare className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No RFQs Available</h3>
                <p className="text-slate-600">Check back later for new Request for Quotations from companies</p>
            </div> */}
        </div>
    );
}
