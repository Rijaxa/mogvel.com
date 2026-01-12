'use client';

import Link from 'next/link';
import { ChevronLeft, User, Phone, Mail } from 'lucide-react';
import ClientProfileHeader from '@/app/dashboard/components/vendor/clients/ClientProfileHeader';
import ProcurementHistory from '@/app/dashboard/components/vendor/clients/ProcurementHistory';
import RelevantDocuments from '@/app/dashboard/components/vendor/clients/RelevantDocuments';

// Note: In a real app, you would fetch data based on the params.id
export default function ClientDetailsPage({ params }: { params: { id: string } }) {

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-300">
            {/* Back Header */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/dashboard/vendor/clients" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Clients
                </Link>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-brand text-white text-xs font-bold rounded-full">Active Client</span>
                </div>
            </div>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Acme Corporation</h1>
                <p className="text-slate-500">Complete client profile and procurement history</p>
            </div>

            <ClientProfileHeader
                name="Acme Corporation"
                legalName="Acme Corporation Limited Liability Company"
                idNumber="123456789"
                status="Verified"
                factualAddress="123 Rustaveli Avenue, Tbilisi 0108, Georgia"
                officialAddress="123 Rustaveli Avenue, Tbilisi 0108, Georgia"
            />

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                    <User className="w-6 h-6 text-brand" />
                    <h2 className="text-lg font-bold text-slate-900">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Contact Person</p>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                <User className="w-4 h-4 text-slate-500" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">Giorgi Beridze</p>
                                <p className="text-xs text-slate-500">Procurement Manager</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Role</p>
                        <span className="inline-block px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-xs font-bold">
                            Procurement Manager
                        </span>
                    </div>

                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Phone Number</p>
                        <a href="tel:+995555123456" className="font-bold text-brand hover:underline flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            +995 555 123 456
                        </a>
                    </div>

                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Email Address</p>
                        <a href="mailto:procurement@acme.ge" className="font-bold text-brand hover:underline flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            procurement@acme.ge
                        </a>
                    </div>
                </div>
            </div>

            <ProcurementHistory />

            <RelevantDocuments />

        </div>
    );
}
