'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function RolesPermissions() {
    const roles = [
        {
            title: 'Admin (Owner)',
            description: 'Full catalogue and team control',
            isExpanded: true,
            permissions: {
                'Orders & Deliveries': ['Create', 'Approve', 'Edit', 'Cancel'],
                'Product Catalogue': ['Add', 'View', 'Edit'],
                'Vendors & Clients': ['Assign', 'Edit', 'View'],
                'Analytics & Reports': ['View', 'Export'],
                'Promotions & Loyalty': ['Manage', 'View'],
                'Settings & Team': ['Edit Team', 'Invite Users']
            }
        },
        {
            title: 'Sales Manager',
            description: 'Manage Clients, Pricing, Promotions',
            isExpanded: false
        },
        {
            title: 'Sales Representative',
            description: 'Manage assigned clients/orders',
            isExpanded: false
        },
        {
            title: 'Logistics Staff',
            description: 'Delivery management',
            isExpanded: false
        },
        {
            title: 'Viewer',
            description: 'Analytics only',
            isExpanded: false
        }
    ];

    const [expandedRoles, setExpandedRoles] = useState<string[]>(['Admin (Owner)']);

    const toggleRole = (title: string) => {
        setExpandedRoles(prev =>
            prev.includes(title)
                ? prev.filter(r => r !== title)
                : [...prev, title]
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Predefined Roles</h3>
            </div>
            <div className="divide-y divide-slate-100">
                {roles.map((role) => {
                    const isExpanded = expandedRoles.includes(role.title);

                    return (
                        <div key={role.title} className="p-6">
                            <button
                                onClick={() => toggleRole(role.title)}
                                className="w-full flex items-center justify-between group"
                            >
                                <div className="text-left">
                                    <h4 className="font-bold text-slate-900 group-hover:text-brand transition-colors">{role.title}</h4>
                                    <p className="text-slate-500 text-sm">{role.description}</p>
                                </div>
                                {isExpanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                            </button>

                            {isExpanded && role.permissions && (
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-200">
                                    {Object.entries(role.permissions).map(([category, perms]) => (
                                        <div key={category}>
                                            <h5 className="font-bold text-slate-900 text-sm mb-3">{category}</h5>
                                            <div className="space-y-3">
                                                {(perms as string[]).map((perm) => (
                                                    <div key={perm} className="flex items-center justify-between">
                                                        <span className="text-slate-600 text-sm">{perm}</span>
                                                        <div className="w-9 h-5 bg-brand rounded-full relative cursor-not-allowed opacity-80">
                                                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}


            </div>
        </div>
    );
}
