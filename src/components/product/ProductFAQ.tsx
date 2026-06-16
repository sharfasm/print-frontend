import React from 'react';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/seo/JsonLd';
import { generateFAQSchema } from '@/lib/seo/schemas';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

interface FAQItem {
  question: string;
  answer: string;
}

interface ProductFAQProps {
  faqs: FAQItem[];
}

export default function ProductFAQ({ faqs }: ProductFAQProps) {
  if (!faqs || faqs.length === 0) return null;

  const faqSchema = generateFAQSchema(faqs);

  return (
    <section 
      id="product-faq-section" 
      className="w-full py-16 border-t border-[var(--secondary)]/20 bg-gradient-to-b from-transparent to-[var(--secondary)]/5"
    >
      <JsonLd schema={faqSchema} />
      <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight uppercase mb-2 text-center text-[var(--text)]">
          Frequently Asked Questions
        </h2>
        <p className="opacity-70 font-medium text-center mb-10 text-sm">
          Everything you need to know about design upload, printing quality, and delivery.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details 
              key={index} 
              className="group border border-[var(--secondary)]/15 rounded-2xl bg-[var(--bg)] p-6 transition-all duration-300 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer focus:outline-none list-none">
                <h3 className="text-lg font-bold text-[var(--text)] pr-4">
                  {faq.question}
                </h3>
                <span className="shrink-0 transition-transform duration-300 group-open:-rotate-180">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2.5} 
                    stroke="currentColor" 
                    className="w-5 h-5 text-[var(--primary)]"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div 
                className="mt-4 text-base opacity-80 leading-relaxed text-[var(--text)] border-t border-[var(--secondary)]/10 pt-4"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.answer) }}
              />
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
