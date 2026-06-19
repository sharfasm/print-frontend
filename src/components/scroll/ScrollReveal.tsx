"use client";
/**
 * Flagship reveal — a native IntersectionObserver decides WHEN an element
 * enters the viewport; Framer Motion handles the smooth enter animation.
 * Lightweight, GPU-friendly, reduced-motion aware.
 *
 *   <ScrollReveal><Card /></ScrollReveal>
 *   <ScrollReveal variant="left" delay={0.1}>…</ScrollReveal>
 */
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Variant = "up" | "down" | "left" | "right" | "fade" | "scale";

const OFFSETS: Record<Variant, { x?: number; y?: number; scale?: number }> = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 28 },
  right: { x: -28 },
  fade: {},
  scale: { scale: 0.94 },
};

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number; // 0–1 visible ratio before triggering
  className?: string;
}

// Reusable IntersectionObserver hook
export function useInView<T extends HTMLElement = HTMLDivElement>(
  { once = true, amount = 0.18, rootMargin = "0px 0px -8% 0px" } = {}
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: amount, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, amount, rootMargin]);

  return { ref, inView };
}

export default function ScrollReveal({
  children,
  variant = "up",
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.18,
  className = "",
}: ScrollRevealProps) {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ once, amount });
  const off = OFFSETS[variant];

  const hidden = reduce
    ? { opacity: 0 }
    : { opacity: 0, x: off.x ?? 0, y: off.y ?? 0, scale: off.scale ?? 1 };
  const shown = { opacity: 1, x: 0, y: 0, scale: 1 };

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={inView ? shown : hidden}
      transition={{ duration: reduce ? 0.2 : duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
