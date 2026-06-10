// @ts-nocheck
import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { generateOrganizationSchema, generateLocalBusinessSchema } from '@/lib/seo/schemas'
import About from '../../views/About'

export const metadata: Metadata = genMeta({
  title: 'About Printvoz — Premium Printing Services Kerala',
  description:
    'Learn about Printvoz, Kerala\'s trusted online printing service. Premium quality business cards, flex banners, brochures, and packaging with fast delivery across Kochi, Thrissur, Calicut, Trivandrum.',
  path: '/about',
  keywords: [
    'about Printvoz',
    'printing company Kerala',
    'Kerala printing history',
    'online printing about',
  ],
})

export default function AboutPage() {
  return (
    <>
      <JsonLd
        schema={[
          generateOrganizationSchema(),
          generateLocalBusinessSchema(),
        ]}
      />
      <About />
    </>
  )
}
