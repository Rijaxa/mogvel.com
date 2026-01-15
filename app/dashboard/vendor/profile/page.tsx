'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { User, Mail, Phone, Briefcase, Shield, Key, FileText, CheckCircle, Pencil } from 'lucide-react';
import EditUserProfileModal from '../../components/EditUserProfileModal';

export default function VendorProfilePage() {
    const { data: session } = useSession();
    const user = session?.user as any;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Helper to get initials
    const getInitials = (name: string) => {
        return name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header with Back Link */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/vendor" className="text-2xl font-bold text-brand hover:text-teal-600 transition-colors">
                        Mogvel
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-500 font-medium">My Profile</span>
                </div>
                <Link href="/dashboard/vendor" className="text-sm font-medium text-slate-500 hover:text-brand transition-colors">
                    &larr; Back to Dashboard
                </Link>
            </div>

            <div>
                <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-600">Manage your personal account details and security settings</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm p-1 ring-4 ring-white/20 shadow-xl shrink-0">
                            <div className="h-full w-full rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-3xl overflow-hidden border border-slate-200/50">
                                {user?.image ? (
                                    <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    getInitials(user?.name || '')
                                )}
                            </div>
                        </div>

                        <div className="flex-1 space-y-2 min-w-0">
                            <h2 className="text-3xl font-bold text-white truncate">{user?.name || 'User Name'} {user?.lastName || ''}</h2>
                            <div className="flex flex-wrap items-center gap-3 text-emerald-50">
                                <span className="font-medium">{user?.jobPosition || 'Team Member'}</span>
                                {user?.role && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm border border-white/10 uppercase tracking-wide">
                                        {user.role}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 self-start md:self-center">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-emerald-50 font-mono text-xs shadow-sm">
                                <span className="opacity-70 mr-2">ID:</span>
                                <span className="font-medium text-white">{user?.id || 'USR-0000'}</span>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-xs font-medium backdrop-blur-sm transition-colors"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-8 pb-8 pt-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <User className="w-5 h-5 text-slate-400" />
                                Personal Information
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
                                    <div className="text-slate-900 font-medium">{user?.name || '-'} {user?.lastName || ''}</div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
                                    <div className="flex items-center gap-2 text-slate-900 font-medium">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        {user?.email || '-'}
                                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1 h-fit">
                                            <CheckCircle className="w-3 h-3" /> Verified
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Phone Number</label>
                                    <div className="flex items-center gap-2 text-slate-900 font-medium">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        {user?.phone || user?.phoneNumber || '+995 555 00 00 00'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <Briefcase className="w-5 h-5 text-slate-400" />
                                Role & Position
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Official Job Position</label>
                                    <div className="text-slate-900 font-medium">{user?.jobPosition || 'Not Specified'}</div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">System Role</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium text-sm w-fit">
                                            <Shield className="w-4 h-4 text-brand" />
                                            {user?.role || 'Custom Role'}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2 max-w-sm">
                                        Your role determines your access permissions within the {user?.companyName} workspace.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Key className="w-5 h-5 text-slate-400" />
                        Security & Login
                    </h3>
                </div>
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h4 className="font-medium text-slate-900">Password</h4>
                            <p className="text-sm text-slate-500 mt-1">Update your password associated with this account.</p>
                        </div>
                        <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm">
                            Change Password
                        </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h4 className="font-medium text-slate-900">Two-Factor Authentication</h4>
                            <p className="text-sm text-slate-500 mt-1">Add an extra layer of security to your account.</p>
                        </div>
                        <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm opacity-50 cursor-not-allowed">
                            Enable 2FA (Coming Soon)
                        </button>
                    </div>
                </div>
            </div>

            {/* Activity Log Teaser - Link to Team page? Or just a placeholder */}
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm border border-blue-100">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-blue-900">Recent Activity</p>
                        <p className="text-xs text-blue-700">View your login history and actions</p>
                    </div>
                </div>
                <button className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline">
                    View Log &rarr;
                </button>
            </div>

            <EditUserProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
            />
        </div>
    );
}
