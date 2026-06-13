"use client";
import React from "react";
import Reveal from "./Reveal";

interface SectionHeadingProps {
  badge?: string | null;
  heading?: string | null;
  subheading?: string | null;
  align?: "center" | "left";
  light?: boolean; // for dark section backgrounds
  className?: string;
}

export default function SectionHeading({
  badge,
  heading,
  subheading,
  align = "center",
  light = false,
  className = "",
}: SectionHeadingProps) {
  if (!heading && !badge && !subheading) return null;
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <Reveal className={`max-w-3xl ${align === "center" ? "mx-auto" : ""} mb-12 md:mb-16 ${className}`}>
      <div className={alignCls}>
        {badge && (
          <span
            className={`inline-block text-[11px] md:text-xs font-black tracking-[0.25em] uppercase mb-4 ${
              light ? "text-[var(--secondary)]" : "text-[var(--primary)]"
            }`}
          >
            {badge}
          </span>
        )}
        {heading && (
          <h2
            className={`text-3xl md:text-5xl font-black tracking-tight leading-[1.1] ${
              light ? "text-[var(--bg)]" : "text-[var(--text)]"
            }`}
          >
            {heading}
          </h2>
        )}
        {subheading && (
          <p
            className={`mt-5 text-base md:text-lg leading-relaxed ${
              light ? "text-[var(--bg)]/70" : "text-[var(--text)]/70"
            } ${align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"}`}
          >
            {subheading}
          </p>
        )}
      </div>
    </Reveal>
  );
}
