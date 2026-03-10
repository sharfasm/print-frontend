import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import config from '../../brand/config';
import { useShop } from '../../context/ShopContext';

export default function BestSellers() {
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
                const response = await fetch(`${config.api}/${config.brand}/products`);
                if (response.ok) {
                    const data = await response.json();
                    // Fetch more products for the slider
                    const topProducts = data.sort((a, b) => b.rating - a.rating).slice(0, 10);
                    setProducts(topProducts);
                }
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        }
        return <div className="flex items-center gap-1">{stars}</div>;
    };

    if (loading) {
        return (
            <section className="py-16 bg-[var(--bg)] text-[var(--text)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-[var(--secondary)]/20 rounded w-1/4 mx-auto"></div>
                        <div className="h-4 bg-[var(--secondary)]/20 rounded w-1/3 mx-auto"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-[var(--secondary)]/10 rounded-2xl h-80"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!products.length) return null;

    return (
        <section className="py-20 bg-[var(--bg)] text-[var(--text)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 uppercase">
                        Best Sellers
                    </h2>
                    <p className="text-base sm:text-lg opacity-70 max-w-2xl mx-auto font-medium">
                        Most loved products by our customers. Premium quality guaranteed.
                    </p>
                    <hr className="w-24 h-1.5 mx-auto my-6 bg-[var(--primary)] border-0 rounded-full" />
                </div>

                <style>{`
                    @keyframes scrollBestSellers {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(calc(-50% - 1rem)); }
                    }
                    .animate-scroll-best {
                        animation: scrollBestSellers 40s linear infinite;
                    }
                    .animate-scroll-best:hover {
                        animation-play-state: paused;
                    }
                `}</style>

                {/* Slider */}
                <div className="relative w-full overflow-hidden py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mask-image-edges">
                    <div className="flex w-max animate-scroll-best gap-8">
                        {[...products, ...products].map((product, idx) => (
                            <Link 
                                to={`/product/${product._id}`} 
                                key={`${product._id}-${idx}`} 
                                className="w-[260px] sm:w-[300px] flex-shrink-0 group flex flex-col bg-[var(--bg)] rounded-2xl overflow-hidden border border-[var(--secondary)]/10 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--secondary)]/5">
                                    <img 
                                        src={product.image || "https://placehold.co/600x800?text=Product"} 
                                        alt={product.name}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                                    />
                                    {product.isNew && (
                                        <div className="absolute top-4 left-4 bg-[var(--primary)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                                            NEW
                                        </div>
                                    )}
                                    
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

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs uppercase tracking-wider font-semibold opacity-60 text-[var(--primary)]">
                                            {product.categoryName || 'PREMIUM'}
                                        </span>
                                        {renderStars(product.rating || 5)}
                                    </div>
                                    
                                    <div className="block mb-2">
                                        <h3 className="text-lg font-bold group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                                            {product.name}
                                        </h3>
                                    </div>

                                    <div className="mt-auto pt-4 flex items-center justify-between">
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
                    </div>
                </div>
            </div>
        </section>
    );
}
