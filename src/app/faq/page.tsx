// @ts-nocheck
import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas'
import config from '@/brand/config'
import Footer from '@/components/Footer'
import HelpCenter from '@/views/HelpCenter/HelpCenter'

export const metadata: Metadata = genMeta({
  title: 'Help Center & FAQ — PrintVoz Customer Support',
  description:
    'Find answers about orders, custom printing, products, payments, shipping, refunds and bulk orders. Search the PrintVoz Help Center, ask a question, or contact our support team.',
  path: '/faq',
  keywords: [
    'PrintVoz help center',
    'PrintVoz FAQ',
    'printing support Kerala',
    'order status printing',
    'bulk order printing quote',
    'printing refund policy',
  ],
})

// Strip HTML so the FAQ schema text stays clean
const stripHtml = (html = '') =>
  String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

async function fetchJson(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default async function FAQPage() {
  const [hero, categories, faqs, popularSearches] = await Promise.all([
    fetchJson(`${config.api}/help/hero`),
    fetchJson(`${config.api}/help/categories`),
    fetchJson(`${config.api}/help/faqs`),
    fetchJson(`${config.api}/help/popular-searches`),
  ])

  const faqList = Array.isArray(faqs) ? faqs : []

  const faqSchema = generateFAQSchema(
    faqList.slice(0, 50).map((f: any) => ({
      question: f.question,
      answer: stripHtml(f.answer),
    }))
  )

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Help Center', url: '/faq' },
  ])

  return (
    <>
      <JsonLd schema={[faqSchema, breadcrumbSchema]} />
      <HelpCenter
        initialHero={hero || null}
        initialCategories={Array.isArray(categories) ? categories : []}
        initialFaqs={faqList}
        initialPopularSearches={Array.isArray(popularSearches) ? popularSearches : []}
      />
      <Footer />
    </>
  )
}

