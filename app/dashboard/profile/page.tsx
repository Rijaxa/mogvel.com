'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { CheckCircle, AlertCircle } from 'lucide-react';
import ProfileForm from './ProfileForm';

export default function ProfilePage() {
    const { data: session } = useSession();

    // Cast session user to include extended properties
    const user = session?.user as any;
    const details = user?.companyDetails || {};

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header with Back Link */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/company" className="text-2xl font-bold text-brand hover:text-teal-600 transition-colors">
                        Mogvel
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-500 font-medium">Profile</span>
                </div>
                <Link href="/dashboard/company" className="text-sm font-medium text-slate-500 hover:text-brand transition-colors">
                    &larr; Back to Dashboard
                </Link>
            </div>

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
                <p className="text-slate-600">Please fill in all mandatory fields marked with <span className="text-red-500">*</span></p>
            </div>

            {/* ID Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row gap-6 items-center">
                <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-3xl shrink-0 overflow-hidden border border-slate-200">
                    {details.logoUrl ? (
                        <img src={details.logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                    ) : (
                        user?.name?.charAt(0).toUpperCase() || 'C'
                    )}
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                    <h2 className="text-xl font-bold text-slate-900">{details.organisationName || user?.name || 'Company Name'}</h2>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-600">
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-sm border border-slate-200">
                            ID: {user?.id || '...'}
                        </span>
                        {details.verificationStatus === 'verified' && (
                            <div className="flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ProfileForm user={user} details={details} />
        </div>
    );
}
