'use client';

import { X, Calendar } from 'lucide-react';
import { useState } from 'react';

interface CreatePromotionModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
}

export default function CreatePromotionModal({ isOpen, onClose, mode }: CreatePromotionModalProps) {
    if (!isOpen) return null;

    // Simple state just for UI
    const [scope, setScope] = useState('all');

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{mode === 'create' ? 'Create Promotion' : 'Edit Promotion'}</h2>
                        <p className="text-slate-500 text-sm">
                            {mode === 'create' ? 'Create and manage promotional campaigns' : 'Update your promotional campaign details'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Promotion Name *</label>
                        <input
                            type="text"
                            defaultValue={mode === 'edit' ? 'Bulk Order Discount' : ''}
                            placeholder="e.g. Summer Sale"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                        />
                    </div>

                    {/* Scope */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Promotion Scope *</label>
                        <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
                            <button
                                onClick={() => setScope('specific')}
                                className={`py-2 rounded-lg text-sm font-bold transition-all ${scope === 'specific' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                            >
                                Specific Products
                            </button>
                            <button
                                onClick={() => setScope('all')}
                                className={`py-2 rounded-lg text-sm font-bold transition-all ${scope === 'all' ? 'bg-brand text-white shadow-sm' : 'text-slate-500'}`}
                            >
                                All Products
                            </button>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Start Date *</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    defaultValue="20.11.2025"
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">End Date *</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    defaultValue="31.12.2025"
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* Discount */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Discount Percentage *</label>
                        <div className="relative">
                            <input
                                type="text"
                                defaultValue="10"
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 transition-colors shadow-lg shadow-brand/20"
                    >
                        {mode === 'create' ? 'Create Promotion' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
