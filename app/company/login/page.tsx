'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function CompanyLoginPage() {
    const router = useRouter();
    const { loginCompany } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        loginCompany();
        router.push('/dashboard/company');
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <Link href="/" className="inline-flex items-center gap-2 mb-8">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-white font-bold text-lg">
                                M
                            </div>
                            <span className="text-xl font-bold text-slate-900">Mogvel</span>
                        </Link>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            {isLogin ? 'Welcome back' : 'Create company account'}
                        </h2>
                        <p className="mt-2 text-slate-600">
                            {isLogin
                                ? 'Enter your credentials to access your dashboard'
                                : 'Get started with your improved procurement workflow'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div>
                                <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">
                                    Company Name
                                </label>
                                <input
                                    id="companyName"
                                    name="companyName"
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={isLogin ? "current-password" : "new-password"}
                                required
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                            />
                        </div>

                        {!isLogin && (
                            <div className="flex items-start">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-slate-600">
                                    I agree to the <a href="#" className="font-medium text-brand hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-brand hover:underline">Privacy Policy</a>
                                </label>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full justify-center rounded-lg bg-brand px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create account')}
                        </button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-slate-600">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-semibold text-brand hover:text-teal-600 hover:underline"
                        >
                            {isLogin ? 'Register now' : 'Sign in'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side - Image/Info */}
            <div className="hidden lg:block relative bg-slate-50">
                <div className="absolute inset-0 bg-brand/5 backdrop-blur-[2px]" />
                <div className="relative h-full flex items-center justify-center p-12">
                    <div className="max-w-lg text-center">
                        <img
                            src="https://illustrations.popsy.co/teal/office-workers.svg"
                            alt="Office collaboration"
                            className="mx-auto w-full max-w-md h-auto mb-8 drop-shadow-xl"
                        />
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">
                            Streamline your procurement
                        </h3>
                        <p className="text-slate-600 text-lg">
                            Manage all your vendor relationships, contracts, and orders in one centralized platform tailored for efficiency.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
