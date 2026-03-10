import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import config from '../brand/config';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, triggerAuthGuard } = useShop();
    const { isLoggedIn } = useAuth();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [categoryName, setCategoryName] = useState('Products');
    const [activeImage, setActiveImage] = useState(null);

    // Animation States
    const [isAdding, setIsAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    
    const sliderRef = useRef(null);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                // Fetch Product
                const response = await fetch(`${config.api}/${config.brand}/products/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                    setActiveImage(data.image);
                    
                    // Fetch categories to get the accurate display name for the breadcrumb
                    const catRes = await fetch(`${config.api}/${config.brand}/categories`);
                    if (catRes.ok) {
                        const categories = await catRes.json();
                        const matchingCat = categories.find(c => c._id === data.category);
                        if (matchingCat) setCategoryName(matchingCat.name);
                    }

                    // Fetch Related Products (same category)
                    const relatedRes = await fetch(`${config.api}/${config.brand}/products`);
                    if (relatedRes.ok) {
                        const allProducts = await relatedRes.json();
                        const related = allProducts
                            .filter(p => p.category === data.category && p._id !== data._id)
                            .slice(0, 10);
                        setRelatedProducts(related);
                    }

                } else {
                    setError("Product not found");
                }
            } catch (err) {
                console.error("Error fetching product details:", err);
                setError("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
        // Reset state when navigating to a new product
        window.scrollTo(0, 0);
        setQuantity(1);
        setActiveTab('description');
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-[var(--bg)]">
                <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col min-h-screen bg-[var(--bg)]">
                <div className="flex-1 flex flex-col justify-center items-center text-[var(--text)]">
                    <h2 className="text-2xl font-bold mb-4">{error || "Product not found"}</h2>
                    <Link to="/products" className="px-6 py-2 bg-[var(--primary)] text-white rounded-md hover:opacity-90 transition-opacity">
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-[var(--secondary)]/30'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    // Placeholder array for thumbnail gallery (assuming API only returns one image for now, generating 4 mock instances of it)
    const galleryImages = [
        product.image,
        product.image,
        product.image,
        product.image
    ];

    const handleAddToCart = () => {
        if (!isLoggedIn) {
            triggerAuthGuard("Login to build your shipping cart");
            return;
        }
        setIsAdding(true);
        // Premium artificial delay for feeling of work
        setTimeout(() => {
            addToCart(product, quantity);
            setIsAdding(false);
            setAdded(true);
            setTimeout(() => setAdded(false), 2500); // Revert back after 2.5s
        }, 600);
    };

    const handleBuyNow = () => {
        if (!isLoggedIn) {
            triggerAuthGuard("Login to proceed with your purchase");
            return;
        }
        setIsBuying(true);
        // Premium transition into checkout
        setTimeout(() => {
            navigate('/checkout', { state: { buyNowItem: { ...product, quantity, categoryName } } });
        }, 600);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[var(--bg)] font-sans text-[var(--text)]">
            
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6 md:pb-10 pt-28 md:pt-32">
                
                {/* Breakcrumb Section */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="text-sm flex items-center gap-3 opacity-80 font-medium whitespace-nowrap overflow-x-auto pb-2 sm:pb-0">
                        <Link to="/" className="hover:text-[var(--primary)] transition-colors">Home</Link>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        <Link to="/products" className="hover:text-[var(--primary)] transition-colors">Products</Link>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        <Link to="/products" state={{ categoryId: product?.category }} className="hover:text-[var(--primary)] transition-colors font-medium">
                            {categoryName}
                        </Link>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        <span className="text-[var(--text)] font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
                    </div>
                </div>

                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
                    
                    {/* Left: Product Images */}
                    <div className="flex flex-col gap-4">
                        {/* Main Image */}
                        <div className="aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 shadow-sm relative group">
                            <img 
                                src={activeImage} 
                                alt={product.name} 
                                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                            />
                            {product.isNew && (
                                <div className="absolute top-4 left-4 bg-[var(--primary)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                                    NEW
                                </div>
                            )}
                        </div>
                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-4 gap-4">
                            {galleryImages.map((img, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setActiveImage(img)}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[var(--primary)] shadow-md' : 'border-transparent hover:border-[var(--secondary)]/30 opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" alt={`${product.name} thumbnail ${i+1}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col pt-2 lg:pt-8">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary)] mb-3 inline-block">
                            {categoryName}
                        </span>
                        
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">{product.name}</h1>
                        
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--secondary)]/10">
                            {renderStars(product.rating || 5)}
                            <span className="text-sm font-semibold opacity-70">({product.reviews || 150} reviews)</span>
                        </div>
                        
                        <div className="mb-6 flex items-baseline gap-4">
                            <span className="text-4xl font-black text-[var(--primary)] drop-shadow-sm">₹{product.price}</span>
                            {/* Assumed comparison price */}
                            <span className="text-lg opacity-40 font-bold line-through">₹{Math.round(product.price * 1.3)}</span>
                        </div>

                        <div className="text-base opacity-75 leading-relaxed mb-8">
                            Bring your brand to life with our premium {product.name.toLowerCase()}. Made from top-quality {product.material || "materials"}, this product guarantees long-lasting vibrance and durability. Perfect for corporate gifting, personal use, or promotional events.
                        </div>

                        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-green-500/10 text-green-600 font-bold rounded-lg w-max text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            Availability: In Stock
                        </div>

                        {/* Quantity & Actions */}
                        <div className="space-y-4 mb-10">
                            <div className="flex gap-4 items-center">
                                <div className="h-14 flex items-center border-2 border-[var(--secondary)]/20 rounded-xl overflow-hidden w-36 bg-[var(--bg)] shadow-sm">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="flex-1 h-full flex items-center justify-center hover:bg-[var(--secondary)]/10 transition-colors font-bold text-xl pb-1"
                                    >-</button>
                                    <input 
                                        type="number" 
                                        readOnly 
                                        value={quantity} 
                                        className="w-12 h-full text-center bg-transparent border-none focus:ring-0 font-bold text-lg"
                                    />
                                    <button 
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="flex-1 h-full flex items-center justify-center hover:bg-[var(--secondary)]/10 transition-colors font-bold text-xl pb-1"
                                    >+</button>
                                </div>
                                <div className="text-sm font-bold opacity-60">Total: ₹{product.price * quantity}</div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={isAdding || added}
                                    className={`relative flex-1 h-14 border-2 font-bold rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-2 overflow-hidden group
                                        ${added 
                                            ? 'bg-green-500 border-green-500 text-white' 
                                            : 'bg-[var(--secondary)]/10 text-[var(--text)] border-[var(--secondary)]/20 hover:bg-[var(--secondary)]/20 hover:border-[var(--secondary)]/40 hover:-translate-y-0.5'
                                        }`}
                                >
                                    {isAdding ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-[var(--text)]/30 border-t-[var(--text)] rounded-full animate-spin"></div>
                                            <span>Adding...</span>
                                        </div>
                                    ) : added ? (
                                        <div className="flex items-center gap-2 animate-[pulse_0.5s_ease-in-out]">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            <span>Added to Cart</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="opacity-0">Add to Cart</span> {/* Spacing placeholder */}
                                            <span className="absolute">Add to Cart</span>
                                        </>
                                    )}
                                </button>
                                
                                <button 
                                    onClick={handleBuyNow}
                                    disabled={isBuying}
                                    className="relative flex-1 h-14 bg-[var(--primary)] text-[var(--bg)] font-black rounded-xl hover:opacity-95 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 shadow-xl shadow-[var(--primary)]/20 flex items-center justify-center gap-2 overflow-hidden group/buy"
                                >
                                    {/* Shimmer Effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover/buy:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                                    
                                    {isBuying ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-[var(--bg)]/30 border-t-[var(--bg)] rounded-full animate-spin"></div>
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="relative z-10 flex items-center gap-2 group-hover/buy:scale-105 transition-transform">
                                                Buy Now
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover/buy:translate-x-1 transition-transform">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                </svg>
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-[var(--secondary)]/5 p-6 rounded-2xl border border-[var(--secondary)]/10 flex items-start gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[var(--primary)] shrink-0 mt-0.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                            <div>
                                <h4 className="font-bold mb-1">Delivery Information</h4>
                                <p className="text-sm opacity-70">Free standard shipping on orders over ₹499. Orders are dispatched within 24-48 hours. Express delivery options available at checkout.</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mb-24 px-4 sm:px-0">
                    <div className="flex justify-center border-b border-[var(--secondary)]/20 mb-8">
                        <div className="flex gap-8 sm:gap-16 overflow-x-auto no-scrollbar">
                            {['description', 'specifications', 'reviews'].map((tab) => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-base sm:text-lg font-bold capitalize transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-[var(--primary)]' : 'opacity-50 hover:opacity-100'}`}
                                >
                                    {tab}
                                    {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-1 bg-[var(--primary)] rounded-t-lg"></span>}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="max-w-4xl mx-auto text-base sm:text-lg opacity-80 leading-relaxed min-h-[200px]">
                        {activeTab === 'description' && (
                            <div className="space-y-6">
                                <p>Discover the pinnacle of quality and elegant design with the {product.name}. This premium piece is crafted purposefully to integrate seamlessly into your daily life.</p>
                                <p>Each unit undergoes strict quality control checks throughout the manufacturing process. Unlike standard alternatives on the market, we utilize a proprietary blend of {product.material || "materials"} that provide both aesthetic appeal and long-term durability. </p>
                                <p>Whether you're treating yourself or looking for the perfect gift, the uncompromising build quality ensures this is a purchase you won't regret.</p>
                            </div>
                        )}
                        {activeTab === 'specifications' && (
                            <div className="bg-[var(--secondary)]/5 rounded-2xl border border-[var(--secondary)]/10 p-6 sm:p-10">
                                <ul className="space-y-4">
                                    <li className="flex sm:items-center flex-col sm:flex-row gap-2 border-b border-[var(--secondary)]/10 pb-4">
                                        <span className="min-w-[200px] font-bold opacity-100">Material Composition</span>
                                        <span>Premium {product.material || "Blend"}</span>
                                    </li>
                                    <li className="flex sm:items-center flex-col sm:flex-row gap-2 border-b border-[var(--secondary)]/10 pb-4">
                                        <span className="min-w-[200px] font-bold opacity-100">Dimensions</span>
                                        <span>Standard format (Refer to size guide)</span>
                                    </li>
                                    <li className="flex sm:items-center flex-col sm:flex-row gap-2 border-b border-[var(--secondary)]/10 pb-4">
                                        <span className="min-w-[200px] font-bold opacity-100">Weight</span>
                                        <span>Optimized for everyday use</span>
                                    </li>
                                    <li className="flex sm:items-center flex-col sm:flex-row gap-2">
                                        <span className="min-w-[200px] font-bold opacity-100">Care Instructions</span>
                                        <span>Wipe clean with a damp cloth. Do not use harsh chemicals.</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-6 mb-10 pb-10 border-b border-[var(--secondary)]/10">
                                    <div className="text-center">
                                        <div className="text-5xl font-black text-[var(--primary)] mb-2">4.8</div>
                                        {renderStars(5)}
                                        <div className="text-sm font-semibold opacity-60 mt-2">Based on {product.reviews || 150} reviews</div>
                                    </div>
                                    <div className="flex-1 max-w-sm border-l border-[var(--secondary)]/20 pl-6">
                                        <button className="w-full sm:w-auto bg-[var(--text)] text-[var(--bg)] font-bold px-8 py-3 rounded-xl hover:bg-[var(--primary)] hover:text-white transition-colors">
                                            Write a Review
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Mock Review */}
                                <div className="border border-[var(--secondary)]/10 p-6 rounded-2xl bg-[var(--secondary)]/5">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--bg)] font-bold text-lg">AJ</div>
                                        <div>
                                            <div className="font-bold">Alex Johnson</div>
                                            <div className="text-xs font-semibold opacity-50 flex items-center gap-2 uppercase tracking-wider">
                                                {renderStars(5)} Verified Buyer
                                            </div>
                                        </div>
                                    </div>
                                    <p className="font-medium text-[var(--text)]">"Absolutely phenomenal quality. The material feels incredible and it arrived much faster than expected. Highly recommended!"</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mb-10 pt-16 border-t border-[var(--secondary)]/20">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase mb-2">
                                    Related Products
                                </h2>
                                <p className="opacity-70 font-medium">You might also like these similar items.</p>
                            </div>
                        </div>

                        <div className="relative w-full group py-4">
                            
                            {/* Left Arrow */}
                            <button 
                                onClick={(e) => { e.preventDefault(); scroll('left'); }}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[var(--bg)] border border-[var(--secondary)]/20 text-[var(--text)] w-12 h-12 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 hover:bg-[var(--primary)] hover:text-white transition-all duration-300 disabled:opacity-0 -ml-4"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>

                            <div 
                                ref={sliderRef}
                                className="flex gap-6 sm:gap-8 overflow-x-auto scroll-smooth no-scrollbar px-2 pb-4"
                            >
                                {relatedProducts.map((related, index) => (
                                    <Link 
                                        key={related._id} 
                                        to={`/product/${related._id}`}
                                        className="w-64 sm:w-72 flex-shrink-0 flex flex-col bg-[var(--bg)] rounded-3xl overflow-hidden border border-[var(--secondary)]/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--secondary)]/5 p-4">
                                            <img 
                                                src={related.image} 
                                                alt={related.name}
                                                className="w-full h-full object-cover object-center rounded-2xl group-hover:scale-105 transition-transform duration-500 ease-out shadow-sm"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <div className="text-xs uppercase tracking-widest font-bold opacity-50 mb-1">{categoryName}</div>
                                            <h3 className="text-lg font-bold group-hover:text-[var(--primary)] transition-colors mb-2 truncate">
                                                {related.name}
                                            </h3>
                                            <div className="font-black text-lg">₹{related.price}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Right Arrow */}
                            <button 
                                onClick={(e) => { e.preventDefault(); scroll('right'); }}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[var(--bg)] border border-[var(--secondary)]/20 text-[var(--text)] w-12 h-12 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 hover:bg-[var(--primary)] hover:text-white transition-all duration-300 disabled:opacity-0 -mr-4"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

            </main>

            <Footer />
        </div>
    );
}
