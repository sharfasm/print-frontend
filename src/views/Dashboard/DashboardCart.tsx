// @ts-nocheck
"use client";
import React from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
;
import { useShop } from '../../context/ShopContext';
import { resolveImage } from '../../lib/imageUtils';

export default function DashboardCart() {
    const { cart, removeFromCart, updateCartQuantity, cartTotal } = useShop();
    const navigate = useRouter();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 uppercase">My Cart</h1>
            <p className="opacity-70 font-medium mb-10">Review your items before checkout.</p>

            {cart.length === 0 ? (
                <div className="bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-inner">
                    <div className="w-20 h-20 bg-[var(--secondary)]/10 rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 opacity-50">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight mb-2">Your Cart is Empty</h2>
                    <p className="opacity-70 font-medium mb-8">Ready to print something amazing today?</p>
                    <Link href="/products" className="bg-[var(--primary)] text-[var(--bg)] font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col xl:flex-row gap-8">
                    {/* Cart Items List */}
                        <div className="grid grid-cols-1 gap-4 md:gap-6">
                            {cart.map((item) => (
                                <div key={item._id} className="group flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-[var(--bg)] border border-[var(--secondary)]/10 p-3 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-300">
                                    <Link href={`/product/${item.slug || item._id}`} className="shrink-0 relative w-full aspect-square md:h-36 md:w-36 bg-[var(--secondary)]/5 rounded-xl md:rounded-2xl overflow-hidden block">
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
                                                className="text-red-500/80 hover:text-red-500 font-bold text-[10px] md:text-sm tracking-wider uppercase transition-colors py-1 flex items-center justify-center gap-1 bg-red-500/10 hover:bg-red-500/20 rounded-lg w-full md:w-auto px-3 py-1.5 md:py-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0">
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full xl:w-[320px] shrink-0">
                        <div className="bg-[var(--secondary)]/5 rounded-[2rem] p-6 border border-[var(--secondary)]/10 sticky top-24 shadow-sm">
                            <h3 className="text-xl font-black mb-6">Order Summary</h3>
                            
                            <div className="space-y-4 mb-6 text-sm">
                                <div className="flex justify-between opacity-80 font-medium">
                                    <span>Subtotal ({cart.reduce((a,c) => a + c.quantity, 0)} items)</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-[var(--primary)] font-medium">
                                    <span>Discount</span>
                                    <span>- ₹0</span>
                                </div>
                                <div className="flex justify-between opacity-80 font-medium">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <hr className="border-[var(--secondary)]/10 my-4" />
                                <div className="flex justify-between text-xl font-black">
                                    <span>Total</span>
                                    <span className="text-[var(--primary)]">₹{cartTotal}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate.push('/checkout')}
                                className="w-full bg-[var(--primary)] text-[var(--bg)] font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all mb-4"
                            >
                                Proceed to Checkout
                            </button>
                            <p className="text-center text-xs opacity-60 font-medium">Taxes and shipping computed at checkout. Secured Encrypted Connection.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
