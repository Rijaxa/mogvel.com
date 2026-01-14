'use client';

import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { addTeamMember } from '@/actions/team';

export default function AddMemberModal({ roles, onClose, onSuccess }: any) {
    console.log('🔍 AddMemberModal received roles:', roles);
    console.log('🔍 Roles count:', roles?.length);
    console.log('🔍 First role:', roles?.[0]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        roleId: roles[0]?.id || '',
        assignedClients: [] as string[],
        permissions: {
            viewOrders: false,
            createOrders: false,
            manageClients: false,
            updateDeliveries: false,
            viewAnalytics: false,
            managePromotions: false,
        },
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Mock clients - in production, fetch from database
    const availableClients = [
        { id: '1', name: 'Acme Corp' },
        { id: '2', name: 'TechStart' },
        { id: '3', name: 'Global Industries' },
    ];

    function toggleClient(clientId: string) {
        setFormData(prev => ({
            ...prev,
            assignedClients: prev.assignedClients.includes(clientId)
                ? prev.assignedClients.filter(id => id !== clientId)
                : [...prev.assignedClients, clientId]
        }));
    }

    function togglePermission(permission: keyof typeof formData.permissions) {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [permission]: !prev.permissions[permission]
            }
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await addTeamMember({
            email: formData.email,
            name: formData.name,
            roleId: formData.roleId,
        });

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            onSuccess();
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900">Add New Member</h2>
                        <p className="text-slate-600 mt-1">Invite a new team member to your organisation</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                                placeholder="Enter full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand bg-slate-50"
                                placeholder="email@company.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-900 mb-2">
                            Role
                        </label>
                        <div className="relative">
                            <select
                                required
                                value={formData.roleId}
                                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand bg-white appearance-none cursor-pointer text-slate-900"
                                style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                            >
                                <option value="" disabled>Select a role</option>
                                {roles.map((role: any) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDown className="w-5 h-5 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-900 mb-3">
                            Assign Access
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {availableClients.map((client) => (
                                <label
                                    key={client.id}
                                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.assignedClients.includes(client.id)}
                                        onChange={() => toggleClient(client.id)}
                                        className="w-4 h-4 text-brand border-slate-300 rounded focus:ring-brand"
                                    />
                                    <span className="text-slate-700">{client.name}</span>
                                </label>
                            ))}
                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-brand border-slate-300 rounded focus:ring-brand"
                                />
                                <span className="text-slate-700">All Clients</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-900 mb-3">
                            Permissions
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-700">View Orders</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.permissions.viewOrders}
                                        onChange={() => togglePermission('viewOrders')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-700">Create Orders</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.permissions.createOrders}
                                        onChange={() => togglePermission('createOrders')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-700">Manage Clients</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.permissions.manageClients}
                                        onChange={() => togglePermission('manageClients')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-700">Update Deliveries</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.permissions.updateDeliveries}
                                        onChange={() => togglePermission('updateDeliveries')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-700">View Analytics</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.permissions.viewAnalytics}
                                        onChange={() => togglePermission('viewAnalytics')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-700">Manage Promotions</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.permissions.managePromotions}
                                        onChange={() => togglePermission('managePromotions')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50 font-medium"
                        >
                            {loading ? 'Sending...' : 'Send Invitation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
