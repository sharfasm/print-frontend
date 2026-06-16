"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "../AboutUI/shared/Reveal";
import { resolveImage } from "@/lib/imageUtils";
import api from "@/lib/axios";

// Seed fallback — shown only until an admin adds items under "Our Work".
const FALLBACK = [
  { image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&q=80&w=1400", category: "Packaging", title: "Luxury Packaging & Gift Boxes", industry: "Premium Retail", href: "/products" },
  { image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800", category: "Custom Apparel", title: "Premium T-Shirt Printing", industry: "Fashion & Retail", href: "/products" },
  { image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&q=80&w=800", category: "Stickers & Labels", title: "Die-Cut Sticker Series", industry: "Creators", href: "/products" },
  { image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800", category: "Drinkware", title: "Custom Mug Printing", industry: "Corporate Gifting", href: "/products" },
  { image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=800", category: "Brand Design", title: "Brand Identity & Print Design", industry: "Agencies", href: "/products" },
];

type Card = { image: string; category?: string; title: string; industry?: string; href: string };

function ProjectCard({ project, featured = false }: { project: Card; featured?: boolean }) {
  return (
    <Link
      href={project.href || "/products"}
      aria-label={`${project.title}${project.category ? ` — ${project.category}` : ""}`}
      className="group relative block h-full w-full overflow-hidden rounded-[1.75rem] md:rounded-[2rem] shadow-lg ring-1 ring-black/5 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary)]/50"
    >
      {/* Image */}
      <img
        src={resolveImage(project.image)}
        alt={project.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />

      {/* Layered premium overlay */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5 group-hover:from-black/90 transition-colors duration-500" />
      <div aria-hidden="true" className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(120%_80%_at_50%_120%,rgba(0,0,0,0.5),transparent)]" />

      {/* Corner arrow chip */}
      <span
        aria-hidden="true"
        className="absolute top-4 right-4 md:top-5 md:right-5 w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 transition-all duration-300 shadow-lg"
      >
        <ArrowUpRight className="w-5 h-5" />
      </span>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        {project.category && (
          <span className="inline-block bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] font-black uppercase tracking-wider rounded-full px-3 py-1 shadow-sm">
            {project.category}
          </span>
        )}
        <h3
          className={`text-white font-black tracking-tight mt-3 leading-tight transition-transform duration-500 group-hover:-translate-y-0.5 ${
            featured ? "text-2xl md:text-3xl lg:text-4xl max-w-md" : "text-base md:text-lg"
          }`}
        >
          {project.title}
        </h3>
        {project.industry && <p className="text-white/60 text-xs font-semibold mt-1">{project.industry}</p>}

        {/* Slide-in "View project" */}
        <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[var(--primary)] opacity-0 max-h-0 -translate-y-1 group-hover:opacity-100 group-hover:max-h-8 group-hover:translate-y-0 transition-all duration-400 overflow-hidden">
          View Project <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

export default function PortfolioShowcase() {
  const [cards, setCards] = useState<Card[]>(FALLBACK);

  useEffect(() => {
    let mounted = true;
    api
      .get("/our-work")
      .then(({ data }) => {
        if (!mounted || !Array.isArray(data) || data.length === 0) return;
        setCards(
          data.map((it: any) => ({
            image: it.image,
            category: it.category,
            title: it.title,
            industry: it.subtitle,
            href: it.productSlug ? `/product/${it.productSlug}` : "/products",
          }))
        );
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  if (!cards.length) return null;
  const [featured, ...supporting] = cards;

  return (
    <section
      aria-labelledby="portfolio-heading"
      className="py-20 md:py-28 bg-[var(--bg)] text-[var(--text)] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="inline-block text-[11px] md:text-xs font-black tracking-[0.25em] uppercase text-[var(--primary)] mb-4">
            Our Work
          </span>
          <h2 id="portfolio-heading" className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1]">
            Printing That Speaks For Itself.
          </h2>
          <p className="mt-5 text-base md:text-lg text-[var(--text)]/70 leading-relaxed">
            Explore real printing projects crafted for businesses, startups, creators, and brands across India.
          </p>
        </Reveal>

        {/* Tablet + desktop: editorial bento */}
        <ul className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5 lg:auto-rows-[250px] list-none">
          <li className="col-span-2 lg:row-span-2 aspect-[16/10] lg:aspect-auto">
            <Reveal className="h-full">
              <ProjectCard project={featured} featured />
            </Reveal>
          </li>
          {supporting.map((project, i) => (
            <li key={`${project.title}-${i}`} className="col-span-1 aspect-[4/5] lg:aspect-auto">
              <Reveal delay={(i + 1) * 0.08} className="h-full">
                <ProjectCard project={project} />
              </Reveal>
            </li>
          ))}
        </ul>

        {/* Mobile: swipeable carousel */}
        <div className="md:hidden">
          <ul className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 list-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {cards.map((project, i) => (
              <li key={`${project.title}-m-${i}`} className="w-[80%] shrink-0 snap-center aspect-[4/5]">
                <Reveal delay={i * 0.06} className="h-full">
                  <ProjectCard project={project} featured={i === 0} />
                </Reveal>
              </li>
            ))}
          </ul>
          <p aria-hidden="true" className="text-center text-xs text-[var(--text)]/50 font-semibold">
            Swipe to explore
          </p>
        </div>
      </div>
    </section>
  );
}
