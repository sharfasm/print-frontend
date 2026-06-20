// @ts-nocheck
"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';

/**
 * Route-level error boundary (Next.js App Router convention). If any page throws
 * during render — including from an unexpected / failed API response — the user
 * sees this recoverable screen instead of a broken app. "Try Again" re-renders
 * the segment; the rest of the shell (navbar, etc.) stays intact.
 */
export default function Error({ error, reset }) {
    useEffect(() => {
        // Log for diagnostics; never surface raw errors to the user.
        console.error("Page render error caught by boundary:", error);
    }, [error]);

    return (
        <section className="min-h-[70vh] flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text)] px-6 py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[var(--primary)]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Something went wrong</h1>
            <p className="opacity-70 font-medium mb-8 max-w-md">
                We hit a snag loading this page. Your data is safe — please try again.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={() => reset()}
                    className="bg-[var(--primary)] text-[var(--bg)] font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                    Try Again
                </button>
                <Link
                    href="/"
                    className="bg-[var(--secondary)]/10 text-[var(--text)] font-bold px-8 py-3 rounded-full hover:bg-[var(--secondary)]/20 transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </section>
    );
}
