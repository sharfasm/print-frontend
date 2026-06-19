// @ts-nocheck
import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/schemas'
import { resolveImage } from '@/lib/imageUtils'
import Contact from '../../views/Contact'
import { logPrefetchFailure } from '@/lib/prefetch'

const API_URL = process.env.NEXT_PUBLIC_API_URL 

async function getContactPage() {
  try {
    const res = await fetch(`${API_URL}/contact-page`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    logPrefetchFailure('contact page', err)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getContactPage()
  
  const seoData = data?.seo || {}
  const advancedSeoData = data?.advancedSeo || {}

  const title = seoData.metaTitle || 'Contact Printvoz — Get in Touch'
  const description =
    seoData.metaDescription ||
    'Contact Printvoz for printing services in Kerala. Reach us for business cards, banners, brochures, bulk orders, and custom printing queries. Fast response guaranteed.'
  const path = seoData.canonicalPath || '/contact'
  const image = seoData.ogImage ? resolveImage(seoData.ogImage) : undefined
  const keywords = seoData.keywords?.length
    ? seoData.keywords
    : [
        'contact Printvoz',
        'printing services contact Kerala',
        'printing company phone number',
        'printing service near me',
      ]

  return genMeta({
    title,
    description,
    path,
    image,
    keywords,
    robots: advancedSeoData.robotsDirective || 'index, follow',
  })
}

export default async function ContactPage() {
  const data = await getContactPage()

  const schemas = [
    generateOrganizationSchema(),
    generateLocalBusinessSchema(),
    generateBreadcrumbSchema([{ name: 'Contact', url: '/contact' }]),
    // Custom inline ContactPage schema
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      '@id': `https://printvoz.com/contact/#webpage`,
      url: `https://printvoz.com/contact`,
      name: data?.seo?.metaTitle || 'Contact Printvoz — Get in Touch',
      description: data?.seo?.metaDescription || 'Contact Printvoz for printing services in Kerala.',
    }
  ]

  if (data?.faqPreview?.status === 'published' && data.faqPreview.items?.length) {
    schemas.push(
      generateFAQSchema(
        data.faqPreview.items.map((f) => ({ question: f.question, answer: f.answer }))
      )
    )
  }

  return (
    <>
      <JsonLd schema={schemas} />
      <Contact initialData={data} />
    </>
  )
}
