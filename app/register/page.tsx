'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { registerUser } from '@/actions/auth';
import { cn } from '@/lib/utils';
import { Building2, Store } from 'lucide-react';

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Default to 'company' if not specified
    const [accountType, setAccountType] = useState<'company' | 'vendor'>(
        (searchParams.get('type') as 'company' | 'vendor') || 'company'
    );

    // Update account type if query param changes
    useEffect(() => {
        const type = searchParams.get('type');
        if (type === 'company' || type === 'vendor') {
            setAccountType(type);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const name = formData.get('userName') as string;
        const organizationName = formData.get('companyName') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const result = await registerUser({
                email,
                password,
                name,
                organizationName,
                accountType
            });

            if (result.error) {
                setError(result.error);
                setIsLoading(false);
            } else {
                // Auto login after successful registration
                const loginRes = await signIn('credentials', {
                    email,
                    password,
                    redirect: false
                });

                if (!loginRes?.error) {
                    // Redirect based on account type
                    if (accountType === 'vendor') {
                        router.push('/dashboard/vendor/orders');
                    } else {
                        router.push('/dashboard/orders');
                    }
                    router.refresh();
                } else {
                    setError('Registration successful but login failed. Please try logging in manually.');
                    setIsLoading(false);
                }
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
                <Link href="/" className="flex items-center gap-3 mb-8">
                    <img src="/mogvel-logo.png" alt="Mogvel" className="h-18" />
                </Link>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    Create an account
                </h2>
                <p className="mt-2 text-slate-600">
                    Join Mogvel and transform your business workflow
                </p>
            </div>

            <div className="space-y-6">
                {/* Account Type Toggle */}
                <div className="grid grid-cols-2 gap-4 p-1 bg-slate-100 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setAccountType('company')}
                        className={cn(
                            "flex flex-col items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                            accountType === 'company'
                                ? "bg-white text-brand shadow-sm ring-1 ring-slate-200"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                        )}
                    >
                        <Building2 className="w-5 h-5" />
                        Company
                    </button>
                    <button
                        type="button"
                        onClick={() => setAccountType('vendor')}
                        className={cn(
                            "flex flex-col items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                            accountType === 'vendor'
                                ? "bg-white text-brand shadow-sm ring-1 ring-slate-200"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                        )}
                    >
                        <Store className="w-5 h-5" />
                        Vendor
                    </button>
                </div>

                {/* Visual indicator of selection */}
                <div className={cn(
                    "rounded-md p-4 text-sm border",
                    accountType === 'company'
                        ? "bg-brand/5 border-brand/20 text-brand"
                        : "bg-brand/5 border-brand/20 text-brand"
                )}>
                    {accountType === 'company'
                        ? "You are registering as a Buyer to procure goods and services."
                        : "You are registering as a Vendor to sell products and manage orders."
                    }
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-slate-700">
                                Full Name
                            </label>
                            <input
                                id="userName"
                                name="userName"
                                type="text"
                                required
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                            />
                        </div>
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">
                                {accountType === 'company' ? 'Company Name' : 'Business/Trading Name'}
                            </label>
                            <input
                                id="companyName"
                                name="companyName"
                                type="text"
                                required
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                            />
                        </div>
                    </div>

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
                            autoComplete="new-password"
                            required
                            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 rounded border-slate-300 focus:ring-brand text-brand"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-slate-600">
                            I agree to the <a href="#" className="font-medium hover:underline">Terms of Service</a> and <a href="#" className="font-medium hover:underline">Privacy Policy</a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full justify-center rounded-lg px-3 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-brand hover:bg-teal-600 focus-visible:outline-brand"
                    >
                        {isLoading ? 'Creating account...' : `Create ${accountType === 'company' ? 'Company' : 'Vendor'} Account`}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-slate-600">
                        Already have an account?{' '}
                    </span>
                    <Link
                        href="/login"
                        className="font-semibold hover:underline text-brand hover:text-teal-600"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
                <Suspense fallback={<div>Loading...</div>}>
                    <RegisterForm />
                </Suspense>
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
                            Start your journey with Mogvel
                        </h3>
                        <p className="text-slate-600 text-lg">
                            Unite your procurement processes or expand your B2B sales network.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
