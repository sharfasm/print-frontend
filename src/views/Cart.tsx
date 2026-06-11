// @ts-nocheck
"use client";
import React from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
;
import { useShop } from '../context/ShopContext';
import { resolveImage } from '../lib/imageUtils';

import { useState } from 'react';
import { Tag, X, HelpCircle, Truck } from 'lucide-react';

export default function Cart() {
    const { 
        cart, 
        removeFromCart, 
        updateCartQuantity, 
        cartTotal,
        appliedCoupon,
        couponDiscount,
        freeShipping,
        couponError,
        couponLoading,
        applyCouponCode,
        removeCoupon
    } = useShop();
    const navigate = useRouter();
    const [couponInput, setCouponInput] = useState('');
    const [promoExpanded, setPromoExpanded] = useState(false);

    if (cart.length === 0) {
        return (
            <section className="py-24 bg-[var(--bg)] text-[var(--text)] min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-[var(--secondary)]/10 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 opacity-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Your Cart is Empty</h2>
                <p className="opacity-70 font-medium mb-8">Ready to print something amazing today?</p>
                <Link href="/products" className="bg-[var(--primary)] text-[var(--bg)] font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
                    Start Shopping
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
                    Continue Shopping
                </button>

                <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-2">Shopping Cart</h1>
                <p className="opacity-70 font-medium mb-12">Review your items before checkout.</p>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Cart Items List */}
                    <div className="flex-1 overflow-hidden">
                        <div className="grid grid-cols-1 gap-4 md:gap-6">
                            {cart.map((item) => (
                                <div key={item._id} className="group flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-[var(--bg)] border border-[var(--secondary)]/10 p-3 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300">
                                    <Link href={`/product/${item.slug || item._id}`} className="shrink-0 relative w-full aspect-square md:h-40 md:w-40 bg-[var(--secondary)]/5 rounded-xl md:rounded-2xl overflow-hidden block">
                                        <img src={resolveImage(item.image)} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                                    </Link>
                                    
                                    <div className="flex-1 flex flex-col w-full text-left">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm md:text-xl font-bold line-clamp-1 group-hover:text-[var(--primary)] transition-colors">{item.name}</h3>
                                                <p className="text-[10px] md:text-sm opacity-60 font-semibold truncate mt-0.5">{typeof item.category === 'object' ? item.category?.name : (item.categoryName || 'Product')}</p>
                                            </div>
                                            <span className="text-sm md:text-xl font-black text-[var(--primary)] mt-1 md:mt-0 shrink-0">₹{item.price}</span>
                                        </div>

                                        <div className="mt-auto pt-2.5 md:pt-4 flex flex-col md:flex-row md:items-center justify-between border-t border-[var(--secondary)]/10 gap-2.5 w-full">
                                            {/* Quantity Stepper */}
                                            <div className="flex items-center justify-between w-full md:w-auto gap-2 md:gap-4 bg-[var(--secondary)]/5 rounded-full px-2.5 py-1 md:px-4 md:py-2 border border-[var(--secondary)]/10">
                                                <button 
                                                    onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                                                    className="w-4 h-4 md:w-6 md:h-6 flex items-center justify-center font-black text-xs md:text-base hover:text-[var(--primary)] transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="font-bold w-4 text-center text-xs md:text-base">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                                                    className="w-4 h-4 md:w-6 md:h-6 flex items-center justify-center font-black text-xs md:text-base hover:text-[var(--primary)] transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Delete Button */}
                                            <button 
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-red-500/70 hover:text-red-500 font-bold text-[10px] md:text-sm tracking-wider uppercase transition-colors py-1 text-center w-full md:w-auto"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-[var(--secondary)]/5 rounded-[2rem] p-8 border border-[var(--secondary)]/10 sticky top-24">
                            <h3 className="text-2xl font-black mb-6">Order Summary</h3>

                            {/* Collapsible Promo Code Section */}
                            <div className="mb-6 border-b border-[var(--secondary)]/10 pb-4">
                                <button 
                                    onClick={() => setPromoExpanded(!promoExpanded)} 
                                    className="w-full flex items-center justify-between text-sm font-bold text-[var(--text)] opacity-80 hover:opacity-100 py-2 transition-all cursor-pointer"
                                >
                                    <span>Have a Promo Code?</span>
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        strokeWidth={2.5} 
                                        stroke="currentColor" 
                                        className={`w-4 h-4 transition-transform duration-200 ${promoExpanded ? 'rotate-180' : ''}`}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                                
                                {promoExpanded && !appliedCoupon && (
                                    <div className="mt-3 space-y-2">
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                placeholder="Enter code" 
                                                value={couponInput}
                                                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                                className="flex-1 bg-[var(--bg)] px-4 py-2.5 rounded-xl border border-[var(--secondary)]/20 focus:border-[var(--primary)]/50 focus:outline-none font-mono text-sm font-bold uppercase tracking-wider"
                                            />
                                            <button 
                                                onClick={() => {
                                                    if (couponInput.trim()) {
                                                        applyCouponCode(couponInput.trim());
                                                    }
                                                }}
                                                disabled={couponLoading || !couponInput.trim()}
                                                className="bg-[var(--primary)] text-[var(--bg)] px-5 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-50 cursor-pointer"
                                            >
                                                {couponLoading ? "Applying..." : "Apply"}
                                            </button>
                                        </div>
                                        {couponError && (
                                            <p className="text-red-500 text-xs font-semibold flex items-center gap-1">
                                                <span>⚠️</span> {couponError}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {appliedCoupon && (
                                    <div className="mt-3 flex items-center justify-between bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 p-3.5 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4" />
                                            <div>
                                                <p className="text-xs font-bold tracking-wider uppercase flex items-center gap-1">
                                                    Coupon Applied ✓
                                                </p>
                                                <p className="text-[10px] font-medium opacity-80">
                                                    Code: {appliedCoupon.code} (-₹{couponDiscount} Saved)
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                removeCoupon();
                                                setCouponInput('');
                                            }}
                                            className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline px-2 py-1 transition-colors cursor-pointer"
                                            title="Remove coupon"
                                        >
                                            Remove Coupon
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm text-[var(--text)] opacity-80 font-medium">
                                    <span>Subtotal ({cart.reduce((a,c) => a + c.quantity, 0)} items)</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-medium">
                                    <span>Discount</span>
                                    <span>- ₹{couponDiscount || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm text-[var(--text)] opacity-80 font-medium">
                                    <span>Shipping</span>
                                    <span>
                                        {freeShipping || cartTotal >= 999 ? (
                                            <span className="text-green-600 dark:text-green-400 font-bold uppercase tracking-wider text-xs">
                                                FREE
                                            </span>
                                        ) : (
                                            "Calculated at checkout"
                                        )}
                                    </span>
                                </div>
                                <hr className="border-[var(--secondary)]/10 my-4" />
                                <div className="flex justify-between text-xl md:text-2xl font-black text-[var(--text)] tracking-tight">
                                    <span>Total</span>
                                    <span className="text-[var(--primary)]">₹{Math.max(0, cartTotal - couponDiscount)}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate.push('/checkout')}
                                className="w-full bg-[var(--primary)] text-[var(--bg)] font-extrabold py-4 rounded-2xl shadow-xl hover:opacity-95 active:scale-[0.99] transition-all mb-4 text-lg uppercase tracking-wider cursor-pointer"
                            >
                                Proceed to Checkout
                            </button>
                            <div className="flex items-center justify-center gap-1.5 text-xs opacity-60 font-semibold tracking-wide mt-2">
                                <span>🔒</span>
                                <span>Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
