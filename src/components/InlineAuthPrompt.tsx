// @ts-nocheck
"use client";
import React from 'react';
import { useRouter, usePathname } from "next/navigation";
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Inline (non-modal) "login to sync" banner shown directly inside the Cart and
 * Wishlist pages for guests. Guests keep a local cart/wishlist; logging in merges
 * it into their account. Renders nothing once the user is authenticated.
 */
const InlineAuthPrompt = ({
    title = "You're browsing as a guest",
    message = "Your items are saved on this device. Log in to sync them to your account and access them anywhere.",
}) => {
    const { isLoggedIn } = useAuth();
    const navigate = useRouter();
    const pathname = usePathname() || '/';

    if (isLoggedIn) return null;

    const goToLogin = () => {
        // Come back to this page after login so the now-synced items are shown.
        navigate.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    };

    return (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-5 sm:p-6">
            <div className="flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                    <LogIn size={20} strokeWidth={2.25} />
                </div>
                <div>
                    <p className="font-black text-sm sm:text-base text-[var(--text)]">{title}</p>
                    <p className="mt-0.5 text-xs sm:text-sm font-medium opacity-70 max-w-xl">{message}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                <button
                    onClick={goToLogin}
                    className="bg-[var(--primary)] text-[var(--bg)] font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition-all whitespace-nowrap"
                >
                    Login to Sync
                </button>
            </div>
        </div>
    );
};

export default InlineAuthPrompt;
