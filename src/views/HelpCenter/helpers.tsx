// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { HelpCircle } from "lucide-react";

/** Debounce any fast-changing value. */
export function useDebounce<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/** Render a lucide icon by its string name (admin-managed); falls back gracefully. */
export function CategoryIcon({ name, className = "w-5 h-5" }: { name?: string; className?: string }) {
  if (name && /^https?:\/\//.test(name)) {
    return <img src={name} alt="" className={`${className} object-contain`} />;
  }
  const Cmp = (name && Icons[name]) || HelpCircle;
  return <Cmp className={className} />;
}

/** Escape regex special chars in a user query. */
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Highlight every occurrence of `query` inside `text` as <mark> spans. */
export function Highlight({ text = "", query = "" }: { text?: string; query?: string }) {
  if (!query || !query.trim()) return <>{text}</>;
  try {
    const parts = String(text).split(new RegExp(`(${escapeRegExp(query.trim())})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.trim().toLowerCase() ? (
            <mark
              key={i}
              className="bg-[var(--secondary)]/40 text-[var(--text)] rounded px-0.5"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  } catch {
    return <>{text}</>;
  }
}

/** Does an FAQ match a free-text query across question/answer/tags? */
export function faqMatchesQuery(faq: any, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    faq.question,
    String(faq.answer || "").replace(/<[^>]*>/g, " "),
    (faq.tags || []).join(" "),
    faq.category?.name,
    faq.subcategory?.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}
