// @ts-nocheck
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
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

interface PageProps {
  params: Promise<{ category: string; subcategory: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: catSlug, subcategory: subSlug } = await params
  const seoData = await getCategorySEO(subSlug)

  if (!seoData) {
    return {
      title: 'Page Not Found | Printvoz',
      robots: { index: false, follow: false },
    }
  }

  const subcategory = seoData.entity
  const category = seoData.parentCategory || { name: 'Category' }

  const title = seoData.metaTitle || `${subcategory.name} Printing Services | ${category.name} | Printvoz`
  const description =
    seoData.metaDescription ||
    `Explore ${subcategory.name} printing under ${category.name} from Printvoz. High quality, custom options, fast delivery in Kerala.`

  return genMeta({
    title,
    description,
    path: `/category/${catSlug}/${subSlug}`,
    keywords: [
      subcategory.name,
      `${subcategory.name} printing`,
      `${subcategory.name} Kerala`,
      category.name,
    ],
  })
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { category: catSlug, subcategory: subSlug } = await params
  const seoData = await getCategorySEO(subSlug)

  if (!seoData) {
    notFound()
  }

  const subcategory = seoData.entity
  const category = seoData.parentCategory || { name: 'Category', slug: catSlug }

  const schemas = [
    generateCollectionPageSchema({
      name: `${subcategory.name} — ${category.name}`,
      description: seoData.metaDescription || subcategory.description || `Shop ${subcategory.name} printing products under ${category.name} from Printvoz Kerala`,
      slug: `${catSlug}/${subSlug}`,
      image: subcategory.image || category.image,
    }),
    generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Products', url: '/products' },
      { name: category.name, url: `/category/${category.slug || catSlug}` },
      { name: subcategory.name, url: `/category/${category.slug || catSlug}/${subSlug}` },
    ]),
    ...(seoData.faqs?.length ? [generateFAQSchema(seoData.faqs)] : []),
  ]

  return (
    <>
      <JsonLd schema={schemas} />
      <Products 
        initialCategory={category} 
        initialSubcategory={subcategory} 
        initialSeoData={seoData} 
      />
    </>
  )
}
