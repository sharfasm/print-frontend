"use client";
import React, { useEffect, useRef, useState } from 'react';
import ProductCard from '../ProductCard';
import Reveal from '../Reveal';
import { useShop } from '../../context/ShopContext';

const STORAGE_KEY = 'recentlyViewedProducts';
const MAX_ITEMS = 12;

interface RecentlyViewedProps {
  product: any;
}

// Keep only the fields ProductCard needs so localStorage stays small.
function trimProduct(p: any) {
  if (!p || !p._id) return null;
  return {
    _id: p._id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    offerPrice: p.offerPrice,
    coverImage: p.coverImage,
    primaryImage: p.primaryImage,
    images: Array.isArray(p.images) ? p.images.slice(0, 1) : undefined,
    rating: p.rating,
    shortDescription: p.shortDescription,
    isBestSeller: p.isBestSeller,
    isNewArrival: p.isNewArrival,
    isFeatured: p.isFeatured,
    customizable: p.customizable,
  };
}

export default function RecentlyViewed({ product }: RecentlyViewedProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [items, setItems] = useState<any[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !product?._id) return;

    let stored: any[] = [];
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      stored = [];
    }
    if (!Array.isArray(stored)) stored = [];

    // Products viewed before this one (exclude the current product).
    // On a user's very first product visit this is empty, so nothing renders.
    const previous = stored.filter((p: any) => p && p._id !== product._id);
    setItems(previous);

    // Push the current product to the front for the next visit.
    const trimmed = trimProduct(product);
    if (trimmed) {
      const updated = [trimmed, ...previous].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        /* ignore quota errors */
      }
    }
  }, [product?._id]);

  if (!items.length) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCartClick = (e: React.MouseEvent, prod: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(prod, 1);
  };

  const handleWishlistClick = (e: React.MouseEvent, prod: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(prod);
  };

  return (
    <section
      id="recently-viewed-section"
      className="w-full py-16 border-t border-[var(--secondary)]/20"
    >
      <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight uppercase mb-2 text-[var(--text)]">
            Recently Viewed
          </h2>
          <p className="opacity-70 font-medium text-sm">
            Pick up where you left off — products you checked out recently.
          </p>
        </div>

        <div className="relative w-full group py-4">
          {/* Left Arrow */}
          <button
            onClick={(e) => { e.preventDefault(); scroll('left'); }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[var(--bg)] border border-[var(--secondary)]/20 text-[var(--text)] w-12 h-12 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 hover:bg-[var(--primary)] hover:text-white transition-all duration-300 disabled:opacity-0 -ml-4"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Scrollable track */}
          <div
            ref={sliderRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth no-scrollbar px-1 pb-4"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {items.map((prod, idx) => (
              <div key={prod._id} className="w-44 sm:w-56 flex-shrink-0">
                <ProductCard
                  prod={prod}
                  index={idx}
                  isWish={isInWishlist(prod._id)}
                  onWishlistClick={(e) => handleWishlistClick(e, prod)}
                  onCartClick={(e) => handleCartClick(e, prod)}
                />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={(e) => { e.preventDefault(); scroll('right'); }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[var(--bg)] border border-[var(--secondary)]/20 text-[var(--text)] w-12 h-12 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 hover:bg-[var(--primary)] hover:text-white transition-all duration-300 disabled:opacity-0 -mr-4"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </Reveal>
    </section>
  );
}
