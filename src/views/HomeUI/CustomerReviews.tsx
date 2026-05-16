// @ts-nocheck
"use client";
import React, { useState } from 'react';

const reviews = [
    {
        id: 1,
        name: "Sarah Jenkins",
        location: "Mumbai, IND",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        rating: 5,
        text: "The quality of these products is simply unmatched. I was hesitant at first because of the price, but the moment I opened the box, I knew it was worth every penny. Excellent craftsmanship."
    },
    {
        id: 2,
        name: "David Chen",
        location: "Singapore",
        avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
        rating: 5,
        text: "I've been a loyal customer for two years now. Customer service is fantastic, shipping is fast, and the designs are always ahead of the curve. Highly recommended."
    },
    {
        id: 3,
        name: "Priya Sharma",
        location: "Delhi, IND",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        rating: 5,
        text: "Beautiful aesthetics. The attention to detail is visible not just in the product itself but also in the premium packaging. It felt like receiving a gift."
    },
    {
        id: 4,
        name: "Michael Ross",
        location: "London, UK",
        avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
        rating: 4,
        text: "Solid product. Looks exactly like the pictures. The wait was a bit longer than expected but the support team kept me updated throughout."
    }
];

export default function CustomerReviews() {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextReview = () => {
        setActiveIndex((prev) => (prev + 1) % reviews.length);
    };

    const prevReview = () => {
        setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-[var(--secondary)]/30'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <section className="py-24 bg-[var(--bg)] text-[var(--text)] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-3">
                            Hear from them
                        </h2>
                        <p className="text-lg opacity-70 font-medium max-w-xl">
                            Don't just take our word for it. Here is what our global community of customers have to say.
                        </p>
                    </div>
                </div>

                <div className="relative">
                    {/* Testimonial Slider */}
                    <div className="overflow-hidden bg-[var(--secondary)]/5 rounded-3xl p-8 md:p-16 border border-[var(--secondary)]/10 shadow-lg relative">
                        {/* Huge quote mark background */}
                        <div className="absolute -top-10 -left-6 text-[200px] text-[var(--secondary)]/10 font-serif leading-none select-none z-0">
                            &ldquo;
                        </div>
                        
                        <div className="relative z-10 min-h-[250px] flex flex-col justify-center">
                            <div className="transition-opacity duration-500 ease-in-out">
                                {renderStars(reviews[activeIndex].rating)}
                                <blockquote className="text-xl md:text-3xl font-medium leading-relaxed mb-8 italic">
                                    "{reviews[activeIndex].text}"
                                </blockquote>
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={reviews[activeIndex].avatar} 
                                        alt={reviews[activeIndex].name} 
                                        className="w-14 h-14 rounded-full border-2 border-[var(--primary)] object-cover"
                                    />
                                    <div>
                                        <div className="font-bold text-lg">{reviews[activeIndex].name}</div>
                                        <div className="text-sm opacity-60 uppercase tracking-widest">{reviews[activeIndex].location}</div>
                                    </div>
                                    
                                    {/* Verified Buyer Badge */}
                                    <div className="ml-auto flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-500/10 px-3 py-1.5 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                        </svg>
                                        VERIFIED
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-8 md:absolute md:top-1/2 md:-translate-y-1/2 md:right-0 md:mt-0 md:-mr-6 z-20 justify-end md:flex-col">
                        <button 
                            onClick={prevReview}
                            className="bg-[var(--bg)] border border-[var(--secondary)]/20 text-[var(--text)] w-12 h-12 rounded-full flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-all shadow-md group focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            aria-label="Previous Review"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button 
                            onClick={nextReview}
                            className="bg-[var(--bg)] border border-[var(--secondary)]/20 text-[var(--text)] w-12 h-12 rounded-full flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-all shadow-md group focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            aria-label="Next Review"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>

                    {/* Indicators */}
                    <div className="flex justify-center gap-2 mt-8 md:mt-12">
                        {reviews.map((_, i) => (
                            <button 
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'w-8 bg-[var(--primary)]' : 'w-2 bg-[var(--secondary)]/20 hover:bg-[var(--primary)]/50'}`}
                                aria-label={`Go to slide ${i+1}`}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
