"use client";
/**
 * Flagship scroll engine — the single source of truth that makes Lenis
 * (smooth scroll) and GSAP ScrollTrigger (scroll-driven animation) run off the
 * same clock. Without this, ScrollTrigger reads the native scroll position while
 * Lenis animates a different one, and everything desyncs/jitters.
 *
 * Mount once, inside <ReactLenis>.
 */
import { useEffect } from "react";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollEngine() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;

    // 1) Every Lenis scroll tick updates ScrollTrigger.
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // 2) GSAP's ticker drives Lenis' RAF loop — one clock for both.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
    };
  }, [lenis]);

  // Recalculate trigger positions after route transitions (content height changes).
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 320);
    return () => clearTimeout(id);
  }, [pathname]);

  return null;
}
