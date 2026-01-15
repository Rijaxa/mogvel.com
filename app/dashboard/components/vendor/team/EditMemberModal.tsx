'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
// import { updateMember } from '@/actions/vendor/team'; // Assuming this action exists or will be created

export default function EditMemberModal({
    isOpen,
    onClose,
    member
}: {
    isOpen: boolean;
    onClose: () => void;
    member: any;
}) {
    const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState<string | null>(null);

    // Initial form state based on member prop
    // In a real app, you might want to use useEffect to update state when member changes

    if (!isOpen || !member) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        // setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // const formData = new FormData(e.currentTarget);
        // const result = await updateMember(member.id, formData);

        // if (result?.error) {
        //     setError(result.error);
        // } else {
        onClose();
        // }
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Edit Member</h3>
                        <p className="text-slate-500 text-sm">Update member information and permissions</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">
                                Full Name
                            </label>
                            <input
                                name="name"
                                type="text"
                                defaultValue={member.user.name}
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                defaultValue={member.user.email}
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Role
                        </label>
                        <div className="relative">
                            <select
                                name="role"
                                defaultValue={member.role.name}
                                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-brand/20 pr-10"
                            >
                                <option value="Viewer">Viewer</option>
                                <option value="Admin">Admin (Owner)</option>
                                <option value="Sales Manager">Sales Manager</option>
                                <option value="Sales Representative">Sales Representative</option>
                                <option value="Logistics Staff">Logistics Staff</option>
                            </select>
                            <div className="absolute right-4 top-3 text-slate-400 pointer-events-none">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Assign Access
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {['Acme Corp', 'TechStart', 'Global Industries', 'All Clients'].map((client) => (
                                <label key={client} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-brand/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand"
                                        defaultChecked={member.assignedAccess?.includes(client) || Math.random() > 0.5} // Mock checked state
                                    />
                                    <span className="text-sm font-medium text-slate-700">{client}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Permissions
                        </label>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                            {[
                                'View Orders', 'Create Orders',
                                'Manage Clients', 'Update Deliveries',
                                'View Analytics', 'Manage Promotions'
                            ].map((perm) => (
                                <div key={perm} className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">{perm}</span>
                                    {/* Mock toggle state for visual */}
                                    <div className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${Math.random() > 0.5 ? 'bg-brand' : 'bg-slate-200'}`}>
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${Math.random() > 0.5 ? 'left-5' : 'left-1' /* This random logic is just for visual mock, in real app use state */}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-brand hover:bg-brand/90 rounded-xl transition-colors shadow-lg shadow-brand/20"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
