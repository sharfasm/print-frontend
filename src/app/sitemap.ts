import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/seo/constants'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://printvoz.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

async function fetchSitemapData() {
  try {
    const res = await fetch(`${API_URL}/seo/sitemap-data`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return { products: [], categories: [], subcategories: [], blogs: [] }
    return res.json()
  } catch {
    return { products: [], categories: [], subcategories: [], blogs: [] }
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products = [], categories = [], subcategories = [], blogs = [] } = await fetchSitemapData()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/bulk-order`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  const locationPages: MetadataRoute.Sitemap = SITE_CONFIG.locations.map((loc) => ({
    url: `${BASE_URL}/printing-service-${loc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const productPages: MetadataRoute.Sitemap = products.map((product: {
    slug: string
    updatedAt?: string
  }) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat: {
    slug: string
    updatedAt?: string
  }) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const subcategoryPages: MetadataRoute.Sitemap = subcategories.map((sub: {
    slug: string
    updatedAt?: string
  }) => ({
    url: `${BASE_URL}/category/${sub.slug}`,
    lastModified: sub.updatedAt ? new Date(sub.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const blogPages: MetadataRoute.Sitemap = blogs.map((b: {
    slug: string
    updatedAt?: string
  }) => ({
    url: `${BASE_URL}/blog/${b.slug}`,
    lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  return [
    ...staticPages,
    ...locationPages,
    ...categoryPages,
    ...subcategoryPages,
    ...productPages,
    ...blogPages,
  ]
}
