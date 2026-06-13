// @ts-nocheck
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Boxes, X, Loader2, CheckCircle2, Upload, ArrowRight } from "lucide-react";
import api from "@/lib/axios";

export default function BulkOrderCTA() {
  const [open, setOpen] = useState(false);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-14 md:py-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] px-7 sm:px-12 py-12 sm:py-16 text-center shadow-2xl shadow-[var(--primary)]/20"
        >
          <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-16 w-72 h-72 bg-black/10 rounded-full blur-3xl pointer-events-none" />

          <span className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--bg)]/20 backdrop-blur mb-5">
            <Boxes className="w-7 h-7 text-[var(--bg)]" />
          </span>
          <h2 className="relative text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--bg)]">
            Need a Bulk Quote?
          </h2>
          <p className="relative mt-3 text-[var(--bg)]/85 max-w-2xl mx-auto">
            Get custom pricing for corporate branding, packaging, events, promotional products, and
            large-volume printing.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="relative mt-7 inline-flex items-center gap-2 px-7 py-3.5 min-h-[44px] rounded-xl bg-[var(--bg)] text-[var(--primary)] font-bold hover:scale-[1.03] transition-transform shadow-lg"
          >
            Request Bulk Order <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      <BulkOrderModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

function BulkOrderModal({ open, onClose }: any) {
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    productType: "",
    quantity: "",
    requirements: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const update = (k: string) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: any) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const fd = new FormData();
      fd.append("type", "bulk_order");
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append("files", f));
      await api.post("/help/support", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("success");
      setForm({ name: "", companyName: "", email: "", phone: "", productType: "", quantity: "", requirements: "" });
      setFiles([]);
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
            className="relative w-full max-w-xl bg-[var(--bg)] rounded-3xl shadow-2xl border border-[var(--secondary)]/25 p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--secondary)]/15 text-[var(--text)]/60"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-[var(--text)] flex items-center gap-2">
              <Boxes className="w-5 h-5 text-[var(--primary)]" /> Request a Bulk Quote
            </h3>

            {status === "success" ? (
              <div className="flex flex-col items-center text-center py-8">
                <CheckCircle2 className="w-14 h-14 text-green-500" />
                <p className="mt-4 font-bold text-[var(--text)]">Quote request submitted!</p>
                <p className="mt-1 text-sm text-[var(--text)]/60">
                  Our sales team will reach out with custom pricing soon.
                </p>
                <button onClick={onClose} className="mt-6 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--bg)] font-bold">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <BField label="Name" required value={form.name} onChange={update("name")} />
                  <BField label="Company Name" value={form.companyName} onChange={update("companyName")} />
                  <BField label="Email" type="email" required value={form.email} onChange={update("email")} />
                  <BField label="Phone" value={form.phone} onChange={update("phone")} />
                  <BField label="Product Type" value={form.productType} onChange={update("productType")} placeholder="e.g. Business Cards" />
                  <BField label="Quantity" value={form.quantity} onChange={update("quantity")} placeholder="e.g. 5000" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Requirements</label>
                  <textarea
                    rows={3}
                    value={form.requirements}
                    onChange={update("requirements")}
                    placeholder="Tell us about your project…"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--secondary)]/30 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Upload Files</label>
                  <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-[var(--secondary)]/40 cursor-pointer hover:border-[var(--primary)] transition-colors">
                    <Upload className="w-5 h-5 text-[var(--primary)]" />
                    <span className="text-sm text-[var(--text)]/70">
                      {files.length > 0 ? `${files.length} file(s) selected` : "Choose files (artwork, specs…)"}
                    </span>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setFiles(Array.from(e.target.files || []))}
                      className="hidden"
                    />
                  </label>
                </div>

                {status === "error" && <p className="text-sm text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[44px] rounded-xl bg-[var(--primary)] text-[var(--bg)] font-bold hover:opacity-90 disabled:opacity-60"
                >
                  {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Request
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BField({ label, required, type = "text", value, onChange, placeholder }: any) {
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
        className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--secondary)]/30 text-[var(--text)] placeholder:text-[var(--text)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)]"
      />
    </div>
  );
}
