"use client";

import { CheckCircle2, ShieldCheck } from "lucide-react";
import SectionHeading from "./shared/SectionHeading";
import Reveal from "./shared/Reveal";

export default function QualityStandards({ data }: { data: any }) {
  if (!data) return null;

  const checklist = Array.isArray(data.checklist) ? data.checklist.filter(Boolean) : [];
  if (!data.heading && !data.subheading && checklist.length === 0) return null;

  return (
    <section id="quality-standards" className="py-16 md:py-24 overflow-hidden bg-white/50 dark:bg-white/[0.03]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: heading + reassurance card */}
          <div>
            <SectionHeading
              align="left"
              badge="Quality Assurance"
              heading={data.heading}
              subheading={data.subheading}
            />
            <Reveal>
              <div className="rounded-3xl bg-[var(--primary)] text-[var(--bg)] p-6 md:p-8 mt-2 flex items-center gap-4">
                <ShieldCheck className="w-10 h-10 shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="font-black">Multi-Point Inspection</h3>
                  <p className="text-[var(--bg)]/75 text-sm">
                    Every single order is verified at each checkpoint before dispatch.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: numbered vertical checklist */}
          {checklist.length > 0 && (
            <div className="relative">
              <div
                className="absolute left-[22px] top-2 bottom-2 w-0.5 bg-[var(--primary)]/15"
                aria-hidden="true"
              />
              <div className="space-y-6">
                {checklist.map((item: any, i: number) => (
                  <Reveal key={item._id || i} delay={i * 0.08}>
                    <div className="flex gap-5">
                      <div className="relative z-10 w-11 h-11 rounded-full bg-[var(--bg)] border-2 border-[var(--primary)] text-[var(--primary)] flex items-center justify-center font-black text-sm shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        {item.title && (
                          <h3 className="font-black text-base md:text-lg flex items-center gap-2">
                            {item.title}
                            <CheckCircle2
                              className="w-4 h-4 text-[var(--primary)]"
                              aria-hidden="true"
                            />
                          </h3>
                        )}
                        {item.description && (
                          <p className="text-sm text-[var(--text)]/70 mt-1">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
