'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import RequestCard, { RequestCardProps } from '@/app/dashboard/components/requests/RequestCard';
import CreateRequestModal from '@/app/dashboard/components/requests/CreateRequestModal';

const initialRequests: RequestCardProps[] = [
    { id: 'RFQ-2847', title: 'Industrial Air Filters', status: 'active', quantity: 50, dueDate: '25.3.2025', responseCount: 3 },
    { id: 'RFQ-2846', title: 'Office Furniture Set', status: 'pending', quantity: 12, dueDate: '20.3.2025', responseCount: 1 },
    { id: 'RFQ-2845', title: 'Cleaning Equipment', status: 'completed', quantity: 8, dueDate: '15.3.2025', responseCount: 5 },
];

export default function RequestsPage() {
    const [requests, setRequests] = useState(initialRequests);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleCreate = (data: any) => {
        const newId = `RFQ-${2848 + requests.length}`;
        const newRequest: RequestCardProps = {
            id: newId,
            title: data.title,
            status: 'pending', // Default new to pending
            quantity: data.quantity,
            dueDate: new Date(data.dueDate).toLocaleDateString('en-GB'), // Simple formatting
            responseCount: 0
        };
        setRequests([newRequest, ...requests]);
        setIsModalOpen(false);
    };

    const filteredRequests = requests.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Requests (RFQs / RFPs)</h1>
                    <p className="text-slate-500">Create and manage procurement requests</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Create New RFQ
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-xl">
                <input
                    type="text"
                    placeholder="Search requests..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredRequests.map((req) => (
                    <RequestCard key={req.id} {...req} />
                ))}

                {filteredRequests.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-500 font-bold">No requests found</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <CreateRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreate}
            />
        </div>
    );
}
