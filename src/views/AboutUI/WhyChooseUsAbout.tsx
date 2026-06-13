"use client";

import SectionHeading from "./shared/SectionHeading";
import Reveal from "./shared/Reveal";
import AboutIcon from "./shared/AboutIcon";

export default function WhyChooseUsAbout({ data }: { data: any }) {
  if (!data) return null;

  const features = Array.isArray(data.features) ? data.features.filter(Boolean) : [];
  if (!data.heading && !data.subheading && features.length === 0) return null;

  return (
    <section id="why-choose-us" className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading heading={data.heading} subheading={data.subheading} align="center" />

        {features.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {features.map((f: any, i: number) => (
              <Reveal key={f._id || i} delay={i * 0.06} className="h-full">
                <div className="group h-full rounded-3xl border border-[var(--text)]/10 bg-white/70 dark:bg-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 md:p-7 flex items-start gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-300">
                    <AboutIcon name={f.icon} className="w-6 h-6" />
                  </div>
                  <div>
                    {f.title && (
                      <h3 className="font-black text-base md:text-lg">{f.title}</h3>
                    )}
                    {f.description && (
                      <p className="text-sm text-[var(--text)]/70 mt-1.5 leading-relaxed">
                        {f.description}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
