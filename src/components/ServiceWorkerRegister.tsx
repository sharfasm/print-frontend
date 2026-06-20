// @ts-nocheck
"use client";
import { useEffect } from "react";

/**
 * Registers the service worker that makes the storefront an installable,
 * offline-capable PWA.
 *
 * Registration is gated to production builds. During `next dev` a service
 * worker would cache HMR chunks and serve stale code, so it is disabled there
 * by default. To exercise the PWA in dev, set NEXT_PUBLIC_PWA_DEV=true (and
 * remember to unregister it afterwards).
 */
const ENABLE_IN_DEV = process.env.NEXT_PUBLIC_PWA_DEV === "true";

const ServiceWorkerRegister = () => {
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!("serviceWorker" in navigator)) return;

        const enabled = process.env.NODE_ENV === "production" || ENABLE_IN_DEV;

        if (!enabled) {
            // Clean up any SW left over from a previous prod build so dev stays fresh.
            navigator.serviceWorker.getRegistrations?.().then((regs) => {
                regs.forEach((r) => r.unregister());
            }).catch(() => {});
            return;
        }

        const register = () => {
            navigator.serviceWorker
                .register("/sw.js", { scope: "/" })
                .catch((err) => console.warn("Service worker registration failed:", err));
        };

        if (document.readyState === "complete") {
            register();
        } else {
            window.addEventListener("load", register);
            return () => window.removeEventListener("load", register);
        }
    }, []);

    return null;
};

export default ServiceWorkerRegister;
