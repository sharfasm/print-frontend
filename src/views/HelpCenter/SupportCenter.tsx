// @ts-nocheck
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  Headset,
  Mail,
  MapPin,
  Phone,
  X,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/seo/constants";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

const cardBase =
  "group relative rounded-3xl border border-[var(--secondary)]/25 bg-[var(--bg)] p-7 shadow-lg shadow-[var(--secondary)]/5 flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl";

export default function SupportCenter() {
  const router = useRouter();
  const auth = useAuth() as any;
  const [emailOpen, setEmailOpen] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const b = SITE_CONFIG.business;
  const whatsapp = (b.phone || "").replace(/[^\d]/g, "");

  const startLiveChat = async () => {
    if (!auth?.isLoggedIn) {
      router.push("/login?redirect=/dashboard/requests");
      return;
    }
    setChatLoading(true);
    try {
      await api.post("/help/support", {
        type: "live_chat",
        name: auth?.user?.name,
        email: auth?.user?.email,
        subject: "Live chat request",
        message: "User requested a live chat from the Help Center.",
      });
      router.push("/dashboard/requests");
    } catch {
      setChatLoading(false);
    }
  };

  return (
    <section id="support" className="px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)]">
            Need Help?
          </h2>
          <p className="mt-3 text-[var(--text)]/65 max-w-xl mx-auto">
            Reach our support team the way that works best for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {/* Live Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={cardBase}
          >
            <span className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[var(--primary)]" />
            </span>
            <h3 className="mt-5 text-xl font-bold text-[var(--text)]">💬 Live Chat</h3>
            <p className="mt-2 text-sm text-[var(--text)]/65 flex-1">
              Talk directly with our support team.
            </p>
            <button
              onClick={startLiveChat}
              disabled={chatLoading}
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-[var(--primary)] text-[var(--bg)] font-bold hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {chatLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Start Live Chat
            </button>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.07 }}
            className={cardBase}
          >
            <span className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
              <Headset className="w-6 h-6 text-[var(--primary)]" />
            </span>
            <h3 className="mt-5 text-xl font-bold text-[var(--text)]">📩 Contact Support</h3>
            <p className="mt-2 text-sm text-[var(--text)]/65">Need detailed assistance?</p>

            <div className="mt-4 space-y-2.5 text-sm text-[var(--text)]/75 flex-1">
              <span className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[var(--primary)]" />
                {b.address.streetAddress}, {b.address.addressLocality}, {b.address.addressRegion}
              </span>
              <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 hover:text-[var(--primary)] transition-colors">
                <Phone className="w-4 h-4 shrink-0 text-[var(--primary)]" />
                {b.phone}
              </a>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-[var(--primary)] transition-colors">
                <MessageSquare className="w-4 h-4 shrink-0 text-[var(--primary)]" />
                WhatsApp
              </a>
              <a href={`mailto:${b.email}`} className="flex items-center gap-2.5 hover:text-[var(--primary)] transition-colors">
                <Mail className="w-4 h-4 shrink-0 text-[var(--primary)]" />
                {b.email}
              </a>
            </div>

            <Link
              href="/contact"
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl border border-[var(--primary)] text-[var(--primary)] font-bold hover:bg-[var(--primary)] hover:text-[var(--bg)] transition-colors"
            >
              Visit Contact Page <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Email Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.14 }}
            className={cardBase}
          >
            <span className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-[var(--primary)]" />
            </span>
            <h3 className="mt-5 text-xl font-bold text-[var(--text)]">📧 Email Support</h3>
            <p className="mt-2 text-sm text-[var(--text)]/65 flex-1">
              Send us your questions directly.
            </p>
            <button
              onClick={() => setEmailOpen(true)}
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-[var(--primary)] text-[var(--bg)] font-bold hover:opacity-90 transition-opacity"
            >
              Send Email
            </button>
          </motion.div>
        </div>
      </div>

      <EmailSupportModal open={emailOpen} onClose={() => setEmailOpen(false)} auth={auth} />
    </section>
  );
}

function EmailSupportModal({ open, onClose, auth }: any) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const update = (k: string) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: any) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await api.post("/help/support", { type: "email_support", ...form });
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="relative w-full max-w-lg bg-[var(--bg)] rounded-3xl shadow-2xl border border-[var(--secondary)]/25 p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--secondary)]/15 text-[var(--text)]/60"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-[var(--text)] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[var(--primary)]" /> Email Support
            </h3>

            {status === "success" ? (
              <div className="flex flex-col items-center text-center py-8">
                <CheckCircle2 className="w-14 h-14 text-green-500" />
                <p className="mt-4 font-bold text-[var(--text)]">Your request was sent!</p>
                <p className="mt-1 text-sm text-[var(--text)]/60">
                  Our team will reply to your email shortly.
                </p>
                <button onClick={onClose} className="mt-6 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--bg)] font-bold">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ModalField label="Name" required value={form.name} onChange={update("name")} />
                  <ModalField label="Email" type="email" required value={form.email} onChange={update("email")} />
                </div>
                <ModalField label="Subject" required value={form.subject} onChange={update("subject")} />
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={update("message")}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--secondary)]/30 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] resize-none"
                  />
                </div>
                {status === "error" && <p className="text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[44px] rounded-xl bg-[var(--primary)] text-[var(--bg)] font-bold hover:opacity-90 disabled:opacity-60"
                >
                  {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send Email
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModalField({ label, required, type = "text", value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">
        {label} {required && <span className="text-[var(--primary)]">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--secondary)]/30 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)]"
      />
    </div>
  );
}
