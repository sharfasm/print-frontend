// @ts-nocheck
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircleQuestion, CheckCircle2, Loader2 } from "lucide-react";
import api from "@/lib/axios";

export default function AskQuestion() {
  const [form, setForm] = useState({ name: "", email: "", orderNumber: "", question: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const update = (k: string) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: any) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await api.post("/help/questions", form);
      setStatus("success");
      setForm({ name: "", email: "", orderNumber: "", question: "" });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section id="ask" className="px-4 sm:px-6 lg:px-8 py-14 md:py-20">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-[var(--secondary)]/25 bg-[var(--bg)] p-7 sm:p-10 shadow-xl shadow-[var(--secondary)]/5 overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
              <MessageCircleQuestion className="w-6 h-6 text-[var(--primary)]" />
            </span>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text)]">
                Didn't find your answer?
              </h2>
              <p className="text-sm text-[var(--text)]/60">
                Send us your question and our team will get back to you.
              </p>
            </div>
          </div>

          {status === "success" ? (
            <div className="mt-8 flex flex-col items-center text-center py-8">
              <CheckCircle2 className="w-14 h-14 text-green-500" />
              <p className="mt-4 text-lg font-bold text-[var(--text)]">Question submitted!</p>
              <p className="mt-1 text-sm text-[var(--text)]/60 max-w-sm">
                We've received your question. You'll get a reply by email, and logged-in users can
                track it in their dashboard.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--bg)] font-bold hover:opacity-90 transition-opacity"
              >
                Ask another question
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Name" required value={form.name} onChange={update("name")} placeholder="Your name" />
                <Field label="Email" required type="email" value={form.email} onChange={update("email")} placeholder="you@email.com" />
              </div>
              <Field
                label="Order Number (optional)"
                value={form.orderNumber}
                onChange={update("orderNumber")}
                placeholder="e.g. PV-10231"
              />
              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Question</label>
                <textarea
                  required
                  rows={4}
                  value={form.question}
                  onChange={update("question")}
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--secondary)]/30 text-[var(--text)] placeholder:text-[var(--text)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all resize-none"
                />
              </div>

              {status === "error" && <p className="text-sm font-medium text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[44px] rounded-xl bg-[var(--primary)] text-[var(--bg)] font-bold hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Question
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, required, type = "text", value, onChange, placeholder }: any) {
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
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--secondary)]/30 text-[var(--text)] placeholder:text-[var(--text)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all"
      />
    </div>
  );
}
