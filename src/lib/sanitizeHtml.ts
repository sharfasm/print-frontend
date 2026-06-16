// @ts-nocheck
import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize admin-authored rich HTML before injecting it via
 * `dangerouslySetInnerHTML`.
 *
 * Uses DOMPurify's DEFAULT profile, which preserves every standard formatting
 * tag the rich-text editor produces (headings, paragraphs, lists, links,
 * emphasis, blockquotes, etc.) while stripping <script>, inline event handlers
 * and `javascript:` URLs. For legitimate content the rendered output is visually
 * identical to before — the change is invisible — but stored-XSS vectors are
 * removed. Works on both server and client (isomorphic).
 */
export const sanitizeHtml = (dirty?: string | null): string => {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty);
};

export default sanitizeHtml;
