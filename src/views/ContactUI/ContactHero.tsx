// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { resolveImage } from "@/lib/imageUtils";
import ResponsiveBanner from "@/components/ResponsiveBanner";

const FALLBACK_BG =
  "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=2000";

export default function ContactHero({ data }) {
  if (!data) return null;

  const isVideo = Boolean(data.backgroundMedia) && data.backgroundType === "video";

  return (
    <section
      id="contact-hero"
      className="relative h-screen min-h-[600px] max-h-[900px] w-full overflow-hidden bg-black text-white"
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
        <ResponsiveBanner
          desktopSrc={data.backgroundMediaDesktop || data.backgroundMedia || FALLBACK_BG}
          mobileSrc={data.backgroundMediaMobile || data.backgroundMedia || FALLBACK_BG}
          alt="Contact PrintVoz"
          priority
          className="object-cover"
        />
      )}

      {/* Overlays */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: (data.overlayOpacity ?? 55) / 100 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      {/* Animated grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-4xl">
          {data.badgeText && (
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block border border-white/25 bg-white/10 backdrop-blur-md rounded-full px-6 py-2.5 text-[11px] font-bold tracking-[0.3em] uppercase mb-7"
            >
              {data.badgeText}
            </motion.span>
          )}
          {data.heading && (
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.02] drop-shadow-2xl"
            >
              {data.heading}
            </motion.h1>
          )}
          {data.subheading && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-6 text-base md:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              {data.subheading}
            </motion.p>
          )}
          {(data.primaryCtaText || data.secondaryCtaText) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10 flex flex-wrap gap-4 justify-center"
            >
              {data.primaryCtaText && (
                <Link
                  href={data.primaryCtaLink || "#contact-form"}
                  className="bg-white text-gray-900 hover:bg-[var(--secondary)] hover:text-white font-bold rounded-full px-8 md:px-10 py-4 hover:scale-105 transition-all duration-300 shadow-2xl text-sm md:text-base"
                >
                  {data.primaryCtaText}
                </Link>
              )}
              {data.secondaryCtaText && (
                <Link
                  href={data.secondaryCtaLink || "#contact-form"}
                  className="border-2 border-white/40 text-white rounded-full px-8 md:px-10 py-4 font-bold hover:bg-white/10 hover:border-white transition-all duration-300 text-sm md:text-base"
                >
                  {data.secondaryCtaText}
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      {data.showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10" aria-hidden="true">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-8 h-8 text-white/60" />
          </motion.div>
        </div>
      )}
    </section>
  );
}
