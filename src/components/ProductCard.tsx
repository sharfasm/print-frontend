"use client";
import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, ShoppingBag, ShieldCheck, Flame, Sparkles, TrendingUp, Palette, Check } from 'lucide-react';
import { resolveImage } from '../lib/imageUtils';

interface ProductCardProps {
  prod: any;
  index: number;
  isWish: boolean;
  cartSuccessId?: string | null;
  onWishlistClick: (e: React.MouseEvent, prod: any) => void;
  onCartClick: (e: React.MouseEvent, prod: any) => void;
}

const ProductCard = memo(({ 
  prod, 
  index, 
  isWish, 
  cartSuccessId,
  onWishlistClick, 
  onCartClick 
}: ProductCardProps) => {
  // Badge logic
  let badgeText: string | null = null;
  let badgeIcon: React.ReactNode = null;
  let badgeClass = '';
  if (prod.isBestSeller) {
    badgeText = "Best Seller";
    badgeIcon = <Flame size={9} className="shrink-0" />;
    badgeClass = 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
  } else if (prod.isNewArrival) {
    badgeText = "New";
    badgeIcon = <Sparkles size={9} className="shrink-0" />;
    badgeClass = 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
  } else if (prod.isFeatured) {
    badgeText = "Trending";
    badgeIcon = <TrendingUp size={9} className="shrink-0" />;
    badgeClass = 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
  } else if (prod.customizable) {
    badgeText = "Custom";
    badgeIcon = <Palette size={9} className="shrink-0" />;
    badgeClass = 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
  }

  const hasDiscount = prod.offerPrice && prod.offerPrice < prod.price;
  const discountPercent = hasDiscount ? Math.round(((prod.price - prod.offerPrice) / prod.price) * 100) : 0;
  const displayPrice = hasDiscount ? prod.offerPrice : prod.price;
  const imageUrl = resolveImage(prod.coverImage || prod.primaryImage || (prod.images && prod.images[0]));

  return (
    <Link 
      href={`/product/${prod.slug || prod._id}`}
      className="animate-product-enter group bg-white dark:bg-[#1a2526] rounded-2xl border border-[var(--secondary)]/10 hover:border-[var(--secondary)]/25 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-out overflow-hidden flex flex-col h-full cursor-pointer relative"
      style={{ animationDelay: `${(index % 8) * 50}ms` }}
    >
      {/* ===== IMAGE ===== */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-[#121A1B]">
        <Image 
          src={imageUrl}
          alt={prod.name}
          width={350}
          height={350}
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        
        {/* Subtle bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-10 product-image-overlay pointer-events-none" />
        
        {/* Desktop hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none hidden sm:block" />

        {/* Badge */}
        {badgeText && (
          <span className={`absolute top-1.5 left-1.5 ${badgeClass} px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold uppercase tracking-wide z-20 shadow-sm flex items-center gap-0.5`}>
            {badgeIcon}
            {badgeText}
          </span>
        )}

        {/* Discount badge */}
        {hasDiscount && discountPercent > 0 && (
          <span className="absolute top-1.5 right-9 sm:right-9 discount-badge px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] z-20 shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
        
        {/* Wishlist */}
        <button 
          onClick={(e) => onWishlistClick(e, prod)}
          className={`absolute top-1.5 right-1.5 w-7 h-7 sm:w-8 sm:h-8 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm transition-all duration-200 z-20
            ${isWish 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white/90 dark:bg-black/50 text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-white'
            }
            active:scale-90
          `}
          title={isWish ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={13} fill={isWish ? "currentColor" : "none"} strokeWidth={2.5} />
        </button>
      </div>
      
      {/* ===== CONTENT ===== */}
      <div className="p-2 sm:p-2.5 flex flex-col flex-grow">
        {/* Product Name */}
        <h3 className="text-[10px] sm:text-[11px] font-semibold text-[var(--text)] line-clamp-2 leading-tight group-hover:text-[var(--primary)] transition-colors">
          {prod.name}
        </h3>
        
        {/* Price Section */}
        <div className="mt-1 flex items-baseline gap-1 flex-wrap">
          <span className="text-[13px] sm:text-sm font-extrabold text-[var(--text)]">
            ₹{displayPrice}
          </span>
          {hasDiscount && (
            <>
              <span className="text-[9px] sm:text-[10px] font-medium text-gray-400 line-through">
                ₹{prod.price}
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                {discountPercent}% off
              </span>
            </>
          )}
        </div>

        {/* Trust Badge */}
        <div className="mt-1">
          <span className="trust-badge inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[7px] sm:text-[8px] font-bold">
            <ShieldCheck size={8} className="shrink-0" />
            Assured
          </span>
        </div>
        
        {/* Bottom: Rating + Cart */}
        <div className="mt-auto flex items-end justify-between gap-1.5 pt-1.5 border-t border-[var(--secondary)]/5 mt-1.5">
          <span className="inline-flex items-center gap-0.5 bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold">
            {prod.rating || "4.5"}
            <Star size={7} className="fill-white stroke-white" />
          </span>
          
          <button 
            onClick={(e) => onCartClick(e, prod)}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 active:scale-90 ${
              cartSuccessId === prod._id 
                ? 'bg-emerald-600 text-white scale-105' 
                : 'bg-[var(--primary)] text-white hover:opacity-90'
            }`}
            title="Add to Cart"
          >
            {cartSuccessId === prod._id ? (
              <Check size={12} className="text-white" />
            ) : (
              <ShoppingBag size={11} className="text-white" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
