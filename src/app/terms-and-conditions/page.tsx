// @ts-nocheck
import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import Footer from '@/components/Footer'

export const metadata: Metadata = genMeta({
  title: 'Terms & Conditions — Printvoz Printing Services',
  description: 'Review the terms and conditions for ordering premium online printing services from Printvoz Kerala. Order guidelines, payment terms, and artwork specifications.',
  path: '/terms-and-conditions',
  keywords: ['terms and conditions', 'Printvoz terms', 'artwork guidelines', 'printing terms Kerala'],
})

export default function TermsAndConditionsPage() {
  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Terms & Conditions — Printvoz',
          description: 'Printvoz terms of service, custom printing guidelines and rules.',
          publisher: {
            '@type': 'Organization',
            name: 'Printvoz',
          },
        }}
      />
      <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6 font-sans">
          <Breadcrumbs items={[{ name: 'Terms & Conditions', href: '/terms-and-conditions' }]} className="mb-8" />
          
          <h1 className="text-3xl sm:text-4xl font-serif font-black uppercase mb-8 text-[var(--primary)] border-b border-[var(--secondary)]/15 pb-4">
            Terms & Conditions
          </h1>

          <div className="space-y-6 opacity-90 text-sm leading-relaxed">
            <p>
              Last updated: June 5, 2026.
            </p>
            <p>
              Welcome to Printvoz. These Terms & Conditions outline the rules and regulations for the use of Printvoz\'s website and custom printing services.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">1. Custom Artwork & File Submission</h2>
            <p>
              When submitting artwork or graphics for custom printing, the customer represents and warrants that they own the rights to the content or have obtained all necessary permissions and licenses. Printvoz reserves the right to reject any file that is of insufficient resolution or contains inappropriate content.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">2. Color Matching & Print Proofs</h2>
            <p>
              Due to differences in monitor calibration, printing technology, ink, and media types, minor color variations may occur between the screen preview and the physical print. We aim for maximum accuracy but do not guarantee exact color reproduction.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">3. Payments & Order Cancellations</h2>
            <p>
              All custom printing orders are processed only upon receiving complete or agreed partial payment. Once a custom order goes into the production/printing queue, cancellation is not possible and payments will not be refunded.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">4. Limitation of Liability</h2>
            <p>
              Printvoz will not be held liable for any damages resulting from delayed delivery due to shipping carrier issues, weather anomalies, or design errors made by the customer.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
