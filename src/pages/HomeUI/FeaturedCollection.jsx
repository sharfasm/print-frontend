import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import config from '../../brand/config';

export default function FeaturedCollection() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${config.api}/${config.brand}/categories`);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.filter(c => c.isActive).slice(0, 4)); // Get exactly 4
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return null;
    if (categories.length < 4) return null; // Fallback if not enough data

    return (
        <section className="py-24 bg-[var(--bg)] text-[var(--text)] border-t border-[var(--secondary)]/10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section Matches New Arrivals */}
                <div className="text-center mb-16 flex flex-col items-center">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-4">
                        Shop By Category
                    </h2>
                    <p className="text-base sm:text-lg opacity-70 font-medium max-w-2xl mx-auto">
                        Explore our premium printing collections customized specifically for your professional brand and personal needs.
                    </p>
                    <hr className="w-24 h-1.5 mx-auto my-6 bg-[var(--primary)] border-0 rounded-full" />
                    
                    <Link to="/products" className="group inline-flex items-center font-bold text-[var(--primary)] hover:opacity-80 transition-opacity mt-2">
                        View All Collections
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    </Link>
                </div>

                {/* New Premium Design: 2x2 Masonry Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {/* Left Column (Large Image) */}
                    <div className="flex flex-col gap-4 lg:gap-6">
                        <Link 
                            to={`/products?category=${categories[0]._id}`} 
                            className="group relative rounded-3xl overflow-hidden h-[400px] md:h-[600px] block shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            <img 
                                src={categories[0].image} 
                                alt={categories[0].name}
                                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-8 h-1/2 flex flex-col justify-end bg-gradient-to-t from-black via-black/50 to-transparent">
                                <h3 className="text-3xl md:text-5xl font-black text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-500">{categories[0].name}</h3>
                                <p className="text-white/80 max-w-sm mb-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">{categories[0].description}</p>
                                <span className="text-[var(--primary)] font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                                    Shop Collection <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Right Column (1 Top Hero, 2 Bottom Squares) */}
                    <div className="flex flex-col gap-4 lg:gap-6">
                        {/* Top Hero */}
                        <Link 
                            to={`/products?category=${categories[1]._id}`} 
                            className="group relative rounded-3xl overflow-hidden h-[250px] md:h-[300px] block shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            <img 
                                src={categories[1].image} 
                                alt={categories[1].name}
                                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-8 h-full flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-2">{categories[1].name}</h3>
                                <span className="text-[var(--primary)] font-bold uppercase tracking-widest text-sm flex items-center gap-2 group-hover:text-white transition-colors">
                                    Shop Collection <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
                                </span>
                            </div>
                        </Link>

                        {/* Bottom 2 Squares */}
                        <div className="grid grid-cols-2 gap-4 lg:gap-6 flex-1 h-[250px] md:h-auto">
                            {categories.slice(2, 4).map((category, idx) => (
                                <Link 
                                    to={`/products?category=${category._id}`} 
                                    key={category._id}
                                    className="group relative rounded-3xl overflow-hidden block shadow-sm hover:shadow-2xl transition-all duration-500"
                                >
                                    <img 
                                        src={category.image} 
                                        alt={category.name}
                                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
                                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/90 to-transparent h-2/3">
                                        <h3 className="text-xl md:text-2xl font-black text-white mb-1 group-hover:-translate-y-1 transition-transform">{category.name}</h3>
                                        <span className="text-white/70 text-xs uppercase tracking-wider font-bold group-hover:text-[var(--primary)] transition-colors">
                                            Explore &rarr;
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
