// @ts-nocheck
"use client";
import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
;
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError('Please fill in all required fields.');
            return;
        }
        setIsLoading(true);
        try {
            await login(email, password);
            // On successful login, redirect to Dashboard
            navigate.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--secondary)]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/2"></div>
            
            <div className="max-w-md w-full relative z-10 pt-20">
                {/* Back Navigation */}
                <button 
                    onClick={() => navigate.back()} 
                    className="mb-4 flex items-center gap-2 font-bold text-sm opacity-70 hover:text-[var(--primary)] hover:opacity-100 transition-all hover:-translate-x-1 duration-300 w-max"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back to previous
                </button>

                <div className="bg-[var(--bg)]/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-2xl border border-[var(--secondary)]/10">
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-block mb-6">
                            <span className="text-2xl font-black tracking-tighter text-[var(--primary)]">PRINT<span className="text-[var(--text)]">CO.</span></span>
                        </Link>
                        <h2 className="text-3xl font-black tracking-tight mb-2 uppercase">Welcome Back</h2>
                        <p className="text-base opacity-70 font-medium">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold opacity-80 mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-[var(--bg)] transition-all"
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold opacity-80 mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-[var(--bg)] transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember_me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 bg-[var(--secondary)]/5 border-[var(--secondary)]/20 rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                                />
                                <label htmlFor="remember_me" className="ml-2 block text-sm font-medium opacity-80 cursor-pointer">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-bold text-[var(--primary)] hover:opacity-80 transition-opacity">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-[var(--primary)] text-[var(--bg)] font-black text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--bg)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[var(--secondary)]/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-[var(--bg)] opacity-60 font-bold tracking-widest uppercase">Or</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-800 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </button>
                        </div>
                    </div>

                    <p className="mt-10 text-center text-sm opacity-80 font-medium">
                        New user to our store?{' '}
                        <Link href="/register" className="font-bold text-[var(--primary)] hover:opacity-80 transition-opacity">
                            Register an account
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}
