// @ts-nocheck
"use client";
import React, { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { Tag, Copy, Check, Calendar, AlertCircle } from 'lucide-react';

export default function ExclusiveOffers() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    useEffect(() => {
        const fetchActiveCoupons = async () => {
            try {
                const response = await api.get('/coupons/active');
                setCoupons(response.data);
            } catch (error) {
                console.error("Error fetching active coupons:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchActiveCoupons();
    }, []);

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    if (loading) {
        return (
            <section className="py-16 bg-[var(--bg)] text-[var(--text)] flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
            </section>
        );
    }

    if (coupons.length === 0) {
        return null; // Don't render anything if there are no active homepage coupons
    }

    return (
        <section className="py-24 bg-[var(--bg)] text-[var(--text)] relative overflow-hidden">
            {/* Ambient Background Decorative elements */}
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[var(--secondary)]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-black tracking-widest uppercase mb-4 border border-[var(--primary)]/10">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Exclusive Promos</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">
                        Active Deals & Coupons
                    </h2>
                    <p className="max-w-xl mx-auto opacity-70 font-medium text-sm sm:text-base leading-relaxed">
                        Claim these special discount codes at checkout to unlock ultimate savings on your custom print orders.
                    </p>
                </div>

                {/* Coupons Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {coupons.map((coupon) => (
                        <div 
                            key={coupon._id}
                            className="group relative rounded-[2rem] p-8 bg-[var(--bg)]/50 backdrop-blur-xl border border-[var(--secondary)]/10 hover:border-[var(--primary)]/30 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                        >
                            {/* Accent edge highlight */}
                            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div>
                                {/* Type Badge */}
                                <div className="flex justify-between items-start mb-6">
                                    <span className="px-3 py-1 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-black uppercase tracking-wider">
                                        {coupon.type} Offer
                                    </span>
                                    {coupon.expiryDate && (
                                        <div className="flex items-center gap-1.5 opacity-60 text-xs font-medium">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>Expires soon</span>
                                        </div>
                                    )}
                                </div>

                                {/* Discount Title */}
                                <h3 className="text-3xl font-black mb-2 tracking-tight">
                                    {coupon.discountType === 'percentage' ? (
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--text)]">
                                            {coupon.discountValue}% OFF
                                        </span>
                                    ) : coupon.discountType === 'flat' ? (
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--text)]">
                                            ₹{coupon.discountValue} OFF
                                        </span>
                                    ) : (
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--text)]">
                                            FREE SHIPPING
                                        </span>
                                    )}
                                </h3>

                                {/* Description */}
                                <p className="opacity-80 text-sm font-medium mb-6 leading-relaxed">
                                    {coupon.description || `Get discounts on print items using coupon ${coupon.code}`}
                                </p>

                                {/* Minimum Amount requirement & Terms */}
                                <div className="space-y-2 mb-8">
                                    {coupon.minimumAmount > 0 && (
                                        <div className="flex items-center gap-2 opacity-60 text-xs font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></div>
                                            <span>Min. Order Value: ₹{coupon.minimumAmount}</span>
                                        </div>
                                    )}
                                    {coupon.firstOrderOnly && (
                                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-medium">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            <span>First order only</span>
                                        </div>
                                    )}
                                    {coupon.maxDiscount && (
                                        <div className="flex items-center gap-2 opacity-60 text-xs font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></div>
                                            <span>Max. Discount Value: ₹{coupon.maxDiscount}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Coupon Code copy bar */}
                            <div className="mt-auto flex items-center justify-between gap-4 p-2 bg-[var(--secondary)]/5 hover:bg-[var(--secondary)]/10 border border-[var(--secondary)]/10 rounded-2xl transition-colors">
                                <span className="font-mono text-base font-bold tracking-[0.15em] pl-3 select-all uppercase">
                                    {coupon.code}
                                </span>
                                <button
                                    onClick={() => handleCopyCode(coupon.code)}
                                    className={`p-3.5 rounded-xl transition-all flex items-center justify-center ${
                                        copiedCode === coupon.code
                                            ? 'bg-green-600 text-white'
                                            : 'bg-[var(--primary)] text-[var(--bg)] hover:opacity-90 active:scale-95'
                                    }`}
                                >
                                    {copiedCode === coupon.code ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
