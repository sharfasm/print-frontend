// @ts-nocheck
import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { generateCollectionPageSchema } from '@/lib/seo/schemas'
import Products from '../../views/Products'

export const metadata: Metadata = genMeta({
  title: 'All Printing Products — Shop Online | Printvoz Kerala',
  description:
    'Browse all printing products from Printvoz Kerala. Business cards, flex banners, brochures, leaflets, packaging, stickers, custom gifts and more. Order online with fast delivery.',
  path: '/products',
  keywords: [
    'printing products Kerala',
    'online printing shop',
    'all printing products',
    'buy printing products online',
    'custom printing products',
  ],
})

export default function ProductsPage() {
  return (
    <>
      <JsonLd
        schema={generateCollectionPageSchema({
          name: 'All Products',
          description: 'Browse all printing products from Printvoz Kerala. Business cards, banners, brochures, packaging and more.',
          slug: 'products',
        })}
      />
      <Products />
    </>
  )
}
