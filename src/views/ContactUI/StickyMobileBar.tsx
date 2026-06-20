// @ts-nocheck
"use client";

import { Phone, MessageCircle, Mail } from "lucide-react";

export default function StickyMobileBar({ data }: { data: any }) {
  if (!data) return null;

  const { phone, whatsapp, email } = data;

  // Render only if at least one contact method is available
  if (!phone && !whatsapp && !email) return null;

  // Deep-link helpers
  const cleanPhone = phone ? phone.replace(/[^+\d]/g, "") : "";
  const cleanWhatsapp = whatsapp ? whatsapp.replace(/[^+\d]/g, "") : "";
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp.startsWith("+") ? cleanWhatsapp.substring(1) : cleanWhatsapp}`
    : "";

  return (
    <div
      className="fixed left-0 right-0 z-50 md:hidden bg-black/80 backdrop-blur-lg border-t border-white/10 px-4 py-3 shadow-2xl"
      style={{ bottom: "var(--bottom-nav-space)" }}
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {phone && (
          <a
            href={`tel:${cleanPhone}`}
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white py-3 px-4 rounded-xl font-bold text-sm active:scale-95 transition-all hover:bg-white/20"
          >
            <Phone size={16} className="text-[var(--primary)]" />
            <span>Call</span>
          </a>
        )}

        {whatsapp && whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#25d366] text-white py-3 px-4 rounded-xl font-bold text-sm active:scale-95 transition-all hover:bg-[#25d366]/90 shadow-lg"
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </a>
        )}

        {email && (
          <a
            href={`mailto:${email}`}
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white py-3 px-4 rounded-xl font-bold text-sm active:scale-95 transition-all hover:bg-white/20"
          >
            <Mail size={16} className="text-[var(--secondary)]" />
            <span>Email</span>
          </a>
        )}
      </div>
    </div>
  );
}
