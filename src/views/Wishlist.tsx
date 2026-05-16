// @ts-nocheck
"use client";
import React from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
;
import { useShop } from '../context/ShopContext';
import { resolveImage } from '../lib/imageUtils';

export default function Wishlist() {
    const { wishlist, removeFromWishlist, moveWishlistToCart } = useShop();
    const navigate = useRouter();

    if (wishlist.length === 0) {
        return (
            <section className="py-24 bg-[var(--bg)] text-[var(--text)] min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-500/50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Your Wishlist is Empty</h2>
                <p className="opacity-70 font-medium mb-8">Save your favorite styles for later.</p>
                <Link href="/products" className="bg-[var(--primary)] text-[var(--bg)] font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
                    Explore Products
                </Link>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-24 bg-[var(--bg)] text-[var(--text)] min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button 
                    onClick={() => navigate.back()} 
                    className="mb-8 flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 hover:text-[var(--primary)] transition-all w-fit bg-[var(--secondary)]/5 px-4 py-2 rounded-lg border border-[var(--secondary)]/10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back to Previous Page
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-2">My Wishlist</h1>
                        <p className="opacity-70 font-medium">({wishlist.length} saved {wishlist.length === 1 ? 'item' : 'items'})</p>
                    </div>
                </div>

                {/* Grid Matches the New Arrivals style for visual consistency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {wishlist.map((item) => (
                        <div key={item._id} className="group relative flex flex-col w-full max-w-[300px] mx-auto sm:max-w-none">
                            <Link href={`/product/${item._id}`} className="block relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--secondary)]/5 mb-4 group-hover:shadow-xl transition-all duration-300">
                                <img 
                                    src={resolveImage(item.image)} 
                                    alt={item.name}
                                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                />
                                {/* Remove Icon Overlay */}
                                <button 
                                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm z-10"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromWishlist(item._id); }}
                                    title="Remove from Wishlist"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </Link>

                            <div className="flex flex-col flex-1 pl-1">
                                <span className="text-xs font-medium text-[var(--primary)] opacity-80 uppercase tracking-widest mb-1 block">
                                    {typeof item.category === 'object' ? item.category?.name : (item.categoryName || 'Product')}
                                </span>
                                <Link href={`/product/${item._id}`} className="block mb-auto">
                                    <h3 className="text-lg font-bold line-clamp-2 hover:text-[var(--primary)] transition-colors">
                                        {item.name}
                                    </h3>
                                </Link>
                                <div className="mt-4 flex flex-col gap-3">
                                    <span className="text-xl font-extrabold">₹{item.price}</span>
                                    {/* Action Button */}
                                    <button 
                                        className="w-full bg-[var(--primary)] text-[var(--bg)] font-bold py-3 rounded-xl shadow-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                        onClick={(e) => { e.preventDefault(); moveWishlistToCart(item); }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                        Move to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
