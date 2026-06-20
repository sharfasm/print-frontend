// @ts-nocheck
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useDeviceInfo } from "../hooks/useDeviceInfo";

/**
 * PWA install prompt.
 *
 * - Android / desktop Chromium: captures the `beforeinstallprompt` event and
 *   shows a custom "Install app" banner that calls the native prompt.
 * - iOS Safari: no such event exists, so we show a short "Add to Home Screen"
 *   instruction card instead.
 * - Hidden entirely when already installed (standalone) or inside an in-app
 *   webview (Instagram/Facebook/etc) where install is impossible.
 * - Dismissals are remembered for 7 days so we don't nag.
 */
const DISMISS_KEY = "pwa-install-dismissed-at";
const DISMISS_DAYS = 7;

const IconShare = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0-12l-4 4m4-4l4 4M5 11v6.75A2.25 2.25 0 007.25 20h9.5A2.25 2.25 0 0019 17.75V11" />
    </svg>
);

const IconPlusSquare = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m-3.75 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const IconDownload = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const IconClose = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

function dismissedRecently() {
    try {
        const ts = Number(localStorage.getItem(DISMISS_KEY) || 0);
        if (!ts) return false;
        return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
    } catch {
        return false;
    }
}

const PWAInstallPrompt = () => {
    const device = useDeviceInfo();
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [visible, setVisible] = useState(false);
    const [installing, setInstalling] = useState(false);

    // Capture the Android/desktop install event.
    useEffect(() => {
        const onBeforeInstall = (e) => {
            e.preventDefault(); // stop the mini-infobar; we show our own UI
            setDeferredPrompt(e);
            if (!dismissedRecently()) setVisible(true);
        };
        const onInstalled = () => {
            setVisible(false);
            setDeferredPrompt(null);
            try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
        };
        window.addEventListener("beforeinstallprompt", onBeforeInstall);
        window.addEventListener("appinstalled", onInstalled);
        return () => {
            window.removeEventListener("beforeinstallprompt", onBeforeInstall);
            window.removeEventListener("appinstalled", onInstalled);
        };
    }, []);

    // iOS has no install event — decide to show the manual hint once mounted.
    useEffect(() => {
        if (!device.mounted) return;
        if (device.isStandalone || device.isInAppBrowser) return;
        if (dismissedRecently()) return;
        if (device.isIOS && device.isSafari) {
            const t = setTimeout(() => setVisible(true), 2500); // let the page settle first
            return () => clearTimeout(t);
        }
    }, [device]);

    const dismiss = useCallback(() => {
        setVisible(false);
        try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
    }, []);

    const install = useCallback(async () => {
        if (!deferredPrompt) return;
        setInstalling(true);
        try {
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
        } catch {
            /* user dismissed the native sheet */
        } finally {
            setInstalling(false);
            setDeferredPrompt(null);
            setVisible(false);
        }
    }, [deferredPrompt]);

    // Nothing to show.
    if (!device.mounted || !visible) return null;
    if (device.isStandalone || device.isInAppBrowser) return null;

    const isIOSHint = device.isIOS && device.isSafari && !deferredPrompt;
    if (!deferredPrompt && !isIOSHint) return null;

    // Sit above the BottomNav (h-16) on mobile; bottom-right card on desktop.
    return (
        <div
            role="dialog"
            aria-label="Install Printvoz app"
            className="fixed left-3 right-3 z-[55] sm:left-auto sm:right-5 sm:max-w-sm animate-pwa-rise"
            style={{ bottom: "calc(env(safe-area-inset-bottom) + 4.75rem)" }}
        >
            <div className="relative rounded-2xl bg-[var(--bg)]/95 backdrop-blur-xl border border-[var(--secondary)]/25 shadow-2xl p-4 pr-10 text-[var(--text)]">
                <button
                    onClick={dismiss}
                    aria-label="Dismiss"
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-[var(--text)]/50 hover:bg-[var(--secondary)]/10 transition-colors"
                >
                    <IconClose className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[var(--primary)] flex items-center justify-center shrink-0 shadow-sm">
                        <img src="/icons/icon-192x192.png" alt="" className="w-11 h-11 rounded-xl object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div className="min-w-0">
                        <p className="font-black text-sm leading-tight">Install Printvoz</p>
                        <p className="text-[12px] text-[var(--text)]/60 mt-0.5">
                            {isIOSHint
                                ? "Add to your Home Screen for a faster, full-screen app."
                                : "Get the app — faster, offline-ready, no app store needed."}
                        </p>
                    </div>
                </div>

                {isIOSHint ? (
                    <div className="mt-3 space-y-1.5 text-[12px] text-[var(--text)]/75">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--secondary)]/15 text-[10px] font-bold shrink-0">1</span>
                            <span className="flex items-center gap-1">Tap the <IconShare className="w-4 h-4 inline text-[var(--primary)]" /> <b>Share</b> button</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--secondary)]/15 text-[10px] font-bold shrink-0">2</span>
                            <span className="flex items-center gap-1">Choose <IconPlusSquare className="w-4 h-4 inline text-[var(--primary)]" /> <b>Add to Home Screen</b></span>
                        </div>
                    </div>
                ) : (
                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={install}
                            disabled={installing}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all touch-manipulation disabled:opacity-60"
                        >
                            <IconDownload className="w-4 h-4" />
                            {installing ? "Installing…" : "Install app"}
                        </button>
                        <button
                            onClick={dismiss}
                            className="px-4 py-2.5 rounded-xl border border-[var(--secondary)]/25 font-semibold text-sm hover:bg-[var(--secondary)]/10 active:scale-95 transition-all touch-manipulation"
                        >
                            Later
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PWAInstallPrompt;
