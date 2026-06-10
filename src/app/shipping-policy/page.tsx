// @ts-nocheck
import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import Footer from '@/components/Footer'

export const metadata: Metadata = genMeta({
  title: 'Shipping Policy — Printvoz Printing Services',
  description: 'Read the shipping and delivery policy of Printvoz Kerala. Learn about standard and express delivery options, shipping times, and rates across Kochi, Kerala, and India.',
  path: '/shipping-policy',
  keywords: ['shipping policy', 'Printvoz delivery', 'printing delivery time', 'express printing Kerala'],
})

export default function ShippingPolicyPage() {
  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Shipping Policy — Printvoz',
          description: 'Printvoz shipping guidelines, delivery methods, rates and durations.',
          publisher: {
            '@type': 'Organization',
            name: 'Printvoz',
          },
        }}
      />
      <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6 font-sans">
          <Breadcrumbs items={[{ name: 'Shipping Policy', href: '/shipping-policy' }]} className="mb-8" />
          
          <h1 className="text-3xl sm:text-4xl font-serif font-black uppercase mb-8 text-[var(--primary)] border-b border-[var(--secondary)]/15 pb-4">
            Shipping & Delivery Policy
          </h1>

          <div className="space-y-6 opacity-90 text-sm leading-relaxed">
            <p>
              Last updated: June 5, 2026.
            </p>
            <p>
              Printvoz is dedicated to shipping your custom prints as quickly and safely as possible. Below are the details regarding our delivery coverage, turnaround times, and charges.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">1. Delivery Scope & Pin Codes</h2>
            <p>
              We ship to all active pin codes across Kerala and India. We partner with reliable courier services (like DTDC, Blue Dart, Professional Couriers, and Speed Post) to ensure safe transit of your packages.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">2. Turnaround & Shipping Times</h2>
            <p>
              Custom printing has two parts: <strong>Production Time</strong> and <strong>Transit Time</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Standard Production:</strong> 1–3 business days depending on product complexity (e.g. flex banners are printed faster than custom packaging boxes).</li>
              <li><strong>Transit Duration:</strong> Standard delivery takes 3–5 working days inside Kerala, and 5–7 days outside Kerala.</li>
              <li><strong>Express Shipping:</strong> 1–2 business days transit inside Kerala for select items.</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">3. Shipping Rates</h2>
            <p>
              Shipping rates are calculated automatically at checkout based on weight, dimensions, and delivery location. Free delivery is applicable on select cart values or promotional campaigns.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
