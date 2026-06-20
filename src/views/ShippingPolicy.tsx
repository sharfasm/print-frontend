// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  Shield,
  Lock,
  CreditCard,
  FolderOpen,
  ShieldCheck,
  User,
  Mail,
  Phone,
  MapPin,
  Truck,
  Key,
  Settings,
  Package,
  ShoppingCart,
  Palette,
  FileText,
  Globe,
  Monitor,
  Smartphone,
  BarChart3,
  Zap,
  Server,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ArrowUp,
  Image as ImageIcon,
  Tag,
  FileBox,
  Headphones,
  Clock,
  ChevronDown,
  Menu,
  X,
  Scale,
  AlertTriangle,
  Layers,
  Sparkles,
  Info,
  Check,
  XCircle,
  Camera,
  RefreshCw,
  Scissors,
  Smile,
  HelpCircle,
  Percent,
  Search,
  DollarSign,
  Gift,
  Compass,
  Briefcase
} from "lucide-react";

/* ───────────────────────────────────────────────────────────
   TABLE OF CONTENTS DATA (11 SECTIONS)
   ─────────────────────────────────────────────────────────── */
const TOC = [
  { id: "overview", label: "Overview", num: "01" },
  { id: "processing-time", label: "Order Processing Time", num: "02" },
  { id: "production-time", label: "Production Time", num: "03" },
  { id: "shipping-delivery", label: "Shipping & Delivery Time", num: "04" },
  { id: "shipping-charges", label: "Shipping Charges", num: "05" },
  { id: "order-tracking", label: "Order Tracking", num: "06" },
  { id: "delivery-delays", label: "Delivery Delays", num: "07" },
  { id: "incorrect-info", label: "Incorrect Shipping Information", num: "08" },
  { id: "lost-packages", label: "Lost or Undelivered Packages", num: "09" },
  { id: "delivery-acceptance", label: "Delivery Acceptance", num: "10" },
  { id: "contact-info", label: "Contact Information", num: "11" },
];

/* ───────────────────────────────────────────────────────────
   ANIMATION VARIANTS
   ─────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ───────────────────────────────────────────────────────────
   SMALL REUSABLE COMPONENTS
   ─────────────────────────────────────────────────────────── */
function SectionHeading({
  num,
  title,
  id,
}: {
  num: string;
  title: string;
  id: string;
}) {
  return (
    <div id={id} className="scroll-mt-28 mb-6">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="flex items-center gap-3 mb-2"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white text-[10px] font-black shadow-sm shadow-[var(--primary)]/15">
          {num}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-[var(--secondary)]/15 to-transparent" />
      </motion.div>
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--text)]"
      >
        {title}
      </motion.h2>
    </div>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="text-sm sm:text-base leading-[1.8] text-[var(--text)]/80 max-w-[72ch] mb-4"
    >
      {children}
    </motion.p>
  );
}

/* ───────────────────────────────────────────────────────────
   MOBILE TOC
   ─────────────────────────────────────────────────────────── */
