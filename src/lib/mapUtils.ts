// @ts-nocheck
/**
 * Helpers to turn an admin-provided Google Maps embed (full <iframe> code OR a
 * bare URL) into (a) an iframe-able src and (b) an "Open in Maps" link that opens
 * the exact place the embed shows — not a slightly-off coordinate pin.
 */

// Pull the embed URL out of a full <iframe …> snippet, or return the value as-is.
export const extractEmbedUrl = (raw) => {
    const t = String(raw || "").trim();
    const m = t.match(/src=["']([^"']+)["']/i);
    return m ? m[1] : t;
};

// iframe src — prefer the admin embed; otherwise build an address-based embed
// (normal Google share links can't be iframed, so we fall back to the address).
export const resolveMapEmbedSrc = (raw, address) => {
    const embed = extractEmbedUrl(raw);
    if (/\/maps\/embed/i.test(embed)) return embed;
    return address
        ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
        : "";
};

// "Open in Maps" / "Get Directions" link.
// Priority: the place's CID (opens the exact business card) → center coords → address.
export const resolveMapLink = (raw, address) => {
    const embed = extractEmbedUrl(raw);

    // The embed pb encodes the place feature id as !1s0x<hex>:0x<cidHex>.
    // The second hex is the CID — maps.google.com/?cid=<decimal> opens that place.
    const ftid = embed.match(/!1s0x[0-9a-fA-F]+(?:%3A|:)0x([0-9a-fA-F]+)/);
    if (ftid) {
        try {
            const cid = BigInt(`0x${ftid[1]}`).toString();
            return `https://www.google.com/maps?cid=${cid}`;
        } catch {
            /* fall through to coords */
        }
    }

    // Center coords: !2d<lng>!3d<lat>. Assign by range so the pin isn't swapped.
    const c = embed.match(/!2d([\d.-]+)!3d([\d.-]+)/);
    if (c) {
        const a = parseFloat(c[1]); // longitude
        const b = parseFloat(c[2]); // latitude
        const lat = Math.abs(b) <= 90 ? b : a;
        const lng = Math.abs(b) <= 90 ? a : b;
        return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || "")}`;
};
