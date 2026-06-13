"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "./shared/SectionHeading";
import Reveal from "./shared/Reveal";
import AboutIcon from "./shared/AboutIcon";
import { resolveImage } from "@/lib/imageUtils";

export default function WhatWeDo({ data }: { data: any }) {
  if (!data) return null;

  const services = (data.services || []).filter(Boolean);
  if (services.length === 0) return null;

  return (
    <section id="what-we-do" className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading heading={data.heading} subheading={data.subheading} align="center" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
          {services.map((s: any, i: number) => (
            <Reveal key={s._id || i} delay={i * 0.06} className="group h-full">
              <div className="h-full rounded-3xl border border-[var(--text)]/10 bg-white/70 dark:bg-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-7 md:p-8 flex flex-col">
                {s.image && (
                  <img
                    src={resolveImage(s.image)}
                    alt={s.title ? `${s.title} - PrintVoz` : "PrintVoz service"}
                    loading="lazy"
                    className="rounded-2xl h-40 w-full object-cover mb-6"
                  />
                )}

                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-300">
                  <AboutIcon name={s.icon} className="w-6 h-6 md:w-7 md:h-7" />
                </div>

                {s.title && (
                  <h3 className="text-xl font-black mt-5 text-[var(--text)]">{s.title}</h3>
                )}
                {s.description && (
                  <p className="text-sm md:text-base text-[var(--text)]/70 mt-3 leading-relaxed flex-1">
                    {s.description}
                  </p>
                )}

                {s.link && (
                  <Link
                    href={s.link}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[var(--primary)] group-hover:gap-3 transition-all"
                    aria-label={s.title ? `Explore ${s.title}` : "Explore this service"}
                  >
                    Explore
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
