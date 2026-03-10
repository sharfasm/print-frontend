import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import config from '../brand/config';
import { useShop } from '../context/ShopContext';
import OurStory from './HomeUI/OurStory';
import CustomerReviews from './HomeUI/CustomerReviews';
import CategoryUI from './HomeUI/CategoryUI';
import BestSellers from './HomeUI/BestSellers';
import FeaturedCollection from './HomeUI/FeaturedCollection';
import AllProducts from './HomeUI/AllProducts';
import Footer from '../components/Footer';

export default function About() {
    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { brandInfo } = useShop();
    const brandName = brandInfo?.name || config.brand || "Brand";

    return (
        <div className="bg-[var(--bg)] min-h-screen flex flex-col pt-20">
            
            {/* 1. Breadcrumb (Navigation) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
                <nav className="flex text-sm font-medium text-[var(--text)]/60" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link to="/" className="hover:text-[var(--primary)] transition-colors">Home</Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="mx-2 text-[var(--text)]/40">/</span>
                                <span className="text-[var(--text)] font-semibold uppercase">Our {brandName}</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>

            {/* 2. Brand Hero Section (First Impression) */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
                <div className="absolute inset-4 sm:inset-6 lg:inset-8 z-0 rounded-[2.5rem] overflow-hidden">
                    <img 
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000" 
                        alt="Brand Lifestyle" 
                        className="w-full h-full object-cover object-bottom"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
                </div>
                
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in-up">
                    <div className="w-20 h-20 mx-auto bg-white text-black rounded-full flex items-center justify-center mb-6 shadow-2xl">
                        <span className="font-black text-xl tracking-tighter uppercase">{brandName}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight drop-shadow-2xl uppercase">
                        {brandName} <span className="text-[var(--primary)]">Store</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-white/90 max-w-2xl mx-auto drop-shadow mb-10">
                        Performance meets innovation. We build products for the modern lifestyle.
                    </p>
                    <Link to="/products" className="inline-block bg-[var(--primary)] text-white px-10 py-4 rounded-full font-bold tracking-wide hover:bg-white hover:text-black transition-all hover:scale-105 shadow-xl">
                        Shop Products
                    </Link>
                </div>
            </section>

            {/* 3. Brand Introduction */}
            <section className="py-20 bg-[var(--bg)] text-[var(--text)]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-sm font-black tracking-[0.2em] uppercase text-[var(--primary)] mb-6">About the Brand</h2>
                    <p className="text-2xl md:text-4xl font-semibold leading-relaxed mb-12 capitalize">
                        Founded in 2010, {brandName} focuses on high-quality products designed intuitively for modern lifestyles and daily adventures.
                    </p>
                </div>
            </section>

            {/* 4. Brand Story Section */}
            {/* The OurStory component acts nicely as the primary storytelling area */}
            <OurStory />

            {/* 5. Brand Highlights (Key Features) */}
            <section className="py-16 bg-[var(--text)] text-[var(--bg)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-[var(--bg)]/10 flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-1.81.588l1.246 5.373a.562.562 0 01-.826.591L12 17.521a.563.563 0 00-.518 0l-4.708 2.02a.562.562 0 01-.826-.59l1.246-5.372a.563.563 0 00-1.81-.588l-4.204-3.602c-.38-.325-.178-.948.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-lg mb-2">Premium Materials</h4>
                            <p className="opacity-70 text-sm">Sourced globally for durability.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-[var(--bg)]/10 flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-lg mb-2">Eco Friendly</h4>
                            <p className="opacity-70 text-sm">Sustainable manufacturing.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-[var(--bg)]/10 flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m4.352-7.875A11.901 11.901 0 0014.25 8.25H9.75M16.5 18.75V10.5m-9 0h6m-6 0h-3.375A1.125 1.125 0 002.25 11.625v2.625" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-lg mb-2">Fast Delivery</h4>
                            <p className="opacity-70 text-sm">Express global shipping.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-[var(--bg)]/10 flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-lg mb-2">Trusted Brand</h4>
                            <p className="opacity-70 text-sm">Loved by over 500k+ customers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Brand Categories Section */}
            <CategoryUI />
            
            {/* 7. Best Selling Products */}
            <BestSellers />
            
            {/* 8. Featured Collection */}
            <FeaturedCollection />

            {/* 9. Customer Reviews */}
            <CustomerReviews />
            
            {/* 10. Brand Gallery (Lifestyle Images) */}
            <section className="py-24 bg-[var(--bg)] text-[var(--text)] overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[var(--primary)] font-bold tracking-widest uppercase text-sm mb-4 block">Lifestyle</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                            The <span className="capitalize">{brandName}</span> Gallery.
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {/* Image 1 */}
                        <div className="col-span-2 row-span-2 rounded-[2rem] overflow-hidden shadow-xl group">
                            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" alt="Lifestyle 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        {/* Image 2 */}
                        <div className="rounded-3xl overflow-hidden shadow-lg group">
                            <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600" alt="Lifestyle 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 aspect-square" />
                        </div>
                        {/* Image 3 */}
                        <div className="rounded-3xl overflow-hidden shadow-lg group">
                            <img src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=600" alt="Lifestyle 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 aspect-square" />
                        </div>
                        {/* Image 4 */}
                        <div className="col-span-2 rounded-[2rem] overflow-hidden shadow-lg group">
                            <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200" alt="Lifestyle 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 aspect-[2/1]" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 11. Explore All Products */}
            <AllProducts />
            
            {/* 12. Footer */}
            <Footer />
        </div>
    );
}
