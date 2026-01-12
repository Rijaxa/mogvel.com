'use client';

import { Search, Box } from 'lucide-react';
import VendorRow from './VendorRow';
import { useEffect, useState } from 'react';

const vendors = [
    { name: 'CleanPro Supplies', isVerified: true, rating: 4.8, stability: 'Stable', stockLevel: 'High Stock', deliverySLA: '99.2%' },
    { name: 'OfficeMax Direct', isVerified: true, rating: 4.5, stability: 'Increasing', stockLevel: 'Medium', deliverySLA: '96.8%' },
    { name: 'HygieneCo', isVerified: true, rating: 4.9, stability: 'Decreasing', stockLevel: 'High Stock', deliverySLA: '98.5%' },
    { name: 'Industrial Supply Co', isVerified: false, rating: 4.3, stability: 'Stable', stockLevel: 'Low Stock', deliverySLA: '94.2%' },
];

export default function VendorView() {
    const [vendors, setVendors] = useState<any[]>([]);

    useEffect(() => {
        import('@/actions/vendors').then(mod => {
            mod.getLinkedVendors().then(setVendors);
        });
    }, []);

    return (
        <div>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-[2]">
                    <input
                        type="text"
                        placeholder="Search vendors by name..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 text-slate-700"
                    />
                    <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                </div>

                <div className="flex-1">
                    <select className="w-full p-2.5 bg-slate-50 border-none rounded-xl text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-brand/20">
                        <option>All Categories</option>
                    </select>
                </div>

                <div className="flex-1">
                    <select className="w-full p-2.5 bg-slate-50 border-none rounded-xl text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-brand/20">
                        <option>Highest Rating</option>
                    </select>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Box className="w-5 h-5 text-brand" />
                        <h3 className="font-bold text-slate-900">Active Vendors</h3>
                    </div>
                    <button className="text-xs font-bold text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50">
                        View All Vendors
                    </button>
                </div>

                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-slate-100 text-xs font-bold text-slate-500 mb-2">
                    <div className="col-span-3">Vendor Name</div>
                    <div className="col-span-1">Rating</div>
                    <div className="col-span-2">Price Stability</div>
                    <div className="col-span-2">Stock Level</div>
                    <div className="col-span-2">Delivery SLA</div>
                    <div className="col-span-2 text-right">Action</div>
                </div>

                <div className="space-y-2">
                    {vendors.length > 0 ? vendors.map((vendor, index) => (
                        // @ts-ignore
                        <VendorRow key={index} {...vendor} />
                    )) : (
                        <div className="py-8 text-center text-slate-500">
                            No verified vendors linked.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
