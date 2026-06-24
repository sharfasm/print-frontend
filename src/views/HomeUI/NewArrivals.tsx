// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import config from '../../brand/config';
import { useShop } from '../../context/ShopContext';
import { resolveImage } from '../../lib/imageUtils';
import api from '../../lib/axios';
import AutoScrollRail from '../../components/AutoScrollRail';

export default function NewArrivals() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, toggleWishlist, isInWishlist } = useShop();
    const [animatingCart, setAnimatingCart] = useState({});
    const [animatingWishlist, setAnimatingWishlist] = useState({});

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        setAnimatingCart(prev => ({ ...prev, [product._id]: true }));
        setTimeout(() => setAnimatingCart(prev => ({ ...prev, [product._id]: false })), 500);
    };

    const handleToggleWishlist = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
        setAnimatingWishlist(prev => ({ ...prev, [product._id]: true }));
        setTimeout(() => setAnimatingWishlist(prev => ({ ...prev, [product._id]: false })), 500);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                const data = response.data;
                // Fetch more products for the slider
                const newProducts = data.filter(p => p.isNew).slice(0, 10);
                
                // If not enough "isNew", just pull the first ones to fill the row
                if (newProducts.length < 10) {
                    const filler = data.filter(p => !p.isNew).slice(0, 10 - newProducts.length);
                    setProducts([...newProducts, ...filler]);
                } else {
                    setProducts(newProducts);
                }
            } catch (err) {
                console.error("Failed to fetch new arrivals:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return null; // Or a skeleton loader
    if (!products.length) return null;

    return (
        <section className="py-20 bg-[var(--bg)] text-[var(--text)] border-t border-[var(--secondary)]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-12 flex flex-col items-center">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-4">
                        New Arrivals
                    </h2>
                    <p className="text-base sm:text-lg opacity-70 font-medium max-w-2xl mx-auto">
                        Be the first to explore our latest premium drops. Fresh designs, unmatched quality.
                    </p>
                    <hr className="w-24 h-1.5 mx-auto my-6 bg-[var(--primary)] border-0 rounded-full" />
                    
                    <Link href="/products" className="group inline-flex items-center font-bold text-[var(--primary)] hover:opacity-80 transition-opacity mt-2">
                        View All Collection
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    </Link>
                </div>

                {/* Products Slider — auto-scrolls, drag/swipe to scroll, arrows to step */}
                <AutoScrollRail ariaLabel="New arrivals">
                    {[...products, ...products].map((product, idx) => (
                            <Link 
                                href={`/product/${product.slug || product._id}`} 
                                key={`${product._id}-${idx}`} 
                                className="w-[260px] sm:w-[300px] flex-shrink-0 group relative flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--secondary)]/5 mb-4 group-hover:shadow-xl transition-shadow duration-300 flex-shrink-0">
                                    <img 
                                        src={resolveImage(product.coverImage || product.primaryImage || (product.images && product.images[0]))} 
                                        alt={product.name}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                    />
                                    {/* Wishlist Heart Icon */}
                                    <button 
                                        className={`absolute top-4 right-4 w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all shadow-sm z-10 pointer-events-auto
                                            ${isInWishlist(product._id) ? 'bg-red-50 text-red-500' : 'bg-white/80 text-[var(--text)] hover:text-red-500 hover:bg-white'}
                                            ${animatingWishlist[product._id] ? 'scale-125 bg-red-100' : ''}
                                        `}
                                        onClick={(e) => handleToggleWishlist(e, product)}
                                        title={isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isInWishlist(product._id) ? "currentColor" : "none"} strokeWidth={2} stroke="currentColor" className="w-5 h-5 transition-transform duration-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="flex flex-col flex-1 pl-1">
                                    <span className="text-xs font-medium text-[var(--primary)] opacity-80 uppercase tracking-widest mb-1 block">
                                        {typeof product.category === 'object' ? product.category?.name : (product.categoryName || 'New Collection')}
                                    </span>
                                    <div className="block mb-auto">
                                        <h3 className="text-lg font-bold line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="mt-1 text-[11px] font-medium leading-snug text-[var(--text)] opacity-60 line-clamp-1">
                                            {product.shortDescription || "Premium bespoke custom printing."}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm opacity-50 line-through">₹{Math.round(product.price * 1.3)}</span>
                                            <span className="text-xl font-extrabold text-[var(--primary)]">₹{product.price}</span>
                                        </div>
                                        {/* Cart Icon */}
                                        <button 
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all focus:outline-none pointer-events-auto shrink-0
                                                ${animatingCart[product._id] ? 'bg-green-500 text-white scale-110 shadow-lg' : 'bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 hover:bg-[var(--primary)] hover:text-white group-hover:border-transparent'}
                                            `}
                                            onClick={(e) => handleAddToCart(e, product)}
                                            title="Add to Cart"
                                        >
                                            {animatingCart[product._id] ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                </AutoScrollRail>
            </div>
        </section>
    );
}
