// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "../lib/axios";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/seo/Breadcrumbs";

// Contact sections imports
import ContactHero from "./ContactUI/ContactHero";
import TrustBadges from "./ContactUI/TrustBadges";
import ContactInfoCards from "./ContactUI/ContactInfoCards";
import ContactForm from "./ContactUI/ContactForm";
import StatsSection from "./ContactUI/StatsSection";
import MapSection from "./ContactUI/MapSection";
import FaqSection from "./ContactUI/FaqSection";
import TestimonialsSection from "./ContactUI/TestimonialsSection";
import SocialLinks from "./ContactUI/SocialLinks";
import CtaBanner from "./ContactUI/CtaBanner";
import StickyMobileBar from "./ContactUI/StickyMobileBar";

// Full high-fidelity default fallback in case API content is empty or unreachable
const defaultContactData = {
  hero: {
    status: "published",
    backgroundType: "gradient",
    badgeText: "GET IN TOUCH",
    heading: "Let's Print Something Great Together",
    subheading: "Have questions about bulk orders, custom designs, or our printing process? Our enterprise support team is here to help you 24/7.",
    primaryCtaText: "Send Message",
    primaryCtaLink: "#contact-form",
    secondaryCtaText: "Call Us Now",
    secondaryCtaLink: "tel:+919876543210",
    showScrollIndicator: true
  },
  contactInfo: {
    status: "published",
    heading: "Contact Information",
    subheading: "Reach out to us through any of our channels or visit our head office.",
    primaryPhone: "+91 98765 43210",
    secondaryPhone: "+91 98765 43211",
    primaryEmail: "hello@printvoz.com",
    supportEmail: "support@printvoz.com",
    address: "Printvoz HQ, 4th Floor, Innovation Hub, Calicut, Kerala - 673001",
    workingHours: "Mon - Sat: 9:00 AM - 7:00 PM"
  },
  statistics: {
    status: "published",
    heading: "Printvoz in Numbers",
    subheading: "Delivering exceptional print quality and speed across the nation.",
    stats: [
      { value: 10, suffix: "M+", label: "Prints Delivered", icon: "Printer" },
      { value: 99, suffix: "%", label: "Happy Customers", icon: "ThumbsUp" },
      { value: 24, suffix: "/7", label: "Support Available", icon: "Clock" },
      { value: 15, suffix: "+", label: "Cities Reached", icon: "MapPin" }
    ]
  },
  mapSettings: {
    status: "published",
    heading: "Find Our Corporate HQ",
    subheading: "Visit our main experience center to touch and feel our premium paper stocks and merchandise.",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.064567215682!2d75.78041071472288!3d11.25875309199342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba65938563d4747%3A0x321557147d33f53f!2sCalicut%2C%20Kerala!5e0!3m2!1sen!2sin!4v1654876293444!5m2!1sen!2sin",
    latitude: "11.2588",
    longitude: "75.7804",
    zoom: 14,
    markerTitle: "Printvoz Corporate Office",
    showDirectionsButton: true
  },
  faqPreview: {
    status: "published",
    heading: "Frequently Asked Questions",
    subheading: "Quick answers to help you navigate your custom print orders.",
    items: [
      { question: "What is your standard turnaround time for orders?", answer: "Most custom prints take 2-4 business days to produce and 1-3 days for delivery depending on your location." },
      { question: "Can I request sample paper stocks before ordering?", answer: "Yes! You can contact our team to request a free sample kit containing our standard, premium, and luxury paper stocks." },
      { question: "Do you offer design assistance for custom orders?", answer: "Absolutely. We have an in-house design team ready to review your files or assist in creating print-ready designs." },
      { question: "Is there a minimum order quantity (MOQ)?", answer: "Most products like business cards have a minimum quantity of 100, while merchandise like custom mugs can be ordered as a single piece." },
      { question: "Do you support shipping across India?", answer: "Yes, we ship to over 15,000 pin codes across India with express delivery available in major metro cities." }
    ]
  },
  testimonials: {
    status: "published",
    heading: "Loved by Creators & Brands",
    subheading: "Don't just take our word for it—see what our regular clients say.",
    items: [
      { name: "Rahul Sharma", company: "Aesthetic Prints", location: "Kochi", rating: 5, text: "Printvoz has completely elevated our brand packaging. The paper feel and print precision are unmatched." },
      { name: "Sneha Kurian", company: "Studio Craft", location: "Bangalore", rating: 5, text: "The bulk order process is incredibly smooth. Their enterprise CMS and tracking features saved us hours." },
      { name: "Mohammed Faiz", company: "Local Cafe Co", location: "Calicut", rating: 4, text: "Amazing customer service. They helped us tweak our file format to ensure the colors popped perfectly." }
    ]
  },
  socialMedia: {
    status: "published",
    heading: "Stay Connected",
    subheading: "Follow us on social media for design inspiration and updates.",
    profiles: [
      { platform: "facebook", url: "https://facebook.com", label: "@printvoz" },
      { platform: "instagram", url: "https://instagram.com", label: "@printvoz.official" },
      { platform: "linkedin", url: "https://linkedin.com", label: "Printvoz India" },
      { platform: "whatsapp", url: "https://wa.me/919876543210", label: "Chat Support" }
    ]
  },
  ctaBanner: {
    status: "published",
    heading: "Let's Bring Your Vision to Life",
    subheading: "Get started with our enterprise-grade customized printing solutions today.",
    primaryCtaText: "Explore Catalog",
    primaryCtaLink: "/products",
    secondaryCtaText: "Request Quote",
    secondaryCtaLink: "#contact-form"
  }
};

