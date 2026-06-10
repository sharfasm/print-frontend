import { SITE_CONFIG } from './constants'

const BASE_URL = SITE_CONFIG.url

// ── Organization ────────────────────────────────────────────────────────────
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: SITE_CONFIG.business.name,
    legalName: SITE_CONFIG.business.legalName,
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}${SITE_CONFIG.logo}`,
      width: 200,
      height: 60,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.business.phone,
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Malayalam'],
    },
    address: {
      '@type': 'PostalAddress',
      ...SITE_CONFIG.business.address,
    },
    sameAs: Object.values(SITE_CONFIG.social).filter(Boolean),
  }
}

// ── LocalBusiness ────────────────────────────────────────────────────────────
export function generateLocalBusinessSchema(city?: string) {
  const b = SITE_CONFIG.business
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#localbusiness`,
    name: city ? `Printvoz — Printing Services ${city}` : b.name,
    description: SITE_CONFIG.description,
    url: BASE_URL,
    telephone: b.phone,
    email: b.email,
    priceRange: b.priceRange,
    address: {
      '@type': 'PostalAddress',
      ...b.address,
      ...(city ? { addressLocality: city } : {}),
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: b.geo.latitude,
      longitude: b.geo.longitude,
    },
    openingHoursSpecification: b.openingHours.map((hours) => {
      const [days, time] = hours.split(' ')
      const [opens, closes] = time.split('-')
      const dayMap: Record<string, string[]> = {
        'Mo-Sa': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      }
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayMap[days] || [days],
        opens,
        closes,
      }
    }),
    image: `${BASE_URL}${SITE_CONFIG.ogImage}`,
    logo: `${BASE_URL}${SITE_CONFIG.logo}`,
  }
}

// ── Website + SearchAction ───────────────────────────────────────────────────
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.tagline,
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-IN',
  }
}

// ── Breadcrumb ───────────────────────────────────────────────────────────────
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  }
}

// ── Product ──────────────────────────────────────────────────────────────────
export function generateProductSchema(product: {
  name: string
  description?: string
  slug: string
  images?: string[]
  price?: number
  currency?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  sku?: string
  brand?: string
  averageRating?: number
  reviewCount?: number
  category?: string
  faqs?: { question: string; answer: string }[]
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} — Premium quality printing from Printvoz Kerala`,
    url: `${BASE_URL}/product/${product.slug}`,
    image: product.images?.map((img) =>
      img.startsWith('http') ? img : `${BASE_URL}${img}`
    ) || [`${BASE_URL}${SITE_CONFIG.ogImage}`],
    brand: {
      '@type': 'Brand',
      name: product.brand || SITE_CONFIG.name,
    },
    ...(product.sku && { sku: product.sku }),
    ...(product.category && { category: product.category }),
  }

  if (product.price) {
    schema.offers = {
      '@type': 'Offer',
      url: `${BASE_URL}/product/${product.slug}`,
      priceCurrency: product.currency || 'INR',
      price: product.price,
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
    }
  }

  if (product.averageRating && product.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  if (product.faqs && product.faqs.length > 0) {
    schema.subjectOf = {
      '@type': 'FAQPage',
      mainEntity: product.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    }
  }

  return schema
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// ── Article / Blog ────────────────────────────────────────────────────────────
export function generateArticleSchema(article: {
  title: string
  description: string
  slug: string
  coverImage?: string
  publishedAt?: string
  updatedAt?: string
  author?: { name: string; image?: string; bio?: string }
  tags?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: `${BASE_URL}/blog/${article.slug}`,
    image: article.coverImage
      ? [article.coverImage.startsWith('http') ? article.coverImage : `${BASE_URL}${article.coverImage}`]
      : [`${BASE_URL}${SITE_CONFIG.ogImage}`],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author?.name || 'Printvoz Team',
      ...(article.author?.image && { image: article.author.image }),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}${SITE_CONFIG.logo}`,
      },
    },
    keywords: article.tags?.join(', '),
    inLanguage: 'en-IN',
  }
}

// ── CollectionPage (Category) ─────────────────────────────────────────────────
export function generateCollectionPageSchema(category: {
  name: string
  description?: string
  slug: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} — Printvoz`,
    description: category.description || `Shop ${category.name} printing products from Printvoz Kerala`,
    url: `${BASE_URL}/category/${category.slug}`,
    image: category.image || `${BASE_URL}${SITE_CONFIG.ogImage}`,
    isPartOf: {
      '@id': `${BASE_URL}/#website`,
    },
  }
}
