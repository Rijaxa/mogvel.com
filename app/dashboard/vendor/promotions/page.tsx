'use client';

import { useState } from 'react';
import { Plus, Calendar, MessageCircle } from 'lucide-react';
import PromotionCard from '@/app/dashboard/components/vendor/promotions/PromotionCard';
import CreatePromotionModal from '@/app/dashboard/components/vendor/promotions/CreatePromotionModal';
import PromotionAnalyticsModal from '@/app/dashboard/components/vendor/promotions/PromotionAnalyticsModal';

export default function PromotionsPage() {
    const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'completed'>('active');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

    return (
        <div className="max-w-7xl mx-auto pb-20 relative">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Promotions & Loyalty</h1>
                    <p className="text-slate-500">Create and manage promotional campaigns</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-brand/90 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create Promotion
                </button>
            </div>

            {/* Usage of a stylized tab container similar to screenshot */}
            <div className="flex bg-white rounded-xl p-1 mb-8 shadow-sm border border-slate-100 w-full">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Active Promotions
                    <span className={`px-2 py-0.5 rounded text-[10px] ${activeTab === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100'}`}>1</span>
                </button>
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'upcoming' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Upcoming Promotions
                    <span className={`px-2 py-0.5 rounded text-[10px] ${activeTab === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100'}`}>0</span>
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'completed' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Completed Promotions
                    <span className={`px-2 py-0.5 rounded text-[10px] ${activeTab === 'completed' ? 'bg-slate-200 text-slate-700' : 'bg-slate-100'}`}>2</span>
                </button>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'active' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <PromotionCard
                            id="p1"
                            title="Bulk Order Discount"
                            status="Active"
                            discount="10% Off"
                            scope="All Products"
                            dates="20/11/2025 – 31/12/2025"
                            onEdit={() => setIsEditModalOpen(true)}
                        />
                    </div>
                )}

                {activeTab === 'upcoming' && (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">No Upcoming Promotions</h3>
                        <p className="text-slate-500">Schedule promotions for future dates</p>
                    </div>
                )}

                {activeTab === 'completed' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <PromotionCard
                            id="p2"
                            title="Summer Sale 2025"
                            status="Completed"
                            discount="15% Off"
                            scope="2 Products"
                            dates="01/07/2025 – 31/07/2025"
                            onViewAnalytics={() => setIsAnalyticsModalOpen(true)}
                        />
                        <PromotionCard
                            id="p3"
                            title="Spring Clearance"
                            status="Completed"
                            discount="20% Off"
                            scope="2 Products"
                            dates="01/03/2025 – 31/03/2025"
                            onViewAnalytics={() => setIsAnalyticsModalOpen(true)}
                        />
                    </div>
                )}
            </div>

            <CreatePromotionModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                mode="create"
            />

            <CreatePromotionModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
            />

            <PromotionAnalyticsModal
                isOpen={isAnalyticsModalOpen}
                onClose={() => setIsAnalyticsModalOpen(false)}
            />

            {/* Floating Chat Button */}
            <div className="fixed bottom-8 right-8 z-40">
                <button className="bg-[#005f73] text-white p-4 rounded-full shadow-lg hover:bg-[#0a9396] transition-colors">
                    <MessageCircle className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
