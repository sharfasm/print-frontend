"use client";
import React from "react";

// Stylized India outline. City dots from the CMS are positioned with percentage
// coordinates over a container that must keep this 100:110 aspect ratio
// (e.g. className="aspect-[10/11]") so the points line up with the silhouette.
export default function IndiaMapSvg({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 110"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Map of India"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M44 3
           L50 7 L47 12
           L55 17 L63 22 L70 26 L78 28 L81 30
           L86 30 L93 32 L97 35 L93 39 L86 38 L80 42 L76 46
           L74 49 L68 52
           L62 57 L55 66 L50 73 L49 78 L45 86 L41 93 L40 95
           L37 90 L35 84 L31 74 L28 64 L26 57 L24 52
           L20 52 L13 49 L11 44 L16 40 L22 40
           L24 36 L28 30 L32 24 L35 18 L38 12 L41 7 Z"
        fill="var(--primary)"
        fillOpacity="0.08"
        stroke="var(--primary)"
        strokeOpacity="0.45"
        strokeWidth="0.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
