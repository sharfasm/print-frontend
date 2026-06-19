"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2, Truck, MapPin, Clock, Headphones, Package } from "lucide-react";

/* ────────────────────────────────────────────────────────────
   DATA — city nodes positioned as percentages over the India
   satellite image (x = left%, y = top%). Routes reference cities
   by index. Coords are approx (derived from lat/lon) — fine-tune
   freely against /images/india-map.jpg.
   ──────────────────────────────────────────────────────────── */
type City = {
  name: string;
  lat: number;
  lng: number;
  x: number; // computed left%
  y: number; // computed top%
  region: string;
  hub?: boolean;
  network?: string[];
};

/* Geographic bounds of /images/india-map.jpg (the VIIRS "India at night"
   crop). Equirectangular linear mapping — calibrated so real lat/lng land
   correctly on the satellite image. */
const MAP_BOUNDS = { lonMin: 62.4, lonMax: 93.2, latMin: 7.07, latMax: 36.99 };
const lonToX = (lng: number) => ((lng - MAP_BOUNDS.lonMin) / (MAP_BOUNDS.lonMax - MAP_BOUNDS.lonMin)) * 100;
const latToY = (lat: number) => ((MAP_BOUNDS.latMax - lat) / (MAP_BOUNDS.latMax - MAP_BOUNDS.latMin)) * 100;

// Real lat/lng for every marker → x/y computed from the image bounds above.
const RAW_CITIES: Omit<City, "x" | "y">[] = [
  // HQ — index 0. `network` cities are served from this hub (shown in its tooltip, not as markers).
  { name: "Kozhikode", lat: 11.2588, lng: 75.7804, region: "Kerala", hub: true, network: ["Palakkad", "Malappuram", "Thrissur", "Kasaragod"] },
  { name: "Kochi", lat: 9.9312, lng: 76.2673, region: "Kerala" },
  { name: "Trivandrum", lat: 8.5241, lng: 76.9366, region: "Kerala" },
  { name: "Kannur", lat: 11.8745, lng: 75.3704, region: "Kerala" },
  { name: "Mangalore", lat: 12.9141, lng: 74.8560, region: "Karnataka" },
  { name: "Mysuru", lat: 12.2958, lng: 76.6394, region: "Karnataka" },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, region: "Karnataka" },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, region: "Tamil Nadu" },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867, region: "Telangana" },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777, region: "Maharashtra" },
  { name: "Delhi", lat: 28.6139, lng: 77.2090, region: "Delhi NCR" },
];

const CITIES: City[] = RAW_CITIES.map((c) => ({ ...c, x: lonToX(c.lng), y: latToY(c.lat) }));

// Every delivery route originates from the HQ (Kozhikode, index 0) → each destination.
const HQ = CITIES[0];
const ROUTE_TARGETS = CITIES.map((_, i) => i).filter((i) => i !== 0);

// 115% zoom focused on Kozhikode/Kerala so the south occupies more visual space.
const MAP_TRANSFORM = "scale(1.15)";
const MAP_ORIGIN = `${HQ.x.toFixed(1)}% ${HQ.y.toFixed(1)}%`;

const STATS = [
  { value: "28,000+", label: "Orders Delivered", icon: Package },
  { value: "700+", label: "Cities Served", icon: MapPin },
  { value: "98.7%", label: "On-Time Delivery", icon: Clock },
  { value: "24/7", label: "Tracking Support", icon: Headphones },
];

const PARTNERS = ["Delhivery", "Blue Dart", "DTDC", "XpressBees", "India Post"];

const DEFAULT_BENEFITS = [
  "Express dispatch from regional fulfilment hubs",
  "Real-time tracking on every shipment",
  "98.7% on-time delivery across 700+ cities",
  "Dedicated support for bulk & enterprise orders",
];

// Gentle quadratic curve between two points (percentage space, perpendicular control offset)
const curve = (a: City, b: City) => {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const off = 0.14;
  const cx = mx - dy * off;
  const cy = my + dx * off;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
};

/* ────────────────────────────────────────────────────────────
   MAP PANEL — satellite image + luxury overlay + routes + nodes
   idPrefix keeps SVG ids unique across the mobile/desktop copies.
   ──────────────────────────────────────────────────────────── */
