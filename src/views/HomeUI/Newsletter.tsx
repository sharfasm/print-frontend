// @ts-nocheck
"use client";
import React, { useState } from 'react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;
        
        setStatus('loading');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <section className="py-24 bg-[var(--bg)] text-[var(--text)] border-t border-[var(--secondary)]/10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                
                <div className="w-16 h-16 mx-auto bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                </div>

                <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                    Join the Club
                </h2>
                <p className="text-lg opacity-70 font-medium mb-10 max-w-xl mx-auto">
                    Subscribe to our newsletter and get 10% off your first order. Plus, receive exclusive updates on new drops and secret sales.
                </p>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto relative">
                    <div className="relative flex items-center">
                        <input 
                            type="email" 
                            required
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-14 pl-6 pr-32 rounded-full border border-[var(--secondary)]/30 bg-[var(--bg)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors text-[var(--text)] placeholder-[var(--text)]/40"
                        />
                        <button 
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className="absolute right-1.5 h-11 px-6 bg-[var(--text)] text-[var(--bg)] font-bold rounded-full hover:bg-[var(--primary)] hover:text-white transition-all focus:outline-none disabled:opacity-70 flex items-center justify-center min-w-[100px]"
                        >
                            {status === 'loading' ? (
                                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : status === 'success' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            ) : (
                                "Subscribe"
                            )}
                        </button>
                    </div>
                    {status === 'success' && (
                        <p className="absolute -bottom-8 left-0 right-0 text-green-500 font-medium text-sm animate-bounce">
                            Welcome to the club! Check your inbox.
                        </p>
                    )}
                </form>
                
                <p className="mt-8 text-xs opacity-50 uppercase tracking-widest">
                    We respect your privacy. Unsubscribe at any time.
                </p>

            </div>
        </section>
    );
}
