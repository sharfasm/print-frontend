"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { resolveImage } from "@/lib/imageUtils";

const FALLBACK_BG =
  "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&q=80&w=2000";

export default function AboutHero({ data }: { data: any }) {
  if (!data) return null;

  const isVideo = Boolean(data.backgroundMedia) && data.backgroundType === "video";

  return (
    <section
      id="about-hero"
      className="relative h-screen min-h-[560px] w-full overflow-hidden bg-black text-white"
    >
      {/* Background media */}
      {isVideo ? (
        <video
          src={resolveImage(data.backgroundMedia)}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      ) : (
        <Image
          src={data.backgroundMedia ? resolveImage(data.backgroundMedia) : FALLBACK_BG}
          alt="PrintVoz printing production"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: (data.overlayOpacity ?? 60) / 100 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="max-w-4xl"
        >
          {data.badgeText && (
            <span className="inline-block border border-white/30 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 text-xs font-bold tracking-[0.25em] uppercase mb-6">
              {data.badgeText}
            </span>
          )}
          {data.heading && (
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] drop-shadow-2xl">
              {data.heading}
            </h1>
          )}
          {data.subheading && (
            <p className="mt-6 text-base md:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
              {data.subheading}
            </p>
          )}
          {(data.primaryCtaText || data.secondaryCtaText) && (
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              {data.primaryCtaText && (
                <Link
                  href={data.primaryCtaLink || "#"}
                  className="bg-white text-gray-900 hover:bg-[var(--secondary)] font-bold rounded-full px-8 md:px-10 py-4 hover:scale-105 transition-all shadow-2xl"
                >
                  {data.primaryCtaText}
                </Link>
              )}
              {data.secondaryCtaText && (
                <Link
                  href={data.secondaryCtaLink || "#"}
                  className="border-2 border-white/50 text-white rounded-full px-8 md:px-10 py-4 font-bold hover:bg-white/10 hover:border-white transition-all"
                >
                  {data.secondaryCtaText}
                </Link>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {data.showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10" aria-hidden="true">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-8 h-8 text-white/70" />
          </motion.div>
        </div>
      )}
    </section>
  );
}
