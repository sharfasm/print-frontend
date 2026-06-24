"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

// Single source of truth for the sort options. `value` matches the existing
// sortOption state in Products.tsx — API mapping is unchanged there.
export const SORT_OPTIONS = [
  { value: "Popular", label: "Trending", desc: "Discover popular products" },
  { value: "Newest", label: "Newest", desc: "Recently added products" },
  { value: "BestSelling", label: "Best Selling", desc: "Most ordered products" },
  { value: "PriceLowToHigh", label: "Price: Low → High", desc: "Budget friendly first" },
  { value: "PriceHighToLow", label: "Price: High → Low", desc: "Premium products first" },
];

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  /** Stretch the trigger to fill its container (mobile). */
  fullWidth?: boolean;
  /** Side the panel anchors to. */
  align?: "left" | "right";
  className?: string;
}

export default function SortDropdown({
  value,
  onChange,
  fullWidth = false,
  align = "right",
  className = "",
}: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = SORT_OPTIONS.find((o) => o.value === value) || SORT_OPTIONS[0];

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleSelect = (v: string) => {
    onChange(v); // updates products instantly (parent effect refetches)
    setOpen(false); // close after selection
  };

  return (
    <div ref={ref} className={`relative ${fullWidth ? "w-full" : ""} ${className}`}>
      {/* Trigger — premium pill, no native select styling */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Sort products: ${selected.label}`}
        className={`group flex items-center gap-2.5 min-h-[48px] px-4 py-2.5 rounded-2xl border border-[var(--secondary)]/20 bg-white/70 dark:bg-white/5 backdrop-blur text-left text-[var(--text)] transition-colors hover:border-[#A7AA63]/60 focus:outline-none focus:ring-2 focus:ring-[#A7AA63]/50 touch-manipulation ${
          fullWidth ? "w-full justify-between" : ""
        }`}
      >
        <span className="flex flex-col leading-tight">
          <span className="text-[9px] uppercase tracking-[0.18em] text-gray-400 font-semibold">Sort by</span>
          <span className="text-xs font-bold">{selected.label}</span>
        </span>
        <ChevronDown
          size={15}
          className={`${fullWidth ? "ml-auto" : ""} shrink-0 text-gray-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Floating panel — scale + fade in */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label="Sort products"
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.18, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={{ transformOrigin: align === "right" ? "top right" : "top left" }}
            className={`absolute ${
              align === "right" ? "right-0" : "left-0"
            } mt-2 w-[300px] max-w-[calc(100vw-2rem)] z-[60] rounded-[20px] border border-[var(--secondary)]/20 bg-[var(--bg)]/95 dark:bg-[#121A1B]/95 backdrop-blur-xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.35)] p-2`}
          >
            {/* Header */}
            <div className="px-3 pt-2 pb-2.5">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                Sort Products
              </p>
            </div>

            {/* Options — radio-style single select, text only */}
            <div className="space-y-1">
              {SORT_OPTIONS.map((opt) => {
                const active = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full min-h-[48px] flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left transition-all duration-200 touch-manipulation ${
                      active
                        ? "bg-[#A7AA63]/15 border border-[#A7AA63]/60"
                        : "border border-transparent hover:bg-[#A7AA63]/10"
                    }`}
                  >
                    <span className="flex-1 min-w-0">
                      <span
                        className={`block text-[13px] leading-tight text-[var(--text)] ${
                          active ? "font-extrabold" : "font-bold opacity-90"
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span className="block text-[11px] text-gray-400 dark:text-gray-500 truncate">
                        {opt.desc}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        active
                          ? "bg-[#A7AA63] border-[#A7AA63] text-white scale-100"
                          : "border-gray-300 dark:border-white/15 scale-90"
                      }`}
                    >
                      {active && <Check size={12} strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
