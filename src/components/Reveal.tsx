"use client";
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Vertical travel distance in px */
  y?: number;
  /** Delay before the animation starts (seconds) */
  delay?: number;
  /** Animation duration (seconds) */
  duration?: number;
  /** Render as a different element if needed (defaults to div) */
  as?: any;
}

/**
 * Lightweight scroll-reveal wrapper used across the product page.
 * Fades + lifts its children into view once, and fully respects
 * the user's reduced-motion preference.
 */
export default function Reveal({
  children,
  className = '',
  y = 28,
  delay = 0,
  duration = 0.6,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
