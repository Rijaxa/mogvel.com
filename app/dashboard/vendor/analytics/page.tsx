'use client';

import { useState } from 'react';
import AnalyticsHeader from '@/app/dashboard/components/vendor/analytics/AnalyticsHeader';
import AnalyticsKPIs from '@/app/dashboard/components/vendor/analytics/AnalyticsKPIs';
import SalesCharts from '@/app/dashboard/components/vendor/analytics/SalesCharts';
import AnalyticsSections from '@/app/dashboard/components/vendor/analytics/AnalyticsSections';
import AnalyticsModals from '@/app/dashboard/components/vendor/analytics/AnalyticsModals';
import { MessageCircle } from 'lucide-react';

export default function VendorAnalyticsPage() {
    const [modalType, setModalType] = useState<string | null>(null);

    return (
        <div className="max-w-7xl mx-auto pb-20 relative">
            <AnalyticsHeader />

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
                <AnalyticsKPIs />
                <SalesCharts onOpenModal={setModalType} />
                <AnalyticsSections onOpenModal={setModalType} />
            </div>

            <AnalyticsModals type={modalType} onClose={() => setModalType(null)} />

            {/* Floating Chat Button */}
            <div className="fixed bottom-8 right-8 z-40">
                <button className="bg-[#005f73] text-white p-4 rounded-full shadow-lg hover:bg-[#0a9396] transition-colors">
                    <MessageCircle className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
