// @ts-nocheck
/**
 * Centralized, validated access to public runtime configuration.
 *
 * Next.js only inlines `process.env.NEXT_PUBLIC_*` when referenced as a static
 * literal, so the vars are read directly here and re-exported as typed constants.
 * Missing values WARN (in the browser) and fall back to local dev defaults rather
 * than throwing, so production builds/SSR are never broken — in production these
 * are always set, so the fallbacks never trigger and behaviour is unchanged.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ;
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Razorpay PUBLIC key id (safe to expose). The backend also returns this key in
// the create-order response, which the checkout prefers; this is the fallback.
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

if (typeof window !== "undefined") {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.warn("[env] NEXT_PUBLIC_API_URL is not set — using fallback:", API_URL);
  }
  if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    console.warn("[env] NEXT_PUBLIC_BACKEND_URL is not set — using fallback:", BACKEND_URL);
  }
}
