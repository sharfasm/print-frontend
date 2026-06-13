"use client";

import SectionHeading from "./shared/SectionHeading";
import Reveal from "./shared/Reveal";
import AboutIcon from "./shared/AboutIcon";
import { resolveImage } from "@/lib/imageUtils";

export default function TechnologyShowcase({ data }: { data: any }) {
  if (!data) return null;

  const equipment = Array.isArray(data.equipment) ? data.equipment.filter(Boolean) : [];
  if (!data.heading && !data.subheading && equipment.length === 0) return null;

  return (
    <section id="technology" className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading heading={data.heading} subheading={data.subheading} align="center" />

        {equipment.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {equipment.map((e: any, i: number) => {
              const specs = Array.isArray(e.specs) ? e.specs.filter(Boolean) : [];
              return (
                <Reveal key={e._id || i} delay={i * 0.06} className="h-full">
                  <div className="group h-full rounded-3xl border border-[var(--text)]/10 bg-white/70 dark:bg-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-0 flex flex-col">
                    {e.image ? (
                      <div className="h-44 w-full overflow-hidden shrink-0">
                        <img
                          src={resolveImage(e.image)}
                          alt={e.name ? `${e.name} printing equipment` : "Printing equipment"}
                          loading="lazy"
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-44 w-full shrink-0 bg-gradient-to-br from-[var(--primary)]/15 to-[var(--secondary)]/20 flex items-center justify-center">
                        <AboutIcon name="Printer" className="w-12 h-12 text-[var(--primary)]/50" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      {e.name && <h3 className="font-black text-lg">{e.name}</h3>}
                      {e.description && (
                        <p className="text-sm text-[var(--text)]/70 mt-2 leading-relaxed flex-1">
                          {e.description}
                        </p>
                      )}
                      {specs.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {specs.map((spec: string, si: number) => (
                            <span
                              key={si}
                              className="text-[11px] font-bold rounded-full bg-[var(--secondary)]/15 text-[var(--text)]/80 px-3 py-1"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
