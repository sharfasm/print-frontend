"use client";

import { resolveImage } from "@/lib/imageUtils";
import SectionHeading from "./shared/SectionHeading";
import Reveal from "./shared/Reveal";
import AboutIcon from "./shared/AboutIcon";

export default function FounderMessage({ data }: { data: any }) {
  if (!data) return null;

  const paragraphs: string[] =
    typeof data.message === "string"
      ? data.message
          .split("\n\n")
          .map((p: string) => p.trim())
          .filter(Boolean)
      : [];

  const photoAlt = data.founderName
    ? `${data.founderName}${data.founderRole ? `, ${data.founderRole}` : ""}`
    : "PrintVoz founder";

  return (
    <section id="founder-message" className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
          {/* Photo column */}
          <Reveal className="lg:col-span-2">
            {data.photo ? (
              <div className="max-w-sm mx-auto sm:pb-4 sm:pr-4">
                <div className="relative">
                  <img
                    src={resolveImage(data.photo)}
                    alt={photoAlt}
                    loading="lazy"
                    className="relative z-10 rounded-[2rem] aspect-[4/5] w-full object-cover shadow-2xl"
                  />
                  <div
                    className="hidden sm:block absolute inset-0 rounded-[2rem] border-2 border-[var(--primary)]/30 translate-x-4 translate-y-4"
                    aria-hidden="true"
                  />
                </div>
              </div>
            ) : (
              <div className="aspect-[4/5] max-w-sm mx-auto rounded-[2rem] bg-[var(--primary)]/10 flex items-center justify-center">
                <AboutIcon name="Users" className="w-16 h-16 text-[var(--primary)]/40" />
              </div>
            )}
          </Reveal>

          {/* Message column */}
          <div className="lg:col-span-3">
            <SectionHeading align="left" heading={data.heading} />
            <Reveal delay={0.1}>
              {(paragraphs.length > 0 || data.quote) && (
                <AboutIcon
                  name="Quote"
                  className="w-10 h-10 text-[var(--secondary)] mb-4 rotate-180"
                />
              )}
              {paragraphs.length > 0 && (
                <div className="space-y-4">
                  {paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className="text-base md:text-lg text-[var(--text)]/75 leading-relaxed"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              )}
              {data.quote && (
                <p className="mt-6 text-lg md:text-2xl font-bold italic text-[var(--primary)] leading-snug">
                  {data.quote}
                </p>
              )}
              {(data.signatureImage || data.founderName || data.founderRole) && (
                <div className="mt-8">
                  {data.signatureImage && (
                    <img
                      src={resolveImage(data.signatureImage)}
                      alt={
                        data.founderName
                          ? `${data.founderName} signature`
                          : "Founder signature"
                      }
                      loading="lazy"
                      className="h-14 w-auto mb-3"
                    />
                  )}
                  {data.founderName && (
                    <p className="font-black text-lg text-[var(--text)]">
                      {data.founderName}
                    </p>
                  )}
                  {data.founderRole && (
                    <p className="text-sm font-bold text-[var(--primary)]">
                      {data.founderRole}
                    </p>
                  )}
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
