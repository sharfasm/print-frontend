import config from "../brand/config";

/**
 * Automatically inserts Cloudinary optimization flags (f_auto, q_auto)
 * to serve compressed modern formats like WebP or AVIF.
 */
export const optimizeCloudinaryUrl = (url: string): string => {
    if (!url || !url.includes('res.cloudinary.com')) return url;
    if (url.includes('/f_auto') || url.includes('/q_auto')) return url;

    if (url.includes('/image/upload/')) {
        return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
    }
    if (url.includes('/video/upload/')) {
        return url.replace('/video/upload/', '/video/upload/f_auto,q_auto/');
    }
    return url;
};

/**
 * Resolves a stored path/URL to a full absolute URL.
 * Prepends the backend URL if the source is a relative path (e.g., /uploads/...).
 * Does NOT add any Cloudinary transforms.
 */
const toAbsoluteUrl = (src: string): string => {
    // If it's already a full URL (Cloudinary or absolute path), return as is
    if (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')) {
        return src;
    }
    if (src.startsWith('/uploads')) {
        return `${config.backend}${src}`;
    }
    if (src.startsWith('uploads/')) {
        return `${config.backend}/${src}`;
    }
    if (!src.startsWith('/') && !src.includes('://')) {
        return `${config.backend}/uploads/${src}`;
    }
    return `${config.backend}${src}`;
};

/**
 * Resolves an image source to a full URL.
 * Prepends the backend URL if the source is a relative path (e.g., /uploads/...).
 * Returns a placeholder if the source is missing.
 */
export const resolveImage = (src: string | null | undefined): string => {
    if (!src) return "https://placehold.co/600x800?text=No+Image";

    // Safely encode URI to handle spaces and special characters without double-encoding %
    return encodeURI(optimizeCloudinaryUrl(toAbsoluteUrl(src)));
};

/**
 * Resolves a banner image source for rendering through next/image with the
 * Cloudinary loader below. Unlike resolveImage(), it does NOT bake in any
 * Cloudinary transforms — the loader appends f_auto, q_auto and the per-width
 * sizing instead. Returns "" when no source is provided so callers can decide
 * on a fallback.
 */
export const resolveBannerSrc = (src: string | null | undefined): string => {
    if (!src) return "";
    return encodeURI(toAbsoluteUrl(src));
};

interface CloudinaryLoaderProps {
    src: string;
    width: number;
    quality?: number;
}

/**
 * next/image loader that builds width-specific Cloudinary delivery URLs.
 *
 * Applies ONLY format (f_auto) + quality (q_auto) + width (w_<width>) and caps
 * at the original size with c_limit, so images are never upscaled and never
 * enhanced — colours, brightness, contrast and design stay exactly as uploaded.
 * Non-Cloudinary URLs (local /uploads, Unsplash fallbacks) pass straight
 * through unchanged.
 */
export const cloudinaryLoader = ({ src, width, quality }: CloudinaryLoaderProps): string => {
    if (!src || !src.includes('res.cloudinary.com') || !src.includes('/image/upload/')) {
        return src;
    }
    const q = quality ? `q_${quality}` : 'q_auto';
    const transform = `f_auto,${q},w_${width},c_limit`;
    return src.replace('/image/upload/', `/image/upload/${transform}/`);
};
