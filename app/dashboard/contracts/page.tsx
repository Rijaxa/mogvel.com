'use client';

import { useState } from 'react';
import ContractStats from '../components/contracts/ContractStats';
import ContractCard from '../components/contracts/ContractCard';
import ContractUploadZone from '../components/contracts/ContractUploadZone';
import { Search, Filter } from 'lucide-react';

const mockContracts = [
    { id: 1, vendor: 'CleanPro Supplies', title: 'Annual Hygiene Supply Agreement', startDate: '2024-01-01', expiryDate: '2024-11-15', status: 'Expiring', value: 12000 },
    { id: 2, vendor: 'OfficeMax Direct', title: 'Office Consumables Contract', startDate: '2023-03-20', expiryDate: '2026-03-20', status: 'Active', value: 45000 },
    { id: 3, vendor: 'TechSupply Hub', title: 'Hardware Maintenance SOW', startDate: '2024-06-01', expiryDate: '2025-06-01', status: 'Active', value: 25000 },
    { id: 4, vendor: 'SafetyFirst Co', title: 'Safety Gear Supply', startDate: '2024-02-01', expiryDate: '2025-02-01', status: 'Active', value: 8500 },
];

export default function ContractsPage() {
    const [filter, setFilter] = useState<'All' | 'Expiring' | 'Active'>('All');

    const filteredContracts = mockContracts.filter(c => {
        if (filter === 'All') return true;
        if (filter === 'Expiring') return c.status === 'Expiring';
        return c.status === 'Active';
    });

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Contracts & Compliance</h1>
                <p className="text-slate-500">Manage procurement contracts and compliance documents</p>
            </div>

            <ContractStats />

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search contracts..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                </div>

                <div className="bg-slate-100 p-1 rounded-xl flex">
                    {(['All', 'Active', 'Expiring'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === tab
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="space-y-4 animate-in fade-in duration-300">
                {filteredContracts.map((contract) => (
                    // @ts-ignore
                    <ContractCard key={contract.id} {...contract} />
                ))}
            </div>

            <ContractUploadZone />
        </div>
    );
}
