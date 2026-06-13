"use client";

import { CheckCircle2 } from "lucide-react";
import { resolveImage } from "@/lib/imageUtils";
import SectionHeading from "./shared/SectionHeading";
import Reveal from "./shared/Reveal";
import AboutIcon from "./shared/AboutIcon";

export default function WhoWeAre({ data }: { data: any }) {
  if (!data) return null;

  const paragraphs: string[] =
    typeof data.content === "string"
      ? data.content
          .split("\n\n")
          .map((p: string) => p.trim())
          .filter(Boolean)
      : [];
  const highlights: string[] = Array.isArray(data.highlights)
    ? data.highlights.filter(Boolean)
    : [];

  return (
    <section id="who-we-are" className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text column */}
          <div>
            <SectionHeading
              align="left"
              badge={data.badgeText}
              heading={data.heading}
            />
            {(paragraphs.length > 0 || highlights.length > 0) && (
              <Reveal delay={0.05}>
                {paragraphs.length > 0 && (
                  <div className="space-y-4">
                    {paragraphs.map((p, i) => (
                      <p key={i} className="text-[var(--text)]/75 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                )}
                {highlights.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-3 mt-8">
                    {highlights.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2
                          className="w-5 h-5 text-[var(--primary)] shrink-0"
                          aria-hidden="true"
                        />
                        <span className="font-semibold text-sm text-[var(--text)]">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Reveal>
            )}
          </div>

          {/* Media column */}
          <Reveal delay={0.15}>
            {data.image ? (
              <div className="sm:pb-4 sm:pr-4">
                <div className="relative">
                  <img
                    src={resolveImage(data.image)}
                    alt={
                      data.imageAlt ||
                      data.heading ||
                      "The PrintVoz team and production floor"
                    }
                    loading="lazy"
                    className="relative z-10 rounded-[2.5rem] aspect-[4/3] w-full object-cover shadow-2xl"
                  />
                  <div
                    className="hidden sm:block absolute -bottom-4 -right-4 w-full h-full rounded-[2.5rem] border-2 border-[var(--secondary)]"
                    aria-hidden="true"
                  />
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-[2.5rem] bg-gradient-to-br from-[var(--primary)] to-[var(--text)] flex items-center justify-center">
                <AboutIcon name="Printer" className="w-20 h-20 text-[var(--bg)]/40" />
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
