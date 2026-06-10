// @ts-nocheck
import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { generateFAQSchema } from '@/lib/seo/schemas'
import Home from '../views/Home'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const metadata: Metadata = genMeta({
  title: 'Printvoz — Premium Online Printing Services in Kerala',
  description:
    'Order premium quality printing online from Printvoz Kerala. Business cards, flex banners, brochures, packaging, custom gifts. Fast delivery in Kochi, Thrissur, Calicut, Trivandrum.',
  path: '/',
  keywords: [
    'online printing Kerala',
    'printing company Kerala',
    'bulk printing Kerala',
  ],
})

// Homepage FAQs for rich snippets
const homepageFaqs = [
  {
    question: 'What printing services does Printvoz offer in Kerala?',
    answer:
      'Printvoz offers a wide range of printing services in Kerala including business cards, flex banners, brochures, leaflets, packaging, stickers, custom gifts, and more. We serve customers across Kochi, Thrissur, Calicut, Trivandrum, and Kannur.',
  },
  {
    question: 'How fast is delivery from Printvoz?',
    answer:
      'Printvoz offers express and standard delivery options. Most orders are delivered within 2–5 business days across Kerala. Same-day printing is available for select products.',
  },
  {
    question: 'Does Printvoz offer bulk printing discounts?',
    answer:
      'Yes, Printvoz offers significant discounts for bulk orders. Contact us or use the bulk order form on our website for custom pricing on large quantities.',
  },
  {
    question: 'Can I upload my own design for printing?',
    answer:
      'Absolutely. Printvoz accepts designs in PDF, AI, PSD, and CDR formats. Our team also offers design assistance if you need help creating artwork for your print job.',
  },
]

export default async function HomePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  let initialSettings = null;
  try {
    const res = await fetch(`${API_URL}/home-settings`, { next: { revalidate: 3600 } });
    if (res.ok) {
      initialSettings = await res.json();
    }
  } catch (err) {
    console.error("Failed to prefetch home settings on server:", err);
  }

  const faqs = (initialSettings && initialSettings.faqs && initialSettings.faqs.length > 0)
    ? initialSettings.faqs
    : homepageFaqs;

  return (
    <>
      <JsonLd schema={generateFAQSchema(faqs)} />
      <Home initialSettings={initialSettings} />
    </>
  )
}

