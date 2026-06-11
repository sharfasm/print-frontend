// @ts-nocheck
import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { SITE_CONFIG } from '@/lib/seo/constants'
import PrivacyPolicy from '@/views/PrivacyPolicy'

export const metadata: Metadata = genMeta({
  title: 'Privacy Policy — PrintVoz',
  description:
    'Learn how PrintVoz collects, uses, protects, and manages customer information, uploaded files, orders, and payment data. Your privacy matters to us.',
  path: '/privacy-policy',
  keywords: [
    'privacy policy',
    'PrintVoz privacy',
    'data protection',
    'customer privacy',
    'online printing Kerala privacy',
    'secure printing service',
    'payment security',
    'file upload privacy',
  ],
})

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* WebPage Schema */}
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Privacy Policy — PrintVoz',
          description:
            'Learn how PrintVoz collects, uses, protects, and manages customer information, uploaded files, orders, and payment data.',
          url: `${SITE_CONFIG.url}/privacy-policy`,
          dateModified: '2026-06-01',
          publisher: {
            '@type': 'Organization',
            name: 'PrintVoz',
            url: SITE_CONFIG.url,
            logo: {
              '@type': 'ImageObject',
              url: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
            },
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: SITE_CONFIG.url,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Privacy Policy',
                item: `${SITE_CONFIG.url}/privacy-policy`,
              },
            ],
          },
        }}
      />
      <PrivacyPolicy />
    </>
  )
}
