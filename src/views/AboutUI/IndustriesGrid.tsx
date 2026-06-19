"use client";
import React from "react";
import SectionHeading from "./shared/SectionHeading";
import Reveal from "./shared/Reveal";
import AboutIcon from "./shared/AboutIcon";
import { resolveImage } from "@/lib/imageUtils";

export default function IndustriesGrid({ data }: { data: any }) {
  if (!data) return null;
  const items = Array.isArray(data.items) ? data.items : [];
  if (!items.length) return null;

  return (
    <section id="industries" className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading heading={data.heading} subheading={data.subheading} align="center" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {items.map((it: any, i: number) => (
            <Reveal key={it._id || i} delay={i * 0.05} className="h-full">
              <div className="group h-full rounded-3xl border border-[var(--text)]/10 bg-white/70 dark:bg-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 py-8 md:py-10 px-4 flex flex-col items-center justify-center gap-4 text-center cursor-default hover:bg-[var(--primary)] hover:border-[var(--primary)]">
                {it.image ? (
                  <img
                    src={resolveImage(it.image)}
                    alt={it.name || "Industry"}
                    loading="lazy"
                    className="w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover shadow-sm"
                  />
                ) : (
                  <AboutIcon
                    name={it.icon}
                    className="w-8 h-8 md:w-9 md:h-9 text-[var(--primary)] group-hover:text-white transition-colors"
                  />
                )}
                {it.name && (
                  <h3 className="font-bold text-sm md:text-base text-[var(--text)] group-hover:text-white transition-colors">
                    {it.name}
                  </h3>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
