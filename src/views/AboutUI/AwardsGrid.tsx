"use client";
import React from "react";
import SectionHeading from "./shared/SectionHeading";
import Reveal from "./shared/Reveal";
import AboutIcon from "./shared/AboutIcon";
import { resolveImage } from "@/lib/imageUtils";

export default function AwardsGrid({ data }: { data: any }) {
  if (!data) return null;
  const items = Array.isArray(data.items) ? data.items : [];
  if (!items.length) return null;

  return (
    <section id="awards" className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading heading={data.heading} subheading={data.subheading} align="center" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {items.map((a: any, i: number) => (
            <Reveal key={a._id || i} delay={i * 0.06} className="h-full">
              <article className="group h-full rounded-3xl border border-[var(--text)]/10 bg-white/70 dark:bg-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-7 flex flex-col">
                <div className="flex items-center justify-between">
                  {a.image ? (
                    <img
                      src={resolveImage(a.image)}
                      alt={a.title ? `${a.title} award` : "Award"}
                      loading="lazy"
                      className="w-14 h-14 rounded-2xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-300">
                      <AboutIcon name={a.icon || "Trophy"} className="w-6 h-6" />
                    </div>
                  )}
                  {a.year && (
                    <span className="text-xs font-black bg-[var(--secondary)]/20 text-[var(--text)]/70 rounded-full px-3 py-1">
                      {a.year}
                    </span>
                  )}
                </div>

                {a.title && (
                  <h3 className="font-black text-lg mt-5 text-[var(--text)]">{a.title}</h3>
                )}
                {a.issuer && (
                  <p className="text-xs font-bold text-[var(--primary)] mt-1 uppercase tracking-wider">
                    {a.issuer}
                  </p>
                )}
                {a.description && (
                  <p className="text-sm text-[var(--text)]/70 mt-2 leading-relaxed">
                    {a.description}
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
