"use client";
import React from "react";
import { CheckCircle2 } from "lucide-react";
import SectionHeading from "./shared/SectionHeading";
import Reveal from "./shared/Reveal";
import IndiaMapSvg from "./IndiaMapSvg";

export default function DeliveryNetworkMap({ data }: { data: any }) {
  if (!data) return null;

  const highlights: string[] = Array.isArray(data.highlights)
    ? data.highlights.filter(Boolean)
    : [];

  return (
    <section id="delivery-network" className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: heading, description, highlights */}
          <div>
            <SectionHeading
              align="left"
              badge="Pan-India Reach"
              heading={data.heading}
              subheading={data.subheading}
            />

            {data.description && (
              <Reveal delay={0.05}>
                <p className="text-[var(--text)]/70 leading-relaxed">
                  {data.description}
                </p>
              </Reveal>
            )}

            {highlights.length > 0 && (
              <Reveal delay={0.1}>
                <ul className="mt-8 space-y-3">
                  {highlights.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2
                        className="w-5 h-5 text-[var(--primary)] shrink-0"
                        aria-hidden="true"
                      />
                      <span className="font-semibold text-sm md:text-base">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>

          {/* Right: stylized India map with pulsing city markers */}
          <Reveal delay={0.15}>
            <div className="relative w-full max-w-[480px] mx-auto aspect-[10/11]">
              <IndiaMapSvg className="w-full h-full" />
              {data.cities
                ?.filter((c: any) => Number.isFinite(c?.x) && Number.isFinite(c?.y))
                .map((c: any) => (
                <div
                  key={c._id || c.name}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: c.x + "%", top: c.y + "%" }}
                >
                  <span className="absolute inline-flex w-4 h-4 -left-2 -top-2 rounded-full bg-[var(--primary)]/40 animate-ping" />
                  <span className="relative block w-2.5 h-2.5 rounded-full bg-[var(--primary)] ring-2 ring-[var(--bg)]" />
                  <span className="absolute left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap text-[11px] font-black bg-[var(--text)] text-[var(--bg)] rounded-full px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
