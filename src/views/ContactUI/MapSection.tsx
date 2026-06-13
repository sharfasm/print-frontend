// @ts-nocheck
"use client";

import { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import SectionHeading from "../AboutUI/shared/SectionHeading";
import Reveal from "../AboutUI/shared/Reveal";

export default function MapSection({ data }: { data: any }) {
  const [isLoading, setIsLoading] = useState(true);

  if (!data || !data.embedUrl) return null;

  const showDirections = data.showDirectionsButton !== false;
  const directionsUrl =
    data.directionsUrl ||
    (data.latitude && data.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.markerTitle || "PrintVoz")}`);

  return (
    <section id="map" className="py-16 md:py-24 bg-[var(--bg)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          heading={data.heading || "Our Location"}
          subheading={data.subheading || "Visit our corporate office or production facility."}
          align="center"
        />

        <Reveal className="relative w-full h-[350px] md:h-[500px] rounded-3xl overflow-hidden border border-[var(--text)]/10 shadow-2xl bg-[var(--text)]/5">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg)] z-10">
              <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
              <span className="mt-4 text-sm font-semibold text-[var(--text)]/60">Loading map location...</span>
            </div>
          )}

          <iframe
            src={data.embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setIsLoading(false)}
            className="w-full h-full grayscale-[20%] contrast-[110%] hover:grayscale-0 transition-all duration-700"
          />

          {showDirections && (
            <div className="absolute bottom-6 right-6 z-20">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-all hover:scale-105 shadow-xl text-sm"
              >
                <MapPin size={16} />
                Get Directions
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
