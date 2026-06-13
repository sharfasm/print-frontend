"use client";
import React from "react";
import SectionHeading from "./shared/SectionHeading";
import Reveal from "./shared/Reveal";
import AboutIcon from "./shared/AboutIcon";
import { resolveImage } from "@/lib/imageUtils";

export default function Sustainability({ data }: { data: any }) {
  if (!data) return null;
  const initiatives: any[] = Array.isArray(data.initiatives) ? data.initiatives : [];
  if (!data.heading && !data.subheading && initiatives.length === 0) return null;

  return (
    <section id="sustainability" className="py-16 md:py-24 overflow-hidden bg-emerald-900/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Responsibility"
          heading={data.heading}
          subheading={data.subheading}
          align="center"
        />

        {initiatives.length > 0 && (
          <div className="grid md:grid-cols-3 gap-5 md:gap-7">
            {initiatives.map((it: any, i: number) => (
              <Reveal key={it._id || i} delay={i * 0.07} className="h-full">
                <div className="group h-full rounded-3xl border border-[var(--text)]/10 bg-white/70 dark:bg-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-7 md:p-8">
                  {it.image && (
                    <img
                      src={resolveImage(it.image)}
                      alt={it.title || "Sustainability initiative"}
                      loading="lazy"
                      className="rounded-2xl h-40 w-full object-cover mb-6"
                    />
                  )}
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <AboutIcon name={it.icon} className="w-7 h-7" />
                  </div>
                  {it.title && <h3 className="font-black text-lg mt-5">{it.title}</h3>}
                  {it.description && (
                    <p className="text-sm text-[var(--text)]/70 mt-2 leading-relaxed">{it.description}</p>
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
