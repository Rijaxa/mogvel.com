'use client';

import { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import TeamList from '../../components/vendor/team/TeamList';
import AddMemberModal from '../../components/vendor/team/AddMemberModal';
import EditMemberModal from '../../components/vendor/team/EditMemberModal';
import RolesPermissions from '../../components/vendor/team/RolesPermissions';
import ActivityLog from '../../components/vendor/team/ActivityLog';
import { getTeamMembers } from '@/actions/vendor/team';

export default function VendorTeamPage() {
    const [activeTab, setActiveTab] = useState<'members' | 'roles' | 'activity'>('members');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const handleEdit = (member: any) => {
        setSelectedMember(member);
        setIsEditModalOpen(true);
    };

    useEffect(() => {
        loadMembers();
    }, [isModalOpen]);

    const loadMembers = async () => {
        setLoading(true);
        const res = await getTeamMembers();
        if (res.members) {
            setMembers(res.members);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Team Management</h1>
                    <p className="text-slate-500">Manage roles, permissions, and members within your organisation</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white font-bold rounded-xl hover:bg-brand/90 transition-colors shadow-sm shadow-brand/20"
                    >
                        <Plus className="w-4 h-4" />
                        Add Member
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('members')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'members'
                        ? 'bg-brand text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                        }`}
                >
                    Members
                </button>
                <button
                    onClick={() => setActiveTab('roles')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'roles'
                        ? 'bg-brand text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                        }`}
                >
                    Roles & Permissions
                </button>
                <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'activity'
                        ? 'bg-brand text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                        }`}
                >
                    Activity Log
                </button>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'members' && (
                    <TeamList members={members} onEdit={handleEdit} />
                )}

                {activeTab === 'roles' && (
                    <RolesPermissions />
                )}

                {activeTab === 'activity' && (
                    <ActivityLog />
                )}
            </div>

            <AddMemberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <EditMemberModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                member={selectedMember}
            />
        </div>
    );
}
