"use client";
import React from "react";
import Link from "next/link";
import Reveal from "./shared/Reveal";
import { resolveImage } from "@/lib/imageUtils";

export default function FinalCta({ data }: { data: any }) {
  if (!data) return null;

  return (
    <section
      id="final-cta"
      className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--text)]"
    >
      {data.backgroundImage && (
        <img
          src={resolveImage(data.backgroundImage)}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
      )}

      {/* Decorative blurred glows */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-[var(--secondary)]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-[var(--secondary)]/15 blur-3xl"
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          {data.heading && (
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--bg)] leading-[1.08]">
              {data.heading}
            </h2>
          )}

          {data.subheading && (
            <p className="mt-6 text-base md:text-lg text-[var(--bg)]/75 leading-relaxed">
              {data.subheading}
            </p>
          )}

          {(data.primaryCtaText || data.secondaryCtaText) && (
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {data.primaryCtaText && (
                <Link
                  href={data.primaryCtaLink || "#"}
                  className="bg-[var(--bg)] text-[var(--text)] px-10 py-4 rounded-full font-black hover:bg-[var(--secondary)] hover:scale-105 transition-all shadow-2xl"
                >
                  {data.primaryCtaText}
                </Link>
              )}
              {data.secondaryCtaText && (
                <Link
                  href={data.secondaryCtaLink || "#"}
                  className="border-2 border-[var(--bg)]/40 text-[var(--bg)] px-10 py-4 rounded-full font-black hover:bg-[var(--bg)]/10 hover:border-[var(--bg)] transition-all"
                >
                  {data.secondaryCtaText}
                </Link>
              )}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
