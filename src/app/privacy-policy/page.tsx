// @ts-nocheck
import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import Footer from '@/components/Footer'

export const metadata: Metadata = genMeta({
  title: 'Privacy Policy — Printvoz Printing Services',
  description: 'Read the privacy policy of Printvoz Kerala. Learn how we collect, use, protect, and handle your personal data when ordering custom printing online.',
  path: '/privacy-policy',
  keywords: ['privacy policy', 'Printvoz privacy', 'data protection', 'online printing Kerala privacy'],
})

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Privacy Policy — Printvoz',
          description: 'Printvoz Privacy Policy regarding user data protection.',
          publisher: {
            '@type': 'Organization',
            name: 'Printvoz',
          },
        }}
      />
      <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6 font-sans">
          <Breadcrumbs items={[{ name: 'Privacy Policy', href: '/privacy-policy' }]} className="mb-8" />
          
          <h1 className="text-3xl sm:text-4xl font-serif font-black uppercase mb-8 text-[var(--primary)] border-b border-[var(--secondary)]/15 pb-4">
            Privacy Policy
          </h1>

          <div className="space-y-6 opacity-90 text-sm leading-relaxed">
            <p>
              Last updated: June 5, 2026.
            </p>
            <p>
              At Printvoz, accessible from printvoz.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Printvoz and how we use it.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">1. Information We Collect</h2>
            <p>
              When you register for an account, place an order, or interact with our website, we may collect personal details such as your name, email address, phone number, shipping and billing address, and business details if custom prints require business information (e.g. GST number).
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Process, fulfill, and ship your printing orders.</li>
              <li>Improve, personalize, and expand our website features.</li>
              <li>Communicate with you regarding order status or support queries.</li>
              <li>Send promotional notifications and marketing emails (with opt-out choice).</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">3. Cookies and Log Files</h2>
            <p>
              Printvoz follows a standard procedure of using log files and browser cookies. These cookies are used to store information including visitors\' preferences, shopping cart states, and the pages on the website that the visitor accessed or visited.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">4. Security of Data</h2>
            <p>
              We take the security of your personal information seriously and use industry-standard encryption protocols (SSL) during transmission and processing of payment and user account details.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
