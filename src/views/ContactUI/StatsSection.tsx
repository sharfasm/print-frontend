// @ts-nocheck
"use client";

import SectionHeading from "../AboutUI/shared/SectionHeading";
import Reveal from "../AboutUI/shared/Reveal";
import ContactIcon from "./shared/ContactIcon";
import useCountUp from "../AboutUI/shared/useCountUp";

function StatItem({ stat, index }: { stat: any; index: number }) {
  const { ref, value } = useCountUp(Number(stat.value) || 0);

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <div className="h-full text-center rounded-3xl border border-[var(--bg)]/10 bg-[var(--bg)]/5 p-6 md:p-10 hover:bg-[var(--bg)]/10 transition-colors">
        <ContactIcon
          name={stat.icon}
          className="w-7 h-7 md:w-9 md:h-9 text-[var(--secondary)] mx-auto"
        />
        <div className="mt-4">
          <span ref={ref} className="text-3xl md:text-5xl font-black text-[var(--bg)] tabular-nums">
            {value.toLocaleString("en-IN")}
          </span>
          {stat.suffix && (
            <span className="text-2xl md:text-4xl font-black text-[var(--secondary)]">
              {stat.suffix}
            </span>
          )}
        </div>
        {stat.label && (
          <div className="mt-2 text-xs md:text-sm font-bold tracking-wider uppercase text-[var(--bg)]/60">
            {stat.label}
          </div>
        )}
      </div>
    </Reveal>
  );
}

export default function StatsSection({ data }: { data: any }) {
  if (!data) return null;

  const stats = (data.stats || []).filter(Boolean);
  if (stats.length === 0) return null;

  return (
    <section id="statistics" className="py-16 md:py-20 bg-[var(--text)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading heading={data.heading} subheading={data.subheading} align="center" light />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {stats.map((stat: any, i: number) => (
            <StatItem key={stat._id || i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
