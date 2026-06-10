// @ts-nocheck
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateCategoryMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { generateCollectionPageSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo/schemas'
import Products from '@/views/Products'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

async function getCategorySEO(slug: string) {
  try {
    const res = await fetch(`${API_URL}/seo/category/${slug}`, {
      next: { revalidate: 3600 },
    })
    if (res.ok) return res.json()
    return null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category: slug } = await params
  const seoData = await getCategorySEO(slug)
  if (!seoData) {
    return {
      title: 'Category Not Found | Printvoz',
      robots: { index: false, follow: false },
    }
  }
  const category = seoData.entity
  return generateCategoryMetadata({
    name: category.name,
    metaTitle: seoData.metaTitle,
    metaDescription: seoData.metaDescription,
    slug: category.slug || slug,
    description: seoData.metaDescription || category.bannerSubtitle,
  })
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: slug } = await params
  const seoData = await getCategorySEO(slug)

  if (!seoData) {
    notFound()
  }

  const category = seoData.entity

  const schemas = [
    generateCollectionPageSchema({
      name: category.name,
      description: seoData.metaDescription || category.bannerSubtitle || `Shop ${category.name} printing products from Printvoz Kerala`,
      slug: category.slug || slug,
      image: category.image,
    }),
    generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Products', url: '/products' },
      { name: category.name, url: `/category/${category.slug || slug}` },
    ]),
    ...(seoData.faqs?.length ? [generateFAQSchema(seoData.faqs)] : []),
  ]

  return (
    <>
      <JsonLd schema={schemas} />
      <Products initialCategory={category} initialSeoData={seoData} />
    </>
  )
}
