"use client";
import React from "react";
import { BadgeCheck, Zap, PenTool, Boxes, ShieldCheck, Headphones, type LucideIcon } from "lucide-react";
import Reveal from "../AboutUI/shared/Reveal";

// All value cards live here — edit copy without touching the UI below.
const VALUE_CARDS: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Premium Print Quality",
    description: "High-quality materials, accurate colors, and professional finishing.",
    icon: BadgeCheck,
  },
  {
    title: "Fast Turnaround & Delivery",
    description: "Efficient production and reliable delivery across India.",
    icon: Zap,
  },
  {
    title: "Design Assistance",
    description: "Expert help with artwork, customization, and print-ready files.",
    icon: PenTool,
  },
  {
    title: "Bulk Order Expertise",
    description: "Dedicated support and competitive pricing for large-volume printing.",
    icon: Boxes,
  },
  {
    title: "Secure & Transparent Ordering",
    description: "Safe payments, clear communication, and order tracking.",
    icon: ShieldCheck,
  },
  {
    title: "Trusted Customer Support",
    description: "Responsive assistance before, during, and after every order.",
    icon: Headphones,
  },
];

export default function WhyChooseUs() {
  return (
    <section
      aria-labelledby="why-choose-heading"
      className="py-20 md:py-28 bg-[var(--bg)] text-[var(--text)] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="inline-block text-[11px] md:text-xs font-black tracking-[0.25em] uppercase text-[var(--primary)] mb-4">
            Why Businesses Choose PrintVoz
          </span>
          <h2 id="why-choose-heading" className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1]">
            Why Choose PrintVoz
          </h2>
          <p className="mt-5 text-base md:text-lg text-[var(--text)]/70 leading-relaxed">
            Premium printing solutions trusted by businesses, startups, creators, and brands across India.
          </p>
        </Reveal>

        {/* Bento grid: 1 col mobile, 2 cols tablet+, 2×3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {VALUE_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={i * 0.07} className="h-full">
                <article className="group relative h-full rounded-[1.75rem] md:rounded-[2rem] bg-white/60 dark:bg-white/5 border border-[var(--text)]/8 p-7 md:p-9 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-[0_22px_50px_-18px_rgba(80,80,57,0.45)]">
                  <div className="flex items-start justify-between gap-4">
                    <span
                      aria-hidden="true"
                      className="text-4xl md:text-5xl font-black text-[var(--secondary)]/40 group-hover:text-[var(--primary)]/50 transition-colors leading-none tabular-nums"
                    >
                      0{i + 1}
                    </span>
                    <Icon
                      aria-hidden="true"
                      className="w-6 h-6 md:w-7 md:h-7 shrink-0 text-[var(--primary)]/35 group-hover:text-[var(--primary)] transition-colors"
                    />
                  </div>
                  <h3 className="mt-6 text-lg md:text-xl font-black tracking-tight">{card.title}</h3>
                  <p className="mt-2.5 text-sm md:text-base text-[var(--text)]/70 leading-relaxed">
                    {card.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
