"use client";

import SectionHeading from "./shared/SectionHeading";
import Reveal from "./shared/Reveal";
import AboutIcon from "./shared/AboutIcon";

export default function CompanyTimeline({ data }: { data: any }) {
  if (!data) return null;

  const milestones = (data.milestones || []).filter(Boolean);
  if (milestones.length === 0) return null;

  return (
    <section id="company-timeline" className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading heading={data.heading} subheading={data.subheading} align="center" />

        <div className="relative">
          {/* Horizontal connector line behind the year badges */}
          <div
            className="absolute top-[26px] left-0 right-0 h-0.5 bg-[var(--primary)]/20 hidden md:block"
            aria-hidden="true"
          />

          <div className="flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {milestones.map((m: any, i: number) => (
              <Reveal
                key={m._id || i}
                delay={i * 0.06}
                className="snap-center shrink-0 w-[270px] md:w-[300px]"
              >
                {/* Fixed-height row so badge + dot centers sit exactly on the top-[26px] line */}
                <div className="flex h-[52px] items-center gap-3">
                  {m.year && (
                    <span className="relative z-10 inline-flex items-center bg-[var(--primary)] text-white rounded-full px-4 py-1.5 text-sm font-black tracking-wide shadow-lg">
                      {m.year}
                    </span>
                  )}
                  <span
                    className="relative z-10 hidden md:block w-3 h-3 rounded-full bg-[var(--secondary)] ring-4 ring-[var(--secondary)]/25"
                    aria-hidden="true"
                  />
                </div>

                <div className="group mt-5 rounded-3xl border border-[var(--text)]/10 bg-white/70 dark:bg-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-300">
                    <AboutIcon name={m.icon} className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  {m.title && (
                    <h3 className="font-black text-lg mt-4 text-[var(--text)]">{m.title}</h3>
                  )}
                  {m.description && (
                    <p className="text-sm text-[var(--text)]/70 mt-2 leading-relaxed">
                      {m.description}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <p className="md:hidden text-xs opacity-50 text-center">Swipe to explore</p>
        </div>
      </div>
    </section>
  );
}
