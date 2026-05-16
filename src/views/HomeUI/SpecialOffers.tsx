// @ts-nocheck
"use client";
import React from 'react';
import Link from "next/link";
;

export default function SpecialOffers() {
    return (
        <section className="py-24 bg-[var(--bg)] text-[var(--text)] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] min-h-[500px] flex items-center border border-[var(--secondary)]/10">
                    
                    {/* Background Image with subtle zoom effect */}
                    <img 
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600" 
                        alt="Special Offer" 
                        className="absolute inset-0 w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-[15s] ease-out brightness-90"
                    />

                    {/* Sophisticated Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent"></div>

                    {/* Content Area */}
                    <div className="relative z-10 w-full md:w-2/3 lg:w-1/2 p-10 md:p-16 lg:p-20 text-white">
                        <div className="animate-fade-in-up">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="h-[2px] w-12 bg-[var(--primary)]"></span>
                                <span className="text-xs font-black tracking-[0.3em] uppercase text-white/90">
                                    Limited Time Offer
                                </span>
                            </div>
                            
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.05] tracking-tight drop-shadow-lg">
                                Get 20% Off <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-white/90">Your First Order.</span>
                            </h2>
                            
                            <p className="text-lg md:text-xl text-white/70 font-medium mb-12 max-w-md leading-relaxed">
                                Join our community today and receive exclusive access to new drops, sales, and a special welcome discount.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <Link href="/products" className="group relative w-full sm:w-auto overflow-hidden rounded-full bg-white px-10 py-4 text-black text-center font-bold tracking-wide shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]">
                                    <span className="relative z-10 group-hover:text-black transition-colors duration-300">Shop the Sale</span>
                                    <div className="absolute inset-0 h-full w-full border-[2px] border-white rounded-full group-hover:scale-110 group-hover:opacity-0 transition-all duration-500 ease-out"></div>
                                </Link>
                                <div className="flex flex-col text-sm w-full sm:w-auto text-center sm:text-left mt-4 sm:mt-0">
                                    <span className="text-white/60 font-medium mb-1.5 uppercase tracking-widest text-[10px]">Use code at checkout</span>
                                    <span className="font-mono text-lg font-bold tracking-[0.1em] px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 select-all cursor-pointer hover:bg-white/20 transition-colors">WELCOME20</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Refined Rotating Badge */}
                    <div className="hidden lg:flex absolute right-32 top-1/2 -translate-y-1/2 justify-center items-center w-48 h-48 opacity-90 hover:opacity-100 transition-opacity duration-300">
                        {/* Circular Blur behind badge for pop effect */}
                        <div className="absolute inset-0 bg-[var(--primary)]/30 blur-3xl rounded-full scale-150"></div>
                        
                        <div className="relative w-full h-full animate-[spin_20s_linear_infinite]">
                            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-2xl">
                                <path id="badgeCurve" d="M 50 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="transparent" />
                                {/* Using exact font settings to ensure no overlapping */}
                                <text style={{fontSize: '10px', textTransform: 'uppercase', letterSpacing: '4px', fill: 'white', fontWeight: 900}} className="drop-shadow-md">
                                    <textPath href="#badgeCurve" startOffset="3%">
                                        PREMIUM QUALITY
                                    </textPath>
                                    <textPath href="#badgeCurve" startOffset="53%">
                                        EXCLUSIVE DESIGN
                                    </textPath>
                                </text>
                            </svg>
                        </div>
                        {/* Center Icon Element */}
                        <div className="absolute inset-x-0 inset-y-0 flex items-center justify-center pointer-events-none">
                            <div className="w-16 h-16 bg-white/10 text-white backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
