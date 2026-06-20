// @ts-nocheck
"use client";
import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from '../context/ShopContext';
import { resolveImage } from '../lib/imageUtils';
import InlineAuthPrompt from '../components/InlineAuthPrompt';
import {
    Tag, Truck, Heart, Trash2, Minus, Plus, ShoppingBag,
    ChevronDown, ShieldCheck, ArrowLeft, ArrowRight, BadgeCheck
} from 'lucide-react';

// Indian-format currency, e.g. ₹2,994. Null-safe so a missing price never prints "₹NaN".
const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const FREE_SHIPPING_THRESHOLD = 999;

/**
 * A single cart line. Deliberately built as a COMPACT HORIZONTAL ROW at every
 * breakpoint (small fixed thumbnail + details), so the cart reads as a review
 * list — not as the product grid. All item-level actions live here.
 */
function CartLineItem({ item, updateCartQuantity, removeFromCart, onSaveForLater }) {
    const lineTotal = item.price * item.quantity;
    const category = typeof item.category === 'object'
        ? item.category?.name
        : (item.categoryName || 'Product');
    const href = `/product/${item.slug || item._id}`;

    return (
        <div className="group relative flex gap-3 sm:gap-5 bg-[var(--bg)] border border-[var(--secondary)]/10 rounded-2xl p-3 sm:p-4 hover:border-[var(--primary)]/30 hover:shadow-lg transition-all duration-300">
            {/* Thumbnail — small & fixed, never full-width */}
            <Link
                href={href}
                className="shrink-0 relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-[var(--secondary)]/5 border border-[var(--secondary)]/10"
            >
                <img
                    src={resolveImage(item.image)}
                    alt={item.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
            </Link>

            {/* Details */}
            <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <Link href={href} className="block">
                            <h3 className="text-sm sm:text-base font-bold leading-snug line-clamp-2 sm:line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
                                {item.name}
                            </h3>
                        </Link>
                        <p className="text-[11px] sm:text-xs opacity-50 font-semibold truncate mt-0.5">
                            {category}
                        </p>
                        <p className="hidden sm:flex items-center gap-1.5 text-xs opacity-70 font-medium mt-1.5">
                            <span>{fmt(item.price)} <span className="opacity-50">/ unit</span></span>
                            <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                                <BadgeCheck className="w-3.5 h-3.5" /> In stock
                            </span>
                        </p>
                    </div>

                    {/* Desktop / tablet action icons */}
                    <div className="shrink-0 hidden sm:flex items-center gap-1">
                        <button
                            onClick={() => onSaveForLater(item)}
                            title="Save for later"
                            aria-label="Save for later"
                            className="w-9 h-9 flex items-center justify-center rounded-full text-[var(--text)]/50 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
                        >
                            <Heart className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => removeFromCart(item._id)}
                            title="Remove from cart"
                            aria-label="Remove from cart"
                            className="w-9 h-9 flex items-center justify-center rounded-full text-[var(--text)]/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Bottom row: quantity stepper + line total */}
                <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center bg-[var(--secondary)]/5 border border-[var(--secondary)]/15 rounded-full">
                        <button
                            onClick={() =>
                                item.quantity <= 1
                                    ? removeFromCart(item._id)
                                    : updateCartQuantity(item._id, item.quantity - 1)
                            }
                            aria-label={item.quantity <= 1 ? 'Remove item' : 'Decrease quantity'}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--secondary)]/10 hover:text-[var(--primary)] transition-colors"
                        >
                            {item.quantity <= 1
                                ? <Trash2 className="w-3.5 h-3.5" />
                                : <Minus className="w-3.5 h-3.5" />}
                        </button>
                        <span className="w-9 text-center text-sm font-bold tabular-nums select-none">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--secondary)]/10 hover:text-[var(--primary)] transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="text-right leading-none">
                        <p className="hidden sm:block text-[10px] uppercase tracking-wider opacity-40 font-bold mb-1">Total</p>
                        <p className="text-sm sm:text-lg font-black text-[var(--text)]">{fmt(lineTotal)}</p>
                        {item.quantity > 1 && (
                            <p className="sm:hidden text-[10px] opacity-50 font-medium mt-0.5">{fmt(item.price)} each</p>
                        )}
                    </div>
                </div>

                {/* Mobile action row */}
                <div className="flex sm:hidden items-center gap-5 mt-2.5 pt-2.5 border-t border-[var(--secondary)]/10">
                    <button
                        onClick={() => onSaveForLater(item)}
                        className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors"
                    >
                        <Heart className="w-3.5 h-3.5" /> Save
                    </button>
                    <button
                        onClick={() => removeFromCart(item._id)}
                        className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-red-500/70 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                </div>
            </div>
        </div>
    );
}

