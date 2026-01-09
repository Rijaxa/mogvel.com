'use client';

import Link from 'next/link';

export default function PricingHeader() {
    return (
        <header className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl bg-white">
            <Link href="/" className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-white font-bold text-lg">
                    M
                </div>
                <span className="text-xl font-bold text-slate-900">Mogvel</span>
            </Link>

        </header>
    );
}
