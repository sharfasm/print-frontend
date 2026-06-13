"use client";

import Reveal from "./shared/Reveal";
import AboutIcon from "./shared/AboutIcon";

export default function MissionVision({ mission, vision }: { mission: any; vision: any }) {
  const hasMission = !!(mission && (mission.heading || mission.content));
  const hasVision = !!(vision && (vision.heading || vision.content));
  if (!hasMission && !hasVision) return null;

  const both = hasMission && hasVision;

  return (
    <section
      id="mission-vision"
      className="py-16 md:py-24 overflow-hidden bg-gradient-to-br from-[var(--text)] to-[var(--primary)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid gap-6 md:gap-8 ${both ? "md:grid-cols-2" : "max-w-2xl mx-auto"}`}>
          {hasMission && (
            <Reveal className="h-full">
              <div className="h-full bg-[var(--bg)] rounded-[2rem] p-8 md:p-12">
                <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                  <AboutIcon name={mission.icon} className="w-8 h-8" />
                </div>
                {mission.heading && (
                  <h3 className="text-2xl md:text-3xl font-black mt-6 text-[var(--text)]">
                    {mission.heading}
                  </h3>
                )}
                {mission.content && (
                  <p className="text-[var(--text)]/70 mt-4 text-base md:text-lg leading-relaxed">
                    {mission.content}
                  </p>
                )}
              </div>
            </Reveal>
          )}

          {hasVision && (
            <Reveal delay={hasMission ? 0.12 : 0} className="h-full">
              <div className="h-full bg-[var(--bg)]/10 backdrop-blur-md border border-[var(--bg)]/20 rounded-[2rem] p-8 md:p-12 text-[var(--bg)]">
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg)]/15 text-[var(--secondary)] flex items-center justify-center shrink-0">
                  <AboutIcon name={vision.icon} className="w-8 h-8" />
                </div>
                {vision.heading && (
                  <h3 className="text-2xl md:text-3xl font-black mt-6 text-[var(--bg)]">
                    {vision.heading}
                  </h3>
                )}
                {vision.content && (
                  <p className="text-[var(--bg)]/75 mt-4 text-base md:text-lg leading-relaxed">
                    {vision.content}
                  </p>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
