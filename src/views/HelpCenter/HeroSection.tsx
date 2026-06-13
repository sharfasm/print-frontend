// @ts-nocheck
"use client";
import { motion } from "framer-motion";
import { Search, LifeBuoy, X } from "lucide-react";
import Link from "next/link";

export default function HeroSection({
  hero,
  query,
  setQuery,
  popularSearches,
  searchRef,
}: any) {
  const title = hero?.title || "Frequently Asked Questions";
  const subtitle =
    hero?.subtitle ||
    "Find answers about orders, printing, shipping, refunds, bulk orders, and customer support.";
  const badge = hero?.badgeText || "Help Center";

  return (
    <section className="relative overflow-hidden pt-28 md:pt-36 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8">
      {/* Soft decorative background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] bg-[var(--primary)]/10 rounded-full blur-[120px]" />
        <div className="absolute top-10 -right-24 w-[26rem] h-[26rem] bg-[var(--secondary)]/15 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        {/* Left */}
        <div className="order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold uppercase tracking-widest"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            {badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-5 text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-[var(--text)] leading-[1.05]"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-base sm:text-lg text-[var(--text)]/70 max-w-xl"
          >
            {subtitle}
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-7 relative max-w-xl"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text)]/40" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for answers…"
              aria-label="Search the help center"
              className="w-full pl-14 pr-12 py-4 rounded-2xl bg-[var(--bg)] border border-[var(--secondary)]/30 shadow-lg shadow-[var(--secondary)]/5 text-[var(--text)] placeholder:text-[var(--text)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-[var(--secondary)]/15 text-[var(--text)]/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>

          {/* Popular searches */}
          {popularSearches?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]/50">
                Popular:
              </span>
              <div className="mt-3 flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible">
                {popularSearches.map((p: any) => (
                  <button
                    key={p._id}
                    onClick={() => setQuery(p.query || p.label)}
                    className="shrink-0 px-4 py-2 rounded-full bg-[var(--bg)] border border-[var(--secondary)]/30 text-sm font-semibold text-[var(--text)]/80 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:-translate-y-0.5 transition-all shadow-sm whitespace-nowrap"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right — hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="order-1 lg:order-2 flex justify-center"
        >
          {hero?.image ? (
            <img
              src={hero.image}
              alt={title}
              className="w-full max-w-md lg:max-w-lg rounded-3xl object-cover shadow-2xl shadow-[var(--secondary)]/20"
            />
          ) : (
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl bg-gradient-to-br from-[var(--primary)]/15 to-[var(--secondary)]/20 border border-[var(--secondary)]/20 flex items-center justify-center shadow-2xl shadow-[var(--secondary)]/10">
              <LifeBuoy className="w-24 h-24 text-[var(--primary)]/40" />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
