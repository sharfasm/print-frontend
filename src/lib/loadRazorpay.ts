// @ts-nocheck
/**
 * Lazily inject Razorpay's hosted Standard Checkout script exactly once and
 * resolve when the global `window.Razorpay` is ready.
 *
 * Razorpay requires loading checkout.js from their CDN at runtime (it cannot be
 * bundled), so this is loaded on demand rather than in the app shell. Resolves
 * `false` if the script fails to load (e.g. the user is offline), letting the
 * caller surface a friendly error instead of throwing.
 */
let promise: Promise<boolean> | null = null;

export const loadRazorpay = (): Promise<boolean> => {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (promise) return promise;

  promise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      // Allow a later retry by clearing the cached promise.
      promise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return promise;
};

export default loadRazorpay;
