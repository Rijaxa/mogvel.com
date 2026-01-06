'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { updateUserProfile } from '@/app/actions/user';
import { CheckCircle, AlertCircle, Building2 } from 'lucide-react';

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Cast session user to include extended properties
    const user = session?.user as any;

    async function handleSubmit(formData: FormData) {
        setIsSaving(true);
        setMessage(null);

        const result = await updateUserProfile(formData);

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            // Trigger session update to reflect changes (optional, might need page reload or complex session sync)
            if (update) await update();
        }

        setIsSaving(false);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header with Back Link */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <a href="/dashboard/company" className="text-2xl font-bold text-brand hover:text-teal-600 transition-colors">
                        Mogvel
                    </a>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-500 font-medium">Profile</span>
                </div>
                <a href="/dashboard/company" className="text-sm font-medium text-slate-500 hover:text-brand transition-colors">
                    &larr; Back to Dashboard
                </a>
            </div>

            <div>
                <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-600">Manage your company details and settings.</p>
            </div>

            {/* ID Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row gap-6 items-center">
                <div className="h-20 w-20 rounded-full bg-brand flex items-center justify-center text-white font-bold text-3xl shrink-0">
                    {user?.name?.charAt(0).toUpperCase() || 'C'}
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                    <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-600">
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-sm border border-slate-200">
                            ID: {user?.id || 'Generating...'}
                        </span>
                        <div className="flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                            <CheckCircle className="w-3 h-3" />
                            Email Verified
                        </div>
                    </div>
                </div>
            </div>

            {!user?.companyDetails?.isProfileComplete && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                        <p className="font-medium">Complete your registration</p>
                        <p className="text-sm opacity-90">Please fill in your company details to enable full platform access.</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-slate-400" />
                        Company Details
                    </h3>
                </div>
                <form action={handleSubmit} className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Business Name</label>
                            <input
                                name="businessName"
                                type="text"
                                defaultValue={user?.companyDetails?.businessName || ''}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Phone Number</label>
                            <input
                                name="phone"
                                type="tel"
                                defaultValue={user?.companyDetails?.phone || ''}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Address</label>
                            <input
                                name="address"
                                type="text"
                                defaultValue={user?.companyDetails?.address || ''}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Website (Optional)</label>
                            <input
                                name="website"
                                type="url"
                                defaultValue={user?.companyDetails?.website || ''}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-brand text-white font-medium py-2 px-6 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
