// @ts-nocheck
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, SearchX, Star } from "lucide-react";
import { Highlight } from "./helpers";
import api from "@/lib/axios";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

function AccordionItem({ faq, query, isOpen, onToggle }: any) {
  return (
    <div className="border border-[var(--secondary)]/20 rounded-2xl bg-[var(--bg)] overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <h3>
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4 sm:py-5 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40 rounded-2xl"
        >
          <span className="flex items-start gap-2.5 font-semibold text-[var(--text)] text-[15px] sm:text-base">
            {faq.featured && (
              <Star className="w-4 h-4 mt-0.5 shrink-0 text-[var(--primary)] fill-[var(--primary)]/30" />
            )}
            <span>
              <Highlight text={faq.question} query={query} />
            </span>
          </span>
          <ChevronDown
            className={`w-5 h-5 shrink-0 text-[var(--text)]/50 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-[var(--text)]/75 leading-relaxed prose-faq"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.answer) }}
            />
            {faq.tags?.length > 0 && (
              <div className="px-5 sm:px-6 pb-5 flex flex-wrap gap-2">
                {faq.tags.map((t: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-[var(--secondary)]/10 text-[var(--text)]/60 text-xs font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqContent({ title, description, faqs, query }: any) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (faq: any) => {
    const next = openId === faq._id ? null : faq._id;
    setOpenId(next);
    if (next) {
      // Fire-and-forget view tracking
      api.patch(`/help/faqs/${faq._id}/view`).catch(() => {});
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-[var(--text)]/65 max-w-2xl">{description}</p>
        )}
        <p className="mt-2 text-sm font-semibold text-[var(--primary)]">
          {faqs.length} {faqs.length === 1 ? "question" : "questions"}
        </p>
      </div>

      {faqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-3xl border border-dashed border-[var(--secondary)]/30 bg-[var(--bg)]">
          <SearchX className="w-12 h-12 text-[var(--text)]/30" />
          <p className="mt-4 font-semibold text-[var(--text)]">No matching answers found</p>
          <p className="mt-1 text-sm text-[var(--text)]/60">
            Try a different search, or ask us your question below.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq: any) => (
            <AccordionItem
              key={faq._id}
              faq={faq}
              query={query}
              isOpen={openId === faq._id}
              onToggle={() => toggle(faq)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
