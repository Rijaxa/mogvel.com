'use client';

import { X, Calendar } from 'lucide-react';
import { useState } from 'react';

interface CreateRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export default function CreateRequestModal({ isOpen, onClose, onSubmit }: CreateRequestModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        quantity: '',
        dueDate: '',
        description: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            quantity: Number(formData.quantity)
        });
        setFormData({ title: '', quantity: '', dueDate: '', description: '' }); // Reset
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">Create New RFQ</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-900 mb-1.5">
                            Item / Service *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Industrial Air Filters"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-slate-400"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-900 mb-1.5">
                            Quantity *
                        </label>
                        <input
                            type="number"
                            required
                            placeholder="e.g., 50"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-slate-400"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-900 mb-1.5">
                            Due Date *
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-slate-600"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                            {/* Custom icon positioning if needed, native date picker has its own */}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-900 mb-1.5">
                            Description
                        </label>
                        <textarea
                            placeholder="Additional requirements or specifications..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-slate-400 resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand/90 transition-colors shadow-sm"
                        >
                            Create RFQ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
