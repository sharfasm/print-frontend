import React from 'react';
import Link from 'next/link';
import { resolveImage } from '../../lib/imageUtils';

interface RelatedCategoriesProps {
  parentCategory?: any;
  siblingCategories: any[];
  popularCategories: any[];
}

export default function RelatedCategories({
  parentCategory,
  siblingCategories = [],
  popularCategories = [],
}: RelatedCategoriesProps) {
  const hasSiblings = siblingCategories && siblingCategories.length > 0;
  const hasPopular = popularCategories && popularCategories.length > 0;

  if (!parentCategory && !hasSiblings && !hasPopular) return null;

  return (
    <section 
      id="category-related-links" 
      className="hidden w-full py-16 border-t border-[var(--secondary)]/20 bg-gradient-to-b from-[var(--secondary)]/5 to-transparent mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Parent Category Link */}
        {parentCategory && (
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider text-[var(--text)]/60 mb-4">
              Parent Category
            </h2>
            <div className="flex">
              <Link
                href={`/category/${parentCategory.slug || parentCategory._id}`}
                className="group relative px-6 py-4 rounded-xl border border-[var(--secondary)]/15 bg-[var(--bg)] hover:border-[var(--primary)] transition-all duration-300 shadow-sm flex items-center gap-4"
              >
                {parentCategory.image && (
                  <img
                    src={resolveImage(parentCategory.image)}
                    alt={parentCategory.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <span className="text-xs text-[var(--text)]/50 block font-semibold uppercase">Back to parent</span>
                  <span className="text-base font-black text-[var(--text)] uppercase tracking-wide group-hover:text-[var(--primary)] transition-colors">
                    {parentCategory.name}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Sibling Categories / Collections */}
        {hasSiblings && (
          <div>
            <h2 className="text-2xl font-serif font-black tracking-tight uppercase mb-6 text-[var(--text)]">
              Similar Collections
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {siblingCategories.slice(0, 4).map((cat) => {
                const imageUrl = resolveImage(cat.image);
                // Subcategories might not have slug directly, fallback to name format
                const slug = cat.slug || cat._id;
                // If it is a sibling subcategory, we link via parentCategory/subCategory
                // But for SEO listing, /category/:slug is mapped to unified lookups, so linking to /category/:slug is clean
                return (
                  <Link
                    key={cat._id}
                    href={`/category/${slug}`}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--secondary)]/15 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-[var(--secondary)]/10" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center z-20 p-4 text-center">
                      <h3 className="text-base font-black text-white uppercase tracking-wider drop-shadow-md">
                        {cat.name}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Popular Categories */}
        {hasPopular && (
          <div>
            <h2 className="text-2xl font-serif font-black tracking-tight uppercase mb-6 text-[var(--text)]">
              Popular Printing Services
            </h2>
            <div className="flex flex-wrap gap-3">
              {popularCategories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug || cat._id}`}
                  className="px-5 py-3 rounded-full border border-[var(--secondary)]/25 text-sm font-bold bg-[var(--bg)] hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all duration-200"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
