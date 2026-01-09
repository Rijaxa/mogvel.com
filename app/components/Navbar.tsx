'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { isCompanyLoggedIn } = useAuth();

    return (
        <nav className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
            <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-white font-bold text-lg">
                    M
                </div>
                <span className="text-xl font-bold text-slate-900">Mogvel</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                <Link href="#" className="hover:text-slate-900">Features</Link>
                <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
                <Link href="#" className="hover:text-slate-900">About</Link>
                <Link href="#" className="hover:text-slate-900">Support</Link>
            </div>

            <div className="flex items-center gap-4">
                <Link
                    href={isCompanyLoggedIn ? "/dashboard/company" : "/company/login"}
                    className="px-4 py-2 text-sm font-medium text-brand border border-brand rounded-full hover:bg-brand/10 transition-colors"
                >
                    {isCompanyLoggedIn ? "Company Dashboard" : "Company Login"}
                </Link>
                <Link href="/dashboard/vendor" className="px-4 py-2 text-sm font-medium text-brand border border-brand rounded-full hover:bg-brand/10 transition-colors">
                    Vendor Login
                </Link>
            </div>
        </nav>
    );
}