function MapPanel({ idPrefix, floating }: { idPrefix: string; floating?: boolean }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [imgOk, setImgOk] = useState(true);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative"
    >
      {/* Ambient glow behind the card */}
      <div className="pointer-events-none absolute -inset-6 rounded-[40px] bg-[radial-gradient(circle_at_50%_45%,rgba(167,170,99,0.18),transparent_65%)] blur-2xl" aria-hidden="true" />

      {/* Premium map card (fixed aspect; inner layers zoom into South India) */}
      <div className="relative rounded-[32px] border border-white/10 shadow-[0_40px_90px_-35px_rgba(0,0,0,0.75)] bg-[#0a1213] aspect-[1190/1264]">
        {/* Clipped visual layer — satellite image + overlays + routes, scaled 115% */}
        <div className="absolute inset-0 overflow-hidden rounded-[32px]">
          <div className="absolute inset-0" style={{ transform: MAP_TRANSFORM, transformOrigin: MAP_ORIGIN }}>
            {imgOk ? (
              <img
                src="/images/india-map.jpg"
                alt="Map of India showing PrintVoz delivery hubs"
                loading="lazy"
                onError={() => setImgOk(false)}
                className="absolute inset-0 w-full h-full object-cover select-none"
                draggable={false}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#0e1b1c] via-[#13262a] to-[#0b1416]" aria-hidden="true" />
            )}

            {/* Dark luxury overlay + vignette (lighter for better map visibility) */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(0,0,0,0.5)_100%)]" aria-hidden="true" />

            {/* Routes + moving shipments (all originate at Kozhikode) */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full overflow-visible"
              aria-hidden="true"
            >
              {ROUTE_TARGETS.map((ti, i) => {
                const dest = CITIES[ti];
                const isKerala = dest.region === "Kerala";
                const d = curve(HQ, dest);
                const id = `${idPrefix}-route-${ti}`;
                const stroke = isKerala ? "#ffd66e" : "#cdb27a";
                const targetOpacity = isKerala ? 0.95 : 0.5;
                const width = isKerala ? 0.5 : 0.4;
                return (
                  <g key={id}>
                    <motion.path
                      id={id}
                      d={d}
                      fill="none"
                      stroke={stroke}
                      strokeWidth={width}
                      strokeLinecap="round"
                      style={isKerala ? { filter: "drop-shadow(0 0 1px rgba(255,214,110,0.8))" } : undefined}
                      initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: targetOpacity }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, delay: 0.2 + i * 0.08, ease: "easeInOut" }}
                    />
                    {!reduce && (
                      <circle r={isKerala ? 0.75 : 0.6} fill={isKerala ? "#fff3cf" : "#e9dcb6"} opacity={isKerala ? 1 : 0.8}>
                        <animateMotion
                          dur={`${5.5 + (i % 5) * 0.8}s`}
                          begin={`${i * 0.35}s`}
                          repeatCount="indefinite"
                          rotate="auto"
                        >
                          <mpath href={`#${id}`} xlinkHref={`#${id}`} />
                        </animateMotion>
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Soft gold inner edge (above the clipped layer) */}
        <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-inset ring-amber-200/10" aria-hidden="true" />

        {/* Interactive markers layer — same transform, NOT clipped so tooltips can float free */}
        <div className="absolute inset-0" style={{ transform: MAP_TRANSFORM, transformOrigin: MAP_ORIGIN }}>
          {CITIES.map((c, i) => {
            const isActive = active === i;
            const isHub = !!c.hub;
            return (
              <div
                key={c.name}
                className={`absolute -translate-x-1/2 -translate-y-1/2 ${isHub ? "z-20" : "z-10"}`}
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              >
                <button
                  type="button"
                  aria-label={isHub ? `${c.name} — PrintVoz headquarters` : `${c.name} delivery hub, ${c.region}`}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive((p) => (p === i ? null : p))}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive((p) => (p === i ? null : p))}
                  onClick={() => setActive((p) => (p === i ? null : i))}
                  className="relative flex items-center justify-center outline-none group p-3 -m-3 touch-manipulation"
                >
                  {/* Glowing marker only — no permanent label (HQ is 1.5x larger) */}
                  {!reduce && (
                    <span className={`absolute rounded-full bg-amber-200/40 animate-ping ${isHub ? "w-7 h-7" : "w-5 h-5"}`} />
                  )}
                  <span
                    className={`relative block rounded-full bg-amber-100 transition-transform duration-300 ${
                      isHub
                        ? "w-[18px] h-[18px] ring-[3px] ring-amber-300/70 shadow-[0_0_22px_rgba(245,214,140,1)]"
                        : "ring-2 ring-amber-300/50 shadow-[0_0_14px_rgba(245,214,140,0.9)]"
                    } ${isActive ? "scale-110" : "group-hover:scale-125"} ${!isHub ? (isActive ? "w-4 h-4" : "w-3 h-3") : ""}`}
                  />
                </button>

                {/* Premium floating glass tooltip — appears only on hover / focus / tap */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.92 }}
                      transition={{ duration: 0.2 }}
                      role="tooltip"
                      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 z-30 w-max max-w-[210px] pointer-events-none"
                    >
                      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] px-4 py-3 text-left">
                        <p className="text-[13px] font-black text-white leading-tight">
                          {c.name}{isHub && <span className="text-amber-200"> · HQ</span>}
                        </p>
                        <p className="text-[11px] font-semibold text-amber-100/90 mt-1">
                          {isHub ? "PrintVoz Headquarters" : "Delivery Hub"}
                        </p>
                        <p className="text-[10px] font-medium text-white/55 mt-0.5">{c.region}</p>
                        {isHub && c.network && c.network.length > 0 && (
                          <div className="mt-2.5 pt-2.5 border-t border-white/15">
                            <p className="text-[9px] font-black uppercase tracking-wider text-white/45 mb-1">Also serving</p>
                            <p className="text-[11px] font-semibold text-white/80 leading-snug">
                              {c.network.join(" · ")}
                            </p>
                          </div>
                        )}
                      </div>
                      <span className="absolute left-1/2 -translate-x-1/2 top-full w-2.5 h-2.5 -mt-1.5 rotate-45 bg-white/10 backdrop-blur-xl border-r border-b border-white/20" aria-hidden="true" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Floating glass statistic cards (desktop overlay — not scaled) */}
        {floating && (
          <div className="hidden lg:block" aria-hidden="true">
            <FloatingStat className="top-4 left-4" reduce={!!reduce} delay={0} {...STATS[0]} />
            <FloatingStat className="top-4 right-4" reduce={!!reduce} delay={0.6} {...STATS[1]} />
            <FloatingStat className="bottom-4 left-4" reduce={!!reduce} delay={1.1} {...STATS[2]} />
            <FloatingStat className="bottom-4 right-4" reduce={!!reduce} delay={1.6} {...STATS[3]} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function FloatingStat({
  value,
  label,
  icon: Icon,
  className,
  reduce,
  delay,
}: {
  value: string;
  label: string;
  icon: React.ElementType;
  className?: string;
  reduce: boolean;
  delay: number;
}) {
  return (
    <motion.div
      className={`absolute ${className} rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-lg px-3 py-2.5 w-[124px]`}
      animate={reduce ? undefined : { y: [0, -7, 0] }}
      transition={reduce ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={12} className="text-amber-200" />
        <span className="text-[8px] font-black uppercase tracking-wider text-white/60 leading-tight">{label}</span>
      </div>
      <p className="text-lg font-black text-white leading-none">{value}</p>
    </motion.div>
  );
}

/* Mobile stat grid (in-flow) */
function StatsGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {STATS.map((s) => (
        <div key={s.label} className="rounded-2xl bg-[var(--text)]/[0.04] border border-[var(--secondary)]/15 p-4">
          <div className="flex items-center gap-1.5 mb-2 text-[var(--primary)]">
            <s.icon size={15} />
            <span className="text-[9px] font-black uppercase tracking-wider text-[var(--text)]/50">{s.label}</span>
          </div>
          <p className="text-2xl font-black leading-none">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

function Benefits({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <motion.li
          key={i}
          initial={reduce ? false : { opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-[var(--primary)] shrink-0" aria-hidden="true" />
          <span className="font-semibold text-sm md:text-base text-[var(--text)]/85">{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}

function Partners() {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text)]/40 mb-4">
        Trusted Logistics Partners
      </p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {PARTNERS.map((p) => (
          <span
            key={p}
            className="text-sm font-black tracking-tight text-[var(--text)]/40 hover:text-[var(--text)]/90 hover:-translate-y-1 transition-all duration-300 cursor-default"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   MAIN SECTION
   ──────────────────────────────────────────────────────────── */
export default function PanIndiaNetworkSection({ data }: { data?: any }) {
  const reduce = useReducedMotion();

  const heading = data?.heading || "Nationwide Delivery Network";
  const description =
    data?.description ||
    data?.subheading ||
    "From metros to tier-3 towns, our regional fulfilment hubs and trusted logistics partners get your prints delivered fast — reliably, anywhere in India.";
  const benefits: string[] =
    Array.isArray(data?.highlights) && data.highlights.filter(Boolean).length
      ? data.highlights.filter(Boolean)
      : DEFAULT_BENEFITS;

  const Header = (
    <div>
      <motion.span
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 text-[11px] md:text-xs font-black tracking-[0.25em] uppercase text-[var(--primary)] mb-4"
      >
        <Truck size={15} /> Pan-India Reach
      </motion.span>
      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.05 }}
        className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.08]"
      >
        {heading}
      </motion.h2>
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.12 }}
        className="mt-5 text-base md:text-lg text-[var(--text)]/70 leading-relaxed max-w-xl"
      >
        {description}
      </motion.p>
    </div>
  );

  return (
    <section
      id="delivery-network"
      aria-labelledby="delivery-network-heading"
      className="py-16 md:py-24 overflow-hidden bg-[var(--bg)] text-[var(--text)]"
    >
      <span id="delivery-network-heading" className="sr-only">
        {heading}
      </span>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop: content left, premium satellite map right */}
        <div className="hidden lg:grid grid-cols-2 gap-14 items-center">
          <div className="space-y-10">
            {Header}
            <Benefits items={benefits} />
            <Partners />
          </div>
          <div>
            <MapPanel idPrefix="pan-desk" floating />
          </div>
        </div>

        {/* Mobile / tablet: stacked in spec order */}
        <div className="lg:hidden flex flex-col gap-9">
          {Header}
          <StatsGrid />
          <MapPanel idPrefix="pan-mob" />
          <Benefits items={benefits} />
          <Partners />
        </div>
      </div>
    </section>
  );
}
