'use client';

import CatalogueHeader from '@/app/dashboard/components/vendor/catalogue/CatalogueHeader';
import VendorProductCard from '@/app/dashboard/components/vendor/catalogue/VendorProductCard';
import { MessageCircle } from 'lucide-react';

export default function VendorCataloguePage() {
    return (
        <div className="max-w-7xl mx-auto pb-20 relative">
            <CatalogueHeader />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                <VendorProductCard
                    title="Office Paper A4 Premium"
                    producer="PaperCo Industries"
                    description="A4 Paper 80gsm White Premium"
                    quantity="Quantity: Box of 500 sheets"
                    price="₾12.99"
                    status="Active"
                    stockCount="85 units"
                    stockLevel={85}
                />
                <VendorProductCard
                    title="Hand Sanitizer 500ml"
                    producer="HygieneFirst Ltd"
                    description="Hand Sanitizer Gel 70% Alcohol"
                    quantity="Volume: 500ml"
                    price="₾7.90"
                    status="Low Stock"
                    lowStockWarning={false} // actually just low stock
                    stockCount="25 units"
                    stockLevel={25}
                    deliveryTime="1 day"
                />
                <VendorProductCard
                    title="Industrial Gloves Box"
                    producer="SafetyPro Manufacturing"
                    description="Nitrile Gloves Powder-Free"
                    quantity="Quantity: Box of 100"
                    price="₾16.50"
                    status="Active"
                    lowStockWarning={true} // mimicking the 'Out of Stock' look or critical low
                    stockCount="12 units"
                    stockLevel={12}
                    deliveryTime="3 days"
                />

                {/* Second Row Example */}
                <VendorProductCard
                    title="Multi-Purpose Cleaner 5L"
                    producer="CleanMaster Solutions"
                    description="All-Surface Cleaner Concentrate"
                    quantity="Volume: 5L"
                    price="₾24.50"
                    status="Active"
                    stockCount="65 units"
                    stockLevel={65}
                />
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-8 right-8">
                <button className="bg-[#005f73] text-white p-4 rounded-full shadow-lg hover:bg-[#0a9396] transition-colors">
                    <MessageCircle className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
