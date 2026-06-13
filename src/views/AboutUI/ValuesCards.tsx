"use client";
import React from "react";
import SectionHeading from "./shared/SectionHeading";
import Reveal from "./shared/Reveal";
import AboutIcon from "./shared/AboutIcon";

export default function ValuesCards({ data }: { data: any }) {
  if (!data) return null;
  const values: any[] = Array.isArray(data.values) ? data.values : [];
  if (!data.heading && !data.subheading && values.length === 0) return null;

  return (
    <section id="our-values" className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading heading={data.heading} subheading={data.subheading} align="center" />

        {values.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {values.map((v: any, i: number) => (
              <Reveal key={v._id || i} delay={i * 0.07} className="h-full">
                <div className="relative group h-full rounded-3xl border border-[var(--text)]/10 bg-white/70 dark:bg-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-7 md:p-8 pt-9 md:pt-9">
                  <div
                    className="absolute top-0 inset-x-0 h-1.5 bg-[var(--secondary)] group-hover:bg-[var(--primary)] transition-colors"
                    aria-hidden="true"
                  />
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-300">
                    <AboutIcon name={v.icon} className="w-7 h-7 md:w-8 md:h-8" />
                  </div>
                  {v.title && <h3 className="text-xl font-black mt-5">{v.title}</h3>}
                  {v.description && (
                    <p className="text-sm text-[var(--text)]/70 mt-2.5 leading-relaxed">{v.description}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
