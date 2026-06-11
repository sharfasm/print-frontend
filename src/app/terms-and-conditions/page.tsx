// @ts-nocheck
import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { SITE_CONFIG } from '@/lib/seo/constants'
import TermsConditions from '@/views/TermsConditions'

export const metadata: Metadata = genMeta({
  title: 'Terms & Conditions | PrintVoz',
  description:
    'Read the official Terms & Conditions governing the use of PrintVoz products, services, custom printing solutions, orders, payments, and website features.',
  path: '/terms-and-conditions',
  keywords: [
    'terms and conditions',
    'PrintVoz terms',
    'custom printing terms',
    'artwork guidelines',
    'printing services Kerala terms',
    'order cancellation policy',
    'refund terms PrintVoz',
    'Intellectual property print',
  ],
})

export default function TermsAndConditionsPage() {
  return (
    <>
      {/* WebPage & Organization & Breadcrumb Schema */}
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Terms & Conditions — PrintVoz',
          description:
            'Read the official Terms & Conditions governing the use of PrintVoz products, services, custom printing solutions, orders, payments, and website features.',
          url: `${SITE_CONFIG.url}/terms-and-conditions`,
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
                name: 'Terms & Conditions',
                item: `${SITE_CONFIG.url}/terms-and-conditions`,
              },
            ],
          },
        }}
      />
      <TermsConditions />
    </>
  )
}
