"use client";
/**
 * Flagship reading-progress bar — a thin gradient line that tracks scroll.
 * Powered by Framer Motion's useScroll (reads the live scroll position that
 * Lenis drives) + a spring for buttery motion.
 */
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)] pointer-events-none shadow-[0_0_12px_var(--primary)]"
    />
  );
}
