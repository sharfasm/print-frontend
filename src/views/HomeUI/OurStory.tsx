"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Reveal from "../AboutUI/shared/Reveal";
import useCountUp from "../AboutUI/shared/useCountUp";
import { resolveImage } from "../../lib/imageUtils";
import api from "../../lib/axios";

// All trust-card statistics live here — edit values/labels without touching the UI below.
const TRUST_STATS = [
  { value: 10000, decimals: 0, suffix: "+", label: "Orders Printed", compact: true },
  { value: 4.9, decimals: 1, suffix: "★", label: "Customer Rating", compact: false },
  { value: 150, decimals: 0, suffix: "+", label: "Cities Reached", compact: false },
];

// Fallbacks shown until an admin uploads the two "Our Heritage" images.
const FALLBACK_IMAGE_1 =
  "https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&q=80&w=1200";
const FALLBACK_IMAGE_2 =
  "https://plus.unsplash.com/premium_photo-1672883551901-caa4758abba7?auto=format&fit=crop&q=80&w=1000";

function HeritageStat({ stat }: { stat: (typeof TRUST_STATS)[number] }) {
  const scale = 10 ** stat.decimals;
  const { ref, value } = useCountUp(Math.round(stat.value * scale));
  const raw = value / scale;
  const display = stat.compact
    ? raw >= 1000
      ? `${Math.round(raw / 1000)}K`
      : `${Math.round(raw)}`
    : stat.decimals > 0
      ? raw.toFixed(stat.decimals)
      : `${Math.round(raw)}`;

  return (
    <div>
      <p className="text-3xl sm:text-4xl font-black tracking-tight tabular-nums leading-none">
        <span ref={ref}>{display}</span>
        <span className="text-[var(--primary)]">{stat.suffix}</span>
      </p>
      <p className="mt-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[var(--text)]/55">
        {stat.label}
      </p>
    </div>
  );
}

export default function OurStory({ initialSettings }: { initialSettings?: any }) {
  const reduce = !!useReducedMotion();
  const [settings, setSettings] = useState<any>(initialSettings || null);

  // Always refresh from the API on mount. The home page is ISR-cached
  // (revalidate 3600), so the server-passed `initialSettings` can be stale and
  // miss newly uploaded heritage images — this client fetch picks up the latest.
  useEffect(() => {
    let mounted = true;
    api
      .get("/home-settings")
      .then(({ data }) => {
        if (mounted && data) setSettings(data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const image1 = settings?.heritageImage1 ? resolveImage(settings.heritageImage1) : FALLBACK_IMAGE_1;
  const image2 = settings?.heritageImage2 ? resolveImage(settings.heritageImage2) : FALLBACK_IMAGE_2;

  return (
    <section
      aria-labelledby="heritage-heading"
      className="py-24 md:py-32 bg-[var(--bg)] text-[var(--text)] overflow-hidden relative"
    >
      {/* Subtle background accent */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-1/2 h-full bg-[var(--secondary)]/5 -z-10 rounded-l-[100px] blur-3xl opacity-60"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left: two overlapping editorial images */}
          <div className="w-full lg:w-1/2 relative mb-16 sm:mb-12 lg:mb-0">
            {/* Dashed brand mark accent */}
            <div aria-hidden="true" className="absolute -top-8 -left-8 z-0 hidden md:block">
              <svg
                width="120"
                height="120"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[var(--primary)] opacity-20"
              >
                <circle cx="50" cy="50" r="49" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" />
              </svg>
            </div>

            <div className="relative max-w-[540px] mx-auto lg:mx-0">
              {/* Main image with scale-reveal */}
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5]">
                <motion.img
                  src={image1}
                  alt="PrintVoz heritage — our craft"
                  loading="lazy"
                  initial={reduce ? false : { scale: 1.12 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="w-full h-full object-cover object-center"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
              </div>

              {/* Second image — overlaps the main image, with entrance + gentle float */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 40, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="absolute -bottom-10 right-2 sm:-right-4 lg:-right-10 z-20 w-40 sm:w-48 lg:w-60"
              >
                <motion.div
                  animate={reduce ? undefined : { y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="rounded-[1.75rem] overflow-hidden shadow-[0_24px_55px_-18px_rgba(18,26,27,0.5)] border-4 border-[var(--bg)] aspect-square"
                >
                  <img
                    src={image2}
                    alt="PrintVoz heritage — finished work"
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Right: editorial content */}
          <div className="w-full lg:w-1/2 relative z-10">
            <Reveal>
              <div className="flex items-center gap-4 mb-6">
                <span aria-hidden="true" className="h-[2px] w-12 bg-[var(--primary)]" />
                <span className="text-[var(--primary)] font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
                  Our Heritage
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h2
                id="heritage-heading"
                className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-[1.08] tracking-tight"
              >
                Building Brands <br />
                <span className="text-[var(--primary)]">Through Print.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="space-y-5 text-base md:text-lg text-[var(--text)]/70 leading-relaxed mb-10 font-medium">
                <p>
                  PrintVoz began with a simple belief — every business deserves print that looks as
                  professional as its ambitions. What started as a passion for quality printing has grown
                  into a trusted platform serving thousands of businesses across India.
                </p>
                <p>
                  From business cards to large-format branding, we combine modern technology, premium
                  materials, and genuine craftsmanship to help brands make a lasting impression — one
                  perfect print at a time.
                </p>
              </div>
            </Reveal>

            {/* Stats row with brand accent rule */}
            <Reveal delay={0.2}>
              <div className="flex items-stretch gap-8 sm:gap-12 mb-10 border-l-2 border-[var(--primary)]/70 pl-6">
                {TRUST_STATS.map((stat) => (
                  <HeritageStat key={stat.label} stat={stat} />
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <Link
                href="/about"
                className="group inline-flex items-center justify-center gap-3 font-bold bg-transparent text-[var(--text)] px-8 py-4 border-2 border-[var(--text)] rounded-full w-full sm:w-max hover:bg-[var(--text)] hover:text-[var(--bg)] transition-all duration-300"
              >
                <span>Explore Our Story</span>
                <ArrowRight aria-hidden="true" className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
