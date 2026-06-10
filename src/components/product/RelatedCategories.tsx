import React from 'react';
import Link from 'next/link';
import { resolveImage } from '../../lib/imageUtils';

interface RelatedCategoriesProps {
  categories: any[];
}

export default function RelatedCategories({ categories }: RelatedCategoriesProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section 
      id="related-categories-section" 
      className="hidden w-full py-16 border-t border-[var(--secondary)]/20 bg-gradient-to-b from-[var(--secondary)]/5 to-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight uppercase mb-2 text-[var(--text)]">
          Related Categories
        </h2>
        <p className="opacity-70 font-medium mb-10 text-sm">
          Browse related collections and print options.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const imageUrl = resolveImage(category.image);
            return (
              <Link
                key={category._id}
                href={`/category/${category.slug || category._id}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--secondary)]/15 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--secondary)]/10" />
                )}
                <div className="absolute inset-0 flex items-center justify-center z-20 p-4 text-center">
                  <h3 className="text-lg font-black text-white uppercase tracking-wider drop-shadow-md">
                    {category.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
