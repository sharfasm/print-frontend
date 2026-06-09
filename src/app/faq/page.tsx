// @ts-nocheck
import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import { generateFAQSchema } from '@/lib/seo/schemas'
import FAQ from '@/views/HomeUI/FAQ'
import Footer from '@/components/Footer'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const metadata: Metadata = genMeta({
  title: 'Frequently Asked Questions — Printvoz Printing Services',
  description:
    'Find answers to common questions about Printvoz printing services — shipping times, return policy, international delivery, order tracking, warranty and more.',
  path: '/faq',
  keywords: [
    'printing services FAQ',
    'Printvoz FAQ',
    'printing help',
    'printing questions Kerala',
  ],
})

export default async function FAQPage() {
  let faqs = [];
  try {
    const res = await fetch(`${API_URL}/home-settings`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      faqs = data.faqs || [];
    }
  } catch (err) {
    console.error("Failed to fetch home settings for FAQ page server-side:", err);
  }

  return (
    <>
      <JsonLd schema={generateFAQSchema(faqs)} />
      <Breadcrumbs items={[{ name: 'FAQ', href: '/faq' }]} className="max-w-4xl mx-auto px-4 pt-28" />
      <FAQ faqs={faqs} />
      <Footer />
    </>
  )
}

