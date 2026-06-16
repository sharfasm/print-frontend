import React from 'react';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

interface ProductSEOContentProps {
  product: {
    name: string;
    seoContent?: string;
  };
}

export default function ProductSEOContent({ product }: ProductSEOContentProps) {
  if (!product.seoContent) return null;

  return (
    <section 
      id="product-seo-content" 
      className="w-full py-16 border-t border-[var(--secondary)]/20 bg-gradient-to-b from-[var(--secondary)]/5 to-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="prose prose-neutral dark:prose-invert max-w-none 
                     prose-headings:font-serif prose-headings:font-black prose-headings:tracking-tight 
                     prose-h2:text-3xl prose-h2:mb-6 prose-h2:text-[var(--text)]
                     prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-[var(--text)]/90
                     prose-p:text-base prose-p:leading-relaxed prose-p:opacity-85 prose-p:mb-6
                     prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
                     prose-li:text-base prose-li:opacity-85 prose-li:mb-2"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.seoContent) }}
        />
      </div>
    </section>
  );
}
