import config from "../brand/config";

/**
 * Resolves an image source to a full URL.
 * Prepends the backend URL if the source is a relative path (e.g., /uploads/...).
 * Returns a placeholder if the source is missing.
 */
export const resolveImage = (src: string | null | undefined) => {
    if (!src) return "https://placehold.co/600x800?text=No+Image";
    
    // If it's already a full URL (Cloudinary or absolute path), return as is
    if (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')) return src;
    
    // If it's a relative path starting with /uploads, prepend backend URL
    if (src.startsWith('/uploads')) {
        return `${config.backend}${src}`;
    }

    if (src.startsWith('uploads/')) {
        return `${config.backend}/${src}`;
    }
    
    // Fallback: prepend backend URL if it seems like a relative path but doesn't start with /
    if (!src.startsWith('/') && !src.includes('://')) {
        return `${config.backend}/uploads/${src}`;
    }

    return `${config.backend}${src}`;
};
