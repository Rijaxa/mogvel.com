'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { getPostLoginRedirectPath } from '@/actions/auth';
import Image from 'next/image';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
                setIsLoading(false);
            } else {
                // Determine redirect path based on user role
                const redirectPath = await getPostLoginRedirectPath();
                // Use window.location.href to force a full page reload, ensuring session cookies 
                // and auth state are correctly propagated to the top-level layout immediately.
                window.location.href = redirectPath;
            }
        } catch (err) {
            console.error("Authentication error:", err);
            setError("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <Link href="/" className="flex items-center gap-3 mb-8">
                            <img src="/mogvel-logo.png" alt="Mogvel" className="h-18" />
                        </Link>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-slate-600">
                            Enter your credentials to access your dashboard
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                        Password
                                    </label>
                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-brand hover:text-teal-600 hover:underline">
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full justify-center rounded-lg bg-brand px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>

                        <div className="text-center text-sm">
                            <span className="text-slate-600">
                                Don&apos;t have an account?{' '}
                            </span>
                            <Link
                                href="/register"
                                className="font-semibold text-brand hover:text-teal-600 hover:underline"
                            >
                                Create an account
                            </Link>
                        </div>
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
                            One Platform for All Your Needs
                        </h3>
                        <p className="text-slate-600 text-lg">
                            Whether you are buying or selling, Mogvel streamlines your procurement and sales operations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
