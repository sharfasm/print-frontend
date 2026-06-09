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
 * Resolves an image source to a full URL.
 * Prepends the backend URL if the source is a relative path (e.g., /uploads/...).
 * Returns a placeholder if the source is missing.
 */
export const resolveImage = (src: string | null | undefined): string => {
    if (!src) return "https://placehold.co/600x800?text=No+Image";
    
    let resolved = src;

    // If it's already a full URL (Cloudinary or absolute path), return as is
    if (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')) {
        resolved = src;
    } else if (src.startsWith('/uploads')) {
        resolved = `${config.backend}${src}`;
    } else if (src.startsWith('uploads/')) {
        resolved = `${config.backend}/${src}`;
    } else if (!src.startsWith('/') && !src.includes('://')) {
        resolved = `${config.backend}/uploads/${src}`;
    } else {
        resolved = `${config.backend}${src}`;
    }

    // Safely encode URI to handle spaces and special characters without double-encoding %
    return encodeURI(optimizeCloudinaryUrl(resolved));
};