export default function Contact({ initialData = null }) {
  const [data, setData] = useState(initialData);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Client-side fallback / fetch when server prefetch wasn't available
  useEffect(() => {
    if (initialData) {
      // Merge with default values if specific sections are missing
      setData({ ...defaultContactData, ...initialData });
      return;
    }
    const fetchData = async () => {
      try {
        const res = await api.get("/contact-page");
        if (res.data && Object.keys(res.data).length > 0) {
          setData({ ...defaultContactData, ...res.data });
        } else {
          setData(defaultContactData);
        }
      } catch (err) {
        console.error("Failed to fetch contact page content, utilizing high-fidelity defaults:", err);
        setData(defaultContactData);
      }
    };
    fetchData();
  }, [initialData]);

  const show = (key) => data?.[key]?.status === "published";

  // Branded loader while data is null
  if (!data) {
    return (
      <div className="bg-[var(--bg)] min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
        <span className="mt-4 text-sm font-semibold text-[var(--text)]/60">Loading PrintVoz Contact Experience...</span>
      </div>
    );
  }

  return (
    <div className={`bg-[var(--bg)] min-h-screen flex flex-col ${show("hero") ? "" : "pt-24"} pb-24 md:pb-0`}>
      {/* Hero Section */}
      {show("hero") && <ContactHero data={data.hero} />}

      {/* Trust Badges Marquee */}
      <TrustBadges />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 pb-4">
        <Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} className="text-[var(--text)]/60" />
      </div>

      {/* Contact Cards Section */}
      {show("contactInfo") && <ContactInfoCards data={data.contactInfo} />}

      {/* Main Lead Generation Contact Form */}
      <ContactForm data={data.contactInfo} />

      {/* Statistics Section */}
      {show("statistics") && <StatsSection data={data.statistics} />}

      {/* Interactive Map Location */}
      {show("mapSettings") && <MapSection data={data.mapSettings} />}

      {/* FAQ Accordion Section */}
      {show("faqPreview") && <FaqSection data={data.faqPreview} />}

      {/* Client Testimonials Section */}
      {show("testimonials") && <TestimonialsSection data={data.testimonials} />}

      {/* Social Media Links */}
      {show("socialMedia") && <SocialLinks data={data.socialMedia} />}

      {/* Conversion Banner */}
      {show("ctaBanner") && <CtaBanner data={data.ctaBanner} />}

      {/* Sticky Mobile Contacts Bar */}
      {show("contactInfo") && <StickyMobileBar data={data.contactInfo} />}

      <Footer />
    </div>
  );
}
