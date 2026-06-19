// @ts-nocheck
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle2, AlertCircle, Phone, Mail, MapPin, Clock, MessageCircle, MessagesSquare } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuth } from "../../context/AuthContext";
import Reveal from "../AboutUI/shared/Reveal";
import SectionHeading from "../AboutUI/shared/SectionHeading";

const INQUIRY_TYPES = [
  { value: "", label: "Select inquiry type" },
  { value: "general", label: "General Inquiry" },
  { value: "order-support", label: "Order Support" },
  { value: "bulk-order", label: "Bulk Order Request" },
  { value: "design-assistance", label: "Design Assistance" },
  { value: "partnership", label: "Partnership" },
  { value: "complaint", label: "Complaint" },
];

const inputCls =
  "w-full bg-[var(--bg)] border border-[var(--text)]/10 rounded-xl px-4 py-3.5 text-sm font-medium text-[var(--text)] placeholder:text-[var(--text)]/35 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all";

const errCls = "text-red-500 text-[11px] font-semibold mt-1.5";

export default function ContactForm({ contactInfo }) {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const { isLoggedIn } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (formData) => {
    setStatus("loading");
    try {
      if (isLoggedIn) {
        // Logged-in users → create a tracked "message" request that shows in
        // their dashboard → Requests AND the admin requests list.
        await api.post("/customization/message", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          inquiryType: formData.inquiryType,
          message: formData.message,
        });
      } else {
        // Guests → support inbox (visible to admin in Help Center → Support).
        const type = formData.inquiryType === "bulk-order" ? "bulk_order" : "email_support";
        await api.post("/help/support", {
          type,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: `[${formData.inquiryType || "general"}] ${formData.message}`,
        });
      }
      setStatus("success");
      reset();
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const phone = contactInfo?.primaryPhone || "+91 98765 43210";
  const email = contactInfo?.primaryEmail || "hello@printvoz.com";
  const address = contactInfo?.address || "Kerala, India";
  const whatsapp = (contactInfo?.secondaryPhone || phone).replace(/[^0-9]/g, "");

  return (
    <section
      id="contact-form"
      className="py-16 md:py-24 overflow-hidden bg-[var(--text)]/[0.02]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          heading="Send Us a Message"
          subheading="Have a question or need a custom quote? Fill out the form and our team will get back to you within 24 hours."
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* ── Left: Form (3 cols) ── */}
          <Reveal className="lg:col-span-3">
            <div className="bg-[var(--surface-elevated)] rounded-3xl border border-[var(--text)]/8 p-6 md:p-8 shadow-sm">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                      <CheckCircle2 size={40} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text)]">Message Sent!</h3>
                    <p className="text-sm text-[var(--text)]/60 mt-2 max-w-sm">
                      Thank you for reaching out. Our team will review your inquiry and get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                    noValidate
                  >
                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cf-name" className="block text-xs font-bold text-[var(--text)]/60 uppercase tracking-wider mb-2">
                          Full Name
                        </label>
                        <input
                          id="cf-name"
                          type="text"
                          autoFocus
                          placeholder="John Doe"
                          className={inputCls}
                          {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && <p className={errCls}>{errors.name.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="cf-email" className="block text-xs font-bold text-[var(--text)]/60 uppercase tracking-wider mb-2">
                          Email Address
                        </label>
                        <input
                          id="cf-email"
                          type="email"
                          placeholder="john@example.com"
                          className={inputCls}
                          {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                          })}
                        />
                        {errors.email && <p className={errCls}>{errors.email.message}</p>}
                      </div>
                    </div>

                    {/* Phone + Inquiry Type row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cf-phone" className="block text-xs font-bold text-[var(--text)]/60 uppercase tracking-wider mb-2">
                          Phone Number
                        </label>
                        <input
                          id="cf-phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          className={inputCls}
                          {...register("phone", {
                            required: "Phone is required",
                            pattern: { value: /^[+]?[\d\s-]{8,15}$/, message: "Invalid phone number" },
                          })}
                        />
                        {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="cf-type" className="block text-xs font-bold text-[var(--text)]/60 uppercase tracking-wider mb-2">
                          Inquiry Type
                        </label>
                        <select
                          id="cf-type"
                          className={inputCls}
                          {...register("inquiryType", { required: "Please select an inquiry type" })}
                        >
                          {INQUIRY_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                        {errors.inquiryType && <p className={errCls}>{errors.inquiryType.message}</p>}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="cf-subject" className="block text-xs font-bold text-[var(--text)]/60 uppercase tracking-wider mb-2">
                        Subject
                      </label>
                      <input
                        id="cf-subject"
                        type="text"
                        placeholder="What is this about?"
                        className={inputCls}
                        {...register("subject", { required: "Subject is required" })}
                      />
                      {errors.subject && <p className={errCls}>{errors.subject.message}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="cf-message" className="block text-xs font-bold text-[var(--text)]/60 uppercase tracking-wider mb-2">
                        Message
                      </label>
                      <textarea
                        id="cf-message"
                        rows={5}
                        placeholder="Tell us more about your requirements…"
                        className={`${inputCls} resize-none`}
                        {...register("message", {
                          required: "Message is required",
                          minLength: { value: 10, message: "At least 10 characters" },
                        })}
                      />
                      {errors.message && <p className={errCls}>{errors.message.message}</p>}
                    </div>

                    {/* Error banner */}
                    {status === "error" && (
                      <div className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-3 text-xs font-semibold">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        Something went wrong. Please try again.
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full sm:w-auto bg-[var(--primary)] text-white px-10 py-4 rounded-full font-bold text-sm hover:opacity-90 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2.5 shadow-lg"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Sending…
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Send Message
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          {/* ── Right: Quick Info (2 cols) ── */}
          <Reveal delay={0.15} className="lg:col-span-2">
            <div className="space-y-5">
              {/* Quick contact card */}
              <div className="bg-[var(--surface-elevated)] rounded-3xl border border-[var(--text)]/8 p-6 md:p-8">
                <h3 className="text-sm font-black uppercase tracking-[0.15em] text-[var(--text)]/40 mb-6">
                  Quick Contact
                </h3>
                <div className="space-y-5">
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                      <Phone size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--text)]/40 uppercase tracking-wider">Phone</p>
                      <p className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{phone}</p>
                    </div>
                  </a>
                  <a href={`mailto:${email}`} className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                      <Mail size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--text)]/40 uppercase tracking-wider">Email</p>
                      <p className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{email}</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--text)]/40 uppercase tracking-wider">Address</p>
                      <p className="text-sm font-medium text-[var(--text)]/70 leading-relaxed">{address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <Clock size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--text)]/40 uppercase tracking-wider">Hours</p>
                      <p className="text-sm font-medium text-[var(--text)]/70">{contactInfo?.workingHours || "Mon–Sat: 9 AM – 7 PM"}</p>
                    </div>
                  </div>
                </div>

                {/* Instant channels */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-[var(--text)]/8">
                  <Link
                    href="/dashboard/requests?type=support"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500/10 text-teal-600 hover:bg-teal-500/20 px-3 py-3 text-xs font-bold transition-colors active:scale-[0.98]"
                  >
                    <MessagesSquare size={16} /> Live Chat
                  </Link>
                  <a
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi Printvoz! I'd like to know more about your services.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500/10 text-green-600 hover:bg-green-500/20 px-3 py-3 text-xs font-bold transition-colors active:scale-[0.98]"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Response guarantee */}
              <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--text)] rounded-3xl p-6 md:p-8 text-white">
                <h3 className="font-black text-lg mb-2">Fast Response Guarantee</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  We respond to all inquiries within 24 hours. For urgent requests, call us directly or reach out via WhatsApp for instant support.
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["P", "V", "K"].map((initial) => (
                      <div key={initial} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs font-black">
                        {initial}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-white/60 font-medium">Our support team is ready to help</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
