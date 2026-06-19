// Server-side data prefetch for these pages is best-effort: they are ISR
// (revalidate), so they always refetch at runtime. When the backend is
// unreachable during `next build` (e.g. it isn't running locally), a failed
// prefetch is expected and non-fatal — the page just renders with fallback
// data until the first revalidation.
//
// In that case we log a single tidy line instead of dumping a full
// `TypeError: fetch failed` stack trace, which otherwise makes a successful
// build look broken. Any other (genuine) error is still logged in full.
export function logPrefetchFailure(label: string, err: unknown): void {
  const code =
    (err as { cause?: { code?: string }; code?: string })?.cause?.code ??
    (err as { code?: string })?.code;

  if (code === "ECONNREFUSED" || code === "ENOTFOUND" || code === "ETIMEDOUT") {
    console.warn(`[prefetch] backend unreachable — ${label} will load at runtime`);
  } else {
    console.error(`Failed to prefetch ${label}:`, err);
  }
}
