"use client";
import React, { useState } from 'react';
import ProductCard from '../ProductCard';
import { useShop } from '../../context/ShopContext';

interface LocationProductGridProps {
  products: any[];
}

export default function LocationProductGrid({ products }: LocationProductGridProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [cartSuccessId, setCartSuccessId] = useState<string | null>(null);

  const handleWishlistClick = (e: React.MouseEvent, prod: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(prod);
  };

  const handleCartClick = async (e: React.MouseEvent, prod: any) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(prod, 1, {});
      setCartSuccessId(prod._id);
      setTimeout(() => setCartSuccessId(null), 2000);
    } catch (err) {
      console.error("Failed to add product to cart:", err);
    }
  };

  if (!products || products.length === 0) {
    return <p className="text-center text-sm text-gray-500 py-6">No products available at this location currently.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
      {products.map((prod, idx) => (
        <ProductCard
          key={prod._id}
          prod={prod}
          index={idx}
          isWish={isInWishlist(prod._id)}
          cartSuccessId={cartSuccessId}
          onWishlistClick={handleWishlistClick}
          onCartClick={handleCartClick}
        />
      ))}
    </div>
  );
}
