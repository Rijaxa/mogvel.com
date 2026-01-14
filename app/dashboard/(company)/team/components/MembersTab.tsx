'use client';

import { useState } from 'react';
import { Search, Edit2, Trash2, Filter } from 'lucide-react';
import { updateMemberRole, updateMemberStatus, deleteMember } from '@/actions/team';
import EditMemberModal from './EditMemberModal';

export default function MembersTab({ members, roles, onRefresh }: any) {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [editingMember, setEditingMember] = useState<any>(null);

    const filteredMembers = members.filter((member: any) => {
        const matchesSearch =
            member.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'all' || member.role.name === roleFilter;
        const matchesStatus = statusFilter === 'all' || member.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    async function handleStatusToggle(memberId: string, currentStatus: string) {
        const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
        await updateMemberStatus(memberId, newStatus);
        onRefresh();
    }

    async function handleDelete(memberId: string) {
        if (confirm('Are you sure you want to remove this member?')) {
            await deleteMember(memberId);
            onRefresh();
        }
    }

    function getInitials(name: string) {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    function getRoleBadgeColor(roleName: string) {
        const colors: Record<string, string> = {
            'Admin': 'bg-teal-100 text-teal-700',
            'Owner': 'bg-teal-100 text-teal-700',
            'Sales Manager': 'bg-yellow-100 text-yellow-700',
            'Sales Representative': 'bg-blue-100 text-blue-700',
            'Logistics Staff': 'bg-purple-100 text-purple-700',
            'Viewer': 'bg-slate-100 text-slate-700',
        };
        return colors[roleName] || 'bg-gray-100 text-gray-700';
    }

    return (
        <div>
            {/* Search and Filters */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search team members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                >
                    <option value="all">All Roles</option>
                    {roles.map((role: any) => (
                        <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="disabled">Suspended</option>
                </select>
            </div>

            {/* Members Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Member
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {filteredMembers.map((member: any) => (
                            <tr key={member.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-semibold">
                                            {getInitials(member.user.name || member.user.email)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">
                                                {member.user.name || 'No name'}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {member.user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role.name)}`}>
                                        {member.role.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={member.status === 'active'}
                                            onChange={() => handleStatusToggle(member.id, member.status)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                        <span className="ml-3 text-sm font-medium text-slate-700">
                                            {member.status === 'active' ? 'Active' : 'Suspended'}
                                        </span>
                                    </label>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setEditingMember(member)}
                                            className="p-2 text-brand hover:bg-brand/10 rounded-lg transition-colors"
                                            title="Edit member"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(member.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete member"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredMembers.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No members found</p>
                    </div>
                )}
            </div>

            {/* Team Overview */}
            <div className="mt-6 bg-teal-50 border border-teal-100 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
                        <Search className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Team Overview</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-slate-600">Total Members</p>
                        <p className="text-2xl font-bold text-slate-900">{members.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600">Active</p>
                        <p className="text-2xl font-bold text-green-600">
                            {members.filter((m: any) => m.status === 'active').length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Edit Member Modal */}
            {editingMember && (
                <EditMemberModal
                    member={editingMember}
                    roles={roles}
                    onClose={() => setEditingMember(null)}
                    onSuccess={() => {
                        setEditingMember(null);
                        onRefresh();
                    }}
                />
            )}
        </div>
    );
}
