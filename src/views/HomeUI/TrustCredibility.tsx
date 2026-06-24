"use client";
import React from "react";
import Reveal from "../AboutUI/shared/Reveal";
import useCountUp from "../AboutUI/shared/useCountUp";

// All statistics live here — edit values/labels without touching the UI below.
const TRUST_STATS = [
  { value: 10000, decimals: 0, suffix: "+", label: "Orders Printed" },
  { value: 4.9, decimals: 1, suffix: "★", label: "Average Rating" },
  { value: 150, decimals: 0, suffix: "+", label: "Cities Reached" },
  { value: 98, decimals: 0, suffix: "%", label: "Customer Satisfaction" },
];

function Stat({ stat }: { stat: (typeof TRUST_STATS)[number] }) {
  const scale = 10 ** stat.decimals;
  const { ref, value } = useCountUp(Math.round(stat.value * scale));
  const display =
    stat.decimals > 0
      ? (value / scale).toFixed(stat.decimals)
      : value.toLocaleString("en-IN");

  return (
    // Divider logic (brand-tinted hairlines):
    // mobile 2x2 -> left border on right column, top border on bottom row
    // desktop row -> left border on every item except the first
    <div
      className="group relative px-3 py-4 sm:px-6 sm:py-5 text-center
        border-[var(--text)]/10
        [&:nth-child(even)]:border-l
        [&:nth-child(n+3)]:border-t
        lg:border-l lg:[&:nth-child(1)]:border-l-0 lg:[&:nth-child(n+3)]:border-t-0"
    >
      <p className="text-2xl sm:text-3xl lg:text-[2.5rem] font-bold tracking-tight tabular-nums leading-none text-[var(--text)] transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
        <span ref={ref}>{display}</span>
        <span className="text-[var(--primary)]">{stat.suffix}</span>
      </p>
      <p className="mt-1.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text)]/45 transition-colors duration-300 group-hover:text-[var(--text)]/70">
        {stat.label}
      </p>
    </div>
  );
}

export default function TrustCredibility() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="relative z-20 py-8 sm:py-10"
    >
      <h2 id="trust-heading" className="sr-only">
        India&apos;s Trusted Premium Printing Services Partner
      </h2>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal y={24}>
          {/* Compact luxury trust bar — thin hairline border, no heavy shadow */}
          <div className="rounded-2xl border border-[var(--text)]/10 bg-[var(--bg)]/50 dark:bg-white/[0.03] backdrop-blur-sm">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {TRUST_STATS.map((stat) => (
                <Stat key={stat.label} stat={stat} />
              ))}
            </div>
          </div>

          <p className="mt-4 text-center text-xs sm:text-sm text-[var(--text)]/50">
            Trusted by startups, businesses, creators, and brands across India.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
