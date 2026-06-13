// @ts-nocheck
"use client";

import { useState } from "react";
import { Phone, MessageCircle, Mail, MapPin, Clock, Copy, Check, ExternalLink } from "lucide-react";
import Reveal from "../AboutUI/shared/Reveal";
import SectionHeading from "../AboutUI/shared/SectionHeading";

function copyToClipboard(text, setCopied) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  });
}

function ContactCard({ icon: Icon, title, value, action, actionLabel, color, index, subValue }) {
  const [copied, setCopied] = useState(false);

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <div className="group relative h-full rounded-3xl border border-[var(--text)]/8 bg-[var(--surface)] backdrop-blur-sm p-6 md:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-400 overflow-hidden">
        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${color}12 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        <div className="relative">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${color}15`, color }}
          >
            <Icon size={24} strokeWidth={1.8} />
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-[var(--text)] mb-2">{title}</h3>

          {/* Value */}
          <p className="text-sm text-[var(--text)]/70 font-medium leading-relaxed mb-1">{value}</p>
          {subValue && (
            <p className="text-xs text-[var(--text)]/50 flex items-center gap-1.5 mb-4">
              <Clock size={12} /> {subValue}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4">
            {action && (
              <a
                href={action}
                target={action.startsWith("http") ? "_blank" : undefined}
                rel={action.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-4 py-2.5 transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: `${color}15`, color }}
              >
                {action.startsWith("http") ? <ExternalLink size={13} /> : <Icon size={13} />}
                {actionLabel}
              </a>
            )}
            <button
              type="button"
              onClick={() => copyToClipboard(value, setCopied)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--text)]/40 hover:text-[var(--text)]/70 rounded-full px-3 py-2 hover:bg-[var(--text)]/5 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function ContactInfoCards({ data }) {
  if (!data) return null;

  const phone = data.primaryPhone || "+91 98765 43210";
  const whatsapp = (data.secondaryPhone || data.primaryPhone || "919876543210").replace(/[^0-9]/g, "");
  const email = data.primaryEmail || "hello@printvoz.com";
  const address = data.address || "123, Business Park, Kerala, India";

  const cards = [
    {
      icon: Phone,
      title: "Call Us",
      value: phone,
      action: `tel:${phone.replace(/\s/g, "")}`,
      actionLabel: "Call Now",
      color: "#3b82f6",
      subValue: data.workingHours || "Mon–Sat: 9 AM – 7 PM",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: data.secondaryPhone || phone,
      action: `https://wa.me/${whatsapp}?text=Hi%20Printvoz!%20I'd%20like%20to%20know%20more%20about%20your%20services.`,
      actionLabel: "Chat Now",
      color: "#22c55e",
      subValue: "Typically replies in 5 min",
    },
    {
      icon: Mail,
      title: "Email Us",
      value: email,
      action: `mailto:${email}`,
      actionLabel: "Send Email",
      color: "#a855f7",
      subValue: data.supportEmail ? `Support: ${data.supportEmail}` : null,
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: address,
      action: `https://www.google.com/maps/search/${encodeURIComponent(address)}`,
      actionLabel: "Get Directions",
      color: "#ef4444",
      subValue: data.workingHours || "Mon–Sat: 9 AM – 7 PM",
    },
  ];

  return (
    <section id="contact-info" className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          heading={data.heading || "Get In Touch"}
          subheading={data.subheading || "We're here to help you with all your printing needs. Reach out through any channel that's convenient for you."}
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
          {cards.map((card, i) => (
            <ContactCard key={card.title} {...card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
