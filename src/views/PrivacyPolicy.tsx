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
  Cookie,
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
} from "lucide-react";

/* ───────────────────────────────────────────────────────────
   TABLE OF CONTENTS DATA
   ─────────────────────────────────────────────────────────── */
const TOC = [
  { id: "introduction", label: "Introduction", num: "01" },
  { id: "information-we-collect", label: "Information We Collect", num: "02" },
  { id: "how-we-use-information", label: "How We Use Information", num: "03" },
  { id: "cookies-analytics", label: "Cookies & Analytics", num: "04" },
  { id: "data-protection", label: "Data Protection", num: "05" },
  { id: "third-party-services", label: "Third-Party Services", num: "06" },
  { id: "uploaded-files", label: "Uploaded Files", num: "07" },
  { id: "contact-us", label: "Contact Us", num: "08" },
  { id: "updates-to-policy", label: "Updates To Policy", num: "09" },
];

/* ───────────────────────────────────────────────────────────
   ANIMATION VARIANTS
   ─────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.07 } },
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
   SMALL COMPONENTS
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
      whileHover="hover"
      className="group flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[var(--secondary)]/10 backdrop-blur-sm transition-all"
      style={{ background: 'var(--surface-card)', willChange: 'transform' }}
    >
      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--primary)]/8 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 shrink-0">
        <Icon size={18} strokeWidth={1.8} />
      </span>
      <span className="text-sm font-semibold text-[var(--text)]/85">{label}</span>
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
      whileHover="hover"
      animate="rest"
      className="relative group flex flex-col items-center text-center px-6 py-8 rounded-2xl backdrop-blur-md border border-[var(--secondary)]/12 overflow-hidden cursor-default"
      style={{ background: 'var(--surface-light)' }}
    >
      {/* glow orb */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[var(--primary)]/5 blur-2xl group-hover:bg-[var(--primary)]/12 transition-all duration-500" />
      <span className="relative z-10 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white mb-4 shadow-lg shadow-[var(--primary)]/15 group-hover:scale-110 transition-transform duration-300">
        <Icon size={26} strokeWidth={1.6} />
      </span>
      <h3 className="relative z-10 text-sm font-bold text-[var(--text)] tracking-tight">
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
    <div id={id} className="scroll-mt-28 mb-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="flex items-center gap-4 mb-3"
      >
        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white text-xs font-black shadow-md shadow-[var(--primary)]/15">
          {num}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-[var(--secondary)]/20 to-transparent" />
      </motion.div>
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]"
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
      className="text-base sm:text-lg leading-[1.85] text-[var(--text)]/80 max-w-[70ch]"
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
            className="absolute bottom-16 right-0 w-72 max-h-[60vh] overflow-y-auto rounded-2xl backdrop-blur-xl border border-[var(--secondary)]/15 shadow-2xl shadow-black/10 p-4"
            style={{ background: 'var(--surface-elevated)' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text)]/40 mb-3 px-2">
              Table of Contents
            </p>
            {TOC.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-3 ${
                  activeSection === item.id
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "text-[var(--text)]/60 hover:bg-[var(--secondary)]/8 hover:text-[var(--text)]"
                }`}
              >
                <span className="w-6 h-6 rounded-lg bg-[var(--secondary)]/10 flex items-center justify-center text-[10px] font-black text-[var(--primary)]/60 shrink-0">
                  {item.num}
                </span>
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle table of contents"
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white flex items-center justify-center shadow-xl shadow-[var(--primary)]/25 hover:shadow-2xl hover:shadow-[var(--primary)]/35 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   MAIN COMPONENT
   ─────────────────────────────────────────────────────────── */
export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  /* scroll progress */
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  /* intersection observer for active section */
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

  /* show back-to-top */
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
      <section className="relative min-h-[60vh] sm:min-h-[55vh] flex items-center justify-center overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20">
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg)] via-[var(--bg)] to-[var(--secondary)]/8" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating orbs */}
        <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-[var(--primary)]/5 blur-[80px] animate-pulse" />
        <div className="absolute bottom-10 right-[15%] w-96 h-96 rounded-full bg-[var(--secondary)]/8 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--primary)]/3 blur-[120px] opacity-30" />

        {/* Floating geometric shapes */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-[20%] w-16 h-16 rounded-2xl border-2 border-[var(--primary)]/10 rotate-12 hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-24 left-[18%] w-12 h-12 rounded-full border-2 border-[var(--secondary)]/15 hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-48 left-[8%] w-8 h-8 rounded-lg bg-[var(--secondary)]/8 rotate-45 hidden lg:block"
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-md border border-[var(--secondary)]/15 mb-8 shadow-sm"
            style={{ background: 'var(--surface-card)' }}
          >
            <Shield size={16} className="text-[var(--primary)]" strokeWidth={2} />
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--primary)]">
              Privacy Policy
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[var(--text)] mb-6"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Privacy{" "}
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
              Policy
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg md:text-xl text-[var(--text)]/60 max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
          >
            Your privacy matters. Learn how PrintVoz collects, uses, protects,
            and manages your information when you use our platform.
          </motion.p>

          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl backdrop-blur-md border border-[var(--secondary)]/12 shadow-sm"
            style={{ background: 'var(--surface-light)' }}
          >
            <Clock size={16} className="text-[var(--secondary)]" />
            <span className="text-sm font-semibold text-[var(--text)]/50">
              Last Updated:
            </span>
            <span className="text-sm font-bold text-[var(--primary)]">
              June 2026
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST HIGHLIGHTS ROW ─────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 -mt-4 mb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <TrustCard icon={Lock} title="Secure Data Handling" delay={0} />
          <TrustCard icon={CreditCard} title="Protected Payments" delay={1} />
          <TrustCard icon={FolderOpen} title="Safe File Uploads" delay={2} />
          <TrustCard icon={ShieldCheck} title="Customer Privacy First" delay={3} />
        </div>
      </section>

      {/* ── MAIN LAYOUT: SIDEBAR + CONTENT ──────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex gap-12 lg:gap-16 relative">
          {/* ── DESKTOP SIDEBAR ─────────────────────────────── */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text)]/35 mb-5 px-3">
                On this page
              </p>
              <nav aria-label="Table of Contents">
                <ul className="space-y-1">
                  {TOC.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollTo(item.id)}
                          aria-current={isActive ? "location" : undefined}
                          className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-250 relative ${
                            isActive
                              ? "bg-[var(--primary)]/8 text-[var(--primary)]"
                              : "text-[var(--text)]/50 hover:text-[var(--text)]/80 hover:bg-[var(--secondary)]/5"
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="sidebar-active"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[var(--primary)]"
                              transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                          )}
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 transition-all duration-250 ${
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

              {/* Progress on sidebar */}
              <div className="mt-8 px-3">
                <div className="w-full h-1.5 rounded-full bg-[var(--secondary)]/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                    style={{ scaleX, transformOrigin: "left" }}
                  />
                </div>
                <p className="text-[10px] font-semibold text-[var(--text)]/30 mt-2">
                  Reading progress
                </p>
              </div>
            </div>
          </aside>

          {/* ── CONTENT AREA ─────────────────────────────────── */}
          <div ref={contentRef} className="flex-1 min-w-0">
            {/* Document Container */}
            <div className="backdrop-blur-sm rounded-3xl border border-[var(--secondary)]/8 shadow-xl shadow-black/[0.03] p-6 sm:p-10 md:p-14 lg:p-16" style={{ background: 'var(--surface)' }}>
              {/* ─── 01 INTRODUCTION ─────────────────────────── */}
              <article className="mb-20">
                <SectionHeading num="01" title="Introduction" id="introduction" />
                <div className="space-y-5 flex flex-col">
                  <Paragraph>
                    At PrintVoz, your privacy is important to us. We are committed to protecting your personal information and maintaining the trust you place in our brand.
                  </Paragraph>
                  <Paragraph>
                    This Privacy Policy explains how we collect, use, store, and safeguard your information when you visit our website, create an account, place an order, upload design files, request custom printing services, or interact with our platform.
                  </Paragraph>
                  <Paragraph>
                    We collect only the information necessary to provide our services, process orders, improve customer experience, and ensure the security of our website. We do not sell or misuse your personal information.
                  </Paragraph>
                  <Paragraph>
                    By accessing or using PrintVoz, you acknowledge that you have read and understood this Privacy Policy and agree to the practices described herein.
                  </Paragraph>
                  <Paragraph>
                    We encourage you to review this policy carefully to understand how your information is handled and protected.
                  </Paragraph>
                </div>
              </article>

              {/* ─── 02 INFORMATION WE COLLECT ───────────────── */}
              <article className="mb-20">
                <SectionHeading
                  num="02"
                  title="Information We Collect"
                  id="information-we-collect"
                />
                <div className="space-y-6 flex flex-col">
                  <Paragraph>
                    To provide our services effectively and deliver a seamless customer experience, PrintVoz may collect certain information when you interact with our website or place an order.
                  </Paragraph>

                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                      <User size={18} className="text-[var(--primary)]" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InfoCard icon={User} label="Full name" delay={0} />
                      <InfoCard icon={Mail} label="Email address" delay={1} />
                      <InfoCard icon={Phone} label="Phone number" delay={2} />
                      <InfoCard icon={MapPin} label="Billing address" delay={3} />
                      <InfoCard icon={Truck} label="Shipping address" delay={4} />
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                      <Key size={18} className="text-[var(--primary)]" />
                      Account Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InfoCard icon={Key} label="Account login details" delay={0} />
                      <InfoCard icon={Settings} label="Saved preferences" delay={1} />
                      <InfoCard icon={Package} label="Order history" delay={2} />
                      <InfoCard icon={BarChart3} label="Account activity" delay={3} />
                    </div>
                  </div>

                  {/* Order & Customization Information */}
                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                      <ShoppingCart size={18} className="text-[var(--primary)]" />
                      Order & Customization Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InfoCard icon={ShoppingCart} label="Product selections" delay={0} />
                      <InfoCard icon={Palette} label="Customization preferences" delay={1} />
                      <InfoCard icon={Image} label="Uploaded artwork, logos, images, or design files" delay={2} />
                      <InfoCard icon={FileText} label="Order specifications and instructions" delay={3} />
                    </div>
                  </div>

                  {/* Technical Information */}
                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                      <Globe size={18} className="text-[var(--primary)]" />
                      Technical Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InfoCard icon={Globe} label="IP address" delay={0} />
                      <InfoCard icon={Monitor} label="Browser type" delay={1} />
                      <InfoCard icon={Smartphone} label="Device information" delay={2} />
                      <InfoCard icon={Settings} label="Operating system" delay={3} />
                      <InfoCard icon={BarChart3} label="Pages visited and website interactions" delay={4} />
                    </div>
                  </div>

                  {/* Communication Information */}
                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                      <Mail size={18} className="text-[var(--primary)]" />
                      Communication Information
                    </h3>
                    <Paragraph>
                      If you contact us through email, forms, live chat, or customer support channels, we may collect information related to those communications to assist you effectively.
                    </Paragraph>
                  </div>

                  <div className="pt-4 border-t border-[var(--secondary)]/10">
                    <Paragraph>
                      We collect only the information necessary to provide our services, improve user experience, process orders, and maintain the security and functionality of our platform.
                    </Paragraph>
                  </div>
                </div>
              </article>

              {/* ─── 03 HOW WE USE INFORMATION ────────────────── */}
              <article className="mb-20">
                <SectionHeading
                  num="03"
                  title="How We Use Your Information"
                  id="how-we-use-information"
                />
                <div className="space-y-6 flex flex-col">
                  <Paragraph>
                    PrintVoz uses the information we collect to provide, improve, and maintain our services while delivering a secure and seamless customer experience.
                  </Paragraph>
                  <Paragraph>
                    Your information may be used for the following purposes:
                  </Paragraph>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {[
                      {
                        icon: ShoppingCart,
                        title: "Order Processing & Fulfillment",
                        desc: "We use your information to process orders, verify transactions, manufacture customized products, and deliver purchases to the correct address.",
                      },
                      {
                        icon: Palette,
                        title: "Product Customization",
                        desc: "Uploaded artwork, logos, images, text, and design files are used to create personalized products according to your specifications and requirements.",
                      },
                      {
                        icon: Headphones,
                        title: "Customer Support",
                        desc: "Your information helps us respond to inquiries, resolve issues, provide order updates, and deliver effective customer support.",
                      },
                      {
                        icon: User,
                        title: "Account Management",
                        desc: "We use account-related information to maintain user accounts, manage preferences, and provide access to order history and account features.",
                      },
                      {
                        icon: Mail,
                        title: "Communication & Notifications",
                        desc: "PrintVoz may send important communications related to order confirmations, production updates, shipping notifications, service announcements, and customer support responses.",
                      },
                      {
                        icon: BarChart3,
                        title: "Website Improvement",
                        desc: "We analyze website usage and customer interactions to improve website performance, user experience, product offerings, and overall service quality.",
                      },
                      {
                        icon: Lock,
                        title: "Security & Fraud Prevention",
                        desc: "Information may be used to detect, prevent, and investigate unauthorized activities, fraudulent transactions, security threats, or misuse of our platform.",
                      },
                      {
                        icon: ShieldCheck,
                        title: "Legal & Regulatory Compliance",
                        desc: "Where required, we may use or disclose information to comply with applicable laws, legal obligations, regulatory requirements, or lawful requests from authorities.",
                      },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        variants={fadeUp}
                        custom={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-40px" }}
                        whileHover="hover"
                        className="group flex gap-4 p-5 rounded-2xl border border-[var(--secondary)]/10 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/5"
                        style={{ background: 'var(--surface-card)' }}
                      >
                        <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--primary)]/8 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 shrink-0">
                          <item.icon size={22} strokeWidth={1.8} />
                        </span>
                        <div>
                          <h4 className="text-base font-extrabold text-[var(--text)] mb-1.5 leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-sm text-[var(--text)]/65 leading-relaxed font-medium">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[var(--secondary)]/10">
                    <Paragraph>
                      PrintVoz uses customer information only for legitimate business purposes related to providing our services and does not sell personal information to third parties.
                    </Paragraph>
                  </div>
                </div>
              </article>

              {/* ─── 04 COOKIES & ANALYTICS ──────────────────── */}
              <article className="mb-20">
                <SectionHeading
                  num="04"
                  title="Cookies & Analytics"
                  id="cookies-analytics"
                />
                <div className="space-y-6 flex flex-col">
                  <Paragraph>
                    PrintVoz uses cookies and analytics technologies to enhance website functionality, improve user experience, and better understand how visitors interact with our platform.
                  </Paragraph>

                  {/* What Are Cookies */}
                  <div className="p-6 rounded-2xl border border-[var(--secondary)]/10" style={{ background: 'var(--surface-card)' }}>
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <Cookie size={18} className="text-[var(--primary)]" />
                      What Are Cookies?
                    </h3>
                    <Paragraph>
                      Cookies are small text files stored on your device when you visit a website. They help websites remember user preferences, improve performance, and provide a more personalized browsing experience.
                    </Paragraph>
                  </div>

                  {/* How We Use Cookies & Analytics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="p-6 rounded-2xl border border-[var(--secondary)]/10" style={{ background: 'var(--surface-light)' }}>
                      <h4 className="text-base font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                        <Cookie size={18} className="text-[var(--primary)]" />
                        How We Use Cookies
                      </h4>
                      <ul className="space-y-3">
                        {[
                          "Remember user preferences and settings",
                          "Maintain secure login sessions",
                          "Improve website functionality",
                          "Enable shopping cart features",
                          "Analyze website performance",
                          "Enhance overall user experience",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm font-semibold text-[var(--text)]/75">
                            <CheckCircle2 size={16} className="text-[var(--secondary)] mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 rounded-2xl border border-[var(--secondary)]/10" style={{ background: 'var(--surface-light)' }}>
                      <h4 className="text-base font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                        <BarChart3 size={18} className="text-[var(--primary)]" />
                        Analytics & Website Performance
                      </h4>
                      <ul className="space-y-3">
                        {[
                          "Website traffic and visitor behavior",
                          "Popular products and pages",
                          "User interactions and engagement",
                          "Website performance and functionality",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm font-semibold text-[var(--text)]/75">
                            <CheckCircle2 size={16} className="text-[var(--secondary)] mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Paragraph>
                      This information helps us improve our services, optimize website content, and provide a better experience for our customers.
                    </Paragraph>
                  </div>

                  {/* Managing Cookies */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <Settings size={18} className="text-[var(--primary)]" />
                      Managing Cookies
                    </h3>
                    <Paragraph>
                      Most web browsers allow users to manage, disable, or delete cookies through browser settings. Please note that disabling certain cookies may affect the functionality of some features on the PrintVoz website.
                    </Paragraph>
                  </div>

                  {/* Your Privacy */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <Shield size={18} className="text-[var(--primary)]" />
                      Your Privacy
                    </h3>
                    <Paragraph>
                      Cookies and analytics data are used primarily for improving our services, maintaining website performance, and enhancing customer experience. We do not use cookies to collect sensitive personal information without your consent.
                    </Paragraph>
                  </div>
                </div>
              </article>

              {/* ─── 05 DATA PROTECTION ──────────────────────── */}
              <article className="mb-20">
                <SectionHeading
                  num="05"
                  title="Data Protection"
                  id="data-protection"
                />
                <div className="space-y-6 flex flex-col">
                  <Paragraph>
                    PrintVoz is committed to protecting the privacy, confidentiality, and security of customer information. We implement reasonable administrative, technical, and organizational measures to safeguard personal data against unauthorized access, misuse, loss, disclosure, alteration, or destruction.
                  </Paragraph>

                  {/* Security Showcase */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    className="mt-4 rounded-2xl bg-gradient-to-br from-[var(--primary)]/[0.03] to-[var(--secondary)]/[0.05] border border-[var(--primary)]/8 p-8"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20">
                        <ShieldCheck size={28} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[var(--text)]">
                          Security Measures
                        </h3>
                        <p className="text-sm text-[var(--text)]/50 font-medium">
                          Multi-layered protection for your data
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { icon: Server, label: "Encrypted Connections", desc: "Secure website connections and encrypted communications" },
                        { icon: Lock, label: "Access Controls", desc: "Access controls and authentication measures" },
                        { icon: ShieldCheck, label: "System Monitoring", desc: "Regular system monitoring and security reviews" },
                        { icon: AlertCircle, label: "Misuse Prevention", desc: "Protection against unauthorized access and misuse" },
                        { icon: Server, label: "Secure Storage", desc: "Secure storage of customer information" },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          variants={fadeUp}
                          custom={i}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          className="flex items-center gap-4 p-4 rounded-xl border border-[var(--secondary)]/8"
                          style={{ background: 'var(--surface)' }}
                        >
                          <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--success-bg)', color: 'var(--success-icon)' }}>
                            <item.icon size={20} strokeWidth={1.8} />
                          </span>
                          <div>
                            <p className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                              <CheckCircle2 size={14} style={{ color: 'var(--success-check)' }} />
                              {item.label}
                            </p>
                            <p className="text-xs text-[var(--text)]/50 font-medium mt-0.5 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Data Access */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <User size={18} className="text-[var(--primary)]" />
                      Data Access
                    </h3>
                    <Paragraph>
                      Access to personal information is limited to authorized personnel, service providers, and business partners who require such information to perform their responsibilities and provide services on behalf of PrintVoz.
                    </Paragraph>
                  </div>

                  {/* Data Retention */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <Clock size={18} className="text-[var(--primary)]" />
                      Data Retention
                    </h3>
                    <Paragraph>
                      We retain personal information only for as long as necessary to:
                    </Paragraph>
                    <ul className="space-y-2.5 mt-3 pl-2">
                      {[
                        "Fulfill orders and provide services",
                        "Maintain customer accounts",
                        "Comply with legal and regulatory obligations",
                        "Resolve disputes and enforce policies",
                        "Improve operational efficiency and customer support",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm font-semibold text-[var(--text)]/75">
                          <CheckCircle2 size={16} className="text-[var(--secondary)] mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="h-2" />
                    <Paragraph>
                      Once information is no longer required, reasonable steps may be taken to securely delete, anonymize, or archive the data.
                    </Paragraph>
                  </div>

                  {/* Security Limitations */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <AlertCircle size={18} className="text-[var(--primary)]" />
                      Security Limitations
                    </h3>
                    <Paragraph>
                      While PrintVoz takes reasonable measures to protect customer information, no method of internet transmission or electronic storage can guarantee absolute security. Customers should also take appropriate precautions to protect their account credentials and personal information.
                    </Paragraph>
                  </div>

                  {/* Our Commitment */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-[var(--primary)]" />
                      Our Commitment
                    </h3>
                    <Paragraph>
                      We continuously strive to maintain a secure environment for our customers and regularly review our practices to help ensure the ongoing protection of personal information.
                    </Paragraph>
                  </div>
                </div>
              </article>

              {/* ─── 06 THIRD-PARTY SERVICES ─────────────────── */}
              <article className="mb-20">
                <SectionHeading
                  num="06"
                  title="Third-Party Services"
                  id="third-party-services"
                />
                <div className="space-y-6 flex flex-col">
                  <Paragraph>
                    To provide a reliable, secure, and efficient experience, PrintVoz may work with trusted third-party service providers that support various aspects of our business operations.
                  </Paragraph>
                  <Paragraph>
                    These third-party services help us process payments, deliver orders, improve website performance, communicate with customers, and maintain our platform.
                  </Paragraph>

                  {/* Services We May Use */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                      <Settings size={18} className="text-[var(--primary)]" />
                      Services We May Use
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { icon: CreditCard, label: "Payment processing", desc: "Secure transaction processing" },
                        { icon: Truck, label: "Shipping and logistics", desc: "Reliable package delivery" },
                        { icon: Server, label: "Website hosting & infrastructure", desc: "Cloud servers and storage" },
                        { icon: BarChart3, label: "Analytics & performance monitoring", desc: "Website activity tracking" },
                        { icon: Mail, label: "Customer communication & alerts", desc: "Email and notification delivery" },
                        { icon: Shield, label: "Security and fraud prevention", desc: "Platform integrity and safety" },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          variants={fadeUp}
                          custom={i}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, margin: "-40px" }}
                          className="group relative p-5 rounded-xl border border-[var(--secondary)]/10 hover:border-[var(--primary)]/15 transition-all duration-300 overflow-hidden"
                          style={{ background: 'var(--surface-card)' }}
                        >
                          <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[var(--primary)]/3 blur-2xl group-hover:bg-[var(--primary)]/8 transition-all duration-500" />
                          <span className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--primary)]/8 text-[var(--primary)] mb-3 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300">
                            <item.icon size={20} strokeWidth={1.7} />
                          </span>
                          <p className="relative text-sm font-bold text-[var(--text)] mb-1">
                            {item.label}
                          </p>
                          <p className="relative text-xs text-[var(--text)]/50 font-medium">
                            {item.desc}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Information Sharing */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <Globe size={18} className="text-[var(--primary)]" />
                      Information Sharing
                    </h3>
                    <Paragraph>
                      When necessary, limited customer information may be shared with trusted third-party providers solely for the purpose of delivering services on our behalf. Examples may include:
                    </Paragraph>
                    <ul className="space-y-2.5 mt-3 pl-2">
                      {[
                        "Sharing shipping details with delivery partners to fulfill orders",
                        "Sharing payment-related information with payment gateway providers to process transactions",
                        "Sharing technical information with analytics providers to improve website performance",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm font-semibold text-[var(--text)]/75">
                          <CheckCircle2 size={16} className="text-[var(--secondary)] mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Data Protection */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-[var(--primary)]" />
                      Data Protection
                    </h3>
                    <Paragraph>
                      We work with reputable service providers that are expected to maintain appropriate security measures and handle information responsibly. These providers are authorized to use customer information only as required to perform their services and are not permitted to use such information for unrelated purposes.
                    </Paragraph>
                  </div>

                  {/* Third-Party Websites */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <ExternalLink size={18} className="text-[var(--primary)]" />
                      Third-Party Websites
                    </h3>
                    <Paragraph>
                      Our website may contain links to third-party websites, services, or platforms. PrintVoz is not responsible for the privacy practices, content, security, or policies of external websites. We encourage users to review the privacy policies of any third-party websites they visit.
                    </Paragraph>
                  </div>

                  {/* Service Improvements */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <Zap size={18} className="text-[var(--primary)]" />
                      Service Improvements
                    </h3>
                    <Paragraph>
                      As our business grows, we may add, remove, or change third-party service providers to improve our operations, customer experience, and service quality. Any such changes will continue to be governed by the principles outlined in this Privacy Policy.
                    </Paragraph>
                  </div>
                </div>
              </article>

              {/* ─── 07 UPLOADED FILES ────────────────────────── */}
              <article className="mb-20">
                <SectionHeading
                  num="07"
                  title="Uploaded Files & Design Content"
                  id="uploaded-files"
                />
                <div className="space-y-6 flex flex-col">
                  <Paragraph>
                    As part of our custom printing and personalization services, customers may upload various types of content through the PrintVoz platform, including:
                  </Paragraph>

                  {/* Upload Types Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
                    {[
                      { icon: Palette, label: "Artwork" },
                      { icon: Image, label: "Images & Photos" },
                      { icon: Tag, label: "Logos & Brand Assets" },
                      { icon: FolderOpen, label: "Design Files" },
                      { icon: FileText, label: "Documents" },
                      { icon: FileText, label: "Custom Text" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        variants={fadeUp}
                        custom={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-40px" }}
                        className="group flex flex-col items-center text-center p-4 rounded-xl border border-[var(--secondary)]/10 hover:border-[var(--primary)]/15 transition-all duration-300"
                        style={{ background: 'var(--surface-card)' }}
                      >
                        <span className="w-12 h-12 rounded-xl bg-[var(--primary)]/8 flex items-center justify-center text-[var(--primary)] mb-2 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300">
                          <item.icon size={22} strokeWidth={1.6} />
                        </span>
                        <span className="text-xs font-bold text-[var(--text)]/70 leading-tight">
                          {item.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Purpose of Uploaded Content */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <Settings size={18} className="text-[var(--primary)]" />
                      Purpose of Uploaded Content
                    </h3>
                    <Paragraph>
                      Uploaded files and design materials are used solely for purposes related to:
                    </Paragraph>
                    <ul className="space-y-2.5 mt-3 pl-2">
                      {[
                        "Product customization",
                        "Design preparation",
                        "Print production",
                        "Quality review",
                        "Order fulfillment",
                        "Customer support and order verification",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm font-semibold text-[var(--text)]/75">
                          <CheckCircle2 size={16} className="text-[var(--secondary)] mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="h-2" />
                    <Paragraph>
                      PrintVoz will not use customer-submitted content for unrelated commercial purposes without appropriate authorization.
                    </Paragraph>
                  </div>

                  {/* Ownership Notice */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    className="rounded-2xl bg-gradient-to-r from-[var(--primary)]/5 to-[var(--secondary)]/5 border border-[var(--primary)]/12 p-6 sm:p-8 flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[var(--primary)]/20">
                      <ShieldCheck size={24} strokeWidth={1.6} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[var(--text)] mb-2">
                        Ownership of Content
                      </h3>
                      <p className="text-sm sm:text-base text-[var(--text)]/65 leading-relaxed font-medium">
                        Customers retain ownership of the files, artwork, logos, images, and other content they submit to PrintVoz. The submission of content to our platform does not transfer ownership rights to PrintVoz.
                      </p>
                    </div>
                  </motion.div>

                  {/* Customer Responsibility */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <User size={18} className="text-[var(--primary)]" />
                      Customer Responsibility
                    </h3>
                    <Paragraph>
                      By uploading any content, customers confirm that they own the content, or they have obtained all necessary permissions, licenses, and rights to use the content. Customers are solely responsible for ensuring that uploaded materials do not violate:
                    </Paragraph>
                    <ul className="space-y-2.5 mt-3 pl-2">
                      {[
                        "Copyright laws",
                        "Trademark rights",
                        "Intellectual property rights",
                        "Privacy rights",
                        "Any applicable laws or regulations",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm font-semibold text-[var(--text)]/75">
                          <CheckCircle2 size={16} className="text-[var(--secondary)] mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prohibited Content */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <AlertCircle size={18} className="text-[var(--primary)]" />
                      Prohibited Content
                    </h3>
                    <Paragraph>
                      PrintVoz reserves the right to reject, suspend, or cancel orders containing content that:
                    </Paragraph>
                    <ul className="space-y-2.5 mt-3 pl-2">
                      {[
                        "Infringes intellectual property rights",
                        "Violates applicable laws",
                        "Contains unlawful, offensive, defamatory, or harmful material",
                        "Promotes illegal activities",
                        "May expose PrintVoz to legal liability",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm font-semibold text-[var(--text)]/75">
                          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* File Storage & Security */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <Server size={18} className="text-[var(--primary)]" />
                      File Storage & Security
                    </h3>
                    <Paragraph>
                      Uploaded files may be stored for operational purposes, including order processing, customer support, quality assurance, and record maintenance. Reasonable measures are taken to help protect uploaded content from unauthorized access or misuse.
                    </Paragraph>
                  </div>

                  {/* Content Removal */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <X size={18} className="text-[var(--primary)]" />
                      Content Removal
                    </h3>
                    <Paragraph>
                      PrintVoz reserves the right to remove or decline any uploaded content that violates our policies, legal obligations, or service standards.
                    </Paragraph>
                  </div>

                  {/* Limitation of Responsibility */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <Shield size={18} className="text-[var(--primary)]" />
                      Limitation of Responsibility
                    </h3>
                    <Paragraph>
                      PrintVoz is not responsible for verifying the ownership, authenticity, legality, or licensing status of customer-submitted content. Responsibility for uploaded materials remains entirely with the customer.
                    </Paragraph>
                  </div>
                </div>
              </article>

              {/* ─── 08 CONTACT US ────────────────────────────── */}
              <article className="mb-20">
                <SectionHeading
                  num="08"
                  title="Contact Us"
                  id="contact-us"
                />
                <div className="space-y-6 flex flex-col">
                  <Paragraph>
                    If you have any questions, concerns, or requests regarding this Privacy Policy or the way your information is collected, used, or protected, we encourage you to contact us. PrintVoz is committed to maintaining transparency and addressing privacy-related inquiries in a timely and professional manner.
                  </Paragraph>

                  {/* Customer Support */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <Headphones size={18} className="text-[var(--primary)]" />
                      Customer Support
                    </h3>
                    <Paragraph>
                      For privacy-related questions, account concerns, or data protection inquiries, please reach out to our support team through our official communication channels.
                    </Paragraph>
                  </div>

                  {/* Contact Info Card */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    className="mt-4 rounded-2xl bg-gradient-to-br from-[var(--primary)]/[0.04] to-[var(--secondary)]/[0.06] border border-[var(--primary)]/10 p-6 sm:p-8"
                  >
                    <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                      <Mail size={18} className="text-[var(--primary)]" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold">
                      <div className="flex flex-col gap-1 p-3.5 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface)]">
                        <span className="text-xs text-[var(--text)]/40 uppercase tracking-wider">Company Name</span>
                        <span className="text-[var(--text)]/85">PrintVoz</span>
                      </div>
                      <div className="flex flex-col gap-1 p-3.5 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface)]">
                        <span className="text-xs text-[var(--text)]/40 uppercase tracking-wider">Email</span>
                        <a href="mailto:support@printvoz.com" className="text-[var(--primary)] hover:underline">support@printvoz.com</a>
                      </div>
                      <div className="flex flex-col gap-1 p-3.5 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface)]">
                        <span className="text-xs text-[var(--text)]/40 uppercase tracking-wider">Website</span>
                        <a href="https://www.printvoz.com" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline flex items-center gap-1">
                          www.printvoz.com <ExternalLink size={12} />
                        </a>
                      </div>
                      <div className="flex flex-col gap-1 p-3.5 rounded-xl border border-[var(--secondary)]/8 bg-[var(--surface)]">
                        <span className="text-xs text-[var(--text)]/40 uppercase tracking-wider">Contact Page</span>
                        <Link href="/contact" className="text-[var(--primary)] hover:underline">
                          Visit Our Contact Page
                        </Link>
                      </div>
                    </div>
                  </motion.div>

                  {/* Response Time */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <Clock size={18} className="text-[var(--primary)]" />
                      Response Time
                    </h3>
                    <Paragraph>
                      We make reasonable efforts to review and respond to inquiries as quickly as possible. Response times may vary depending on the nature and complexity of the request.
                    </Paragraph>
                  </div>

                  {/* Privacy Requests */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                      <FileText size={18} className="text-[var(--primary)]" />
                      Privacy Requests
                    </h3>
                    <Paragraph>
                      Customers may contact us regarding:
                    </Paragraph>
                    <ul className="space-y-2.5 mt-3 pl-2">
                      {[
                        "Questions about this Privacy Policy",
                        "Requests to update account information",
                        "Requests to correct inaccurate information",
                        "Privacy-related concerns",
                        "General customer support inquiries",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm font-semibold text-[var(--text)]/75">
                          <CheckCircle2 size={16} className="text-[var(--secondary)] mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-[var(--secondary)]/10">
                    <Paragraph>
                      We value your trust and are committed to handling your information responsibly and transparently.
                    </Paragraph>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                    <Link
                      href="/contact"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-bold text-sm shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl hover:shadow-[var(--primary)]/30 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <Headphones size={16} />
                      Contact Support
                    </Link>
                    <Link
                      href="/"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-[var(--secondary)]/15 text-[var(--text)] font-bold text-sm hover:border-[var(--primary)]/25 transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
                      style={{ background: 'var(--surface-elevated)' }}
                    >
                      Return To Homepage
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>

              {/* ─── 09 UPDATES TO POLICY ─────────────────────── */}
              <article>
                <SectionHeading
                  num="09"
                  title="Updates to This Policy"
                  id="updates-to-policy"
                />
                <div className="space-y-6 flex flex-col">
                  <Paragraph>
                    PrintVoz may update, modify, or revise this Privacy Policy from time to time to reflect changes in our services, business practices, technologies, legal requirements, or operational processes.
                  </Paragraph>
                  <Paragraph>
                    Any updates will be published on this page along with a revised "Last Updated" date so that users can easily identify when changes have been made. We encourage customers to review this Privacy Policy periodically to stay informed about how their information is collected, used, and protected.
                  </Paragraph>
                  <Paragraph>
                    Any changes to this Privacy Policy become effective immediately upon publication on the PrintVoz website unless otherwise stated. Your continued use of the PrintVoz website and services after any updates constitutes your acceptance of the revised Privacy Policy.
                  </Paragraph>
                  <Paragraph>
                    If we make significant changes that materially affect how your personal information is handled, we may provide additional notice through our website, email communications, or other appropriate channels where required.
                  </Paragraph>
                  <Paragraph>
                    PrintVoz remains committed to maintaining transparency, protecting customer privacy, and ensuring that our privacy practices continue to support a secure and trustworthy experience for all users.
                  </Paragraph>

                  {/* Revision Timeline */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    className="mt-4 rounded-2xl border border-[var(--secondary)]/10 p-6 sm:p-8"
                    style={{ background: 'var(--surface-card)' }}
                  >
                    <h3 className="text-base font-bold text-[var(--text)] mb-6 flex items-center gap-2">
                      <Clock size={18} className="text-[var(--primary)]" />
                      Revision History
                    </h3>

                    <div className="relative pl-8 space-y-6">
                      {/* Timeline line */}
                      <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-[var(--primary)]/30 via-[var(--secondary)]/20 to-transparent" />

                      {[
                        {
                          date: "June 2026",
                          label: "Latest Policy Update",
                          desc: "Comprehensive updates to clarify user responsibility, content ownership, cookies handling, and detailed third-party sharing details.",
                          active: true,
                        },
                        {
                          date: "January 2026",
                          label: "Minor Update",
                          desc: "Updated third-party service providers list.",
                          active: false,
                        },
                        {
                          date: "September 2025",
                          label: "Initial Release",
                          desc: "First version of the PrintVoz privacy policy.",
                          active: false,
                        },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          variants={fadeUp}
                          custom={i}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          className="relative"
                        >
                          {/* Dot */}
                          <div
                            className={`absolute -left-5 top-1.5 w-4 h-4 rounded-full border-2 ${
                              item.active
                                ? "bg-[var(--primary)] border-[var(--primary)] shadow-md shadow-[var(--primary)]/30"
                                : "bg-[var(--bg)] border-[var(--secondary)]/30"
                            }`}
                          />
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                            <span
                              className={`text-sm font-bold ${
                                item.active
                                  ? "text-[var(--primary)]"
                                  : "text-[var(--text)]/50"
                              }`}
                            >
                              {item.date}
                            </span>
                            {item.active && (
                              <span className="inline-flex px-2.5 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider w-fit">
                                Latest
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-[var(--text)]/70 mb-0.5">
                            {item.label}
                          </p>
                          <p className="text-xs text-[var(--text)]/45 font-medium">
                            {item.desc}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Alert Notice */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    className="mt-4 rounded-2xl p-6 flex items-start gap-4"
                    style={{ background: 'var(--alert-bg)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--alert-border)' }}
                  >
                    <AlertCircle
                      size={22}
                      className="shrink-0 mt-0.5"
                      style={{ color: 'var(--alert-icon)' }}
                    />
                    <div>
                      <p className="text-sm font-bold mb-1" style={{ color: 'var(--alert-title)' }}>
                        Stay Informed
                      </p>
                      <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--alert-text)' }}>
                        We encourage you to periodically review this page for the latest information on our privacy practices. Your continued use of PrintVoz after any changes indicates your acceptance of the updated policy.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE TABLE OF CONTENTS ─────────────────────────── */}
      <MobileToc activeSection={activeSection} onNavigate={scrollTo} />

      {/* ── BACK TO TOP ──────────────────────────────────────── */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-2xl backdrop-blur-md border border-[var(--secondary)]/15 shadow-lg flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all duration-300 hover:scale-105"
            style={{ background: 'var(--surface-elevated)' }}
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
