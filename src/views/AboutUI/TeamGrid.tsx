"use client";
import React from "react";
import SectionHeading from "./shared/SectionHeading";
import Reveal from "./shared/Reveal";
import { resolveImage } from "@/lib/imageUtils";

export default function TeamGrid({ data }: { data: any }) {
  if (!data) return null;
  const members: any[] = Array.isArray(data.members) ? data.members : [];
  if (!data.heading && !data.subheading && members.length === 0) return null;

  return (
    <section id="meet-the-team" className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading heading={data.heading} subheading={data.subheading} align="center" />

        {members.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
            {members.map((m: any, i: number) => (
              <Reveal key={m._id || i} delay={i * 0.06}>
                <div className="group">
                  {m.photo ? (
                    <img
                      src={resolveImage(m.photo)}
                      alt={m.name ? `${m.name}${m.role ? `, ${m.role}` : ""}` : "Team member portrait"}
                      loading="lazy"
                      className="w-full aspect-[4/5] rounded-3xl object-cover shadow-md group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300"
                    />
                  ) : (
                    <div
                      className="w-full aspect-[4/5] rounded-3xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] text-5xl font-black"
                      aria-hidden="true"
                    >
                      {(m.name || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  {m.name && <h3 className="font-black text-base md:text-lg mt-4">{m.name}</h3>}
                  {m.role && <p className="text-sm font-bold text-[var(--primary)] mt-0.5">{m.role}</p>}
                  {m.bio && (
                    <p className="text-sm text-[var(--text)]/65 mt-2 leading-relaxed line-clamp-3">{m.bio}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
