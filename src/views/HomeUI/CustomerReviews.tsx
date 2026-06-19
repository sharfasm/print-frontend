"use client";
import React, { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import Reveal from "../AboutUI/shared/Reveal";
import api from "../../lib/axios";

// Fallback testimonials — shown until/unless admin adds approved Website Reviews.
const FALLBACK_TESTIMONIALS = [
  {
    name: "Rahul Menon",
    business: "Retail Business Owner · Kochi",
    rating: 5,
    text: "Outstanding quality and timely delivery. From business cards to store signage, PrintVoz has become our go-to partner for all business printing.",
  },
  {
    name: "Priya Sharma",
    business: "Marketing Manager · Bengaluru",
    rating: 5,
    text: "Perfect for our brand campaigns. The color accuracy and finishing exceeded our expectations — our printed materials finally match our digital brand.",
  },
  {
    name: "Arjun Nair",
    business: "Startup Founder · Mumbai",
    rating: 5,
    text: "Professional support throughout the process. They helped us with print-ready files, suggested better materials, and delivered ahead of schedule.",
  },
];

function StarRow({ rating }: { rating: number }) {
  const safe = Math.max(0, Math.min(5, rating));
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Rated ${safe} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`w-4 h-4 md:w-5 md:h-5 ${
            i < safe ? "fill-[var(--secondary)] text-[var(--secondary)]" : "text-[var(--text)]/15"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: (typeof FALLBACK_TESTIMONIALS)[number] }) {
  return (
    <figure className="h-full rounded-[2rem] bg-white/60 dark:bg-white/5 backdrop-blur border border-[var(--text)]/8 p-7 md:p-9 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-[0_22px_50px_-18px_rgba(80,80,57,0.45)]">
      <div className="flex items-start justify-between gap-4">
        <Quote aria-hidden="true" className="w-9 h-9 text-[var(--secondary)]/50 rotate-180 shrink-0" />
        <StarRow rating={t.rating} />
      </div>
      <blockquote className="mt-5 flex-1">
        <p className="text-base md:text-lg leading-relaxed text-[var(--text)]/80">
          &ldquo;{t.text}&rdquo;
        </p>
      </blockquote>
      <figcaption className="mt-7 flex items-center gap-3.5">
        <span
          aria-hidden="true"
          className="w-11 h-11 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-black text-base shrink-0"
        >
          {t.name.charAt(0)}
        </span>
        <span>
          <span className="block font-black text-sm md:text-base">{t.name}</span>
          <span className="block text-xs font-semibold text-[var(--text)]/55 mt-0.5">{t.business}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function CustomerReviews() {
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);

  useEffect(() => {
    let active = true;
    api.get("/reviews/website?page=home")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        if (active && list.length) {
          setTestimonials(list.map((r: any) => ({
            name: r.username,
            business: r.designation || "",
            rating: r.rating || 5,
            text: r.message,
          })));
        }
      })
      .catch(() => { /* keep fallback */ });
    return () => { active = false; };
  }, []);

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="py-20 md:py-28 bg-[var(--bg)] text-[var(--text)] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="inline-block text-[11px] md:text-xs font-black tracking-[0.25em] uppercase text-[var(--primary)] mb-4">
            Customer Stories
          </span>
          <h2 id="testimonials-heading" className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1]">
            Trusted By Businesses Across India.
          </h2>
          <p className="mt-5 text-base md:text-lg text-[var(--text)]/70 leading-relaxed">
            Real experiences from the businesses, startups, and creators who print with PrintVoz.
          </p>
        </Reveal>

        {/* Tablet + desktop grid */}
        <ul className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 list-none">
          {testimonials.map((t, i) => (
            <li
              key={`${t.name}-${i}`}
              className={i === 2 ? "md:col-span-2 lg:col-span-1" : ""}
            >
              <Reveal delay={i * 0.08} className="h-full">
                <TestimonialCard t={t} />
              </Reveal>
            </li>
          ))}
        </ul>

        {/* Mobile: swipeable carousel */}
        <div className="md:hidden">
          <ul className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 list-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {testimonials.map((t, i) => (
              <li key={`${t.name}-${i}`} className="w-[85%] shrink-0 snap-center">
                <Reveal delay={i * 0.06} className="h-full">
                  <TestimonialCard t={t} />
                </Reveal>
              </li>
            ))}
          </ul>
          <p aria-hidden="true" className="text-center text-xs text-[var(--text)]/50 font-semibold">
            Swipe to explore
          </p>
        </div>
      </div>
    </section>
  );
}
