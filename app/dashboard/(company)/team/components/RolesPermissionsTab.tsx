'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const predefinedRoles = [
    {
        name: 'Admin (Owner)',
        description: 'Full catalogue and team control',
        sections: [
            {
                title: 'Orders & Deliveries',
                permissions: [
                    { name: 'Create', enabled: true },
                    { name: 'Approve', enabled: true },
                    { name: 'Edit', enabled: true },
                    { name: 'Cancel', enabled: true },
                ],
            },
            {
                title: 'Product Catalogue',
                permissions: [
                    { name: 'Add', enabled: true },
                    { name: 'View', enabled: true },
                    { name: 'Edit', enabled: true },
                ],
            },
            {
                title: 'Vendors & Clients',
                permissions: [
                    { name: 'Assign', enabled: true },
                    { name: 'Edit', enabled: true },
                    { name: 'View', enabled: true },
                ],
            },
            {
                title: 'Analytics & Reports',
                permissions: [
                    { name: 'View', enabled: true },
                    { name: 'Export', enabled: true },
                ],
            },
            {
                title: 'Promotions & Loyalty',
                permissions: [
                    { name: 'Manage', enabled: true },
                    { name: 'View', enabled: true },
                ],
            },
            {
                title: 'Settings & Team',
                permissions: [
                    { name: 'Edit Team', enabled: true },
                    { name: 'Invite Users', enabled: true },
                ],
            },
        ],
    },
    {
        name: 'Sales Manager',
        description: 'Manage clients + pricing + promotions',
        sections: [
            {
                title: 'Orders & Deliveries',
                permissions: [
                    { name: 'Create', enabled: true },
                    { name: 'Approve', enabled: true },
                    { name: 'Edit', enabled: false },
                    { name: 'Cancel', enabled: false },
                ],
            },
            {
                title: 'Product Catalogue',
                permissions: [
                    { name: 'Add', enabled: false },
                    { name: 'View', enabled: true },
                    { name: 'Edit', enabled: true },
                ],
            },
            {
                title: 'Vendors & Clients',
                permissions: [
                    { name: 'Assign', enabled: true },
                    { name: 'Edit', enabled: true },
                    { name: 'View', enabled: true },
                ],
            },
            {
                title: 'Analytics & Reports',
                permissions: [
                    { name: 'View', enabled: true },
                    { name: 'Export', enabled: true },
                ],
            },
            {
                title: 'Promotions & Loyalty',
                permissions: [
                    { name: 'Manage', enabled: true },
                    { name: 'View', enabled: true },
                ],
            },
        ],
    },
    {
        name: 'Sales Representative',
        description: 'Handle assigned clients and orders',
        sections: [
            {
                title: 'Orders & Deliveries',
                permissions: [
                    { name: 'Create', enabled: true },
                    { name: 'View', enabled: true },
                ],
            },
            {
                title: 'Product Catalogue',
                permissions: [
                    { name: 'View', enabled: true },
                ],
            },
            {
                title: 'Vendors & Clients',
                permissions: [
                    { name: 'View', enabled: true },
                ],
            },
        ],
    },
    {
        name: 'Logistics Staff',
        description: 'Update delivery and stock statuses',
        sections: [
            {
                title: 'Orders & Deliveries',
                permissions: [
                    { name: 'Update Status', enabled: true },
                    { name: 'View', enabled: true },
                ],
            },
            {
                title: 'Stock Management',
                permissions: [
                    { name: 'Update Levels', enabled: true },
                    { name: 'View Reports', enabled: true },
                ],
            },
        ],
    },
    {
        name: 'Viewer',
        description: 'View analytics and orders only',
        sections: [
            {
                title: 'Orders & Deliveries',
                permissions: [
                    { name: 'View', enabled: true },
                ],
            },
            {
                title: 'Product Catalogue',
                permissions: [
                    { name: 'View', enabled: true },
                ],
            },
            {
                title: 'Analytics & Reports',
                permissions: [
                    { name: 'View', enabled: true },
                    { name: 'Export', enabled: true },
                ],
            },
        ],
    },
];

export default function RolesPermissionsTab({ roles }: any) {
    const [expandedRole, setExpandedRole] = useState<string | null>(null);

    return (
        <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Predefined Roles</h2>

            <div className="space-y-4">
                {predefinedRoles.map((role) => (
                    <div
                        key={role.name}
                        className="bg-white border border-slate-200 rounded-lg overflow-hidden"
                    >
                        <button
                            onClick={() => setExpandedRole(expandedRole === role.name ? null : role.name)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                            <div className="text-left">
                                <h3 className="font-semibold text-slate-900">{role.name}</h3>
                                <p className="text-sm text-slate-600 mt-1">{role.description}</p>
                            </div>
                            {expandedRole === role.name ? (
                                <ChevronUp className="w-5 h-5 text-slate-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                        </button>

                        {expandedRole === role.name && (
                            <div className="px-6 py-4 bg-white border-t border-slate-200">
                                <div className="space-y-4">
                                    {role.sections.map((section, idx) => (
                                        <div key={idx}>
                                            <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                                {section.title}
                                            </h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                {section.permissions.map((perm, permIdx) => (
                                                    <div
                                                        key={permIdx}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <span className="text-sm text-slate-700">
                                                            {perm.name}
                                                        </span>
                                                        <div className={`w-11 h-6 rounded-full ${perm.enabled ? 'bg-brand' : 'bg-slate-200'} relative`}>
                                                            <div className={`absolute top-[2px] ${perm.enabled ? 'right-[2px]' : 'left-[2px]'} w-5 h-5 bg-white rounded-full transition-all`}></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
