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

function StatCard({ stat, index }: { stat: (typeof TRUST_STATS)[number]; index: number }) {
  const scale = 10 ** stat.decimals;
  const { ref, value } = useCountUp(Math.round(stat.value * scale));
  const display =
    stat.decimals > 0
      ? (value / scale).toFixed(stat.decimals)
      : value.toLocaleString("en-IN");

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <div className="h-full rounded-2xl md:rounded-3xl bg-white/60 dark:bg-white/5 border border-[var(--text)]/5 px-3 py-6 sm:p-7 lg:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-[0_18px_40px_-14px_rgba(80,80,57,0.4)]">
        <p className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--text)] tabular-nums leading-none">
          <span ref={ref}>{display}</span>
          <span className="text-[var(--primary)]">{stat.suffix}</span>
        </p>
        <p className="mt-2 text-[11px] sm:text-xs lg:text-sm font-semibold uppercase tracking-wider text-[var(--text)]/60">
          {stat.label}
        </p>
      </div>
    </Reveal>
  );
}

export default function TrustCredibility() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="relative z-20 pt-12 sm:pt-16 lg:pt-20 pb-4"
    >
      <h2 id="trust-heading" className="sr-only">
        India&apos;s Trusted Premium Printing Services Partner
      </h2>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal y={36}>
          {/* Subtle brand-gradient hairline border around the glass card */}
          <div className="rounded-[2rem] md:rounded-[2.5rem] p-[1.5px] bg-gradient-to-br from-[var(--primary)]/35 via-[var(--secondary)]/25 to-[var(--primary)]/10 shadow-[0_24px_60px_-20px_rgba(18,26,27,0.35)]">
            <div className="rounded-[calc(2rem-1.5px)] md:rounded-[calc(2.5rem-1.5px)] bg-[var(--bg)]/80 dark:bg-[#161f20]/85 backdrop-blur-xl p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {TRUST_STATS.map((stat, i) => (
                  <StatCard key={stat.label} stat={stat} index={i} />
                ))}
              </div>

              <Reveal delay={0.35}>
                <p className="mt-5 md:mt-7 text-center text-sm md:text-base text-[var(--text)]/60">
                  Trusted by startups, businesses, creators, and brands across India.
                </p>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
