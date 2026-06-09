import Link from 'next/link'
import JsonLd from './JsonLd'
import { generateBreadcrumbSchema } from '@/lib/seo/schemas'

interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const allItems = [{ name: 'Home', href: '/' }, ...items]

  const schemaItems = allItems.map((item) => ({
    name: item.name,
    url: item.href,
  }))

  return (
    <>
      <JsonLd schema={generateBreadcrumbSchema(schemaItems)} />
      <nav aria-label="Breadcrumb" className={className}>
        <ol
          className="flex items-center gap-1 text-sm"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {allItems.map((item, index) => (
            <li
              key={item.href}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center gap-1"
            >
              {index < allItems.length - 1 ? (
                <>
                  <Link
                    href={item.href}
                    itemProp="item"
                    className="hover:underline text-muted-foreground"
                  >
                    <span itemProp="name">{item.name}</span>
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              ) : (
                <span
                  itemProp="item"
                  aria-current="page"
                  className="text-foreground font-medium"
                >
                  <span itemProp="name">{item.name}</span>
                </span>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
