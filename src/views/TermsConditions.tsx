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
  Image,
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
} from "lucide-react";

/* ───────────────────────────────────────────────────────────
   TABLE OF CONTENTS DATA (18 SECTIONS)
   ─────────────────────────────────────────────────────────── */
const TOC = [
  { id: "acceptance-of-terms", label: "Acceptance of Terms", num: "01" },
  { id: "eligibility-accounts", label: "Eligibility & User Accounts", num: "02" },
  { id: "products-services", label: "Products & Services", num: "03" },
  { id: "pricing-payments", label: "Pricing & Payments", num: "04" },
  { id: "order-acceptance-cancellation", label: "Order Acceptance & Cancellation", num: "05" },
  { id: "custom-printing-orders", label: "Custom Printing Orders", num: "06" },
  { id: "uploaded-designs", label: "Customer Uploaded Designs", num: "07" },
  { id: "copyright-trademark", label: "Copyright & Trademark Responsibility", num: "08" },
  { id: "print-quality-variation", label: "Print Quality & Color Variation", num: "09" },
  { id: "production-delivery", label: "Production & Delivery Timelines", num: "10" },
  { id: "shipping-policy", label: "Shipping Policy", num: "11" },
  { id: "intellectual-property", label: "Intellectual Property", num: "12" },
  { id: "limitation-of-liability", label: "Limitation of Liability", num: "13" },
  { id: "third-party-services", label: "Third-Party Services", num: "14" },
  { id: "account-suspension", label: "Account Suspension & Termination", num: "15" },
  { id: "changes-to-terms", label: "Changes to Terms", num: "16" },
  { id: "governing-law", label: "Governing Law & Jurisdiction", num: "17" },
  { id: "contact-us", label: "Contact Us", num: "18" },
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

const cardGlow = {
  rest: { boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  hover: {
    y: -4,
    boxShadow: "0 20px 40px rgba(80,80,57,0.10), 0 0 0 1px rgba(167,170,99,0.15)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

/* ───────────────────────────────────────────────────────────
   SMALL REUSABLE COMPONENTS
   ─────────────────────────────────────────────────────────── */
function InfoCard({
  icon: Icon,
  label,
  delay = 0,
}: {
  icon: any;
  label: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--secondary)]/10 backdrop-blur-sm transition-all duration-300"
      style={{ background: 'var(--surface-card)', willChange: 'transform' }}
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary)]/8 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 shrink-0">
        <Icon size={16} strokeWidth={1.8} />
      </span>
      <span className="text-xs sm:text-sm font-semibold text-[var(--text)]/85">{label}</span>
    </motion.div>
  );
}

function TrustCard({
  icon: Icon,
  title,
  delay = 0,
}: {
  icon: any;
  title: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -4 }}
      className="relative group flex flex-col items-center text-center px-5 py-6 rounded-2xl backdrop-blur-md border border-[var(--secondary)]/12 overflow-hidden cursor-default transition-all duration-300"
      style={{ background: 'var(--surface-light)' }}
    >
      <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-[var(--primary)]/5 blur-xl group-hover:bg-[var(--primary)]/10 transition-all duration-500" />
      <span className="relative z-10 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white mb-3 shadow-md shadow-[var(--primary)]/15 group-hover:scale-105 transition-transform duration-300">
        <Icon size={22} strokeWidth={1.6} />
      </span>
      <h3 className="relative z-10 text-xs sm:text-sm font-bold text-[var(--text)] tracking-tight">
        {title}
      </h3>
    </motion.div>
  );
}

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
      className="text-sm sm:text-base leading-[1.8] text-[var(--text)]/80 max-w-[72ch]"
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
              Agreement Sections
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
        aria-label="Toggle terms sections"
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white flex items-center justify-center shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   MAIN TERMS & CONDITIONS COMPONENT
   ─────────────────────────────────────────────────────────── */
