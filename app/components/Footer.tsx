'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
    const { isCompanyLoggedIn } = useAuth();

    return (
        <footer>
            {/* CTA Section */}
            <div className="bg-[#1e293b] py-20 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                        Ready to transform your procurement?
                    </h2>
                    <p className="text-slate-300 text-lg">
                        Join hundreds of companies and vendors already using Mogvel to streamline their operations
                    </p>
                    <div className="flex justify-center">
                        <button className="flex items-center gap-2 px-8 py-3 bg-[#fcd34d] text-slate-900 rounded-full font-bold hover:bg-[#fbbf24] transition-colors">
                            Try free for 14 days
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Links Section */}
            <div className="bg-[#0f172a] py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-white font-bold text-lg">
                                    M
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm">
                                Procurement made predictable
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4">Product</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4">Company</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Support</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4">Access</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><Link href="#" className="hover:text-white transition-colors">Vendor Login</Link></li>
                                <li>
                                    <Link href={isCompanyLoggedIn ? "/dashboard/company" : "/company/login"} className="hover:text-white transition-colors">
                                        {isCompanyLoggedIn ? "Company Dashboard" : "Company Login"}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                        © 2025 Mogvel. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
