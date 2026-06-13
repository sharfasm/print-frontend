"use client";

import { resolveImage } from "@/lib/imageUtils";
import SectionHeading from "./shared/SectionHeading";
import Reveal from "./shared/Reveal";
import AboutIcon from "./shared/AboutIcon";

export default function OurStorySection({ data }: { data: any }) {
  if (!data) return null;

  const paragraphs: string[] =
    typeof data.content === "string"
      ? data.content
          .split("\n\n")
          .map((p: string) => p.trim())
          .filter(Boolean)
      : [];

  return (
    <section id="our-story" className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="rounded-[2.5rem] overflow-hidden bg-[var(--text)] text-[var(--bg)] grid lg:grid-cols-2 shadow-2xl">
            {/* Content side */}
            <div className="p-8 md:p-14 flex flex-col justify-center">
              <SectionHeading
                align="left"
                light
                badge={data.badgeText}
                heading={data.heading}
              />
              {paragraphs.length > 0 && (
                <div className="space-y-4">
                  {paragraphs.map((p, i) => (
                    <p key={i} className="text-[var(--bg)]/70 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              )}
              {data.quote && (
                <blockquote className="mt-8 border-l-4 border-[var(--secondary)] pl-5">
                  <p className="text-lg md:text-xl italic font-medium text-[var(--bg)]/90">
                    {data.quote}
                  </p>
                  {data.quoteAuthor && (
                    <footer className="text-sm font-bold text-[var(--secondary)] mt-2">
                      — {data.quoteAuthor}
                    </footer>
                  )}
                </blockquote>
              )}
            </div>

            {/* Media side */}
            {data.image ? (
              <img
                src={resolveImage(data.image)}
                alt={data.heading || "The PrintVoz story"}
                loading="lazy"
                className="w-full h-64 lg:h-full object-cover"
              />
            ) : (
              <div className="relative min-h-[280px] lg:min-h-full overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]/60 flex items-center justify-center">
                <div
                  className="absolute -top-12 -left-12 w-52 h-52 rounded-full bg-white/10 blur-2xl"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl"
                  aria-hidden="true"
                />
                <AboutIcon name="Quote" className="w-24 h-24 text-white/20" />
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
