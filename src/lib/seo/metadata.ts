import { Metadata } from 'next'
import { SITE_CONFIG, DEFAULT_KEYWORDS } from './constants'

interface GenerateMetadataOptions {
  title: string
  description: string
  path: string
  image?: string
  keywords?: string[]
  noIndex?: boolean
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
}

export function generateMetadata(options: GenerateMetadataOptions): Metadata {
  const {
    title,
    description,
    path,
    image,
    keywords = [],
    noIndex = false,
    type = 'website',
    publishedTime,
    modifiedTime,
  } = options

  const fullTitle = title.includes('Printvoz')
    ? title
    : `${title} | Printvoz`

  const canonicalUrl = `${SITE_CONFIG.url}${path}`
  const ogImage = image || SITE_CONFIG.ogImage

  return {
    title: fullTitle,
    description,
    keywords: [...DEFAULT_KEYWORDS, ...keywords].join(', '),

    alternates: {
      canonical: canonicalUrl,
    },

    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large' as const,
            'max-snippet': -1,
          },
        },

    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      type: type === 'article' ? 'article' : 'website',
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${SITE_CONFIG.url}${ogImage}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_IN',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },

    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${SITE_CONFIG.url}${ogImage}`],
      site: SITE_CONFIG.twitter,
    },
  }
}

// ── Product page metadata ──────────────────────────────────────────────────
export function generateProductMetadata(product: {
  name: string
  metaTitle?: string
  metaDescription?: string
  description?: string
  slug: string
  images?: string[]
  category?: string
  price?: number
  tags?: string[]
}): Metadata {
  const title = product.metaTitle || `${product.name} — Buy Online | Printvoz`
  const description =
    product.metaDescription ||
    `Buy ${product.name} online from Printvoz. Premium quality printing, fast delivery across Kerala. ${product.description?.slice(0, 100) || ''}`

  return generateMetadata({
    title,
    description,
    path: `/product/${product.slug}`,
    image: product.images?.[0],
    keywords: [
      product.name,
      `${product.name} printing`,
      `${product.name} Kerala`,
      `buy ${product.name} online`,
      ...(product.tags || []),
      product.category || '',
    ].filter(Boolean),
    type: 'product',
  })
}

// ── Category page metadata ─────────────────────────────────────────────────
export function generateCategoryMetadata(category: {
  name: string
  metaTitle?: string
  metaDescription?: string
  slug: string
  description?: string
}): Metadata {
  const title =
    category.metaTitle ||
    `${category.name} Printing Services Kerala | Printvoz`
  const description =
    category.metaDescription ||
    `Explore ${category.name} printing services from Printvoz Kerala. High quality, fast turnaround, bulk order discounts. Order online now.`

  return generateMetadata({
    title,
    description,
    path: `/category/${category.slug}`,
    keywords: [
      category.name,
      `${category.name} printing Kerala`,
      `${category.name} printing online`,
      `cheap ${category.name} printing`,
    ],
  })
}

// ── Blog/Article metadata ──────────────────────────────────────────────────
export function generateBlogMetadata(article: {
  title: string
  metaTitle?: string
  metaDescription?: string
  excerpt?: string
  slug: string
  coverImage?: string
  publishedAt?: string
  updatedAt?: string
  tags?: string[]
}): Metadata {
  return generateMetadata({
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt || article.title,
    path: `/blog/${article.slug}`,
    image: article.coverImage,
    keywords: article.tags || [],
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  })
}

// ── Location page metadata ─────────────────────────────────────────────────
export function generateLocationMetadata(city: string, slug: string): Metadata {
  return generateMetadata({
    title: `Printing Services in ${city} | Printvoz Kerala`,
    description: `Best printing services in ${city}, Kerala. Business cards, flex banners, brochures, packaging and more. Same-day printing available. Order online from Printvoz.`,
    path: `/printing-service-${slug}`,
    keywords: [
      `printing services ${city}`,
      `printing shop ${city}`,
      `online printing ${city}`,
      `business cards ${city}`,
      `flex printing ${city}`,
      `${city} printing company`,
    ],
  })
}
