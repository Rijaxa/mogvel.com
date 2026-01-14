'use client';

import { useState, useEffect } from 'react';
import { Users, Download, UserPlus, Search, Filter } from 'lucide-react';
import { getTeamMembers, getOrganizationRoles, exportTeamCSV } from '@/actions/team';
import MembersTab from './components/MembersTab';
import RolesPermissionsTab from './components/RolesPermissionsTab';
import ActivityLogTab from './components/ActivityLogTab';
import AddMemberModal from './components/AddMemberModal';

type TabType = 'members' | 'roles' | 'activity';

export default function TeamManagementPage() {
    const [activeTab, setActiveTab] = useState<TabType>('members');
    const [members, setMembers] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        const [membersResult, rolesResult] = await Promise.all([
            getTeamMembers(),
            getOrganizationRoles(),
        ]);

        if (!membersResult.error && membersResult.members) {
            setMembers(membersResult.members);
        }

        if (!rolesResult.error && rolesResult.roles) {
            setRoles(rolesResult.roles);
        }

        setLoading(false);
    }

    async function handleExportCSV() {
        const result = await exportTeamCSV();
        if (result.csvContent) {
            // Create download link
            const blob = new Blob([result.csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `team-members-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Team Management</h1>
                    <p className="text-slate-600">Manage roles, permissions, and members within your organisation</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Member
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('members')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'members'
                            ? 'text-brand border-b-2 border-brand'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    Members
                </button>
                <button
                    onClick={() => setActiveTab('roles')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'roles'
                            ? 'text-brand border-b-2 border-brand'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    Roles & Permissions
                </button>
                <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'activity'
                            ? 'text-brand border-b-2 border-brand'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    Activity Log
                </button>
            </div>

            {/* Tab Content */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-600">Loading team data...</p>
                </div>
            ) : (
                <>
                    {activeTab === 'members' && (
                        <MembersTab members={members} roles={roles} onRefresh={loadData} />
                    )}
                    {activeTab === 'roles' && <RolesPermissionsTab roles={roles} />}
                    {activeTab === 'activity' && <ActivityLogTab />}
                </>
            )}

            {/* Add Member Modal */}
            {showAddModal && (
                <AddMemberModal
                    roles={roles}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        loadData();
                    }}
                />
            )}
        </div>
    );
}