function MobileToc({
  activeSection,
  onNavigate,
}: {
  activeSection: string;
  onNavigate: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden fixed over-bottom-nav right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-16 right-0 w-64 max-h-[50vh] overflow-y-auto rounded-2xl backdrop-blur-xl border border-[var(--secondary)]/15 shadow-2xl p-4 drawer-scrollbar"
            style={{ background: 'var(--surface-elevated)' }}
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--text)]/40 mb-3 px-2">
              Shipping Policy Sections
            </p>
            {TOC.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2.5 ${
                  activeSection === item.id
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "text-[var(--text)]/60 hover:bg-[var(--secondary)]/8 hover:text-[var(--text)]"
                }`}
              >
                <span className="w-5 h-5 rounded bg-[var(--secondary)]/10 flex items-center justify-center text-[9px] font-black text-[var(--primary)]/60 shrink-0">
                  {item.num}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle contents drawer"
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white flex items-center justify-center shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   MAIN SHIPPING POLICY COMPONENT
   ─────────────────────────────────────────────────────────── */
export default function ShippingPolicy() {
  const [activeSection, setActiveSection] = useState("overview");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  /* scroll progress */
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  /* active section observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: 0 }
    );

    TOC.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* show back-to-top handler */
  useEffect(() => {
    const handler = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      {/* ── READING PROGRESS BAR ────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)] z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* ── HERO SECTION ────────────────────────────────────── */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
        {/* Luxury gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg)] via-[var(--bg)] to-[var(--secondary)]/8" />

        {/* Floating blur effects */}
        <div className="absolute top-16 left-[8%] w-64 h-64 rounded-full bg-[var(--primary)]/5 blur-[80px] animate-pulse" />
        <div className="absolute bottom-8 right-[12%] w-80 h-80 rounded-full bg-[var(--secondary)]/8 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[var(--primary)]/3 blur-[120px] opacity-25" />

        {/* Animated grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Floating geometric logistics-inspired assets */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-28 right-[18%] w-14 h-14 rounded-xl border border-[var(--primary)]/10 backdrop-blur-[2px] bg-white/2 rotate-6 hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, 8, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-[15%] w-10 h-10 rounded-full border border-[var(--secondary)]/12 backdrop-blur-[2px] bg-white/2 hidden lg:block"
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Shipping Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border border-[var(--secondary)]/15 mb-6 shadow-sm"
            style={{ background: 'var(--surface-card)' }}
          >
            <Truck size={14} className="text-[var(--primary)]" strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--primary)]">
              🚚 Shipping & Delivery Information
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--text)] mb-4"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Shipping{" "}
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
              Policy
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm sm:text-base md:text-lg text-[var(--text)]/65 max-w-2xl mx-auto leading-relaxed mb-8 font-medium"
          >
            Learn how PrintVoz processes, manufactures, ships, tracks, and delivers custom printing orders.
          </motion.p>

          {/* Last Updated Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl backdrop-blur-md border border-[var(--secondary)]/12 shadow-sm"
            style={{ background: 'var(--surface-light)' }}
          >
            <Clock size={14} className="text-[var(--secondary)]" />
            <span className="text-xs font-semibold text-[var(--text)]/50">
              Last Updated:
            </span>
            <span className="text-xs font-bold text-[var(--primary)]">
              June 2026
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── SHIPPING TRUST BANNER ─────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 -mt-2 mb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Package, title: "Order Fulfillment", desc: "Expert, safe packaging of custom materials" },
            { icon: Truck, title: "Reliable Shipping", desc: "Trusted carriers delivering across India" },
            { icon: MapPin, title: "Live Order Tracking", desc: "Monitor transit progression in real-time" },
            { icon: ShieldCheck, title: "Secure Delivery Process", desc: "Safe checkout to doorstep guarantees" }
          ].map((card, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative group flex flex-col items-center text-center p-5 rounded-2xl backdrop-blur-md border border-[var(--secondary)]/12 overflow-hidden cursor-default transition-all duration-300"
              style={{ background: 'var(--surface-light)' }}
            >
              <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-[var(--primary)]/4 blur-xl group-hover:bg-[var(--primary)]/8 transition-all duration-500" />
              <span className="relative z-10 flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white mb-3 shadow-md shadow-[var(--primary)]/15 group-hover:scale-105 transition-transform duration-300">
                <card.icon size={20} strokeWidth={1.8} />
              </span>
              <h3 className="relative z-10 text-xs sm:text-sm font-bold text-[var(--text)] tracking-tight mb-1">
                {card.title}
              </h3>
              <p className="relative z-10 text-[10px] sm:text-xs text-[var(--text)]/50 font-semibold leading-normal">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── VISUAL ORDER JOURNEY ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 mb-16 relative z-10">
        <div className="backdrop-blur-sm rounded-3xl border border-[var(--secondary)]/8 shadow-md p-6 bg-[var(--surface)] text-center">
          <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text)]/40 mb-6">
            The Interactive Shipping Journey
          </h3>
          
          {/* Horizontal layout for desktop, swipeable/flex for mobile */}
          <div className="flex flex-row overflow-x-auto pb-4 gap-4 md:gap-0 justify-between items-start scrollbar-none relative">
            {[
              { name: "Order Placed", desc: "Specs uploaded", icon: ShoppingCart },
              { name: "Order Processing", desc: "Design & file audit", icon: Settings },
              { name: "Production", desc: "CMYK press printing", icon: Palette },
              { name: "Packaging", desc: "Security wraps", icon: FileBox },
              { name: "Shipping", desc: "Logistics dispatch", icon: Truck },
              { name: "Tracking", desc: "Live updates active", icon: Search },
              { name: "Delivery", desc: "Safe doorstep drop", icon: CheckCircle2 }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center min-w-[120px] md:min-w-0 md:flex-1 relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white flex items-center justify-center shadow-md shadow-[var(--primary)]/15 mb-3"
                >
                  <step.icon size={16} />
                </motion.div>
                <span className="text-xs font-bold text-[var(--text)] leading-tight">{step.name}</span>
                <span className="text-[10px] text-[var(--text)]/40 font-semibold mt-0.5 leading-tight">{step.desc}</span>
              </div>
            ))}
            {/* Background connecting timeline bar */}
            <div className="absolute left-[7%] right-[7%] top-5 h-[1.5px] bg-[var(--secondary)]/12 -z-10 hidden md:block" />
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT LAYOUT ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex gap-10 lg:gap-14 relative">
          
          {/* Desktop Table of Contents Sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-28">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--text)]/35 mb-4 px-2">
                Table of Contents
              </p>
              <nav aria-label="Table of Contents Navigation">
                <ul className="space-y-0.5">
                  {TOC.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollTo(item.id)}
                          aria-current={isActive ? "location" : undefined}
                          className={`w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                            isActive
                              ? "bg-[var(--primary)]/8 text-[var(--primary)] font-bold"
                              : "text-[var(--text)]/50 hover:text-[var(--text)]/80 hover:bg-[var(--secondary)]/5"
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="shipping-toc-sidebar-active"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-[2.5px] h-4 rounded-full bg-[var(--primary)]"
                              transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                          )}
                          <span
                            className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center text-[9px] font-black shrink-0 transition-all duration-200 ${
                              isActive
                                ? "bg-[var(--primary)] text-white"
                                : "bg-[var(--secondary)]/8 text-[var(--text)]/35"
                            }`}
                          >
                            {item.num}
                          </span>
                          <span className="truncate">{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Progress indicator */}
              <div className="mt-6 pt-5 border-t border-[var(--secondary)]/8 px-2">
                <div className="w-full h-1 rounded-full bg-[var(--secondary)]/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                    style={{ scaleX, transformOrigin: "left" }}
                  />
                </div>
                <p className="text-[9px] font-bold text-[var(--text)]/30 mt-2 tracking-wider uppercase">
                  Reading Progress
                </p>
              </div>
            </div>
          </aside>

          {/* Document Content Area */}
          <div ref={contentRef} className="flex-1 min-w-0">
            <div className="backdrop-blur-sm rounded-3xl border border-[var(--secondary)]/8 shadow-lg p-5 sm:p-10 md:p-12" style={{ background: 'var(--surface)' }}>
              
              {/* ─ 01 Overview */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="01" title="Overview" id="overview" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    PrintVoz is dedicated to shipping your custom prints as quickly and safely as possible. Below are the details regarding our delivery coverage, turnaround times, and charges.
                  </Paragraph>
                  <Paragraph>
                    We deliver custom print products across Kerala and other Indian states utilizing trusted logistics partners.
                  </Paragraph>
                  <Paragraph>
                    Our goal is to maintain a fair, transparent, and customer-focused shipping process while ensuring the quality and integrity of our delivery services.
                  </Paragraph>

                  {/* Smart UI Enhancements: Grid Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                    <div className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)] flex gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/6 text-[var(--primary)] flex items-center justify-center shrink-0">
                        <Sparkles size={16} />
                      </span>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text)] mb-1">Mission Card</h4>
                        <p className="text-[11px] text-[var(--text)]/60 leading-relaxed font-semibold">
                          Delivering premium custom print products quickly, safely, and tailored to specifications.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)] flex gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/6 text-[var(--primary)] flex items-center justify-center shrink-0">
                        <Scale size={16} />
                      </span>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text)] mb-1">Transparency Card</h4>
                        <p className="text-[11px] text-[var(--text)]/60 leading-relaxed font-semibold">
                          Clear production timelines, delivery estimates, rates, and active courier options.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)] flex gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/6 text-[var(--primary)] flex items-center justify-center shrink-0">
                        <Smile size={16} />
                      </span>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text)] mb-1">Customer Satisfaction Card</h4>
                        <p className="text-[11px] text-[var(--text)]/60 leading-relaxed font-semibold">
                          Fulfillment loops optimized to get packages out correctly and on schedule.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)] flex gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/6 text-[var(--primary)] flex items-center justify-center shrink-0">
                        <ShieldCheck size={16} />
                      </span>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text)] mb-1">Delivery Commitment Card</h4>
                        <p className="text-[11px] text-[var(--text)]/60 leading-relaxed font-semibold">
                          Reliable logistics hubs across Kerala and Indian territories to support business runs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* ─ 02 Order Processing Time */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="02" title="Order Processing Time" id="processing-time" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    Custom printing has two parts: Production Time and Transit Time. Before production begins, every order undergoes systematic processing phases.
                  </Paragraph>
                  <Paragraph>
                    Order processing comprises several review processes to ensure accuracy of the submitted assets before they enter our manufacturing queue.
                  </Paragraph>

                  {/* workflow cards process flow */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-6">
                    {[
                      { step: "01", name: "Payment Confirmation", desc: "Verifying transaction receipt to clear production release.", icon: CreditCard },
                      { step: "02", name: "Order Verification", desc: "Auditing quantity, specifications, and layout request.", icon: FileText },
                      { step: "03", name: "File Review", desc: "Inspecting upload resolution and design format adequacy.", icon: Palette },
                      { step: "04", name: "Design Confirmation", desc: "Confirming layouts align with bleed trim zones.", icon: CheckCircle2 },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)] relative">
                        <span className="text-[9px] font-black text-[var(--primary)] tracking-widest block mb-1 uppercase">Phase {item.step}</span>
                        <h4 className="text-xs font-extrabold text-[var(--text)] flex items-center gap-1.5 mb-1.5">
                          <item.icon size={13} className="text-[var(--primary)] shrink-0" />
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[var(--text)]/60 leading-relaxed font-semibold">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* ─ 03 Production Time */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="03" title="Production Time" id="production-time" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    Print production timelines represent manufacturing durations and do not include transport shipping phases.
                  </Paragraph>
                  <Paragraph>
                    Standard Production: 1–3 business days depending on product complexity (e.g. flex banners are printed faster than custom packaging boxes).
                  </Paragraph>
                  <Paragraph>
                    Timelines represent business days (excluding Sundays and national holidays). PrintVoz works to achieve deadlines but makes no absolute delivery date guarantees.
                  </Paragraph>

                  {/* manufacturing timeline grid cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                    {[
                      { name: "Production", desc: "Initiating high-resolution printing plates & presses.", icon: PrinterIcon }, // Fallback to Settings
                      { name: "Custom Manufacturing", desc: "Forming stocks, laminating, and cutting frames.", icon: Package },
                      { name: "Personalization", desc: "Applying custom templates and customer logos.", icon: Palette },
                      { name: "Quality Control", desc: "Final measurements check & count auditing.", icon: CheckCircle2 }
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-card)]">
                        <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/6 text-[var(--primary)] flex items-center justify-center mb-2">
                          {item.icon ? <item.icon size={16} /> : <Settings size={16} />}
                        </span>
                        <h4 className="text-xs font-bold text-[var(--text)] mb-1 leading-tight">{item.name}</h4>
                        <p className="text-[10px] text-[var(--text)]/40 leading-normal font-semibold">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* ─ 04 Shipping & Delivery Time */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="04" title="Shipping & Delivery Time" id="shipping-delivery" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    We ship to all active pin codes across Kerala and India. We partner with reliable courier services (like DTDC, Blue Dart, Professional Couriers, and Speed Post) to ensure safe transit of your packages.
                  </Paragraph>
                  <Paragraph>
                    Transit Duration: Standard delivery takes 3–5 working days inside Kerala, and 5–7 days outside Kerala. Express Shipping: 1–2 business days transit inside Kerala for select items.
                  </Paragraph>

                  {/* premium logistics dashboard */}
                  <div className="rounded-2xl border border-[var(--secondary)]/12 p-6 bg-gradient-to-br from-[var(--primary)]/[0.02] to-[var(--secondary)]/[0.04] my-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                        <Truck size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-[var(--text)]">Logistics Control Tower</h4>
                        <p className="text-[10px] text-[var(--text)]/40 font-medium uppercase tracking-wider">National Delivery Coverage</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl border border-[var(--secondary)]/10 bg-[var(--surface)]">
                        <h5 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5 mb-1">
                          <Truck size={12} className="text-[var(--primary)]" />
                          Shipping Process
                        </h5>
                        <p className="text-[11px] text-[var(--text)]/65 leading-relaxed font-semibold">
                          Packages leave our print facility immediately upon packing checks and get sorted to hub.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-[var(--secondary)]/10 bg-[var(--surface)]">
                        <h5 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5 mb-1">
                          <MapPin size={12} className="text-[var(--primary)]" />
                          Delivery Coverage
                        </h5>
                        <p className="text-[11px] text-[var(--text)]/65 leading-relaxed font-semibold">
                          Reaching standard active pin codes across Kerala, south territories, and Indian states.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-[var(--secondary)]/10 bg-[var(--surface)]">
                        <h5 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5 mb-1">
                          <Briefcase size={12} className="text-[var(--primary)]" />
                          Courier Network
                        </h5>
                        <p className="text-[11px] text-[var(--text)]/65 leading-relaxed font-semibold">
                          Partnering with DTDC, Blue Dart, Professional Couriers, and Speed Post services.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-[var(--primary)]/15 bg-[var(--primary)]/5 flex flex-col justify-between">
                        <div>
                          <h5 className="text-xs font-black text-[var(--primary)] flex items-center gap-1.5 mb-1">
                            <Clock size={12} />
                            TRANSIT TIMES
                          </h5>
                          <span className="text-xl font-black text-[var(--text)] tracking-tight block mb-1">
                            3–7 Days
                          </span>
                        </div>
                        <p className="text-[10px] text-[var(--text)]/50 leading-normal font-semibold">
                          3–5 days in Kerala, 5–7 days other states. Express: 1–2 days.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* ─ 05 Shipping Charges */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="05" title="Shipping Charges" id="shipping-charges" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    Shipping rates are calculated automatically at checkout based on weight, dimensions, and delivery location. Free delivery is applicable on select cart values or promotional campaigns.
                  </Paragraph>

                  {/* Pricing information cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 my-6">
                    <div className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)]">
                      <h4 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5 mb-1.5">
                        <DollarSign size={13} className="text-[var(--primary)]" />
                        Shipping Costs
                      </h4>
                      <p className="text-xs text-[var(--text)]/60 leading-relaxed font-semibold">
                        Dynamically calculated at checkout based on packaging dimensions, weight, and pincode zone.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)]">
                      <h4 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5 mb-1.5">
                        <Gift size={13} className="text-[var(--primary)]" />
                        Free Shipping Offers
                      </h4>
                      <p className="text-xs text-[var(--text)]/60 leading-relaxed font-semibold">
                        Free transit options are auto-triggered on checkouts exceeding coupon or minimum-tier targets.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)]">
                      <h4 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5 mb-1.5">
                        <Package size={13} className="text-[var(--primary)]" />
                        Additional Charges
                      </h4>
                      <p className="text-xs text-[var(--text)]/60 leading-relaxed font-semibold">
                        Extra charges apply for customized oversized items, express processing requests, or remote sectors.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)]">
                      <h4 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5 mb-1.5">
                        <Globe size={13} className="text-[var(--primary)]" />
                        International Delivery
                      </h4>
                      <p className="text-xs text-[var(--text)]/60 leading-relaxed font-semibold">
                        Currently restricted. Deliveries are confined to active domestic pincodes across India.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* ─ 06 Order Tracking */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="06" title="Order Tracking" id="order-tracking" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    Order tracking is available for all shipments. Once your order has been dispatched from our facility, you will receive tracking coordinates.
                  </Paragraph>

                  {/* tracking showcase cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 my-6">
                    {[
                      { title: "Email Updates", desc: "Automated emails sent containing tracking numbers & active status links.", icon: Mail },
                      { title: "Tracking Status", desc: "Check current shipping logs and logistics transit hubs on-site.", icon: MapPin },
                      { title: "Shipment Progress", desc: "Trace sorting scans, dispatch checkpoints, and courier routes.", icon: Search },
                      { title: "Delivery Notifications", desc: "Live SMS alerts when the package is out for final delivery.", icon: CheckCircle2 }
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl border border-[var(--secondary)]/10 bg-[var(--surface-card)]">
                        <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/6 text-[var(--primary)] flex items-center justify-center mb-2 shrink-0">
                          <item.icon size={16} />
                        </span>
                        <h5 className="text-xs font-bold text-[var(--text)] mb-1 leading-tight">{item.title}</h5>
                        <p className="text-[10px] text-[var(--text)]/50 leading-relaxed font-semibold">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* ─ 07 Delivery Delays */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="07" title="Delivery Delays" id="delivery-delays" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    Once a package leaves our facility, transport delays from carrier anomalies, weather obstacles, or customs audits are outside our operational control. PrintVoz is not liable for delayed transit delivery windows.
                  </Paragraph>

                  {/* Informative notice area cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-6">
                    {[
                      { title: "Weather Issues", desc: "Heavy monsoons, storms, or road blockage risks inside Kerala sectors.", icon: AlertTriangle },
                      { title: "Courier Delays", desc: "Carrier warehouse backlogs, sorting technical downtime, or peak traffic.", icon: Truck },
                      { title: "Government Restrictions", desc: "Local bandhs, political lockdowns, or regional transit audits.", icon: Scale },
                      { title: "Seasonal Demand", desc: "Holiday/festive rushes (Onam, Diwali) slowing down carrier turnaround.", icon: Clock }
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl border border-red-500/10 bg-red-500/5 dark:bg-red-500/2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-red-700 dark:text-red-300 flex items-center gap-1.5 mb-1.5">
                          <item.icon size={14} className="shrink-0" />
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-[var(--text)]/65 leading-relaxed font-semibold">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* ─ 08 Incorrect Shipping Information */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="08" title="Incorrect Shipping Information" id="incorrect-info" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    Customers are solely responsible for ensuring the accuracy of all shipping coordinates submitted during checkout. Incorrect details may result in lost or returned packages.
                  </Paragraph>

                  {/* checklist cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-6">
                    {[
                      { name: "Address Accuracy", desc: "Include correct street numbers, building details, flat numbers, and distinct landmarks." },
                      { name: "Postal Code", desc: "Double check the 6-digit active pincode matches the destination area exactly." },
                      { name: "Phone Number", desc: "Ensure active mobile numbers are provided so logistics drivers can call." },
                      { name: "Email Address", desc: "Active email for routing digital notifications, receipts, and tracking URLs." }
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl border border-green-500/15 bg-green-500/5 dark:bg-green-500/2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-green-700 dark:text-green-300 flex items-center gap-1.5 mb-1">
                          <Check size={14} className="shrink-0" />
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-[var(--text)]/60 leading-relaxed font-semibold">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* ─ 09 Lost or Undelivered Packages */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="09" title="Lost or Undelivered Packages" id="lost-packages" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    In the rare event that a package is lost in transit or returned as undelivered, we are committed to investigating the status and finding an appropriate resolution.
                  </Paragraph>

                  {/* support timeline resolutions */}
                  <div className="rounded-2xl border border-[var(--secondary)]/10 p-5 bg-[var(--surface-card)] my-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]/50 mb-5 text-center">
                      Lost Shipment Resolution Workflow
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
                      {[
                        { step: "01", name: "Shipment Dispatched", desc: "Order leaves print shop via courier partner." },
                        { step: "02", name: "Issue Reported", desc: "Client notifies us of missing delivery." },
                        { step: "03", name: "Investigation", desc: "We open tracking dispute tickets with carrier." },
                        { step: "04", name: "Carrier Review", desc: "Courier audits sorting hubs and drivers." },
                        { step: "05", name: "Resolution", desc: "Reprinting or store credits issued to account." }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col relative z-10">
                          <span className="w-7 h-7 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-bold mb-2">
                            {item.step}
                          </span>
                          <span className="text-xs font-bold text-[var(--text)] leading-tight">{item.name}</span>
                          <span className="text-[10px] text-[var(--text)]/40 font-semibold mt-0.5 leading-tight">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>

              {/* ─ 10 Delivery Acceptance */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="10" title="Delivery Acceptance" id="delivery-acceptance" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    Please inspect the outer package before accepting delivery. Ensure there are no visible signs of damage or leakage.
                  </Paragraph>

                  {/* inspection checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-6">
                    {[
                      { title: "Product Condition", desc: "Ensure no physical tear, print bleed, folds, or moisture defects exist.", icon: Package },
                      { title: "Order Quantity", desc: "Cross check delivered items counts against billing invoice lists.", icon: FileText },
                      { title: "Customization Check", desc: "Confirm spelling, templates, graphics, and dimensions parameters.", icon: Palette },
                      { title: "Damage Inspection", desc: "Document errors and click clear photos before reporting to support.", icon: Camera }
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl border border-[var(--secondary)]/10 bg-[var(--surface-light)]">
                        <h4 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5 mb-1.5">
                          <item.icon size={13} className="text-[var(--primary)] shrink-0" />
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-[var(--text)]/50 leading-relaxed font-semibold">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* ─ 11 Contact Information */}
              <article className="scroll-mt-28" id="contact-info">
                <SectionHeading num="11" title="Contact Information" id="contact-info" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    For shipping questions, transit issues, or tracking support, please reach out to our logistics help desk.
                  </Paragraph>

                  {/* support cards matrix */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-2">
                    {[
                      { icon: Phone, title: "Shipping Support", desc: "Assistance with shipping estimates and routes." },
                      { icon: Package, title: "Delivery Assistance", desc: "Coordination for local pincode delivery." },
                      { icon: MapPin, title: "Tracking Help", desc: "Verifying shipment coordinates and logs." },
                      { icon: Headphones, title: "Customer Care", desc: "General support tickets and feedback." }
                    ].map((card, i) => (
                      <div key={i} className="p-4 rounded-xl border border-[var(--secondary)]/10 bg-[var(--surface-card)]">
                        <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/6 text-[var(--primary)] flex items-center justify-center mb-2.5">
                          <card.icon size={16} />
                        </span>
                        <h5 className="text-xs font-bold text-[var(--text)] mb-0.5 leading-tight">{card.title}</h5>
                        <p className="text-[10px] text-[var(--text)]/40 leading-normal font-semibold">{card.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* support center details card */}
                  <div className="p-6 rounded-2xl border border-[var(--secondary)]/10 bg-gradient-to-br from-[var(--primary)]/[0.03] to-[var(--secondary)]/[0.05] flex flex-col gap-4 my-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/8 text-[var(--primary)] flex items-center justify-center">
                        <Scale size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-wider text-[var(--text)]">PrintVoz Shipping Desk</h4>
                        <p className="text-[10px] text-[var(--text)]/40 font-semibold">Official Logistics Operations</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                      <div className="p-3.5 rounded-lg border border-[var(--secondary)]/8 bg-[var(--surface)] flex flex-col gap-0.5">
                        <span className="text-[10px] text-[var(--text)]/35 uppercase tracking-wider">Official Website</span>
                        <span className="text-[var(--text)] font-bold">www.printvoz.com</span>
                      </div>
                      <div className="p-3.5 rounded-lg border border-[var(--secondary)]/8 bg-[var(--surface)] flex flex-col gap-0.5">
                        <span className="text-[10px] text-[var(--text)]/35 uppercase tracking-wider">Support Email</span>
                        <a href="mailto:support@printvoz.com" className="text-[var(--primary)] hover:underline font-bold">support@printvoz.com</a>
                      </div>
                    </div>

                    {/* CTA Card with Buttons */}
                    <div className="p-4 rounded-xl border border-[var(--primary)]/10 bg-[var(--surface-light)] text-center flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                      <div className="text-left">
                        <h5 className="text-xs font-bold text-[var(--text)]">Need shipping assistance?</h5>
                        <p className="text-[10px] text-[var(--text)]/50 leading-normal font-semibold">Our help desk is ready to trace your package.</p>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Link
                          href="/contact"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-bold text-xs shadow-md shadow-[var(--primary)]/15 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                          <Headphones size={13} />
                          Contact Support
                        </Link>
                        <Link
                          href="/dashboard/delivery-tracking"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--secondary)]/15 text-[var(--text)] font-bold text-xs hover:border-[var(--primary)]/25 hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
                          style={{ background: 'var(--surface-elevated)' }}
                        >
                          Track Order
                        </Link>
                        <Link
                          href="/"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--secondary)]/15 text-[var(--text)] font-bold text-xs hover:border-[var(--primary)]/25 hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
                          style={{ background: 'var(--surface-elevated)' }}
                        >
                          Return Home
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

            </div>
          </div>

        </div>
      </section>

      {/* Floating mobile TOC button */}
      <MobileToc activeSection={activeSection} onNavigate={scrollTo} />

      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="fixed over-bottom-nav left-6 z-50 w-11 h-11 rounded-xl backdrop-blur-md border border-[var(--secondary)]/15 shadow-md flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all duration-300"
            style={{ background: 'var(--surface-elevated)' }}
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

/* ───────────────────────────────────────────────────────────
   PRINTER ICON FOR WORKFLOWS
   ─────────────────────────────────────────────────────────── */
function PrinterIcon({ size = 16, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}