export default function TermsConditions() {
  const [activeSection, setActiveSection] = useState("acceptance-of-terms");
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
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg)] via-[var(--bg)] to-[var(--secondary)]/5" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Blurred floating orbs */}
        <div className="absolute top-16 left-[8%] w-64 h-64 rounded-full bg-[var(--primary)]/3 blur-[70px] animate-pulse" />
        <div className="absolute bottom-8 right-[12%] w-80 h-80 rounded-full bg-[var(--secondary)]/6 blur-[90px]" />

        {/* Floating geometric assets */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-28 right-[18%] w-14 h-14 rounded-xl border border-[var(--primary)]/10 rotate-6 hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, 8, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-[15%] w-10 h-10 rounded-full border border-[var(--secondary)]/12 hidden lg:block"
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Legal Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border border-[var(--secondary)]/15 mb-6 shadow-sm"
            style={{ background: 'var(--surface-card)' }}
          >
            <Scale size={14} className="text-[var(--primary)]" strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--primary)]">
              📜 Legal Agreement
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
            Terms &{" "}
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
              Conditions
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm sm:text-base md:text-lg text-[var(--text)]/65 max-w-2xl mx-auto leading-relaxed mb-8 font-medium"
          >
            These Terms & Conditions govern your access to and use of PrintVoz products, services, website, custom printing solutions, and related features.
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

      {/* ── LEGAL TRUST BANNER ──────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 -mt-2 mb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <TrustCard icon={Scale} title="Fair Business Practices" delay={0} />
          <TrustCard icon={Lock} title="Secure Transactions" delay={1} />
          <TrustCard icon={ShieldCheck} title="Customer Protection" delay={2} />
          <TrustCard icon={FileText} title="Transparent Policies" delay={3} />
        </div>
      </section>

      {/* ── MAIN CONTENT LAYOUT ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex gap-10 lg:gap-14 relative">
          
          {/* Desktop Table of Contents Sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-28">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--text)]/35 mb-4 px-2">
                Document Sections
              </p>
              <nav aria-label="Table of Contents">
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
                              layoutId="toc-sidebar-active"
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
                <p className="text-[9px] font-bold text-[var(--text)]/30 mt-2 tracking-wider">
                  READING PROGRESS
                </p>
              </div>
            </div>
          </aside>

          {/* Document Content Area */}
          <div ref={contentRef} className="flex-1 min-w-0">
            <div className="backdrop-blur-sm rounded-3xl border border-[var(--secondary)]/8 shadow-lg p-5 sm:p-10 md:p-12" style={{ background: 'var(--surface)' }}>
              
              {/* ─ 01 Acceptance of Terms */}
              <article className="mb-14">
                <SectionHeading num="01" title="Acceptance of Terms" id="acceptance-of-terms" />
                <div className="space-y-4 flex flex-col">
                  <Paragraph>
                    Welcome to PrintVoz. By accessing our website, creating an account, placing an order, uploading files, or using any of our premium custom printing services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
                  </Paragraph>
                  <Paragraph>
                    If you do not agree to these terms, you must not access or use our platform. These terms represent a legally binding agreement between you (the "Customer", "User", or "You") and PrintVoz.
                  </Paragraph>
                  <Paragraph>
                    We reserve the right to modify or replace these terms at any time. Continued use of the platform after updates constitutes your agreement to the new Terms & Conditions.
                  </Paragraph>
                </div>
              </article>

              {/* ─ 02 Eligibility & User Accounts */}
              <article className="mb-14">
                <SectionHeading num="02" title="Eligibility & User Accounts" id="eligibility-accounts" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    To use the full features of PrintVoz, you may be required to register for an account. You represent that you are at least 18 years old or possess legal parental consent, and are fully capable of entering into binding agreements.
                  </Paragraph>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <InfoCard icon={User} label="Eligibility (18+ / Consent)" delay={0} />
                    <InfoCard icon={Lock} label="Account Security & Access" delay={1} />
                    <InfoCard icon={CheckCircle2} label="Information Accuracy" delay={2} />
                    <InfoCard icon={X} label="Termination & Suspension" delay={3} />
                  </div>
                  <Paragraph>
                    You are solely responsible for maintaining the confidentiality of your account credentials, including password. You agree to accept responsibility for all activities that occur under your account. PrintVoz reserves the right to suspend or terminate accounts in its sole discretion.
                  </Paragraph>
                </div>
              </article>

              {/* ─ 03 Products & Services */}
              <article className="mb-14">
                <SectionHeading num="03" title="Products & Services" id="products-services" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    PrintVoz provides a high-end online platform offering custom digital printing, fabric prints, banners, stationery, and packaging solutions. We strive to describe and display our printing products as accurately as possible.
                  </Paragraph>
                  
                  {/* Services Grid Showcase */}
                  <div>
                    <h3 className="text-base font-bold text-[var(--text)] mb-3 flex items-center gap-2">
                      <Layers size={16} className="text-[var(--primary)]" />
                      Our Print Solutions
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {[
                        { label: "Custom Printing", icon: Sparkles },
                        { label: "Business Cards", icon: CreditCard },
                        { label: "Packaging & Boxes", icon: Package },
                        { label: "Flyers & Brochures", icon: FileText },
                        { label: "Banners & Signage", icon: Layers },
                        { label: "Custom Stationery", icon: Palette },
                        { label: "Promotional Items", icon: Tag }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-4 rounded-xl border border-[var(--secondary)]/10 text-center bg-[var(--surface-card)] hover:border-[var(--primary)]/15 transition-all">
                          <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/8 text-[var(--primary)] flex items-center justify-center mb-2">
                            <item.icon size={16} />
                          </span>
                          <span className="text-xs font-bold text-[var(--text)]/80 leading-tight">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Paragraph>
                    We reserve the right to limit the sales of our products or services to any person, geographic region, or jurisdiction. We may exercise this right on a case-by-case basis. All descriptions of products or product pricing are subject to change at any time without notice.
                  </Paragraph>
                </div>
              </article>

              {/* ─ 04 Pricing & Payments */}
              <article className="mb-14">
                <SectionHeading num="04" title="Pricing & Payments" id="pricing-payments" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    All prices are listed in Indian Rupees (INR) and are subject to applicable taxes (GST) and shipping fees, which will be detailed during checkout.
                  </Paragraph>

                  {/* Payment Security Dashboard */}
                  <div className="rounded-2xl border border-[var(--secondary)]/12 p-6 bg-gradient-to-br from-[var(--primary)]/[0.02] to-[var(--secondary)]/[0.04]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-[var(--text)]">Secure Transaction Hub</h4>
                        <p className="text-[10px] text-[var(--text)]/40 font-medium">PCI-DSS Compliant Infrastructure</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-[var(--secondary)]/10 bg-[var(--surface)]">
                        <h5 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5 mb-1">
                          <Lock size={12} className="text-[var(--primary)]" />
                          Secure Transactions
                        </h5>
                        <p className="text-[11px] text-[var(--text)]/60 leading-relaxed font-medium">
                          Transactions processed via encrypted gateway channels with zero storage of card credentials.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-[var(--secondary)]/10 bg-[var(--surface)]">
                        <h5 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5 mb-1">
                          <CreditCard size={12} className="text-[var(--primary)]" />
                          Payment Methods
                        </h5>
                        <p className="text-[11px] text-[var(--text)]/60 leading-relaxed font-medium">
                          Supports UPI, NetBanking, credit cards, debit cards, and corporate payment profiles.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-[var(--secondary)]/10 bg-[var(--surface)]">
                        <h5 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5 mb-1">
                          <ShieldCheck size={12} className="text-[var(--primary)]" />
                          Fraud Protection
                        </h5>
                        <p className="text-[11px] text-[var(--text)]/60 leading-relaxed font-medium">
                          Automated triggers and audits detect anomalous billing requests and prevent fraud.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-[var(--secondary)]/10 bg-[var(--surface)]">
                        <h5 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5 mb-1">
                          <Server size={12} className="text-[var(--primary)]" />
                          SSL Encryption
                        </h5>
                        <p className="text-[11px] text-[var(--text)]/60 leading-relaxed font-medium">
                          256-bit Secure Socket Layer data transmission protocols actively shield checkouts.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Paragraph>
                    Production begins only after full payment or a pre-agreed deposit has been verified. PrintVoz reserves the right to hold any order pending resolution of credit issues or payment disputes.
                  </Paragraph>
                </div>
              </article>

              {/* ─ 05 Order Acceptance & Cancellation */}
              <article className="mb-14">
                <SectionHeading num="05" title="Order Acceptance & Cancellation" id="order-acceptance-cancellation" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    Receipt of an order confirmation email does not signify our acceptance of your order. PrintVoz reserves the right to accept, decline, or limit your order for any reason.
                  </Paragraph>

                  {/* Production Pipeline Indicator */}
                  <div className="rounded-2xl border border-[var(--secondary)]/10 p-5 bg-[var(--surface-card)]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]/50 mb-4 text-center">
                      Order Progress & Cancellation Cut-off
                    </h4>
                    <div className="grid grid-cols-4 gap-2 relative">
                      {[
                        { step: "01", name: "Placed", active: true, desc: "Cancel Allowed" },
                        { step: "02", name: "Approved", active: true, desc: "Proofs Confirmed" },
                        { step: "03", name: "Production", active: false, desc: "No Cancellation", highlight: true },
                        { step: "04", name: "Delivery", active: false, desc: "Completed" }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center relative z-10">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                            item.highlight
                              ? "bg-red-500/10 border-red-500 text-red-500 font-extrabold shadow-sm"
                              : item.active
                              ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                              : "bg-[var(--bg)] border-[var(--secondary)]/20 text-[var(--text)]/30"
                          }`}>
                            {item.step}
                          </span>
                          <span className="text-xs font-bold text-[var(--text)] mt-2">{item.name}</span>
                          <span className={`text-[9px] font-semibold mt-0.5 ${item.highlight ? "text-red-500 font-bold" : "text-[var(--text)]/40"}`}>{item.desc}</span>
                        </div>
                      ))}
                      {/* connector line */}
                      <div className="absolute left-[12%] right-[12%] top-4 h-0.5 bg-[var(--secondary)]/15 -z-10" />
                    </div>
                  </div>

                  <Paragraph>
                    <strong className="text-red-500">CRITICAL RULE:</strong> Because custom products are manufactured to individual client specifications, orders cannot be cancelled, modified, or refunded once they transition into the "Production" queue. Please check your layouts and quantities carefully before final submission.
                  </Paragraph>
                </div>
              </article>

              {/* ─ 06 Custom Printing Orders */}
              <article className="mb-14">
                <SectionHeading num="06" title="Custom Printing Orders" id="custom-printing-orders" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    Custom orders require specific preparation parameters. To ensure high-quality output, customers must adhere to our structural guidelines:
                  </Paragraph>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "Design Accuracy", desc: "Always align layouts with our bleed margins, trim lines, and safety zones to avoid critical design cut-offs." },
                      { title: "File Quality", desc: "Submit assets in high-resolution vector format (PDF, AI, EPS, SVG) or high-res raster (300+ DPI)." },
                      { title: "Proof Approval", desc: "Customer proof approvals are binding. We are not liable for typographical or layout errors post-approval." },
                      { title: "Production Limits", desc: "Acceptable manufacturing tolerances (up to 1.5mm offset on cuts, folds, or drills) are industry standard." }
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)]">
                        <h4 className="text-xs font-bold text-[var(--text)] mb-1 flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-[var(--primary)]" />
                          {item.title}
                        </h4>
                        <p className="text-xs text-[var(--text)]/60 leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* ─ 07 Customer Uploaded Designs & Content */}
              <article className="mb-14">
                <SectionHeading num="07" title="Customer Uploaded Designs & Content" id="uploaded-designs" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    You retain full intellectual property ownership of any files, artwork, vectors, logos, and materials you upload to PrintVoz.
                  </Paragraph>

                  {/* Upload Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Vector & Print Layouts", icon: Layers },
                      { label: "Brand Assets & Logos", icon: Tag },
                      { label: "High-Res Photography", icon: Image },
                      { label: "Custom Order Specs", icon: FileText }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center text-center p-4 rounded-xl border border-[var(--secondary)]/10 bg-[var(--surface-card)]">
                        <span className="w-9 h-9 rounded-lg bg-[var(--primary)]/6 text-[var(--primary)] flex items-center justify-center mb-2">
                          <item.icon size={16} />
                        </span>
                        <span className="text-xs font-bold text-[var(--text)]/85 leading-tight">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    className="rounded-2xl border border-[var(--primary)]/10 p-5 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--secondary)]/5 flex gap-3.5 items-start"
                  >
                    <Info size={20} className="text-[var(--primary)] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text)] mb-1">Limited Execution License</h4>
                      <p className="text-xs text-[var(--text)]/65 leading-relaxed font-medium">
                        By uploading files, you grant PrintVoz a non-exclusive, worldwide, royalty-free license to copy, display, distribute, modify, and reproduce your designs solely for the purpose of printing and fulfilling your orders.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </article>

              {/* ─ 08 Copyright & Trademark Responsibility */}
              <article className="mb-14">
                <SectionHeading num="08" title="Copyright & Trademark Responsibility" id="copyright-trademark" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    You represent and warrant that you own or have the lawful rights and licensing permissions for all designs, trademarks, and copyrightable materials submitted to us for print production.
                  </Paragraph>

                  {/* Legal Callout */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    className="rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5 text-amber-800 dark:text-amber-200 flex gap-3.5 items-start"
                  >
                    <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold mb-1">Third-Party Infringement & Indemnity</h4>
                      <p className="text-xs leading-relaxed font-medium opacity-85">
                        PrintVoz rejects printing copyright-infringing materials. The Customer agrees to indemnify, defend, and hold harmless PrintVoz, its directors, partners, and affiliates, from any claims, suits, losses, or legal liabilities arising out of copyright, trademark, or ownership disputes related to custom printed assets.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </article>

              {/* ─ 09 Print Quality & Color Variation */}
              <article className="mb-14">
                <SectionHeading num="09" title="Print Quality & Color Variation" id="print-quality-variation" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    Minor color deviations from digital representation are standard features of high-volume commercial printing.
                  </Paragraph>

                  {/* Calibration Showcase */}
                  <div className="rounded-2xl border border-[var(--secondary)]/10 p-5 bg-[var(--surface-light)]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-[var(--text)] mb-2 flex items-center gap-1.5">
                          <Monitor size={14} className="text-[var(--primary)]" />
                          Monitor RGB Space
                        </h4>
                        <div className="h-10 rounded-lg bg-gradient-to-r from-red-500 via-green-500 to-blue-500 mb-2" />
                        <p className="text-[11px] text-[var(--text)]/50 leading-relaxed font-medium">
                          Monitors display color using dynamic emitted RGB light paths. Brightness controls vary between screens.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[var(--text)] mb-2 flex items-center gap-1.5">
                          <Layers size={14} className="text-[var(--primary)]" />
                          Physical CMYK Inks
                        </h4>
                        <div className="h-10 rounded-lg bg-gradient-to-r from-cyan-500 via-magenta-500 to-yellow-500 mb-2" />
                        <p className="text-[11px] text-[var(--text)]/50 leading-relaxed font-medium">
                          Presses print utilizing Cyan, Magenta, Yellow, and Key (Black) inks. Finished prints reflect ambient room light.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Paragraph>
                    We guarantee print quality parameters, but we cannot warrant exact matches to the colors shown on your computer screen. For color-critical projects, we recommend ordering custom color test proofs before committing to large print runs.
                  </Paragraph>
                </div>
              </article>

              {/* ─ 10 Production & Delivery Timelines */}
              <article className="mb-14">
                <SectionHeading num="10" title="Production & Delivery Timelines" id="production-delivery" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    Print production timelines represent manufacturing durations and do not include transport shipping phases.
                  </Paragraph>

                  {/* Horizontal steps timeline */}
                  <div className="rounded-2xl border border-[var(--secondary)]/8 p-5 bg-[var(--surface-card)]">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      {[
                        { title: "1. Artwork Check", desc: "Resolution review and dimensions audit" },
                        { title: "2. Prepress", desc: "Digital plates and calibration alignments" },
                        { title: "3. Press Run", desc: "Premium ink overlay on selected stocks" },
                        { title: "4. QC & Finish", desc: "Trim verification and package sorting" }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col">
                          <h4 className="text-xs font-bold text-[var(--primary)] mb-1">{item.title}</h4>
                          <p className="text-[10px] text-[var(--text)]/50 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Paragraph>
                    Estimated production turnaround times are detailed during order checkout. Timelines represent business days (excluding Sundays and national holidays). PrintVoz works to achieve deadlines but makes no absolute delivery date guarantees.
                  </Paragraph>
                </div>
              </article>

              {/* ─ 11 Shipping Policy */}
              <article className="mb-14">
                <SectionHeading num="11" title="Shipping Policy" id="shipping-policy" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    We deliver custom print products across Kerala and other Indian states utilizing trusted logistics partners.
                  </Paragraph>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoCard icon={Truck} label="Courier Carrier Integrations" delay={0} />
                    <InfoCard icon={Clock} label="Transit Timeframes" delay={1} />
                    <InfoCard icon={Tag} label="Tracking Notifications" delay={2} />
                    <InfoCard icon={AlertCircle} label="Logistics Delay Conditions" delay={3} />
                  </div>
                  <Paragraph>
                    Once a package leaves our facility, transport delays from carrier anomalies, weather obstacles, or customs audits are outside our operational control. PrintVoz is not liable for delayed transit delivery windows.
                  </Paragraph>
                </div>
              </article>

              {/* ─ 12 Intellectual Property */}
              <article className="mb-14">
                <SectionHeading num="12" title="Intellectual Property" id="intellectual-property" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    All content on the PrintVoz platform, including logos, visual interface elements, custom typography layouts, coding assets, graphics, and branding icons, represents proprietary intellectual property owned by or licensed to PrintVoz.
                  </Paragraph>
                  <Paragraph>
                    You agree not to duplicate, modify, reverse-engineer, distribute, or display any proprietary assets or site architecture belonging to PrintVoz without explicit written authorization.
                  </Paragraph>
                </div>
              </article>

              {/* ─ 13 Limitation of Liability */}
              <article className="mb-14">
                <SectionHeading num="13" title="Limitation of Liability" id="limitation-of-liability" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    PrintVoz provides products and services "as is" and "as available" without any warranties of any kind, whether express or implied.
                  </Paragraph>

                  {/* Warning Block */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    className="p-5 rounded-2xl border border-red-500/25 bg-red-500/5 text-red-900 dark:text-red-200"
                  >
                    <div className="flex gap-3 items-start">
                      <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold mb-1 uppercase tracking-wider">LIMITATION ON DAMAGES</h4>
                        <p className="text-xs leading-relaxed font-medium opacity-85">
                          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL PRINTVOZ, ITS OFFICERS, PARTNERS, OR EMPLOYEES BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, DATA LOSS, OR DELIVERY DELAYS, ARISING FROM ACCUMULATED SERVICE OUTAGES OR GRAPHIC LAYOUT ERRORS COMPLETED BY THE CUSTOMER.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </article>

              {/* ─ 14 Third-Party Services */}
              <article className="mb-14">
                <SectionHeading num="14" title="Third-Party Services" id="third-party-services" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    PrintVoz relies on specialized, trusted third-party service providers to power checkout, transport, and server infrastructure:
                  </Paragraph>

                  {/* Partner Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {[
                      { icon: CreditCard, label: "Payments", desc: "Stripe & Razorpay" },
                      { icon: Truck, label: "Logistics", desc: "BlueDart & Delhivery" },
                      { icon: Server, label: "Hosting", desc: "Vercel Cloud Node" },
                      { icon: BarChart3, label: "Analytics", desc: "Google Insights" },
                      { icon: Mail, label: "Alerts", desc: "Twilio Notifications" }
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl border border-[var(--secondary)]/10 text-center bg-[var(--surface-card)]">
                        <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/6 text-[var(--primary)] flex items-center justify-center mx-auto mb-2">
                          <item.icon size={16} />
                        </span>
                        <h5 className="text-xs font-bold text-[var(--text)]">{item.label}</h5>
                        <p className="text-[9px] text-[var(--text)]/40 font-semibold mt-0.5">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <Paragraph>
                    Use of third-party platforms remains subject to those parties' unique terms of service. PrintVoz does not assume liability for the functionality or performance failures of external provider nodes.
                  </Paragraph>
                </div>
              </article>

              {/* ─ 15 Account Suspension & Termination */}
              <article className="mb-14">
                <SectionHeading num="15" title="Account Suspension & Termination" id="account-suspension" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    We reserve the right to suspend, terminate, or restrict your access to your account or the PrintVoz platform at our sole discretion, without notice or liability.
                  </Paragraph>

                  {/* Suspension Dashboard */}
                  <div className="p-5 rounded-2xl border border-[var(--secondary)]/10 bg-[var(--surface-light)]">
                    <h4 className="text-xs font-bold text-[var(--text)] mb-3">Violation and Suspension Criteria</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                      <div className="p-3.5 rounded-lg border border-red-500/10 bg-red-500/2 text-[var(--text)] flex items-center gap-2">
                        <AlertCircle size={14} className="text-red-500 shrink-0" />
                        <span>Fraud & Payment Manipulation</span>
                      </div>
                      <div className="p-3.5 rounded-lg border border-red-500/10 bg-red-500/2 text-[var(--text)] flex items-center gap-2">
                        <AlertCircle size={14} className="text-red-500 shrink-0" />
                        <span>Copyright Abuse & Infringement</span>
                      </div>
                      <div className="p-3.5 rounded-lg border border-red-500/10 bg-red-500/2 text-[var(--text)] flex items-center gap-2">
                        <AlertCircle size={14} className="text-red-500 shrink-0" />
                        <span>False Personal & Corporate Info</span>
                      </div>
                      <div className="p-3.5 rounded-lg border border-red-500/10 bg-red-500/2 text-[var(--text)] flex items-center gap-2">
                        <AlertCircle size={14} className="text-red-500 shrink-0" />
                        <span>Platform Abuse & Exploitation</span>
                      </div>
                    </div>
                  </div>

                  <Paragraph>
                    Upon termination, your right to access and use the platform will immediately cease. Any terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
                  </Paragraph>
                </div>
              </article>

              {/* ─ 16 Changes to Terms */}
              <article className="mb-14">
                <SectionHeading num="16" title="Changes to Terms" id="changes-to-terms" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    PrintVoz reserves the right, at our sole discretion, to modify or replace these Terms & Conditions at any time. Any changes will be published here with an updated revision date.
                  </Paragraph>

                  {/* Revision Timeline */}
                  <div className="p-5 rounded-2xl border border-[var(--secondary)]/10 bg-[var(--surface-card)]">
                    <div className="relative pl-6 space-y-4">
                      {/* Timeline bar */}
                      <div className="absolute left-2.5 top-1.5 bottom-1.5 w-[1px] bg-gradient-to-b from-[var(--primary)]/40 to-transparent" />
                      
                      {[
                        { date: "June 2026", label: "Latest Revision", desc: "Terms overhauled to detail uploaded content license, calibration limits, Indian jurisdiction specifics, and third-party partners.", active: true },
                        { date: "September 2025", label: "Initial Framework Release", desc: "Establish basic print production parameters and standard checkout terms.", active: false }
                      ].map((item, i) => (
                        <div key={i} className="relative">
                          <div className={`absolute -left-5 top-1.5 w-3 h-3 rounded-full border ${item.active ? "bg-[var(--primary)] border-[var(--primary)]" : "bg-[var(--bg)] border-[var(--secondary)]/30"}`} />
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-xs font-bold ${item.active ? "text-[var(--primary)]" : "text-[var(--text)]/40"}`}>{item.date}</span>
                            {item.active && (
                              <span className="px-1.5 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-[9px] font-bold uppercase tracking-wider">LATEST</span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-[var(--text)]/85 mb-0.5">{item.label}</p>
                          <p className="text-[11px] text-[var(--text)]/50 leading-relaxed font-semibold">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>

              {/* ─ 17 Governing Law & Jurisdiction */}
              <article className="mb-14">
                <SectionHeading num="17" title="Governing Law & Jurisdiction" id="governing-law" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    These Terms & Conditions, and any disputes arising from or relating to the use of PrintVoz, shall be governed by, construed, and enforced in accordance with the laws of the Republic of India.
                  </Paragraph>

                  {/* Jurisdiction Card */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    className="p-5 rounded-2xl border border-[var(--secondary)]/10 bg-gradient-to-br from-[var(--primary)]/[0.03] to-[var(--secondary)]/[0.05] flex gap-3.5 items-start"
                  >
                    <Scale size={20} className="text-[var(--primary)] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text)] mb-1">Exclusive Court Jurisdiction</h4>
                      <p className="text-xs text-[var(--text)]/65 leading-relaxed font-medium">
                        Any legal action, suit, or proceeding arising under or in connection with these Terms & Conditions shall be subject to the exclusive jurisdiction of the competent courts located in Calicut/Kozhikode, Kerala, India.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </article>

              {/* ─ 18 Contact Us */}
              <article>
                <SectionHeading num="18" title="Contact Us" id="contact-us" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    For questions, comments, or legal claims regarding these Terms & Conditions, please contact us.
                  </Paragraph>

                  {/* Contact detail grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)] flex flex-col gap-0.5">
                      <span className="text-[10px] text-[var(--text)]/35 uppercase tracking-wider">Company name</span>
                      <span className="text-[var(--text)]/85 font-bold">PrintVoz Printing Services</span>
                    </div>
                    <div className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)] flex flex-col gap-0.5">
                      <span className="text-[10px] text-[var(--text)]/35 uppercase tracking-wider">Legal email</span>
                      <a href="mailto:support@printvoz.com" className="text-[var(--primary)] hover:underline">support@printvoz.com</a>
                    </div>
                    <div className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)] flex flex-col gap-0.5">
                      <span className="text-[10px] text-[var(--text)]/35 uppercase tracking-wider">Support hotline</span>
                      <span className="text-[var(--text)]/85 font-bold">+91 98765 43210</span>
                    </div>
                    <div className="p-4 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface-light)] flex flex-col gap-0.5">
                      <span className="text-[10px] text-[var(--text)]/35 uppercase tracking-wider">Office Headquarters</span>
                      <span className="text-[var(--text)]/85 font-bold">123, Print Street, Koduvally, Kerala, India</span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <Link
                      href="/contact"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-bold text-xs shadow-md shadow-[var(--primary)]/15 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <Headphones size={14} />
                      Reach Support
                    </Link>
                    <Link
                      href="/"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--secondary)]/15 text-[var(--text)] font-bold text-xs hover:border-[var(--primary)]/25 hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
                      style={{ background: 'var(--surface-elevated)' }}
                    >
                      Return to Home
                      <ChevronRight size={14} />
                    </Link>
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
