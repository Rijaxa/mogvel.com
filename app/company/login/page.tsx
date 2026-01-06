'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { signIn } from 'next-auth/react';

export default function CompanyLoginPage() {
    const router = useRouter();
    const { loginCompany } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        await signIn('google', { callbackUrl: '/dashboard/company' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const companyName = formData.get('companyName') as string || 'Acme Corp';
        const email = formData.get('email') as string || 'demo@acme.com';

        // For login mode, we might just default to a specific user if the form doesn't have the name field
        const userToLogin = {
            companyName: isLogin ? 'Acme Corp' : companyName,
            email: email
        };

        loginCompany(userToLogin);
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

                    <div className="space-y-6">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">Or continue with</span>
                            </div>
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
