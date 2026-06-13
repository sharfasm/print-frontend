// @ts-nocheck
"use client";

import { ShieldCheck, Zap, Star, Clock, Briefcase, Lock } from "lucide-react";
import Reveal from "../AboutUI/shared/Reveal";

const BADGES = [
  { icon: ShieldCheck, label: "Verified Business" },
  { icon: Lock, label: "Secure Communication" },
  { icon: Zap, label: "Fast Response" },
  { icon: Star, label: "4.9★ Satisfaction" },
  { icon: Clock, label: "Business Hours" },
  { icon: Briefcase, label: "Professional Support" },
];

export default function TrustBadges() {
  return (
    <section className="py-6 md:py-8 overflow-hidden border-b border-[var(--text)]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          {/* Desktop: static grid */}
          <div className="hidden md:flex items-center justify-center gap-8 lg:gap-12 flex-wrap">
            {BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.label}
                  className="flex items-center gap-2.5 text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors"
                >
                  <Icon size={18} strokeWidth={2} />
                  <span className="text-xs font-bold tracking-wide uppercase">{badge.label}</span>
                </div>
              );
            })}
          </div>

          {/* Mobile: scrolling marquee */}
          <div className="md:hidden overflow-hidden">
            <div className="animate-marquee">
              {[...BADGES, ...BADGES].map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={`${badge.label}-${i}`}
                    className="flex items-center gap-2 text-[var(--text)]/60 mx-5 flex-shrink-0"
                  >
                    <Icon size={16} strokeWidth={2} />
                    <span className="text-[11px] font-bold tracking-wide uppercase whitespace-nowrap">
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
