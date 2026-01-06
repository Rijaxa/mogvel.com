'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { updateUserProfile } from '@/app/actions/user';
import { CheckCircle, AlertCircle, Building2, MapPin, Globe } from 'lucide-react';

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Cast session user to include extended properties
    const user = session?.user as any;
    const details = user?.companyDetails || {};

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
            // Force reload to show new logo if uploaded
            window.location.reload();
        }

        setIsSaving(false);
    }

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

            <form action={handleSubmit} className="space-y-8">
                {/* 1. General Info */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-slate-400" />
                            General Information
                        </h3>
                    </div>
                    <div className="p-6 grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Organisation name / Trademark <span className="text-red-500">*</span></label>
                            <input name="organisationName" type="text" defaultValue={details.organisationName || ''} required className="input-field" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Legal name <span className="text-red-500">*</span></label>
                            <input name="legalName" type="text" defaultValue={details.legalName || ''} required className="input-field" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Registration number <span className="text-red-500">*</span></label>
                            <input name="registrationNumber" type="text" defaultValue={details.registrationNumber || ''} required className="input-field" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">VAT Payer status <span className="text-red-500">*</span></label>
                            <select name="vatPayerStatus" defaultValue={details.vatPayerStatus || ''} required className="input-field">
                                <option value="" disabled>Select status</option>
                                <option value="vat_payer">VAT Payer</option>
                                <option value="not_vat_payer">Not a VAT Payer</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Business scale</label>
                            <select name="businessScale" defaultValue={details.businessScale || ''} className="input-field">
                                <option value="">Select scale (Optional)</option>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Upload Logo <span className="text-red-500">*</span></label>
                            <input name="logo" type="file" accept="image/*" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand/10 file:text-brand hover:file:bg-brand/20" />
                            {details.logoUrl && <p className="text-xs text-green-600 mt-1">✓ Logo uploaded</p>}
                        </div>
                    </div>
                </div>

                {/* 2. Location & Contact */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-slate-400" />
                            Location & Contact
                        </h3>
                    </div>
                    <div className="p-6 grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Country <span className="text-red-500">*</span></label>
                            <input name="country" type="text" defaultValue={details.country || 'Georgia'} required className="input-field bg-slate-50" readOnly />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">City <span className="text-red-500">*</span></label>
                            <input name="city" type="text" defaultValue={details.city || ''} required className="input-field" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Company address <span className="text-red-500">*</span></label>
                            <input name="address" type="text" defaultValue={details.address || ''} required className="input-field" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Contact person <span className="text-red-500">*</span></label>
                            <input name="contactPerson" type="text" defaultValue={details.contactPerson || ''} required className="input-field" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Contact phone <span className="text-red-500">*</span></label>
                            <input name="phone" type="tel" defaultValue={details.phone || ''} required className="input-field" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Contact email <span className="text-red-500">*</span></label>
                            <input name="contactEmail" type="email" defaultValue={details.contactEmail || ''} required className="input-field" />
                        </div>
                    </div>
                </div>

                {/* 3. Operational Details */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-slate-400" />
                            Operational Details
                        </h3>
                    </div>
                    <div className="p-6 grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Default currency <span className="text-red-500">*</span></label>
                            <input name="currency" type="text" defaultValue={details.currency || 'GEL'} required className="input-field bg-slate-50" readOnly />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Number of offices <span className="text-red-500">*</span></label>
                            <input name="numberOfOffices" type="text" placeholder="e.g. 1, 5, 10+" defaultValue={details.numberOfOffices || ''} required className="input-field" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Service Areas (cities/regions)</label>
                            <input name="serviceAreas" type="text" placeholder="e.g. Tbilisi, Batumi, Kutaisi" defaultValue={details.serviceAreas || ''} className="input-field" />
                        </div>
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                        {message.text}
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-brand text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 shadow-md"
                    >
                        {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                    </button>
                </div>
            </form>

            <style jsx>{`
                .input-field {
                    width: 100%;
                    border-radius: 0.5rem;
                    border: 1px solid #e2e8f0;
                    padding: 0.5rem 0.75rem;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    outline: none;
                }
                .input-field:focus {
                    border-color: #17BEBB;
                    ring: 2px solid #17BEBB;
                    box-shadow: 0 0 0 1px #17BEBB;
                }
            `}</style>
        </div>
    );
}
