"use client";
import { useEffect, useState } from "react";

/**
 * Device / platform detection for PWA install UX.
 *
 * Why this exists: iOS Safari does NOT fire `beforeinstallprompt` and gives no
 * programmatic install — it needs a manual "Share → Add to Home Screen" hint.
 * Android Chrome (and desktop Chromium) DO fire `beforeinstallprompt`. So the
 * install UI has to branch on the platform, which is what this hook detects.
 *
 * SSR-safe: returns `mounted: false` with neutral defaults during server render
 * and the first client paint, then fills in real values inside useEffect. Always
 * guard UI on `mounted` to avoid hydration mismatches.
 */
export type DeviceOS = "ios" | "android" | "windows" | "macos" | "linux" | "unknown";

export interface DeviceInfo {
  /** false during SSR / before the first effect runs */
  mounted: boolean;
  os: DeviceOS;
  /** iPhone, iPod, iPad — incl. iPadOS that masquerades as macOS */
  isIOS: boolean;
  isAndroid: boolean;
  /** phone or tablet form factor */
  isMobile: boolean;
  isSafari: boolean;
  /** running as an installed PWA (standalone display mode) */
  isStandalone: boolean;
  /** Instagram/Facebook/etc in-app webview where install is impossible */
  isInAppBrowser: boolean;
}

const NEUTRAL: DeviceInfo = {
  mounted: false,
  os: "unknown",
  isIOS: false,
  isAndroid: false,
  isMobile: false,
  isSafari: false,
  isStandalone: false,
  isInAppBrowser: false,
};

export function getDeviceInfo(): DeviceInfo {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return NEUTRAL;
  }

  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouch = navigator.maxTouchPoints || 0;

  // iPadOS 13+ reports itself as "MacIntel" — disambiguate via touch points.
  const isIPadOS = platform === "MacIntel" && maxTouch > 1;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || isIPadOS;
  const isAndroid = /Android/.test(ua);
  // Real Safari (not Chrome/Firefox/Edge for iOS which embed "Safari" too).
  const isSafari = /^((?!chrome|android|crios|fxios|edgios|opios).)*safari/i.test(ua);

  let os: DeviceOS = "unknown";
  if (isIOS) os = "ios";
  else if (isAndroid) os = "android";
  else if (/Win/.test(platform)) os = "windows";
  else if (/Mac/.test(platform)) os = "macos";
  else if (/Linux/.test(platform)) os = "linux";

  const isMobile = isIOS || isAndroid || /Mobi/i.test(ua);

  const isStandalone =
    (typeof window.matchMedia === "function" &&
      window.matchMedia("(display-mode: standalone)").matches) ||
    // iOS-only, non-standard:
    (navigator as unknown as { standalone?: boolean }).standalone === true ||
    document.referrer.startsWith("android-app://");

  const isInAppBrowser =
    /FBAN|FBAV|Instagram|Line|Twitter|Snapchat|Pinterest|MicroMessenger|WhatsApp|GSA/i.test(ua);

  return {
    mounted: true,
    os,
    isIOS,
    isAndroid,
    isMobile,
    isSafari,
    isStandalone,
    isInAppBrowser,
  };
}

export function useDeviceInfo(): DeviceInfo {
  const [info, setInfo] = useState<DeviceInfo>(NEUTRAL);

  useEffect(() => {
    setInfo(getDeviceInfo());

    // Re-evaluate if the app gets installed and reopened in standalone mode.
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(display-mode: standalone)");
    const onChange = () => setInfo(getDeviceInfo());
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return info;
}
