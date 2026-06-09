// @ts-nocheck
import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import Footer from '@/components/Footer'

export const metadata: Metadata = genMeta({
  title: 'Refund & Return Policy — Printvoz Printing Services',
  description: 'Learn about our 30-day refund, return, and reprint policy for custom printing orders at Printvoz Kerala. Premium quality guarantee and replacement options.',
  path: '/refund-policy',
  keywords: ['refund policy', 'Printvoz returns', 'printing reprints', 'Kerala online printing returns'],
})

export default function RefundPolicyPage() {
  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Refund & Return Policy — Printvoz',
          description: 'Printvoz return policy and refund guidelines for custom printed products.',
          publisher: {
            '@type': 'Organization',
            name: 'Printvoz',
          },
        }}
      />
      <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6 font-sans">
          <Breadcrumbs items={[{ name: 'Refund Policy', href: '/refund-policy' }]} className="mb-8" />
          
          <h1 className="text-3xl sm:text-4xl font-serif font-black uppercase mb-8 text-[var(--primary)] border-b border-[var(--secondary)]/15 pb-4">
            Refund & Return Policy
          </h1>

          <div className="space-y-6 opacity-90 text-sm leading-relaxed">
            <p>
              Last updated: June 5, 2026.
            </p>
            <p>
              At Printvoz, we are committed to providing premium quality prints. Since our products are custom-made to your specific requirements, we handle returns, reprints, and refunds with the following guidelines.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">1. Quality Issues & Manufacturing Defects</h2>
            <p>
              If there is a defect in material or workmanship, or an error committed purely on our end during printing/cutting, we will offer a free reprint and replacement. Please notify our support team within 7 days of receiving your order with photos and description of the issue.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">2. Non-Refundable Situations</h2>
            <p>
              We cannot offer reprints or refunds for:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Low-resolution artwork or graphics uploaded by the customer resulting in pixelation.</li>
              <li>Spelling, punctuation, or layout errors made by the customer on the submitted designs.</li>
              <li>Incorrect size selection or product choice during checkout.</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">3. Refund Processing</h2>
            <p>
              For approved refunds (e.g. order cancelation prior to production or double charge errors), refunds will be processed back to the original payment method within 5–7 working days depending on your bank.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
