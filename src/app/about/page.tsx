// @ts-nocheck
import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateFAQSchema,
} from '@/lib/seo/schemas'
import { resolveImage } from '@/lib/imageUtils'
import About from '../../views/About'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

async function getAboutPage() {
  try {
    const res = await fetch(`${API_URL}/about-page`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.error('Failed to prefetch about page on server:', err)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getAboutPage()
  return genMeta({
    title: data?.seo?.metaTitle || 'About Printvoz — Printing Ideas Into Reality',
    description:
      data?.seo?.metaDescription ||
      'Printvoz is a modern printing and branding platform delivering premium business printing, custom merchandise, packaging and large-format solutions across India.',
    path: data?.seo?.canonicalPath || '/about',
    image: data?.seo?.ogImage ? resolveImage(data.seo.ogImage) : undefined,
    keywords: data?.seo?.keywords?.length
      ? data.seo.keywords
      : ['about Printvoz', 'printing company India', 'custom printing', 'business printing solutions'],
  })
}

export default async function AboutPage() {
  const data = await getAboutPage()

  const schemas = [generateOrganizationSchema(), generateLocalBusinessSchema()]
  if (data?.faq?.status === 'published' && data.faq.items?.length) {
    schemas.push(
      generateFAQSchema(
        data.faq.items.map((f) => ({ question: f.question, answer: f.answer }))
      )
    )
  }

  return (
    <>
      <JsonLd schema={schemas} />
      <About initialData={data} />
    </>
  )
}
