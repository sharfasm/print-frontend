"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "../AboutUI/shared/Reveal";

// CTA copy and destinations — edit here without touching the UI below.
const BULK_CTA = {
  badge: "Bulk Printing Solutions",
  heading: "Need Bulk Printing For Your Business?",
  subtitle:
    "Get custom pricing, dedicated support, and professional printing solutions for large-volume orders.",
  primary: { label: "Request Custom Quote", href: "/contact" },
  secondary: { label: "Contact Our Team", href: "/contact" },
};

export default function BulkOrderCta() {
  return (
    <section
      aria-labelledby="bulk-cta-heading"
      className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--text)]"
    >
      {/* Decorative glow accents */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-[var(--secondary)]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-[var(--secondary)]/15 blur-3xl"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <span className="inline-block border border-[var(--bg)]/30 bg-[var(--bg)]/10 text-[var(--bg)] rounded-full px-5 py-2 text-[11px] md:text-xs font-black tracking-[0.25em] uppercase">
            {BULK_CTA.badge}
          </span>
          <h2
            id="bulk-cta-heading"
            className="mt-6 text-3xl sm:text-5xl font-black tracking-tight leading-[1.1] text-[var(--bg)]"
          >
            {BULK_CTA.heading}
          </h2>
          <p className="mt-5 text-base md:text-lg text-[var(--bg)]/75 leading-relaxed max-w-2xl mx-auto">
            {BULK_CTA.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={BULK_CTA.primary.href}
              className="group inline-flex items-center gap-2.5 bg-[var(--bg)] text-[var(--text)] rounded-full px-9 py-4 font-black hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              {BULK_CTA.primary.label}
              <ArrowRight
                aria-hidden="true"
                className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300"
              />
            </Link>
            <Link
              href={BULK_CTA.secondary.href}
              className="inline-flex items-center border-2 border-[var(--bg)]/40 text-[var(--bg)] rounded-full px-9 py-4 font-black hover:bg-[var(--bg)]/10 hover:border-[var(--bg)] transition-all duration-300"
            >
              {BULK_CTA.secondary.label}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
