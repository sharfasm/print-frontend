// @ts-nocheck — LogoLoop is untyped (has its own @ts-nocheck), so its props infer as `object`
"use client";
import React from "react";
import SectionHeading from "./shared/SectionHeading";
import Reveal from "./shared/Reveal";
import LogoLoop from "@/components/LogoLoop";
import { resolveImage } from "@/lib/imageUtils";

export default function TrustedByWall({ data }: { data: any }) {
  if (!data?.logos?.length) return null;

  // Only logos with an actual image are rendered (resolveImage(null) would
  // return a placehold.co placeholder, which must never appear in the UI).
  const logos = data.logos
    .filter((l: any) => l?.logo)
    .map((l: any) => ({
      src: resolveImage(l.logo),
      alt: l.name || "Client logo",
      href: l.website || undefined,
    }));

  if (!logos.length) return null;

  return (
    <section id="trusted-by" className="py-14 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading heading={data.heading} subheading={data.subheading} align="center" />

        <Reveal>
          <LogoLoop
            logos={logos}
            speed={60}
            logoHeight={44}
            gap={64}
            pauseOnHover
            fadeOut
            fadeOutColor="#EAE6D2"
            ariaLabel="Brands that trust PrintVoz"
          />
        </Reveal>
      </div>
    </section>
  );
}
