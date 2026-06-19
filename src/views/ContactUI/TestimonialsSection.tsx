// @ts-nocheck
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import SectionHeading from "../AboutUI/shared/SectionHeading";
import Reveal from "../AboutUI/shared/Reveal";
import { resolveImage } from "@/lib/imageUtils";
import api from "@/lib/axios";

export default function TestimonialsSection({ data }: { data: any }) {
  const [fetched, setFetched] = useState<any[]>([]);
  const [active, setActive] = useState(0);

  // Prefer admin-managed Website Reviews; fall back to CMS items.
  useEffect(() => {
    let alive = true;
    api.get("/reviews/website?page=contact")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        if (alive && list.length) {
          setFetched(list.map((r: any) => ({
            _id: r._id,
            name: r.username,
            company: r.designation || "",
            location: "",
            text: r.message,
            rating: r.rating || 5,
            avatar: r.userImage || "",
          })));
        }
      })
      .catch(() => { /* keep CMS items */ });
    return () => { alive = false; };
  }, []);

  const items: any[] = fetched.length ? fetched : (Array.isArray(data?.items) ? data.items : []);

  const prev = useCallback(() => {
    setActive((p) => (items.length ? (p - 1 + items.length) % items.length : 0));
  }, [items.length]);

  const next = useCallback(() => {
    setActive((p) => (items.length ? (p + 1) % items.length : 0));
  }, [items.length]);

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => {
      setActive((p) => (p + 1) % items.length);
    }, 6000);
    return () => clearInterval(id);
  }, [items.length]);

  if (!items.length) return null;

  const index = active % items.length;
  const t = items[index];
  const rating = Math.max(0, Math.min(5, Number(t?.rating) || 5));
  const meta = [t?.company, t?.location].filter(Boolean).join(" · ");
  const initial = (t?.name || "?").trim().charAt(0).toUpperCase();

  return (
    <section id="testimonials" className="py-16 md:py-24 overflow-hidden bg-white/50 dark:bg-white/[0.03]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          heading={data?.heading || "Client Stories"}
          subheading={data.subheading || "What businesses say about partnering with Printvoz."}
          align="center"
        />

        <Reveal>
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
              >
                <div className="mx-auto max-w-3xl rounded-[2.5rem] bg-white dark:bg-[#1a2526] border border-[var(--text)]/10 shadow-xl p-8 md:p-14 text-center">
                  <div className="flex items-center justify-center gap-1" aria-label={`Rated ${rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < rating
                            ? "fill-[var(--secondary)] text-[var(--secondary)]"
                            : "text-[var(--text)]/15"
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  {t?.text && (
                    <blockquote className="text-lg md:text-2xl font-medium leading-relaxed text-[var(--text)]/85 mt-6">
                      &ldquo;{t.text}&rdquo;
                    </blockquote>
                  )}

                  <div className="mt-8 flex items-center justify-center gap-4">
                    {t?.avatar ? (
                      <img
                        src={resolveImage(t.avatar)}
                        alt={t?.name ? `Portrait of ${t.name}` : "Customer portrait"}
                        loading="lazy"
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-black text-lg"
                        aria-hidden="true"
                      >
                        {initial}
                      </div>
                    )}
                    <div className="text-left">
                      {t?.name && <p className="font-black text-[var(--text)]">{t.name}</p>}
                      {meta && <p className="text-sm text-[var(--text)]/60">{meta}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-[#1a2526] border border-[var(--text)]/10 shadow-lg items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next testimonial"
                  className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-[#1a2526] border border-[var(--text)]/10 shadow-lg items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </>
            )}
          </div>

          {items.length > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {items.map((item: any, i: number) => (
                <button
                  key={item._id || i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className={`h-2.5 rounded-full transition-all ${
                    i === index ? "w-8 bg-[var(--primary)]" : "w-2.5 bg-[var(--text)]/20"
                  }`}
                />
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
