// @ts-nocheck
import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { generateLocalBusinessSchema } from '@/lib/seo/schemas'
import Contact from '../../views/Contact'

export const metadata: Metadata = genMeta({
  title: 'Contact Printvoz — Get in Touch',
  description:
    'Contact Printvoz for printing services in Kerala. Reach us for business cards, banners, brochures, bulk orders, and custom printing queries. Fast response guaranteed.',
  path: '/contact',
  keywords: [
    'contact Printvoz',
    'printing services contact Kerala',
    'printing company phone number',
    'printing service near me',
  ],
})

export default function ContactPage() {
  return (
    <>
      <JsonLd schema={generateLocalBusinessSchema()} />
      <Contact />
    </>
  )
}
