// @ts-nocheck
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateProductMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  generateProductSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo/schemas'

// Import the existing product page UI component UNCHANGED
import ProductDetails from '@/views/ProductDetails'

const API_URL = process.env.NEXT_PUBLIC_API_URL 

async function getProduct(slug: string) {
  try {
    // Try slug-based endpoint first
    const res = await fetch(`${API_URL}/products/slug/${slug}`, {
      next: { revalidate: 300 },
    })
    if (res.ok) return res.json()

    // Fallback: try treating slug as ID (backward compat during migration)
    const res2 = await fetch(`${API_URL}/products/${slug}`, {
      next: { revalidate: 300 },
    })
    if (res2.ok) return res2.json()

    return null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) {
    return {
      title: 'Product Not Found | Printvoz',
      robots: { index: false, follow: false },
    }
  }
  return generateProductMetadata(product)
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const schemas = [
    generateProductSchema(product),
    generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: product.category?.name || 'Products', url: '/products' },
      { name: product.name, url: `/product/${product.slug || slug}` },
    ]),
    ...(product.faqs?.length ? [generateFAQSchema(product.faqs)] : []),
  ]

  return (
    <>
      <JsonLd schema={schemas} />
      {/*
        Existing ProductDetails component renders completely unchanged.
        It still fetches its own data via useParams + useEffect internally.
        The JsonLd above ensures schemas are in the server-rendered HTML.
      */}
      <ProductDetails />
    </>
  )
}
