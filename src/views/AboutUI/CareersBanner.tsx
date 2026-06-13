"use client";
import React from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import Reveal from "./shared/Reveal";
import { resolveImage } from "@/lib/imageUtils";

export default function CareersBanner({ data }: { data: any }) {
  if (!data) return null;
  if (!data.heading && !data.subheading && !data.ctaText) return null;

  return (
    <section id="careers" className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div
            className={`relative rounded-[2.5rem] overflow-hidden text-center text-[var(--bg)] px-6 py-16 md:py-24 ${
              data.image ? "" : "bg-gradient-to-br from-[var(--primary)] to-[var(--text)]"
            }`}
          >
            {data.image ? (
              <>
                <img
                  src={resolveImage(data.image)}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[var(--text)]/75" aria-hidden="true" />
              </>
            ) : (
              <>
                <div
                  className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-3xl"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-24 -right-10 w-72 h-72 rounded-full bg-white/5 blur-3xl"
                  aria-hidden="true"
                />
              </>
            )}

            <div className="relative z-10 max-w-2xl mx-auto">
              <Briefcase className="w-10 h-10 mx-auto text-[var(--secondary)]" aria-hidden="true" />
              {data.heading && (
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-5">{data.heading}</h2>
              )}
              {data.subheading && (
                <p className="text-[var(--bg)]/75 mt-4 text-base md:text-lg leading-relaxed">{data.subheading}</p>
              )}
              {data.ctaText && (
                <Link
                  href={data.ctaLink || "/contact"}
                  className="inline-block mt-9 bg-[var(--bg)] text-[var(--text)] px-10 py-4 rounded-full font-black hover:bg-[var(--secondary)] hover:scale-105 transition-all shadow-2xl"
                >
                  {data.ctaText}
                </Link>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
