"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "../AboutUI/shared/Reveal";

// All steps live here — edit copy without touching the UI below.
const STEPS = [
  {
    title: "Choose Your Product",
    description: "Browse and select the perfect printing product for your needs.",
  },
  {
    title: "Upload Your Design",
    description: "Upload your artwork or share your requirements with our team.",
  },
  {
    title: "Print & Quality Check",
    description: "Your order is professionally produced and carefully inspected for quality.",
  },
  {
    title: "Delivered To Your Doorstep",
    description: "Securely packed and delivered across India with reliable shipping.",
  },
];

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

function StepNumber({ index, reduce }: { index: number; reduce: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      initial={reduce ? false : { scale: 0.6, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: EASE }}
      className="inline-block text-5xl xl:text-6xl font-black tracking-tight tabular-nums leading-none text-[var(--secondary)]/50 group-hover:text-[var(--primary)] transition-colors duration-300"
    >
      0{index + 1}
    </motion.span>
  );
}

export default function HowItWorks() {
  const reduce = !!useReducedMotion();

  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="py-20 md:py-28 bg-[var(--bg)] text-[var(--text)] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="max-w-3xl mx-auto text-center mb-14 md:mb-20">
          <span className="inline-block text-[11px] md:text-xs font-black tracking-[0.25em] uppercase text-[var(--primary)] mb-4">
            Simple &amp; Hassle-Free Process
          </span>
          <h2 id="how-it-works-heading" className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1]">
            How It Works
          </h2>
          <p className="mt-5 text-base md:text-lg text-[var(--text)]/70 leading-relaxed">
            From product selection to doorstep delivery, we&apos;ve simplified professional printing into four easy steps.
          </p>
        </Reveal>

        {/* Desktop: horizontal process journey */}
        <ol className="hidden lg:grid grid-cols-4 gap-8 relative list-none">
          {/* Connector track + scroll-drawn progress line (between column centers) */}
          <div
            aria-hidden="true"
            className="absolute top-[85px] left-[12.5%] right-[12.5%] h-px bg-[var(--text)]/10"
          />
          <motion.div
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
            style={{ transformOrigin: "left" }}
            className="absolute top-[85px] left-[12.5%] right-[12.5%] h-px bg-[var(--primary)]/60"
          />

          {STEPS.map((step, i) => (
            <li key={step.title} className="group text-center">
              <Reveal delay={i * 0.12} className="flex flex-col items-center">
                <div className="h-16 flex items-end justify-center">
                  <StepNumber index={i} reduce={reduce} />
                </div>
                {/* Dot on the connector line */}
                <span
                  aria-hidden="true"
                  className="mt-4 block w-3 h-3 rounded-full bg-[var(--primary)] ring-4 ring-[var(--bg)] relative z-10 group-hover:scale-125 transition-transform duration-300"
                />
                <h3 className="mt-6 text-lg xl:text-xl font-black tracking-tight group-hover:text-[var(--primary)] transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm xl:text-base text-[var(--text)]/70 leading-relaxed max-w-[16rem]">
                  {step.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* Tablet: 2×2 process layout */}
        <ol className="hidden md:grid lg:hidden grid-cols-2 gap-x-10 gap-y-14 list-none">
          {STEPS.map((step, i) => (
            <li key={step.title} className="group">
              <Reveal delay={i * 0.1}>
                <StepNumber index={i} reduce={reduce} />
                <div
                  aria-hidden="true"
                  className="mt-4 h-px w-16 bg-[var(--primary)]/40 group-hover:w-24 group-hover:bg-[var(--primary)] transition-all duration-300"
                />
                <h3 className="mt-5 text-xl font-black tracking-tight group-hover:text-[var(--primary)] transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-base text-[var(--text)]/70 leading-relaxed">{step.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* Mobile: vertical timeline */}
        <ol className="md:hidden relative list-none pl-1">
          {/* Vertical track + scroll-drawn progress line */}
          <div aria-hidden="true" className="absolute left-[7px] top-3 bottom-3 w-px bg-[var(--text)]/10" />
          <motion.div
            aria-hidden="true"
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
            style={{ transformOrigin: "top" }}
            className="absolute left-[7px] top-3 bottom-3 w-px bg-[var(--primary)]/60"
          />

          {STEPS.map((step, i) => (
            <li key={step.title} className={`group relative flex gap-6 ${i > 0 ? "mt-10" : ""}`}>
              <span
                aria-hidden="true"
                className="mt-1.5 block w-[15px] h-[15px] rounded-full bg-[var(--primary)] ring-4 ring-[var(--bg)] relative z-10 shrink-0"
              />
              <Reveal delay={i * 0.1} className="flex-1 -mt-1">
                <StepNumber index={i} reduce={reduce} />
                <h3 className="mt-3 text-lg font-black tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm text-[var(--text)]/70 leading-relaxed">{step.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
