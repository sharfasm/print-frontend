"use client";

import Image from "next/image";
import { resolveBannerSrc, cloudinaryLoader } from "@/lib/imageUtils";

interface ResponsiveBannerProps {
    /** Desktop image (recommended 2400×1000). Served to ≥768px (tablet/laptop/desktop/TV). */
    desktopSrc?: string | null;
    /** Mobile image (recommended 1080×1350). Served to <768px phones. */
    mobileSrc?: string | null;
    alt: string;
    /** Set on the LCP banner (above-the-fold hero) for faster first paint. */
    priority?: boolean;
    /**
     * Classes applied to BOTH images — pass the exact classes the original
     * single image used (e.g. "object-cover opacity-80") so the visual layout
     * is unchanged. Responsive show/hide is handled internally.
     */
    className?: string;
}

/**
 * Drop-in responsive replacement for a single banner <Image>.
 *
 * Renders the same image fill-style but picks a separate desktop/mobile source
 * per device (mobile <768px, desktop from 768px up) and serves each through the
 * Cloudinary loader. It does NOT impose any size of its own — the parent keeps
 * its original dimensions/classes, so the existing UI is preserved exactly; only
 * the image source becomes device-specific.
 *
 * The parent must be `position: relative` (or absolute/fixed) and own the height,
 * exactly as the original single <Image fill> required.
 */
export default function ResponsiveBanner({
    desktopSrc,
    mobileSrc,
    alt,
    priority = false,
    className = "",
}: ResponsiveBannerProps) {
    // Backward-compatible fallbacks: legacy banners may only have one image, so
    // each variant falls back to the other when its own source is missing.
    const desktop = desktopSrc || mobileSrc || "";
    const mobile = mobileSrc || desktopSrc || "";

    if (!desktop && !mobile) return null;

    return (
        <>
            {/* Mobile (<768px). The `1px` sizes hint keeps any preload tiny on
                wider viewports where this variant is hidden. */}
            <Image
                loader={cloudinaryLoader}
                src={resolveBannerSrc(mobile)}
                alt={alt}
                fill
                priority={priority}
                sizes="(max-width: 767px) 100vw, 1px"
                className={`md:hidden ${className}`}
            />
            {/* Tablet / laptop / desktop / TV (≥768px). */}
            <Image
                loader={cloudinaryLoader}
                src={resolveBannerSrc(desktop)}
                alt={alt}
                fill
                priority={priority}
                sizes="(max-width: 767px) 1px, 100vw"
                className={`hidden md:block ${className}`}
            />
        </>
    );
}
