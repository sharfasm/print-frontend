// @ts-nocheck
"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import SectionHeading from "../AboutUI/shared/SectionHeading";
import Reveal from "../AboutUI/shared/Reveal";

export default function FaqSection({ data }: { data: any }) {
  const [open, setOpen] = useState<number | null>(0);

  if (!data) return null;

  const allItems: any[] = Array.isArray(data.items) ? data.items : [];
  // Limit to max 5 FAQ items as per specs
  const items = allItems.slice(0, 5);

  if (items.length === 0) return null;

  return (
    <section id="faq" className="py-16 md:py-24 overflow-hidden bg-white/50 dark:bg-white/[0.03]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          heading={data.heading || "Frequently Asked Questions"}
          subheading={data.subheading || "Find answers to commonly asked questions about our custom printing services."}
          align="center"
        />

        <div className="space-y-3">
          {items.map((item: any, i: number) => {
            const isOpen = open === i;
            const panelId = `contact-faq-panel-${item._id || i}`;
            return (
              <Reveal key={item._id || i} delay={i * 0.05}>
                <div className="rounded-2xl border border-[var(--text)]/10 bg-white dark:bg-[#1a2526] overflow-hidden hover:shadow-md transition-shadow">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 text-left px-5 md:px-7 py-5 font-bold text-sm md:text-base text-[var(--text)]"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 shrink-0 text-[var(--primary)] transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 md:px-7 pb-5 text-sm md:text-base text-[var(--text)]/70 leading-relaxed">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        {allItems.length > 5 && (
          <div className="mt-10 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-[var(--primary)] font-bold hover:underline group"
            >
              View All FAQs
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
