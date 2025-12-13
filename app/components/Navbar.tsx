import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-white font-bold text-lg">
                    M
                </div>
                <span className="text-xl font-bold text-slate-900">Mogvel</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                <Link href="#" className="hover:text-slate-900">Features</Link>
                <Link href="#" className="hover:text-slate-900">Pricing</Link>
                <Link href="#" className="hover:text-slate-900">About</Link>
                <Link href="#" className="hover:text-slate-900">Support</Link>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/dashboard/company" className="px-4 py-2 text-sm font-medium text-brand border border-brand rounded-full hover:bg-brand/10 transition-colors">
                    Company Login
                </Link>
                <button className="px-4 py-2 text-sm font-medium text-brand border border-brand rounded-full hover:bg-brand/10 transition-colors">
                    Vendor Login
                </button>
            </div>
        </nav>
    );
}
