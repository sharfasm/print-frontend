// @ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import config from "../../brand/config";
import Reveal from "../AboutUI/shared/Reveal";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

// Curated fallback shown when no FAQs are managed in the admin (home-settings).
// Each entry covers one support category. Admin-managed FAQs always take priority.
const DEFAULT_FAQS = [
  {
    category: "Orders & Ordering",
    question: "How do I place an order?",
    answer:
      "Browse our products, choose your specifications, upload your design, and check out securely online. Our team reviews every file before printing begins.",
  },
  {
    category: "Design & Artwork",
    question: "What file formats do you accept?",
    answer:
      "We accept print-ready PDF, PNG, JPG, and AI files. Not sure about your artwork? Upload it anyway — every order includes a free file check by our prepress team.",
  },
  {
    category: "Printing Quality",
    question: "How do you ensure print quality?",
    answer:
      "Every order passes through multi-point quality checks — file verification, color calibration, production inspection, and finishing review — before it leaves our facility.",
  },
  {
    category: "Delivery & Shipping",
    question: "How long does delivery take?",
    answer:
      "Most orders are produced within 2–4 business days and delivered across India through trusted logistics partners, with tracking on every shipment.",
  },
  {
    category: "Bulk Orders",
    question: "Do you offer bulk pricing?",
    answer:
      "Yes. Large-volume orders get custom pricing, a dedicated support manager, and flexible production schedules. Request a custom quote to get started.",
  },
  {
    category: "Payments",
    question: "Which payment methods are supported?",
    answer:
      "We support UPI, all major credit and debit cards, and net banking — processed through secure, encrypted payment gateways.",
  },
];

export default function FAQ({ faqs: initialFaqs }) {
  const [faqsList, setFaqsList] = useState(initialFaqs || []);
  const [openIndex, setOpenIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (initialFaqs !== undefined) {
      setFaqsList(initialFaqs || []);
      return;
    }

    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${config.api}/home-settings`);
        if (res.ok) {
          const data = await res.json();
          setFaqsList(data.faqs || []);
        }
      } catch (err) {
        console.error("Failed to fetch home FAQs client-side:", err);
      }
    };
    fetchFaqs();
  }, [initialFaqs]);

  // Admin-managed FAQs take priority; otherwise show the curated defaults.
  const items = faqsList && faqsList.length > 0 ? faqsList : DEFAULT_FAQS;

  return (
    <section
      aria-labelledby="faq-heading"
      className="py-20 md:py-28 bg-[var(--secondary)]/5 text-[var(--text)] overflow-hidden"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="text-center mb-12 md:mb-16">
          <span className="inline-block text-[11px] md:text-xs font-black tracking-[0.25em] uppercase text-[var(--primary)] mb-4">
            Frequently Asked Questions
          </span>
          <h2 id="faq-heading" className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1]">
            Have Questions? We&apos;ve Got Answers.
          </h2>
          <p className="mt-5 text-base md:text-lg text-[var(--text)]/70 leading-relaxed">
            Everything you need to know about ordering, design files, production, delivery, and custom printing.
          </p>
        </Reveal>

        {/* Premium accordion */}
        <Reveal delay={0.1}>
          <div className="rounded-[2rem] bg-white/60 dark:bg-white/5 border border-[var(--text)]/8 divide-y divide-[var(--text)]/8 overflow-hidden shadow-sm">
            {items.map((faq, index) => {
              const isOpen = openIndex === index;
              const panelId = `faq-panel-${index}`;
              const buttonId = `faq-button-${index}`;
              return (
                <div key={faq._id || faq.question || index}>
                  <h3>
                    <button
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="w-full flex items-center justify-between gap-4 text-left px-6 md:px-8 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--primary)]/50"
                    >
                      <span className="min-w-0">
                        {typeof faq.category === "string" && faq.category && (
                          <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-[var(--primary)]/10 text-[var(--primary)] rounded-full px-2.5 py-0.5 mb-2">
                            {faq.category}
                          </span>
                        )}
                        <span
                          className={`block font-bold text-base md:text-lg transition-colors duration-300 ${
                            isOpen ? "text-[var(--primary)]" : "text-[var(--text)]"
                          }`}
                        >
                          {faq.question}
                        </span>
                      </span>
                      <Plus
                        aria-hidden="true"
                        className={`w-5 h-5 shrink-0 text-[var(--primary)] transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-6 md:px-8 pb-7 text-base text-[var(--text)]/70 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.answer) }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Support footer */}
        <Reveal delay={0.15}>
          <div className="mt-10 text-center">
            <p className="text-base text-[var(--text)]/70 mb-3">Still have questions?</p>
            <Link
              href="/contact"
              className="inline-flex font-bold text-[var(--primary)] hover:opacity-80 transition-opacity underline underline-offset-4"
            >
              Contact our support team
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
