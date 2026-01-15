import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TrendingDown, CheckSquare } from 'lucide-react';

export default function Hero() {
    return (
        <section className="px-6 py-12 md:py-24 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <div className="inline-block px-4 py-2 text-sm font-medium text-brand bg-brand/10 rounded-full">
                        B2B Procurement Reinvented
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                        Procurement Made Predictable
                    </h1>

                    <p className="text-lg text-slate-600 max-w-lg">
                        Connect with verified vendors and automate your procurement workflow. From hygiene products to MRO equipment, Mogvel streamlines everything.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <Link href="/register?type=company" className="flex items-center gap-2 px-6 py-3 text-white bg-brand rounded-lg hover:bg-brand/90 transition-colors font-medium shadow-sm">
                            Get Started as a Company
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/register?type=vendor" className="px-6 py-3 text-brand border border-brand rounded-lg hover:bg-brand/10 transition-colors font-medium">
                            Join as a Vendor
                        </Link>
                    </div>

                    <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
                        <div className="flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-brand" strokeWidth={2.5} />
                            14-day free trial
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-brand" strokeWidth={2.5} />
                            No credit card required
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                        <Image
                            src="/hero-warehouse.png"
                            alt="Warehouse"
                            fill
                            className="object-cover"
                            priority
                        />

                        {/* Gradient overlay for text readability if needed, though image is usually clear */}
                        <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
                    </div>

                    {/* Floating Card */}
                    <div className="absolute top-1/2 -left-12 -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg flex items-center gap-4 max-w-xs animate-in slide-in-from-left-4 fade-in duration-700">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <TrendingDown className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Cost Savings</p>
                            <p className="text-sm text-green-500 font-medium">↓ 23% this quarter</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
