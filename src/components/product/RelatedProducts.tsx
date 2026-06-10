"use client";
import React from 'react';
import ProductCard from '../ProductCard';
import { useShop } from '../../context/ShopContext';

interface RelatedProductsProps {
  products: any[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  if (!products || products.length === 0) return null;

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
      id="related-products-section" 
      className="w-full py-16 border-t border-[var(--secondary)]/20 bg-gradient-to-b from-transparent to-[var(--secondary)]/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight uppercase mb-2 text-[var(--text)]">
          Related Products
        </h2>
        <p className="opacity-70 font-medium mb-10 text-sm">
          Explore similar high-quality custom printing options.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product, idx) => (
            <div key={product._id} className="h-full">
              <ProductCard
                prod={product}
                index={idx}
                isWish={isInWishlist(product._id)}
                onWishlistClick={(e) => handleWishlistClick(e, product)}
                onCartClick={(e) => handleCartClick(e, product)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
