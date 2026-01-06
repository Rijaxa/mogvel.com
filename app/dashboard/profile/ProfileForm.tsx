'use client';

import { useState, useEffect } from 'react';
import { updateUserProfile } from '@/app/actions/user';
import { Building2, MapPin, Globe, CheckCircle } from 'lucide-react';
import { countries, defaultCountry } from '@/lib/countries';
import Link from 'next/link';

interface ProfileFormProps {
    user: any;
    details: any;
}

export default function ProfileForm({ user, details }: ProfileFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // State for dependent fields
    const [selectedCountryName, setSelectedCountryName] = useState(details.country || defaultCountry.name);
    const [currency, setCurrency] = useState(details.currency || defaultCountry.currency);
    const [selectedPhoneCode, setSelectedPhoneCode] = useState(defaultCountry.phoneCode); // Default, but should check existing phone
    const [phoneNumber, setPhoneNumber] = useState(details.phone ? details.phone.replace(/^\+\d+\s?/, '') : ''); // Strip code if exists

    // Effects
    useEffect(() => {
        const country = countries.find(c => c.name === selectedCountryName) || defaultCountry;
        setCurrency(country.currency);
        setSelectedPhoneCode(country.phoneCode);
    }, [selectedCountryName]);

    const activeCountry = countries.find(c => c.name === selectedCountryName) || defaultCountry;

    async function handleSubmit(formData: FormData) {
        setIsSaving(true);
        setMessage(null);

        // Pre-process phone number to include code
        const fullPhone = `${selectedPhoneCode} ${phoneNumber}`;
        formData.set('phone', fullPhone);

        // Ensure currency matches country
        formData.set('currency', currency);

        const result = await updateUserProfile(formData);

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            window.location.reload();
        }

        setIsSaving(false);
    }

    return (
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
                    {/* Country Dropdown */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Country <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select
                                name="country"
                                value={selectedCountryName}
                                onChange={(e) => setSelectedCountryName(e.target.value)}
                                required
                                className="input-field pl-10"
                            >
                                {countries.map(c => (
                                    <option key={c.code} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">{activeCountry.flag}</span>
                        </div>
                    </div>

                    {/* City Dropdown */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">City <span className="text-red-500">*</span></label>
                        <select name="city" defaultValue={details.city || ''} required className="input-field">
                            <option value="" disabled>Select City</option>
                            {activeCountry.cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                            <option value="Other">Other...</option>
                        </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-slate-700">Company address <span className="text-red-500">*</span></label>
                        {/* Google Maps Autocomplete Placeholder - Real implementation needs API Key */}
                        {/* <div id="google-maps-autocomplete" /> */}
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                name="address"
                                type="text"
                                defaultValue={details.address || ''}
                                required
                                className="input-field pl-10"
                                placeholder="Start typing address..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Contact person <span className="text-red-500">*</span></label>
                        <input name="contactPerson" type="text" defaultValue={details.contactPerson || ''} required className="input-field" />
                    </div>

                    {/* Phone Dropdown */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Contact phone <span className="text-red-500">*</span></label>
                        <div className="flex gap-2">
                            <div className="relative w-32 shrink-0">
                                <select
                                    className="input-field pl-8"
                                    value={selectedCountryName} // Sync with country or separate? User "Make the phone number country code a dropdown with a flag"
                                    onChange={(e) => {
                                        const c = countries.find(x => x.name === e.target.value);
                                        if (c) {
                                            setSelectedPhoneCode(c.phoneCode);
                                            // Optional: Sync country field too? "Make the country dropdown similar... Default currency connected to the country field."
                                            // Usually phone code is independent but defaults to country. Let's keep it somewhat independent or synced.
                                            // Simpler UI: Just a dropdown of codes with flags.
                                        }
                                    }}
                                >
                                    {countries.map(c => (
                                        <option key={c.code} value={c.name}>{c.phoneCode}</option>
                                    ))}
                                </select>
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-lg">
                                    {countries.find(c => c.phoneCode === selectedPhoneCode)?.flag || '🌍'}
                                </span>
                            </div>
                            <input
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                name="phoneNumberInput" // We construct real 'phone' in onSubmit
                                type="tel"
                                required
                                className="input-field flex-1"
                                placeholder="555 123 456"
                            />
                        </div>
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
                        <input name="currencyDisplay" type="text" value={currency} readOnly className="input-field bg-slate-50 cursor-not-allowed" />
                        <input name="currency" type="hidden" value={currency} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Number of offices <span className="text-red-500">*</span></label>
                        <input name="numberOfOffices" type="text" placeholder="e.g. 1" defaultValue={details.numberOfOffices || ''} required className="input-field" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-slate-700">Service Areas (cities/regions)</label>
                        <input name="serviceAreas" type="text" placeholder="e.g. Tbilisi, Batumi" defaultValue={details.serviceAreas || ''} className="input-field" />
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

            <style jsx global>{`
                .input-field {
                    width: 100%;
                    border-radius: 0.5rem;
                    border: 1px solid #e2e8f0;
                    padding: 0.5rem 0.75rem;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    outline: none;
                    background-color: white;
                }
                .input-field:focus {
                    border-color: #17BEBB;
                    ring: 2px solid #17BEBB;
                    box-shadow: 0 0 0 1px #17BEBB;
                }
            `}</style>
        </form>
    );
}
