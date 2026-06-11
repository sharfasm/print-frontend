// @ts-nocheck
import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { SITE_CONFIG } from '@/lib/seo/constants'
import RefundPolicy from '@/views/RefundPolicy'

export const metadata: Metadata = genMeta({
  title: 'Refund Policy | PrintVoz',
  description: 'Learn about PrintVoz refund eligibility, replacement policies, damaged orders, cancellations, custom printing refunds, and customer support procedures.',
  path: '/refund-policy',
  keywords: [
    'refund policy',
    'PrintVoz refund',
    'custom printing refund',
    'replacement policy',
    'damaged printing order refund',
    'order cancellation policy',
    'Kerala printing service refunds'
  ],
})

export default function RefundPolicyPage() {
  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Refund Policy — PrintVoz',
          description: 'Learn about PrintVoz refund eligibility, replacement policies, damaged orders, cancellations, custom printing refunds, and customer support procedures.',
          url: `${SITE_CONFIG.url}/refund-policy`,
          dateModified: '2026-06-11',
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
                name: 'Refund Policy',
                item: `${SITE_CONFIG.url}/refund-policy`,
              },
            ],
          },
        }}
      />
      <RefundPolicy />
    </>
  )
}

