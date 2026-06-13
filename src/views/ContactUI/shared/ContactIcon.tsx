// @ts-nocheck
"use client";
import React from "react";
import {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Globe,
  Heart,
  HeartHandshake,
  IndianRupee,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Printer,
  Send,
  ShieldCheck,
  Star,
  ThumbsUp,
  TrendingUp,
  Trophy,
  Truck,
  Users,
  Zap,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTwitter,
  FaWhatsapp,
  FaTelegram,
  FaPinterest,
} from "react-icons/fa";

// Lucide icon map
export const CONTACT_ICON_MAP: Record<string, LucideIcon> = {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Globe,
  Heart,
  HeartHandshake,
  IndianRupee,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Printer,
  Send,
  ShieldCheck,
  Star,
  ThumbsUp,
  TrendingUp,
  Trophy,
  Truck,
  Users,
  Zap,
  Sparkles,
};

// Brand icons map from React Icons (FontAwesome)
export const BRAND_ICON_MAP: Record<string, React.ComponentType<any>> = {
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  Linkedin: FaLinkedin,
  Youtube: FaYoutube,
  Twitter: FaTwitter,
  Whatsapp: FaWhatsapp,
  Telegram: FaTelegram,
  Pinterest: FaPinterest,
};

interface ContactIconProps {
  name?: string | null;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export default function ContactIcon({ name, className, size, strokeWidth }: ContactIconProps) {
  if (!name) {
    return <Sparkles className={className} size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
  }

  // First check if it is a brand icon
  const BrandIcon = BRAND_ICON_MAP[name];
  if (BrandIcon) {
    return <BrandIcon className={className} size={size} aria-hidden="true" />;
  }

  // Otherwise fallback to Lucide icon
  const Icon = CONTACT_ICON_MAP[name] || Sparkles;
  return <Icon className={className} size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
}
