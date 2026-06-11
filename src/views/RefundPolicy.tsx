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
  Heart,
  Check,
  XCircle,
  Camera,
  RefreshCw,
  Scissors,
  Smile,
  HelpCircle,
  Percent,
  Search
} from "lucide-react";

/* ───────────────────────────────────────────────────────────
   TABLE OF CONTENTS DATA (10 SECTIONS)
   ─────────────────────────────────────────────────────────── */
const TOC = [
  { id: "overview", label: "Overview", num: "01" },
  { id: "customized-products", label: "Customized Products Policy", num: "02" },
  { id: "eligible-cases", label: "Eligible Cases", num: "03" },
  { id: "non-refundable", label: "Non-Refundable Situations", num: "04" },
  { id: "damaged-incorrect", label: "Damaged or Incorrect Orders", num: "05" },
  { id: "reporting-issues", label: "Reporting Issues", num: "06" },
  { id: "refund-processing", label: "Refund Processing", num: "07" },
  { id: "order-cancellation", label: "Order Cancellation", num: "08" },
  { id: "contact-info", label: "Contact Information", num: "09" },
  { id: "print-quality", label: "Print Quality & Color Variations", num: "10" },
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
    <div className="lg:hidden fixed bottom-6 right-6 z-50">
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
              Refund Policy Sections
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
   MAIN REFUND POLICY COMPONENT
   ─────────────────────────────────────────────────────────── */
export default function RefundPolicy() {
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

        {/* Soft floating blur effects */}
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

        {/* Floating geometric assets (Glassmorphism) */}
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
          {/* Refund Policy Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border border-[var(--secondary)]/15 mb-6 shadow-sm"
            style={{ background: 'var(--surface-card)' }}
          >
            <Shield size={14} className="text-[var(--primary)]" strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--primary)]">
              🛡 Refund Policy Center
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
            Refund & Return{" "}
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
            Learn how PrintVoz handles refunds, replacements, damaged products, cancellations, custom printing orders, and customer support requests.
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

      {/* ── PREMIUM TRUST BANNER ─────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 -mt-2 mb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: RefreshCw, title: "Easy Resolution Process", desc: "Straightforward reprint & support paths" },
            { icon: ShieldCheck, title: "Customer Protection", desc: "Fair protection on print production" },
            { icon: Scale, title: "Fair Refund Reviews", desc: "Systematic, transparent reviews" },
            { icon: Headphones, title: "Dedicated Support", desc: "Ready assistance within 48 hours" }
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
                              layoutId="refund-toc-sidebar-active"
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
                    At PrintVoz, customer satisfaction is important to us. We strive to deliver high-quality custom printing products and personalized solutions that meet customer expectations.
                  </Paragraph>
                  <Paragraph>
                    Because many of our products are manufactured specifically according to customer-provided designs, artwork, logos, text, and customization requirements, our refund and replacement process differs from that of standard retail products.
                  </Paragraph>
                  <Paragraph>
                    This Refund Policy outlines the conditions under which refunds, replacements, cancellations, or other resolutions may be provided.
                  </Paragraph>

                  {/* Smart UI Enhancements: Grid Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                    <div className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)] flex gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/6 text-[var(--primary)] flex items-center justify-center shrink-0">
                        <Sparkles size={16} />
                      </span>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text)] mb-1">Our Mission</h4>
                        <p className="text-[11px] text-[var(--text)]/60 leading-relaxed font-semibold">
                          Delivering premium custom printing products and personalized templates crafted to perfection.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)] flex gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/6 text-[var(--primary)] flex items-center justify-center shrink-0">
                        <Smile size={16} />
                      </span>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text)] mb-1">Customer Satisfaction</h4>
                        <p className="text-[11px] text-[var(--text)]/60 leading-relaxed font-semibold">
                          We handle custom returns, replacements, and refunds systematically to align with client goals.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)] flex gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/6 text-[var(--primary)] flex items-center justify-center shrink-0">
                        <Scale size={16} />
                      </span>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text)] mb-1">Transparency Policy</h4>
                        <p className="text-[11px] text-[var(--text)]/60 leading-relaxed font-semibold">
                          Offering a clear, outline-based guide of eligible resolutions, cancellations, and printing tolerances.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)] flex gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/6 text-[var(--primary)] flex items-center justify-center shrink-0">
                        <ShieldCheck size={16} />
                      </span>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text)] mb-1">Trust Core</h4>
                        <p className="text-[11px] text-[var(--text)]/60 leading-relaxed font-semibold">
                          Maintaining fair reviews on all custom requests while ensuring the highest product standards.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Paragraph>
                    We encourage customers to carefully review product details, customization information, and order specifications before placing an order.
                  </Paragraph>
                  <Paragraph>
                    By placing an order with PrintVoz, you acknowledge and agree to the terms outlined in this Refund Policy.
                  </Paragraph>
                  <Paragraph>
                    Our goal is to maintain a fair, transparent, and customer-focused process while ensuring the quality and integrity of our custom printing services.
                  </Paragraph>
                </div>
              </article>

              {/* ─ 02 Customized Products Policy */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="02" title="Customized Products Policy" id="customized-products" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    PrintVoz specializes in custom printing and personalized products created according to customer specifications.
                  </Paragraph>
                  <Paragraph>
                    Many products offered through our platform are manufactured specifically for each order using customer-provided:
                  </Paragraph>

                  {/* UI Feature Cards for customization inputs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 my-2">
                    {[
                      { name: "Logos", icon: Palette },
                      { name: "Artwork", icon: Sparkles },
                      { name: "Images", icon: ImageIcon },
                      { name: "Text", icon: FileText },
                      { name: "Brand Elements", icon: Tag },
                      { name: "Design Files", icon: FileBox },
                      { name: "Custom Instructions", icon: Settings },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center justify-center p-3 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-card)] text-center">
                        <span className="w-7 h-7 rounded-lg bg-[var(--primary)]/6 text-[var(--primary)] flex items-center justify-center mb-1.5 shrink-0">
                          <item.icon size={14} />
                        </span>
                        <span className="text-[10px] font-bold text-[var(--text)]/85 leading-tight">{item.name}</span>
                      </div>
                    ))}
                  </div>

                  <Paragraph>
                    Because these products are uniquely created for individual customers, they cannot typically be resold, reused, or restocked.
                  </Paragraph>

                  {/* Notice Panel for non-eligible returns */}
                  <div className="rounded-2xl border border-[var(--primary)]/10 p-5 bg-gradient-to-r from-[var(--primary)]/4 to-[var(--secondary)]/4 flex gap-3 items-start my-4">
                    <Info size={18} className="text-[var(--primary)] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text)] mb-1">Reselling & Restocking Notice</h4>
                      <p className="text-xs text-[var(--text)]/75 leading-relaxed font-semibold">
                        Customized products generally cannot be resold or restocked. Consequently, they are not eligible for refunds, returns, or exchanges once production starts, except in cases of verified defects or errors caused by PrintVoz.
                      </p>
                    </div>
                  </div>

                  <Paragraph>
                    As a result, customized and personalized products are generally not eligible for refunds, returns, or exchanges once production has started, except in situations involving verified manufacturing defects, printing errors caused by PrintVoz, or other eligible circumstances outlined in this Refund Policy.
                  </Paragraph>
                  <Paragraph>
                    Customers are responsible for reviewing and confirming all customization details before placing an order, including spelling, design content, colors, dimensions, quantities, and uploaded files.
                  </Paragraph>
                  <Paragraph>
                    PrintVoz is committed to producing customized products according to the specifications provided by the customer and maintaining high standards of quality throughout the production process.
                  </Paragraph>
                </div>
              </article>

              {/* ─ 03 Eligible Refund & Replacement Cases */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="03" title="Eligible Refund & Replacement Cases" id="eligible-cases" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    At PrintVoz, we take pride in maintaining high standards of quality and accuracy. While every order undergoes quality checks before dispatch, certain situations may qualify for a refund, replacement, or other appropriate resolution.
                  </Paragraph>
                  <Paragraph>
                    Refunds or replacements may be considered in the following circumstances:
                  </Paragraph>

                  {/* Green trust styling dashboard */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4">
                    {[
                      { title: "Incorrect Product Delivered", desc: "If the product received is significantly different from the product ordered, customers may be eligible for a replacement or other appropriate resolution.", icon: FileText },
                      { title: "Printing Errors Caused by PrintVoz", desc: "If a product contains a clear printing error, production mistake, or customization error that differs from the specifications submitted and approved by the customer, PrintVoz may review the issue for replacement or refund eligibility.", icon: Palette },
                      { title: "Damaged Products", desc: "If a product arrives damaged due to manufacturing defects or shipping-related damage, customers may be eligible for assistance after verification.", icon: FileBox },
                      { title: "Incorrect Quantity Delivered", desc: "If the delivered quantity is substantially less than the quantity confirmed in the order, customers should notify us for review and resolution.", icon: Layers },
                      { title: "Manufacturing Defects", desc: "Products containing verified manufacturing defects that affect their intended use, appearance, or functionality may qualify for replacement or other corrective action.", icon: Settings }
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl border border-green-500/15 bg-green-500/5 dark:bg-green-500/2 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-green-700 dark:text-green-300 flex items-center gap-1.5 mb-1.5">
                            <Check size={14} className="shrink-0" />
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-[var(--text)]/65 leading-relaxed font-semibold">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Verification Process</h3>
                  <Paragraph>
                    To review any refund or replacement request, PrintVoz may require:
                  </Paragraph>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm font-semibold text-[var(--text)]/75">
                    <li>Order number</li>
                    <li>Clear photographs of the product</li>
                    <li>Photographs of packaging (if applicable)</li>
                    <li>Description of the issue</li>
                    <li>Additional information necessary for investigation</li>
                  </ul>

                  <Paragraph>
                    Each request is reviewed individually based on the specific circumstances and supporting evidence provided.
                  </Paragraph>

                  {/* Resolution Options grid */}
                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Resolution Options</h3>
                  <Paragraph>
                    Depending on the nature of the issue, PrintVoz may provide one or more of the following:
                  </Paragraph>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-4">
                    {[
                      { title: "Product Replacement", icon: RefreshCw },
                      { title: "Reprint Product", icon: Layers },
                      { title: "Store Credit", icon: GiftCardIcon }, // we can use FileText as fallback
                      { title: "Partial Refund", icon: Percent },
                      { title: "Full Refund", icon: CreditCard }
                    ].map((item, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)] flex flex-col items-center justify-center text-center">
                        <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/6 text-[var(--primary)] flex items-center justify-center mb-1.5 shrink-0">
                          {item.icon ? <item.icon size={16} /> : <FileText size={16} />}
                        </span>
                        <span className="text-[10px] font-bold text-[var(--text)]/85 leading-tight">{item.title}</span>
                      </div>
                    ))}
                  </div>

                  <Paragraph>
                    The final resolution will be determined after reviewing the details of the claim.
                  </Paragraph>

                  <div className="border-t border-[var(--secondary)]/8 pt-4 mt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]/40 mb-1">Our Commitment</h4>
                    <Paragraph>
                      Customer satisfaction is important to us. When genuine production, manufacturing, or fulfillment issues occur, PrintVoz will make reasonable efforts to provide a fair and appropriate resolution.
                    </Paragraph>
                  </div>
                </div>
              </article>

              {/* ─ 04 Non-Refundable Situations */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="04" title="Non-Refundable Situations" id="non-refundable" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    While PrintVoz is committed to customer satisfaction, certain situations are not eligible for refunds, returns, replacements, or exchanges due to the customized nature of our products and services.
                  </Paragraph>
                  <Paragraph>
                    Refund requests may be declined in the following circumstances:
                  </Paragraph>

                  {/* Warning zone with custom styling */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4">
                    {[
                      {
                        title: "Customer-Provided Errors",
                        desc: "Mistakes submitted by customers: spelling/grammatical errors, incorrect names/numbers, dimensions/specifications, quantities, color selections, or incorrect shipping info.",
                        icon: XCircle
                      },
                      {
                        title: "Low-Quality Files",
                        desc: "Print quality issues from low-resolution images, pixelated artwork, blurry photographs, poor file quality, incorrect file formats, or customer-submitted design bugs.",
                        icon: AlertTriangle
                      },
                      {
                        title: "Approved Designs & Proofs",
                        desc: "Once layout proofs, mockups, or previews are approved by the client, refund or reprint requests based on approved content, spelling, or designs are not accepted.",
                        icon: ShieldCheck
                      },
                      {
                        title: "Change of Mind",
                        desc: "No refunds, returns, or exchanges are available for change of mind, personal preference shifts, or decisions made after print production has commenced.",
                        icon: RefreshCw
                      },
                      {
                        title: "Minor Variations",
                        desc: "Slight color differences, minor alignment shifts, small trimming limits, material texture shifts, or finishing variations considered normal in commercial printing.",
                        icon: Layers
                      },
                      {
                        title: "Delivery Delays Beyond Control",
                        desc: "Delays caused by couriers, weather anomalies, national holidays, transport disruptions, or government restrictions do not qualify for refunds.",
                        icon: Truck
                      },
                      {
                        title: "Copyright Violations",
                        desc: "Orders rejected or affected due to customer-submitted designs violating copyright, trademark, intellectual property, or local laws.",
                        icon: Lock
                      }
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl border border-red-500/10 bg-red-500/5 dark:bg-red-500/2 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-red-700 dark:text-red-300 flex items-center gap-1.5 mb-1.5">
                            <XCircle size={14} className="shrink-0" />
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-[var(--text)]/65 leading-relaxed font-semibold">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[var(--secondary)]/8 pt-4 mt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]/40 mb-1">Our Commitment</h4>
                    <Paragraph>
                      While certain situations are not eligible for refunds, PrintVoz remains committed to reviewing genuine concerns fairly and providing appropriate assistance whenever possible.
                    </Paragraph>
                  </div>
                </div>
              </article>

              {/* ─ 05 Damaged or Incorrect Orders */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="05" title="Damaged or Incorrect Orders" id="damaged-incorrect" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    PrintVoz takes great care to ensure that all products are manufactured, inspected, packaged, and shipped according to our quality standards. However, in the unlikely event that you receive a damaged or incorrect product, we are committed to reviewing the issue and providing an appropriate resolution where applicable.
                  </Paragraph>

                  {/* Interactive timeline diagram */}
                  <div className="rounded-2xl border border-[var(--secondary)]/10 p-5 bg-[var(--surface-card)] my-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]/50 mb-5 text-center">
                      Issue Resolution Pipeline
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative">
                      {[
                        { step: "01", name: "Receive Order", desc: "Order delivered" },
                        { step: "02", name: "Inspect Product", desc: "Audit print quality" },
                        { step: "03", name: "Report Issue", desc: "Within 48 hours" },
                        { step: "04", name: "Verification", desc: "Provide evidence" },
                        { step: "05", name: "Review", desc: "Production audit" },
                        { step: "06", name: "Resolution", desc: "Reprint/refund" }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center relative z-10 text-center">
                          <span className="w-8 h-8 rounded-full bg-[var(--primary)] border-2 border-[var(--primary)] text-white flex items-center justify-center text-xs font-bold transition-all shadow-sm">
                            {item.step}
                          </span>
                          <span className="text-xs font-bold text-[var(--text)] mt-2 leading-tight">{item.name}</span>
                          <span className="text-[9px] text-[var(--text)]/40 font-semibold mt-0.5 leading-tight">{item.desc}</span>
                        </div>
                      ))}
                      {/* connector line */}
                      <div className="absolute left-[8%] right-[8%] top-4 h-[1px] bg-[var(--secondary)]/15 -z-10 hidden md:block" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Damaged Products</h3>
                  <Paragraph>
                    If your order arrives damaged during shipping or contains a manufacturing defect, please contact us as soon as possible after delivery.
                  </Paragraph>
                  <Paragraph>
                    Examples may include: physical damage to the product, printing defects caused during production, torn, broken, or defective items, and products that are unusable due to manufacturing issues.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Incorrect Products</h3>
                  <Paragraph>
                    Customers should carefully inspect their order upon delivery. If you receive a different product than ordered, an incorrect design or customization caused by PrintVoz, an incorrect quantity, or a product that significantly differs from the confirmed order specifications, please notify our support team for review.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Required Evidence</h3>
                  <Paragraph>
                    To help us investigate and resolve the issue efficiently, customers may be asked to provide: order number, clear photographs of the product, photographs showing the issue, packaging photographs (if applicable), and a brief description of the problem.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Review Process</h3>
                  <Paragraph>
                    Each claim is reviewed individually by our team to verify: the reported issue, production records, order specifications, and supporting evidence. Providing accurate and complete information helps us process requests more efficiently.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Resolution Options</h3>
                  <Paragraph>
                    If the claim is approved, PrintVoz may provide one of the following resolutions: product replacement, reprint of the affected item, store credit, partial refund, or full refund (where applicable). The appropriate resolution will depend on the nature and severity of the issue.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Inspection Requirement</h3>
                  <Paragraph>
                    Customers are encouraged to inspect their orders promptly upon delivery and report any concerns within the reporting period specified in this Refund Policy. Delays in reporting issues may affect our ability to investigate and resolve claims.
                  </Paragraph>

                  <div className="border-t border-[var(--secondary)]/8 pt-4 mt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]/40 mb-1">Our Commitment</h4>
                    <Paragraph>
                      Customer satisfaction is important to us. If a genuine production error, manufacturing defect, or fulfillment mistake occurs, PrintVoz will make reasonable efforts to provide a fair and timely resolution.
                    </Paragraph>
                  </div>
                </div>
              </article>

              {/* ─ 06 Reporting Issues */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="06" title="Reporting Issues" id="reporting-issues" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    To ensure that concerns can be investigated and resolved efficiently, customers are encouraged to review their orders immediately upon delivery and report any issues within the timeframes outlined below.
                  </Paragraph>
                  <Paragraph>
                    Prompt reporting helps us verify claims, review production records, and provide appropriate assistance where applicable.
                  </Paragraph>

                  {/* Modern support process UI workflow steps */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 my-4">
                    {[
                      { step: "Step 1", title: "Take Photos", desc: "Capture clear product & packaging photos", icon: Camera },
                      { step: "Step 2", title: "Contact Support", desc: "Open support ticket within 48h", icon: Headphones },
                      { step: "Step 3", title: "Submit Evidence", desc: "Provide order ID & issue description", icon: FileText },
                      { step: "Step 4", title: "Investigation", desc: "We check QC & production records", icon: Search },
                      { step: "Step 5", title: "Outcome", desc: "Approve replacement/reprint/refund", icon: CheckCircle2 }
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl border border-[var(--secondary)]/10 bg-[var(--surface-light)]">
                        <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider mb-1 block">{item.step}</span>
                        <h4 className="text-xs font-extrabold text-[var(--text)] flex items-center gap-1.5 mb-1">
                          <item.icon size={13} className="text-[var(--primary)] shrink-0" />
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-[var(--text)]/50 leading-relaxed font-semibold">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Reporting Timeframe</h3>
                  <Paragraph>
                    Any issue relating to a product, including damage, manufacturing defects, printing errors, or incorrect items, should be reported within 48 hours of delivery. Claims submitted after this period may be more difficult to verify and may not be eligible for review.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">How to Report an Issue</h3>
                  <Paragraph>
                    Customers may contact PrintVoz through our official customer support channels and provide: order number, product name, description of the issue, clear photographs of the product, packaging photographs (if applicable), and any additional supporting information requested by our team. Providing complete and accurate information will help us process claims more quickly and efficiently.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Investigation Process</h3>
                  <Paragraph>
                    Once a report is received, PrintVoz may review: order records, production files, quality control records, shipping information, and submitted photographs/evidence. Additional information may be requested if necessary to complete the investigation.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Review Outcome</h3>
                  <Paragraph>
                    After reviewing the claim, PrintVoz will determine the most appropriate resolution based on the circumstances of the case and the information provided. Possible outcomes may include: product replacement, product reprint, store credit, partial refund, full refund (where applicable), and claim rejection if eligibility requirements are not met.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">False or Misleading Claims</h3>
                  <Paragraph>
                    PrintVoz reserves the right to reject claims that contain false, misleading, incomplete, or fraudulent information. Our review process is designed to ensure fairness for both customers and the business.
                  </Paragraph>

                  <div className="border-t border-[var(--secondary)]/8 pt-4 mt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]/40 mb-1">Our Commitment</h4>
                    <Paragraph>
                      We are committed to handling customer concerns professionally, fairly, and efficiently. Prompt reporting allows us to provide faster support and maintain the quality standards our customers expect from PrintVoz.
                    </Paragraph>
                  </div>
                </div>
              </article>

              {/* ─ 07 Refund Processing */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="07" title="Refund Processing" id="refund-processing" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    If a refund request is approved by PrintVoz, we will initiate the refund process in accordance with this Refund Policy and applicable payment procedures.
                  </Paragraph>
                  <Paragraph>
                    Our goal is to process eligible refunds fairly, transparently, and as efficiently as possible.
                  </Paragraph>

                  {/* Financial dashboard UI */}
                  <div className="rounded-2xl border border-[var(--secondary)]/12 p-6 bg-gradient-to-br from-[var(--primary)]/[0.02] to-[var(--secondary)]/[0.04] my-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-[var(--text)]">Financial Refund Hub</h4>
                        <p className="text-[10px] text-[var(--text)]/40 font-medium uppercase tracking-wider">Gateway Processing Status</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl border border-[var(--secondary)]/10 bg-[var(--surface)]">
                        <h5 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5 mb-1">
                          <CreditCard size={12} className="text-[var(--primary)]" />
                          Original Method
                        </h5>
                        <p className="text-[11px] text-[var(--text)]/60 leading-relaxed font-semibold">
                          Approved refunds are processed back to the exact payment method used to purchase.
                        </p>
                      </div>
                      
                      {/* Prominent Statistics Card for 5-10 Days */}
                      <div className="p-4 rounded-xl border border-[var(--primary)]/15 bg-[var(--primary)]/5 flex flex-col justify-between sm:col-span-2">
                        <div>
                          <h5 className="text-xs font-black text-[var(--primary)] flex items-center gap-1.5 mb-1.5">
                            <Clock size={12} />
                            PROCESSING TIMELINE
                          </h5>
                          <span className="text-2xl font-black text-[var(--text)] tracking-tight block mb-1">
                            5–10 Business Days
                          </span>
                        </div>
                        <p className="text-[10px] text-[var(--text)]/50 leading-normal font-semibold">
                          Dependent on banking gateways, public holidays, and provider clearing parameters.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-[var(--secondary)]/10 bg-[var(--surface)]">
                        <h5 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5 mb-1">
                          <Lock size={12} className="text-[var(--primary)]" />
                          Secure Audits
                        </h5>
                        <p className="text-[11px] text-[var(--text)]/60 leading-relaxed font-semibold">
                          Every gateway clearance is verified to avoid double charges and coordinate logs.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Refund Approval</h3>
                  <Paragraph>
                    All refund requests are subject to review and verification. Approval of a refund is not automatic and depends on factors such as: eligibility under this Refund Policy, verification of the reported issue, supporting evidence provided by the customer, order and production records, and internal review findings.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Refund Method</h3>
                  <Paragraph>
                    Approved refunds will generally be issued through the original payment method used during the purchase whenever possible. The available refund method may depend on: payment provider policies, banking requirements, transaction type, and applicable regulations.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Processing Time</h3>
                  <Paragraph>
                    Once a refund has been approved, processing may take approximately 5 to 10 business days to appear in the customer's account. Actual processing times may vary depending on: banks, payment gateways, financial institutions, public holidays, and technical processing delays.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Partial Refunds</h3>
                  <Paragraph>
                    In certain situations, PrintVoz may determine that a partial refund is more appropriate than a full refund. Examples may include: partially affected orders, minor production issues, quantity discrepancies, or other circumstances where a partial resolution is deemed reasonable.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Alternative Resolutions</h3>
                  <Paragraph>
                    Depending on the nature of the issue, PrintVoz may offer alternative solutions instead of a monetary refund, including: product replacement, product reprint, store credit, promotional credit, and other mutually agreed resolutions.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Non-Approved Claims</h3>
                  <Paragraph>
                    If a refund request does not meet the eligibility requirements outlined in this Refund Policy, the request may be declined. Customers will be informed of the outcome following the review process.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Refund Status</h3>
                  <Paragraph>
                    Customers may contact our support team to inquire about the status of an approved refund or request additional assistance regarding the refund process.
                  </Paragraph>

                  <div className="border-t border-[var(--secondary)]/8 pt-4 mt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]/40 mb-1">Our Commitment</h4>
                    <Paragraph>
                      PrintVoz is committed to maintaining a fair and transparent refund process. We strive to review every request carefully and provide appropriate resolutions when eligible issues are identified.
                    </Paragraph>
                  </div>
                </div>
              </article>

              {/* ─ 08 Order Cancellation */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="08" title="Order Cancellation" id="order-cancellation" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    At PrintVoz, we understand that customers may occasionally need to modify or cancel an order. However, because many of our products are custom-made and manufactured specifically according to customer requirements, cancellation requests are subject to certain limitations.
                  </Paragraph>

                  {/* Interactive Cancellation Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                    <div className="p-4 rounded-xl border border-green-500/15 bg-green-500/5 dark:bg-green-500/2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-green-700 dark:text-green-300 flex items-center gap-1.5 mb-1">
                        <CheckCircle2 size={14} className="shrink-0" />
                        Before Production
                      </h4>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-black tracking-wider uppercase mb-2">
                        Eligible
                      </span>
                      <p className="text-[11px] text-[var(--text)]/65 leading-relaxed font-semibold">
                        Cancellations are accepted if requested before materials are prepared or custom manufacturing starts.
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-xl border border-amber-500/15 bg-amber-500/5 dark:bg-amber-500/2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                        <AlertTriangle size={14} className="shrink-0" />
                        Production Started
                      </h4>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black tracking-wider uppercase mb-2">
                        Restricted
                      </span>
                      <p className="text-[11px] text-[var(--text)]/65 leading-relaxed font-semibold">
                        Once designs are checked and machines begin printing, cancellations are strictly restricted.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-red-500/15 bg-red-500/5 dark:bg-red-500/2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-red-700 dark:text-red-300 flex items-center gap-1.5 mb-1">
                        <XCircle size={14} className="shrink-0" />
                        Completed Production
                      </h4>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 text-[10px] font-black tracking-wider uppercase mb-2">
                        Not Eligible
                      </span>
                      <p className="text-[11px] text-[var(--text)]/65 leading-relaxed font-semibold">
                        Finished customized products cannot be resold or restocked, making them non-refundable.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Cancellation Before Production</h3>
                  <Paragraph>
                    Customers may request cancellation of an order before production, printing, customization, or manufacturing work has begun. If the cancellation request is approved before production starts, any eligible refund will be processed in accordance with our Refund Policy.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Cancellation After Production Begins</h3>
                  <Paragraph>
                    Once production, printing, design preparation, customization, or manufacturing has started, cancellation requests may not be accepted. This is because customized products are created specifically for individual customers and often cannot be resold or reused.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Order Modification Requests</h3>
                  <Paragraph>
                    Customers are encouraged to carefully review all order details before completing their purchase. Requests to modify: product specifications, quantities, customization details, uploaded artwork, design files, or shipping information may not be possible after production has started.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Customer Responsibility</h3>
                  <Paragraph>
                    Before placing an order, customers should verify: product selections, design content, spelling and text, quantities, dimensions, shipping details, and contact information. PrintVoz is not responsible for cancellation requests resulting from customer-submitted errors identified after production has begun.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Cancellation by PrintVoz</h3>
                  <Paragraph>
                    PrintVoz reserves the right to cancel an order in situations including, but not limited to: payment verification issues, suspected fraudulent activity, technical or pricing errors, unavailable materials or products, production limitations, policy violations, or unlawful/prohibited content. If an order is cancelled by PrintVoz before production begins, any eligible payment amount will be handled according to our Refund Policy.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Bulk & Special Orders</h3>
                  <Paragraph>
                    Large-volume orders, corporate orders, and specially sourced products may be subject to additional cancellation restrictions due to production planning and procurement requirements.
                  </Paragraph>

                  <div className="border-t border-[var(--secondary)]/8 pt-4 mt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]/40 mb-1">Our Commitment</h4>
                    <Paragraph>
                      PrintVoz aims to process orders efficiently while maintaining flexibility wherever possible. We encourage customers to review all order details carefully before purchase and contact our support team promptly if cancellation assistance is required.
                    </Paragraph>
                  </div>
                </div>
              </article>

              {/* ─ 09 Contact Information */}
              <article className="mb-14 scroll-mt-28">
                <SectionHeading num="09" title="Contact Information" id="contact-info" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    If you have any questions, require cancellation assistance, or need to contact us regarding our Refund Policy, please connect with our team.
                  </Paragraph>

                  {/* Premium Support Center details card */}
                  <div className="p-6 rounded-2xl border border-[var(--secondary)]/10 bg-gradient-to-br from-[var(--primary)]/[0.03] to-[var(--secondary)]/[0.05] flex flex-col gap-4 my-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/8 text-[var(--primary)] flex items-center justify-center">
                        <Scale size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-wider text-[var(--text)]">PrintVoz Support</h4>
                        <p className="text-[10px] text-[var(--text)]/40 font-semibold">Official Refund Operations</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                      <div className="p-3.5 rounded-lg border border-[var(--secondary)]/8 bg-[var(--surface)] flex flex-col gap-0.5">
                        <span className="text-[10px] text-[var(--text)]/35 uppercase tracking-wider">Company Website</span>
                        <span className="text-[var(--text)] font-bold">printvoz.com</span>
                      </div>
                      <div className="p-3.5 rounded-lg border border-[var(--secondary)]/8 bg-[var(--surface)] flex flex-col gap-0.5">
                        <span className="text-[10px] text-[var(--text)]/35 uppercase tracking-wider">Support Email</span>
                        <a href="mailto:support@printvoz.com" className="text-[var(--primary)] hover:underline font-bold">support@printvoz.com</a>
                      </div>
                    </div>

                    {/* CTA Card with Buttons */}
                    <div className="p-4 rounded-xl border border-[var(--primary)]/10 bg-[var(--surface-light)] text-center flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                      <div className="text-left">
                        <h5 className="text-xs font-bold text-[var(--text)]">Have an issue with your order?</h5>
                        <p className="text-[10px] text-[var(--text)]/50 leading-normal font-semibold">Our team resolves claims within 48 hours.</p>
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

              {/* ─ 10 Print Quality & Color Variations */}
              <article className="scroll-mt-28" id="print-quality">
                <SectionHeading num="10" title="Print Quality & Color Variations" id="print-quality" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    PrintVoz is committed to delivering high-quality printed products using professional printing equipment, materials, and production processes.
                  </Paragraph>
                  <Paragraph>
                    However, customers should understand that minor variations may naturally occur between digital designs, on-screen previews, and final printed products.
                  </Paragraph>

                  {/* RGB vs CMYK Educational comparison */}
                  <div className="rounded-2xl border border-[var(--secondary)]/10 p-5 bg-[var(--surface-light)] my-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-extrabold text-[var(--text)] mb-2 flex items-center gap-1.5">
                          <Monitor size={14} className="text-[var(--primary)] shrink-0" />
                          Digital Screen (RGB)
                        </h4>
                        <div className="h-8 rounded-lg bg-gradient-to-r from-red-500 via-green-500 to-blue-500 mb-2 shadow-inner" />
                        <p className="text-[11px] text-[var(--text)]/50 leading-relaxed font-semibold">
                          Colors viewed on mobile phones, tablets, laptops, and computer monitors may appear different from printed colors. This difference occurs because digital screens display colors using light (RGB).
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-extrabold text-[var(--text)] mb-2 flex items-center gap-1.5">
                          <Layers size={14} className="text-[var(--primary)] shrink-0" />
                          Printed Product (CMYK)
                        </h4>
                        <div className="h-8 rounded-lg bg-gradient-to-r from-cyan-500 via-magenta-500 to-yellow-500 mb-2 shadow-inner" />
                        <p className="text-[11px] text-[var(--text)]/50 leading-relaxed font-semibold">
                          Printed products are produced using inks, toners, and physical materials (CMYK and other printing methods). As a result, slight color differences between digital previews and printed products are normal and expected.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-2">Acceptable Variations</h3>
                  <Paragraph>
                    Minor variations may occur in: color tones and shades, brightness and saturation, image positioning, trimming and cutting, material texture, and finishing effects. Such variations are considered standard within the printing industry and do not constitute defects.
                  </Paragraph>

                  {/* Grid Cards for variations */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                    {[
                      { title: "Color Differences", desc: "Color tones and brightness shades", icon: Palette },
                      { title: "Material Variations", desc: "Paper type, fabric and vinyl texture absorption", icon: FileText },
                      { title: "Trimming Variations", desc: "Standard tolerances in cutting & alignment", icon: Scissors },
                      { title: "Production Tolerances", desc: "Digital previews vs physical printing substrates", icon: Layers }
                    ].map((item, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-card)]">
                        <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/6 text-[var(--primary)] flex items-center justify-center mb-2">
                          <item.icon size={16} />
                        </span>
                        <h4 className="text-xs font-bold text-[var(--text)] mb-0.5">{item.title}</h4>
                        <p className="text-[10px] text-[var(--text)]/40 leading-normal font-semibold">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Material & Product Differences</h3>
                  <Paragraph>
                    Printed results may vary depending on: paper type, fabric material, vinyl surfaces, packaging materials, promotional products, and specialty printing substrates. Different materials absorb and display colors differently, which may affect the final appearance of the product.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Customer-Provided Files</h3>
                  <Paragraph>
                    Final print quality depends significantly on the quality of the files submitted by the customer. For best results, customers should provide: high-resolution artwork, print-ready files, accurate color specifications, and properly formatted designs. PrintVoz is not responsible for quality issues caused by low-resolution images, poor artwork quality, incorrect file preparation, or customer-provided design errors.
                  </Paragraph>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Proofs & Mockups</h3>
                  <Paragraph>
                    Digital proofs, previews, and mockups are intended as visual references only. The final printed product may vary slightly due to production methods, materials, lighting conditions, and printing technology.
                  </Paragraph>

                  {/* Important Notice Callout */}
                  <div className="rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5 text-amber-800 dark:text-amber-200 flex gap-3.5 items-start my-4">
                    <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-black uppercase tracking-wider mb-1">Important Notice</h5>
                      <p className="text-xs leading-relaxed font-semibold opacity-85">
                        Minor color, alignment, trimming, or finishing variations that fall within normal industry tolerances are not eligible for refunds, returns, or replacements. Minor variations are normal in the printing industry and generally do not qualify for refunds.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text)] mt-4">Refund Eligibility</h3>
                  <Paragraph>
                    Minor color, alignment, trimming, or finishing variations that fall within normal industry tolerances are not eligible for refunds, returns, or replacements. Refund and replacement requests will be evaluated according to the terms outlined in this Refund Policy.
                  </Paragraph>

                  <div className="border-t border-[var(--secondary)]/8 pt-4 mt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]/40 mb-1">Our Commitment</h4>
                    <Paragraph>
                      PrintVoz continuously strives to maintain high production standards and deliver professional-quality products. While minor variations are a natural part of the printing process, customer satisfaction, quality, and transparency remain at the core of everything we do.
                    </Paragraph>
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
            className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-xl backdrop-blur-md border border-[var(--secondary)]/15 shadow-md flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all duration-300"
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
   GIFT CARD ICON FOR RESOLUTIONS GRID
   ─────────────────────────────────────────────────────────── */
function GiftCardIcon({ size = 16, className = "" }) {
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
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V7" />
      <path d="M8 21V7" />
      <path d="M12 7a4 4 0 0 1-4-4 2 2 0 0 1 4 0 2 2 0 0 1 4 0 4 4 0 0 1-4 4z" />
    </svg>
  );
}
