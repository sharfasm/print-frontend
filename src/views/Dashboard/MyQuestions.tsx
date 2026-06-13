// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircleQuestion, Loader2, Clock, CheckCircle2, Lock } from "lucide-react";
import api from "@/lib/axios";

const STATUS_BADGE = {
  pending: { label: "Pending", cls: "bg-amber-500/15 text-amber-600", icon: Clock },
  answered: { label: "Answered", cls: "bg-green-500/15 text-green-600", icon: CheckCircle2 },
  closed: { label: "Closed", cls: "bg-gray-500/15 text-gray-500", icon: Lock },
};

export default function MyQuestions() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/help/questions/mine");
        setQuestions(Array.isArray(data) ? data : []);
      } catch {
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="w-11 h-11 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
          <MessageCircleQuestion className="w-6 h-6 text-[var(--primary)]" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text)]">My Questions</h1>
          <p className="text-sm text-[var(--text)]/60">
            Questions you've submitted to our Help Center and our replies.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16 rounded-3xl border border-dashed border-[var(--secondary)]/30">
          <MessageCircleQuestion className="w-12 h-12 mx-auto text-[var(--text)]/30" />
          <p className="mt-4 font-semibold text-[var(--text)]">No questions yet</p>
          <p className="mt-1 text-sm text-[var(--text)]/60">
            Ask a question from the{" "}
            <a href="/faq#ask" className="text-[var(--primary)] font-semibold underline">
              Help Center
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => {
            const badge = STATUS_BADGE[q.status] || STATUS_BADGE.pending;
            const Icon = badge.icon;
            return (
              <motion.div
                key={q._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[var(--secondary)]/20 bg-[var(--bg)] p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-[var(--text)]">{q.question}</p>
                  <span className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badge.cls}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {badge.label}
                  </span>
                </div>
                {q.orderNumber && (
                  <p className="mt-1 text-xs text-[var(--text)]/50">Order: {q.orderNumber}</p>
                )}

                {/* Conversation thread */}
                {q.messages?.length > 0 && (
                  <div className="mt-4 space-y-2.5">
                    {q.messages.map((m: any, i: number) => (
                      <div
                        key={i}
                        className={`flex ${m.sender === "admin" ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                            m.sender === "admin"
                              ? "bg-[var(--primary)]/10 text-[var(--text)] rounded-tl-sm"
                              : "bg-[var(--secondary)]/15 text-[var(--text)] rounded-tr-sm"
                          }`}
                        >
                          <span className="block text-[10px] font-bold uppercase tracking-wider opacity-50 mb-0.5">
                            {m.sender === "admin" ? "Support" : "You"}
                          </span>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {q.status === "pending" && (
                  <p className="mt-3 text-xs text-[var(--text)]/50 italic">
                    Awaiting a reply from our support team…
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
