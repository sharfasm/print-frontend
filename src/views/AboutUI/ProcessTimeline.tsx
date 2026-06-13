"use client";

import SectionHeading from "./shared/SectionHeading";
import Reveal from "./shared/Reveal";
import AboutIcon from "./shared/AboutIcon";

export default function ProcessTimeline({ data }: { data: any }) {
  if (!data) return null;

  const steps = Array.isArray(data.steps) ? data.steps.filter(Boolean) : [];
  if (!data.heading && !data.subheading && steps.length === 0) return null;

  return (
    <section id="our-process" className="py-16 md:py-24 overflow-hidden bg-[var(--text)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading heading={data.heading} subheading={data.subheading} align="center" light />

        {steps.length > 0 && (
          <>
            {/* Desktop: horizontal timeline */}
            <div
              className="hidden lg:grid gap-4 relative"
              style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
            >
              {steps.length > 1 && (
                <div
                  className="absolute top-[28px] left-[8%] right-[8%] h-0.5 bg-[var(--bg)]/15"
                  aria-hidden="true"
                />
              )}
              {steps.map((s: any, i: number) => (
                <Reveal key={s._id || i} delay={i * 0.08}>
                  <div className="text-center">
                    <div className="mx-auto w-14 h-14 rounded-full bg-[var(--secondary)] text-[var(--text)] flex items-center justify-center relative z-10 shadow-lg">
                      <AboutIcon name={s.icon} className="w-6 h-6" />
                    </div>
                    <div className="text-[11px] font-black text-[var(--secondary)] tracking-widest mt-4">
                      STEP {i + 1}
                    </div>
                    {s.title && (
                      <h3 className="text-[var(--bg)] font-black text-sm xl:text-base mt-1">{s.title}</h3>
                    )}
                    {s.description && (
                      <p className="text-xs text-[var(--bg)]/60 mt-2 leading-relaxed">{s.description}</p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Mobile / tablet: vertical rail */}
            <div className="lg:hidden relative pl-2">
              {steps.length > 1 && (
                <div
                  className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-[var(--bg)]/15"
                  aria-hidden="true"
                />
              )}
              <div className="space-y-8">
                {steps.map((s: any, i: number) => (
                  <Reveal key={s._id || i} delay={i * 0.08}>
                    <div className="flex gap-5">
                      <div className="w-12 h-12 rounded-full bg-[var(--secondary)] text-[var(--text)] flex items-center justify-center relative z-10 shrink-0 shadow-lg">
                        <AboutIcon name={s.icon} className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-[var(--secondary)] tracking-widest">
                          STEP {i + 1}
                        </div>
                        {s.title && <h3 className="text-[var(--bg)] font-black">{s.title}</h3>}
                        {s.description && (
                          <p className="text-sm text-[var(--bg)]/60 mt-1">{s.description}</p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