/** Free-shipping progress — turns the hidden ₹999 threshold into a motivator. */
function FreeShippingBar({ cartTotal, qualifies }) {
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
    const pct = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

    return (
        <div className="bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2.5">
                <Truck className="w-4 h-4 text-[var(--primary)] shrink-0" />
                {qualifies ? (
                    <p className="text-xs sm:text-sm font-bold text-green-600 dark:text-green-400">
                        You've unlocked FREE shipping! 🎉
                    </p>
                ) : (
                    <p className="text-xs sm:text-sm font-semibold">
                        Add <span className="font-black text-[var(--primary)]">{fmt(remaining)}</span> more for FREE shipping
                    </p>
                )}
            </div>
            <div className="h-1.5 bg-[var(--secondary)]/15 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${qualifies ? 'bg-green-500' : 'bg-[var(--primary)]'}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

export default function Cart() {
    const {
        cart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
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

    // Guard: API/context can briefly yield a non-array — coerce to a safe list so a
    // bad/failed response can never crash the cart with `.map`/`.reduce is not a function`.
    const items = Array.isArray(cart) ? cart : [];
    const itemCount = items.reduce((a, c) => a + c.quantity, 0);
    const finalTotal = Math.max(0, cartTotal - couponDiscount);
    const qualifiesFreeShipping = freeShipping || cartTotal >= FREE_SHIPPING_THRESHOLD;

    // Move an item to the wishlist, then drop it from the cart. We only add to the
    // wishlist if it isn't already there (toggleWishlist would otherwise remove it).
    const handleSaveForLater = (item) => {
        if (!isInWishlist(item._id)) toggleWishlist(item);
        removeFromCart(item._id);
    };

    const handleClearCart = () => {
        if (typeof window !== 'undefined' && window.confirm('Remove all items from your cart?')) {
            clearCart();
        }
    };

    if (items.length === 0) {
        return (
            <section className="py-24 bg-[var(--bg)] text-[var(--text)] min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <InlineAuthPrompt
                        title="Save your cart to your account"
                        message="Items you add stay on this device. Log in to sync your cart and check out from anywhere."
                    />
                </div>
                <div className="flex flex-col items-center justify-center pt-8 px-4 text-center">
                    <div className="w-24 h-24 bg-[var(--secondary)]/10 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag className="w-10 h-10 opacity-50" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Your Cart is Empty</h2>
                    <p className="opacity-70 font-medium mb-8">Ready to print something amazing today?</p>
                    <Link href="/products" className="bg-[var(--primary)] text-[var(--bg)] font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
                        Start Shopping
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="py-10 md:py-16 lg:py-20 bg-[var(--bg)] text-[var(--text)] min-h-screen pb-32 lg:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate.back()}
                    className="mb-6 flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 hover:text-[var(--primary)] transition-all w-fit bg-[var(--secondary)]/5 px-4 py-2 rounded-lg border border-[var(--secondary)]/10"
                >
                    <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
                    Continue Shopping
                </button>

                {/* Title row */}
                <div className="flex items-end justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase">
                            Shopping Cart
                        </h1>
                        <p className="opacity-70 font-medium text-sm mt-1">
                            {itemCount} {itemCount === 1 ? 'item' : 'items'} ready for checkout
                        </p>
                    </div>
                    <button
                        onClick={handleClearCart}
                        className="shrink-0 text-xs font-bold uppercase tracking-wide text-red-500/70 hover:text-red-500 transition-colors py-2"
                    >
                        Clear all
                    </button>
                </div>

                <InlineAuthPrompt
                    title="You're shopping as a guest"
                    message="Your cart is saved on this device. Log in to sync it to your account and check out securely."
                />

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
                    {/* Cart Items List */}
                    <div className="flex-1 w-full min-w-0 space-y-4">
                        <FreeShippingBar cartTotal={cartTotal} qualifies={qualifiesFreeShipping} />

                        <div className="flex flex-col gap-3 sm:gap-4">
                            {items.map((item) => (
                                <CartLineItem
                                    key={item._id}
                                    item={item}
                                    updateCartQuantity={updateCartQuantity}
                                    removeFromCart={removeFromCart}
                                    onSaveForLater={handleSaveForLater}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-[380px] shrink-0">
                        <div className="bg-[var(--secondary)]/5 rounded-3xl p-6 sm:p-7 border border-[var(--secondary)]/10 lg:sticky lg:top-24">
                            <h3 className="text-xl font-black mb-5">Order Summary</h3>

                            {/* Collapsible Promo Code Section */}
                            <div className="mb-5 border-b border-[var(--secondary)]/10 pb-4">
                                <button
                                    onClick={() => setPromoExpanded(!promoExpanded)}
                                    className="w-full flex items-center justify-between text-sm font-bold text-[var(--text)] opacity-80 hover:opacity-100 py-1.5 transition-all cursor-pointer"
                                >
                                    <span className="flex items-center gap-2"><Tag className="w-4 h-4" /> Have a Promo Code?</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${promoExpanded ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                                </button>

                                {promoExpanded && !appliedCoupon && (
                                    <div className="mt-3 space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter code"
                                                value={couponInput}
                                                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                                className="flex-1 min-w-0 bg-[var(--bg)] px-4 py-2.5 rounded-xl border border-[var(--secondary)]/20 focus:border-[var(--primary)]/50 focus:outline-none font-mono text-sm font-bold uppercase tracking-wider"
                                            />
                                            <button
                                                onClick={() => {
                                                    if (couponInput.trim()) {
                                                        applyCouponCode(couponInput.trim());
                                                    }
                                                }}
                                                disabled={couponLoading || !couponInput.trim()}
                                                className="bg-[var(--primary)] text-[var(--bg)] px-5 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-50 cursor-pointer shrink-0"
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
                                        <div className="flex items-center gap-2 min-w-0">
                                            <Tag className="w-4 h-4 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold tracking-wider uppercase">Coupon Applied ✓</p>
                                                <p className="text-[10px] font-medium opacity-80 truncate">
                                                    {appliedCoupon.code} (−{fmt(couponDiscount)} saved)
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { removeCoupon(); setCouponInput(''); }}
                                            className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline px-2 py-1 transition-colors cursor-pointer shrink-0"
                                            title="Remove coupon"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3.5 mb-5">
                                <div className="flex justify-between text-sm text-[var(--text)] opacity-80 font-medium">
                                    <span>Subtotal ({itemCount} items)</span>
                                    <span>{fmt(cartTotal)}</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-medium">
                                        <span>Discount</span>
                                        <span>− {fmt(couponDiscount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm text-[var(--text)] opacity-80 font-medium">
                                    <span>Shipping</span>
                                    <span>
                                        {qualifiesFreeShipping ? (
                                            <span className="text-green-600 dark:text-green-400 font-bold uppercase tracking-wider text-xs">FREE</span>
                                        ) : (
                                            "Calculated at checkout"
                                        )}
                                    </span>
                                </div>
                                <hr className="border-[var(--secondary)]/10 !my-4" />
                                <div className="flex justify-between items-baseline text-lg md:text-xl font-black text-[var(--text)] tracking-tight">
                                    <span>Total</span>
                                    <span className="text-[var(--primary)]">{fmt(finalTotal)}</span>
                                </div>
                            </div>

                            {/* Desktop checkout (mobile uses the sticky bar below) */}
                            <button
                                onClick={() => navigate.push('/checkout')}
                                className="hidden lg:flex w-full items-center justify-center gap-2 bg-[var(--primary)] text-[var(--bg)] font-extrabold py-4 rounded-2xl shadow-xl hover:opacity-95 active:scale-[0.99] transition-all text-base uppercase tracking-wider cursor-pointer"
                            >
                                Proceed to Checkout <ArrowRight className="w-4 h-4" />
                            </button>
                            <div className="hidden lg:flex items-center justify-center gap-1.5 text-xs opacity-60 font-semibold tracking-wide mt-3">
                                <ShieldCheck className="w-4 h-4" /> Secure Checkout
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile / tablet sticky checkout bar — sits flush above the floating
                BottomNav (offset via --bottom-nav-space) so the two never overlap. */}
            <div
                className="lg:hidden fixed left-0 right-0 z-40 bg-[var(--bg)]/95 backdrop-blur-lg border-t border-[var(--secondary)]/15 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.10)]"
                style={{ bottom: 'var(--bottom-nav-space)' }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-2.5">
                        <div className="flex items-center gap-1.5 text-xs opacity-60 font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5" /> Secure · {itemCount} {itemCount === 1 ? 'item' : 'items'}
                        </div>
                        <div className="text-right leading-none">
                            <span className="block text-[10px] uppercase tracking-wider opacity-50 font-bold mb-0.5">Total</span>
                            <span className="text-xl font-black text-[var(--primary)]">{fmt(finalTotal)}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate.push('/checkout')}
                        className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] text-[var(--bg)] font-extrabold py-3.5 rounded-2xl shadow-lg active:scale-[0.99] transition-transform uppercase tracking-wider"
                    >
                        Proceed to Checkout <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}
