// @ts-nocheck
import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { SITE_CONFIG } from '@/lib/seo/constants'
import ShippingPolicy from '@/views/ShippingPolicy'

export const metadata: Metadata = genMeta({
  title: 'Shipping Policy | PrintVoz',
  description: 'Read the shipping and delivery policy of PrintVoz Kerala. Learn about standard and express delivery options, shipping times, and rates across Kochi, Kerala, and India.',
  path: '/shipping-policy',
  keywords: [
    'shipping policy',
    'PrintVoz shipping',
    'PrintVoz delivery',
    'printing delivery time',
    'express printing Kerala',
    'Kerala custom print delivery',
    'DTDC Speed Post delivery'
  ],
})

export default function ShippingPolicyPage() {
  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Shipping Policy — PrintVoz',
          description: 'Read the shipping and delivery policy of PrintVoz Kerala. Learn about standard and express delivery options, shipping times, and rates across Kochi, Kerala, and India.',
          url: `${SITE_CONFIG.url}/shipping-policy`,
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
                name: 'Shipping Policy',
                item: `${SITE_CONFIG.url}/shipping-policy`,
              },
            ],
          },
        }}
      />
      <ShippingPolicy />
    </>
  )
}
