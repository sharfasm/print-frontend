// @ts-nocheck
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import config from '../brand/config';
import { resolveImage } from '../lib/imageUtils';
import { useForm, FormProvider } from 'react-hook-form';
import { DynamicFormRenderer } from '../components/DynamicFormRenderer';
import { ChevronDown, ChevronUp, Edit3, Tag, Truck, Copy, Check } from 'lucide-react';
import api from '../lib/axios';
import CustomizationModal from '../components/CustomizationModal';
import { io } from 'socket.io-client';
import ProductFAQ from '../components/product/ProductFAQ';
import RelatedCategories from '../components/product/RelatedCategories';
import RecentlyViewed from '../components/product/RecentlyViewed';
import CategoryUI from './HomeUI/CategoryUI';
import Reveal from '../components/Reveal';

export default function ProductDetails() {
    const params = useParams();
    const slug = params.slug || params.id;
    const navigate = useRouter();
    const { addToCart, triggerAuthGuard, setBuyNowItem } = useShop();
    const { isLoggedIn } = useAuth();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [categoryName, setCategoryName] = useState('Products');
    const [activeImage, setActiveImage] = useState(null);
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [customizationFields, setCustomizationFields] = useState([]);
    const [subcategoryData, setSubcategoryData] = useState(null);

    // Bulk Order States
    const [isBulkOpen, setIsBulkOpen] = useState(false);
    const [bulkQuantity, setBulkQuantity] = useState('');
    const [bulkPhone, setBulkPhone] = useState('');
    const [bulkNotes, setBulkNotes] = useState('');
    const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);
    const [bulkSuccess, setBulkSuccess] = useState(false);

    const methods = useForm();
    const { handleSubmit, reset } = methods;

    // Animation States
    const [isAdding, setIsAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const actionTypeRef = useRef('cart');
    
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const [activeCoupons, setActiveCoupons] = useState([]);
    const [copiedCoupon, setCopiedCoupon] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState({ total: 0, averageRating: 0 });
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewMessage, setReviewMessage] = useState("");
    const [reviewImages, setReviewImages] = useState([]);
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    
    const sliderRef = useRef(null);

    useEffect(() => {
        const fetchActiveCoupons = async () => {
            try {
                const response = await api.get('/coupons/active');
                setActiveCoupons(response.data);
            } catch (error) {
                console.error("Error fetching active coupons:", error);
            }
        };
        fetchActiveCoupons();
    }, []);

    const handleCopyCoupon = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCoupon(code);
        setTimeout(() => setCopiedCoupon(null), 2000);
    };

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                // Fetch Product via SEO endpoint
                let response = await fetch(`${config.api}/seo/product/${slug}`);
                if (!response.ok) {
                    response = await fetch(`${config.api}/products/${slug}`);
                }
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                    setActiveImage(data.primaryImage || data.image || (data.images && data.images[0]));
                    
                    // Set Category Name from populated data or fallback
                    if (data.category?.name) {
                        setCategoryName(data.category.name);
                    } else if (typeof data.category === 'string') {
                        // Fetch categories as fallback
                        const catRes = await fetch(`${config.api}/category`);
                        if (catRes.ok) {
                            const categories = await catRes.json();
                            const matchingCat = categories.find(c => c._id === data.category);
                            if (matchingCat) setCategoryName(matchingCat.name);
                        }
                    }

                    // Set Related Products from populated SEO list
                    setRelatedProducts(data.relatedProducts || []);

                    // Fetch Subcategory for custom fields
                    const subId = data.subcategory?._id || data.subcategory;
                    if (subId) {
                        if (data.subcategory && typeof data.subcategory === 'object') {
                            setSubcategoryData(data.subcategory);
                            const merged = [
                                ...(data.subcategory.customFields || []),
                                ...(data.extraFields || [])
                            ].sort((a, b) => (a.order || 0) - (b.order || 0));
                            setCustomizationFields(merged);
                        } else {
                            const subRes = await fetch(`${config.api}/subcategory`);
                            if (subRes.ok) {
                                const allSubs = await subRes.json();
                                const sub = allSubs.find(s => s._id === subId);
                                if (sub) {
                                    setSubcategoryData(sub);
                                    const merged = [
                                        ...(sub.customFields || []),
                                        ...(data.extraFields || [])
                                    ].sort((a, b) => (a.order || 0) - (b.order || 0));
                                    setCustomizationFields(merged);
                                }
                            }
                        }
                    } else if (data.extraFields && data.extraFields.length > 0) {
                        setCustomizationFields(data.extraFields.sort((a, b) => (a.order || 0) - (b.order || 0)));
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
    }, [slug]);

    const fetchReviews = async () => {
        if (!product?._id) return;
        try {
            const response = await fetch(`${config.api}/reviews/product/${product._id}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data.reviews || []);
                setReviewStats({ total: data.total || 0, averageRating: data.averageRating || 0 });
            }
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    };

    useEffect(() => {
        if (!product?._id) return;
        fetchReviews();
        const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL , { withCredentials: true });
        const refreshProductReviews = (payload) => {
            if (!payload?.productId || String(payload.productId) === String(product._id)) fetchReviews();
        };
        socket.on('review-created', refreshProductReviews);
        socket.on('review-updated', refreshProductReviews);
        socket.on('review-deleted', refreshProductReviews);
        return () => socket.disconnect();
    }, [product?._id]);

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
                    <Link href="/products" className="px-6 py-2 bg-[var(--primary)] text-white rounded-md hover:opacity-90 transition-opacity">
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

    // Placeholder array for thumbnail gallery
    const galleryImages = product.images && product.images.length > 0 ? product.images : [product.primaryImage || product.coverImage];

    const handleAddToCart = (data = {}) => {
        // Guests can build a cart too — it's stored locally and synced on login.
        setIsAdding(true);
        // Premium artificial delay for feeling of work
        setTimeout(() => {
            const cartItem = {
                ...product,
                customization: data
            };
            addToCart(cartItem, quantity);
            setIsAdding(false);
            setAdded(true);
            setTimeout(() => setAdded(false), 2500); // Revert back after 2.5s
        }, 600);
    };

    const onSubmitCustomization = (data) => {
        if (actionTypeRef.current === 'buy') {
            handleBuyNow(data);
        } else {
            handleAddToCart(data);
        }
    };

    const handleBuyNow = (data = {}) => {
        if (!isLoggedIn) {
            triggerAuthGuard("Login to proceed with your purchase");
            return;
        }
        setIsBuying(true);
        setBuyNowItem({ ...product, quantity, categoryName, customization: data });
        setTimeout(() => {
            navigate.push('/checkout');
        }, 600);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            triggerAuthGuard("Login to share your review");
            return;
        }
        if (!reviewMessage.trim()) return;

        setReviewSubmitting(true);
        try {
            const reviewData = new FormData();
            reviewData.append("rating", String(reviewRating));
            reviewData.append("message", reviewMessage);
            reviewData.append("reviewType", "product");
            reviewImages.forEach((file) => reviewData.append("reviewImages", file));
            await api.post(`/reviews/product/${product._id}`, reviewData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setReviewMessage("");
            setReviewRating(5);
            setReviewImages([]);
            await fetchReviews();
        } catch (error) {
            console.error("Failed to submit review:", error);
        } finally {
            setReviewSubmitting(false);
        }
    };

    const formatReviewDate = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days <= 0) return "Today";
        if (days === 1) return "1 day ago";
        return `${days} days ago`;
    };

    const handleBulkSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            triggerAuthGuard("Login to submit a bulk request");
            return;
        }
        if (!bulkQuantity || !bulkPhone) return;

        setIsSubmittingBulk(true);
        try {
            const res = await api.post('/customization/create', {
                productId: product._id,
                requestType: 'bulk',
                bulkQuantity,
                bulkPhone,
                bulkNotes
            });
            if (res.status === 201) {
                setBulkSuccess(true);
                setBulkQuantity('');
                setBulkPhone('');
                setBulkNotes('');
            }
        } catch (err) {
            console.error("Bulk request error:", err);
        } finally {
            setIsSubmittingBulk(false);
        }
    };

    const fallbackSpecifications = [
        { title: "Material", value: `Premium ${product.material || "Blend"}` },
        { title: "Dimensions", value: "Standard format" },
        { title: "Weight", value: "Optimized for daily use" },
        { title: "Care", value: "Wipe clean" },
    ];
    const displaySpecifications = product.specifications?.filter((spec) => spec.title || spec.value)?.length
        ? product.specifications.filter((spec) => spec.title || spec.value)
        : fallbackSpecifications;

    return (
        <div className="flex flex-col min-h-screen bg-[var(--bg)] font-sans text-[var(--text)]">
            
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 md:pb-16 pt-24 sm:pt-28 md:pt-32">
                
                {/* Breakcrumb Section */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="text-sm flex items-center gap-2 opacity-80 font-medium whitespace-nowrap overflow-x-auto pb-2 sm:pb-0 no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
                        <Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link>
                        <span className="text-gray-400 dark:text-gray-600 px-1 font-bold">›</span>
                        <Link href="/products" className="hover:text-[var(--primary)] transition-colors">Products</Link>
                        {product?.category && (
                            <>
                                <span className="text-gray-400 dark:text-gray-600 px-1 font-bold">›</span>
                                <Link 
                                    href={`/products?categoryId=${product.category?._id || product.category}`} 
                                    className="hover:text-[var(--primary)] transition-colors font-medium"
                                >
                                    {categoryName}
                                </Link>
                            </>
                        )}
                        {(product?.subcategory || subcategoryData) && (
                            <>
                                <span className="text-gray-400 dark:text-gray-600 px-1 font-bold">›</span>
                                <Link 
                                    href={`/products?categoryId=${product.category?._id || product.category}&subcategoryId=${product.subcategory?._id || (typeof product.subcategory === 'string' ? product.subcategory : null) || subcategoryData?._id}`} 
                                    className="hover:text-[var(--primary)] transition-colors font-medium"
                                >
                                    {product.subcategory?.name || subcategoryData?.name || 'Subcategory'}
                                </Link>
                            </>
                        )}
                        <span className="text-gray-400 dark:text-gray-600 px-1 font-bold">›</span>
                        <span className="text-[var(--text)] font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
                    </div>
                </div>

                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 mb-16 sm:mb-20 lg:mb-24">
                    
                    {/* Left: Product Images */}
                    <div className="flex flex-col gap-4">
                        {/* Main Image */}
                        <div className="aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 shadow-sm relative group">
                            <img 
                                src={resolveImage(activeImage)} 
                                alt={product.name} 
                                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                            />
                            {product.isFeatured && (
                                <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-md z-10 flex items-center gap-1">
                                    <svg className="w-3 h-3 fill-white" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    FEATURED
                                </div>
                            )}
                            {product.isNewArrival && (
                                <div className="absolute top-4 left-4 bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-md z-10">
                                    NEW ARRIVAL
                                </div>
                            )}
                            {product.isBestSeller && (
                                <div className="absolute top-14 left-4 bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-md z-10">
                                    BEST SELLER
                                </div>
                            )}
                        </div>
                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-4 gap-4">
                            {galleryImages.slice(0, 4).map((img, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setActiveImage(img)}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[var(--primary)] shadow-md' : 'border-transparent hover:border-[var(--secondary)]/30 opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={resolveImage(img)} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" alt={`${product.name} thumbnail ${i+1}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col pt-2 lg:pt-8">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary)] mb-3 inline-block">
                            {categoryName}
                        </span>
                        
                        <h1 className="text-[26px] sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 sm:mb-4 leading-[1.12]">{product.name}</h1>
                        
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--secondary)]/10">
                            {renderStars(Math.round(reviewStats.averageRating || 5))}
                            <span className="text-sm font-semibold opacity-70">({reviewStats.total} reviews)</span>
                        </div>
                        
                        <div className="mb-6 flex flex-col gap-1">
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl sm:text-4xl font-black text-[var(--primary)] drop-shadow-sm">
                                    ₹{product.offerPrice || product.price}
                                </span>
                                {product.offerPrice && (
                                    <span className="text-xl opacity-40 font-bold line-through">
                                        ₹{product.price}
                                    </span>
                                )}
                            </div>
                            {product.offerPrice && (
                                <span className="text-sm font-bold text-green-600 bg-green-500/10 px-2 py-1 rounded w-max">
                                    Save ₹{product.price - product.offerPrice} ({Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF)
                                </span>
                            )}
                        </div>

                        <div className="text-base opacity-75 leading-relaxed mb-8 whitespace-pre-line">
                            {product.shortDescription || `Premium custom-ready ${product.name.toLowerCase()} crafted for clean presentation, lasting quality, and everyday use.`}
                        </div>



                        {/* Customization Toggle */}
                        {customizationFields.length > 0 && (
                            <div className="mb-8">
                                <button 
                                    onClick={() => setIsCustomizing(!isCustomizing)}
                                    className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-500 group ${isCustomizing ? 'bg-[var(--secondary)]/5 border-[var(--primary)] text-[var(--primary)] shadow-md' : 'bg-[var(--bg)] border-[var(--secondary)]/20 text-[var(--text)] hover:border-[var(--primary)]/50 shadow-sm'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl transition-colors ${isCustomizing ? 'bg-[var(--primary)]/10' : 'bg-[var(--secondary)]/5 group-hover:bg-[var(--primary)]/10'}`}>
                                            <Edit3 size={20} className={isCustomizing ? 'text-[var(--primary)]' : 'text-[var(--text)]/50 group-hover:text-[var(--primary)]'} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-xs font-black uppercase tracking-widest ${isCustomizing ? 'text-[var(--primary)]/80' : 'text-[var(--text)]/50'}`}>Print Options</p>
                                            <p className="font-black text-lg">Choose Product Options</p>
                                        </div>
                                    </div>
                                    {isCustomizing ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                </button>

                                <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isCustomizing ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                                    <div className="bg-[var(--secondary)]/5 p-8 rounded-3xl border border-[var(--secondary)]/10 shadow-inner">
                                        <FormProvider {...methods}>
                                            <form id="customization-form" onSubmit={handleSubmit(onSubmitCustomization)}>
                                                <DynamicFormRenderer fields={customizationFields} />
                                            </form>
                                        </FormProvider>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quantity & Actions */}
                        <div className="space-y-4 mb-10">
                            <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
                                <div className="h-14 flex items-center border-2 border-[var(--secondary)]/20 rounded-xl overflow-hidden w-32 sm:w-36 bg-[var(--bg)] shadow-sm">
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
                                <div className="text-sm font-bold opacity-60">Total: ₹{(product.offerPrice || product.price) * quantity}</div>
                            </div>

                            <div className="flex flex-col gap-4 pt-4">
                                {product.hasCustomization && (
                                    <button 
                                        onClick={() => setIsCustomModalOpen(true)}
                                        className="relative w-full h-14 bg-[var(--text)] text-[var(--bg)] text-sm sm:text-base font-black rounded-xl hover:opacity-95 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 shadow-xl shadow-black/10 flex items-center justify-center gap-2 overflow-hidden group/custom"
                                    >
                                        <div className="absolute inset-0 -translate-x-full group-hover/custom:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                                        <span className="relative z-10 flex items-center gap-2 group-hover/custom:scale-105 transition-transform">
                                            🎨 Customize This Product
                                        </span>
                                    </button>
                                )}
                                
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <button 
                                        onClick={() => {
                                            if (customizationFields.length > 0 && isCustomizing) {
                                                actionTypeRef.current = 'cart';
                                                document.getElementById('customization-form').requestSubmit();
                                            } else {
                                                handleAddToCart();
                                            }
                                        }}
                                        disabled={isAdding || added}
                                        className={`relative w-full sm:flex-1 h-14 border-2 text-sm sm:text-base font-black rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-2 overflow-hidden group active:scale-[0.98]
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
                                                <span className="opacity-0">Add to Cart</span>
                                                <span className="absolute">Add to Cart</span>
                                            </>
                                        )}
                                    </button>
                                    
                                    <button 
                                        onClick={() => {
                                            if (customizationFields.length > 0 && isCustomizing) {
                                                actionTypeRef.current = 'buy';
                                                document.getElementById('customization-form').requestSubmit();
                                            } else {
                                                handleBuyNow();
                                            }
                                        }}
                                        disabled={isBuying}
                                        className="relative w-full sm:flex-1 h-14 bg-[var(--primary)] text-[var(--bg)] text-sm sm:text-base font-black rounded-xl hover:opacity-95 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 shadow-xl shadow-[var(--primary)]/20 flex items-center justify-center gap-2 overflow-hidden group/buy"
                                    >
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
                            </div>

                        {/* Bulk Pricing / Order Section */}
                        {product.hasBulkPricing && (
                            <div className="mb-10">
                                <button 
                                    onClick={() => setIsBulkOpen(!isBulkOpen)}
                                    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${isBulkOpen ? 'bg-[var(--secondary)]/5 border-[var(--primary)] text-[var(--primary)] shadow-md' : 'bg-[var(--bg)] border-[var(--secondary)]/20 text-[var(--text)] hover:border-[var(--primary)]/50 shadow-sm'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${isBulkOpen ? 'from-[var(--primary)]/20 to-[var(--primary)]/5 text-[var(--primary)]' : 'from-[var(--secondary)]/10 to-[var(--secondary)]/5 text-[var(--text)]/70'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${isBulkOpen ? 'text-[var(--primary)]' : 'text-[var(--text)]/50'}`}>Corporate & Events</p>
                                            <p className="font-bold text-lg">
                                                {product.hasBulkPricing && product.bulkPricing && product.bulkPricing.length > 0 
                                                    ? 'Bulk Pricing Available' 
                                                    : 'Request Bulk Order'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${isBulkOpen ? 'bg-[var(--primary)] text-white rotate-180 shadow-md shadow-[var(--primary)]/30' : 'bg-[var(--secondary)]/10 text-[var(--text)]/50'}`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </button>

                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isBulkOpen ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                    <div className="bg-[var(--secondary)]/5 p-6 sm:p-8 rounded-3xl border border-[var(--secondary)]/10 shadow-inner space-y-8">
                                        
                                        {/* Pricing Tier Table */}
                                        {product.hasBulkPricing && product.bulkPricing && product.bulkPricing.length > 0 && (
                                            <div className="overflow-hidden rounded-2xl border border-[var(--secondary)]/15 bg-[var(--bg)]">
                                                <div className="grid grid-cols-2 bg-[var(--text)] text-[var(--bg)] text-[10px] sm:text-xs font-black uppercase tracking-widest">
                                                    <div className="px-4 py-3 sm:py-4 border-r border-[var(--bg)]/20">Quantity Tier</div>
                                                    <div className="px-4 py-3 sm:py-4">Price Per Unit</div>
                                                </div>
                                                {product.bulkPricing.map((tier, idx) => (
                                                    <div key={idx} className={`grid grid-cols-2 border-t border-[var(--secondary)]/10 ${idx % 2 === 0 ? 'bg-[var(--secondary)]/5' : 'bg-[var(--bg)]'}`}>
                                                        <div className="px-4 py-3 sm:py-4 text-sm font-bold text-[var(--secondary)]/80 flex items-center gap-2">
                                                            {tier.minQty}{tier.maxQty ? ` - ${tier.maxQty}` : '+'} units
                                                        </div>
                                                        <div className="px-4 py-3 sm:py-4 text-base font-black text-[var(--text)] flex items-center justify-between">
                                                            <span>₹{tier.pricePerUnit}</span>
                                                            {tier.bestPriceAvailable && (
                                                                <span className="hidden sm:inline-block bg-green-500 text-white text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">Best Value</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Request Form */}
                                        {bulkSuccess ? (
                                            <div className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
                                                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                                </div>
                                                <h4 className="font-black text-xl mb-2 text-green-700">Request Received!</h4>
                                                <p className="text-sm font-medium opacity-80 mb-6">Our team will review your bulk order requirements and send a quotation to your dashboard.</p>
                                                <Link href="/dashboard/requests" className="inline-block bg-[var(--text)] text-[var(--bg)] font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform shadow-lg">
                                                    View Dashboard
                                                </Link>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleBulkSubmit} className="space-y-4">
                                                <div>
                                                    <h4 className="font-black text-lg mb-1">Request a Quote</h4>
                                                    <p className="text-xs font-medium opacity-60 mb-4">Fill out the details below to get a customized bulk pricing quote.</p>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-1.5 ml-1">Estimated Quantity *</label>
                                                        <input type="number" required value={bulkQuantity} onChange={(e) => setBulkQuantity(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--secondary)]/20 rounded-xl px-4 py-3 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all font-medium" placeholder="E.g., 50" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-1.5 ml-1">Contact Phone *</label>
                                                        <input type="tel" required value={bulkPhone} onChange={(e) => setBulkPhone(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--secondary)]/20 rounded-xl px-4 py-3 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all font-medium" placeholder="+91 98765 43210" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-1.5 ml-1">Additional Requirements</label>
                                                    <textarea value={bulkNotes} onChange={(e) => setBulkNotes(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--secondary)]/20 rounded-xl px-4 py-3 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all font-medium min-h-[100px]" placeholder="Specific colors, deadline, delivery location, etc." />
                                                </div>
                                                <button disabled={isSubmittingBulk} type="submit" className="w-full h-14 bg-[var(--primary)] text-[var(--bg)] font-black rounded-xl hover:opacity-95 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shadow-md shadow-[var(--primary)]/20 flex items-center justify-center gap-2 overflow-hidden group/bulk">
                                                    <div className="absolute inset-0 -translate-x-full group-hover/bulk:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                                                    {isSubmittingBulk ? "Submitting Request..." : "Submit Bulk Request"}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

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

                {/* Responsive Details Section */}
                <>
                {/* Desktop Tabs UI (Hidden on mobile) */}
                <div className="hidden md:block mb-24 px-4 sm:px-0 pt-20 border-t border-[var(--secondary)]/10">
                    <div className="flex justify-center mb-16">
                        <div className="inline-flex gap-2 p-2 bg-[var(--secondary)]/5 rounded-full border border-[var(--secondary)]/10 shadow-inner">
                            {['description', 'specifications', 'reviews'].map((tab) => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-10 py-3 text-base sm:text-lg font-bold capitalize transition-all duration-300 rounded-full relative whitespace-nowrap ${activeTab === tab ? 'bg-[var(--bg)] text-[var(--primary)] shadow-md border border-[var(--secondary)]/5 scale-105' : 'text-[var(--text)] opacity-60 hover:opacity-100 hover:bg-[var(--secondary)]/5'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="max-w-5xl mx-auto text-base sm:text-lg opacity-90 leading-relaxed min-h-[300px]">
                        {activeTab === 'description' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="whitespace-pre-line text-center text-xl font-medium leading-loose px-10">
                                    {product.description || `Discover the pinnacle of quality and elegant design with the ${product.name}. This premium piece is crafted purposefully to integrate seamlessly into your daily life.
                                    
                                    Each unit undergoes strict quality control checks throughout the manufacturing process. Unlike standard alternatives on the market, we utilize a proprietary blend of materials that provide both aesthetic appeal and long-term durability. 
                                    
                                    Whether you're treating yourself or looking for the perfect gift, the uncompromising build quality ensures this is a purchase you won't regret.`}
                                </div>
                            </div>
                        )}
                        {activeTab === 'specifications' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="max-w-4xl mx-auto overflow-hidden rounded-3xl border border-[var(--secondary)]/15 shadow-sm bg-[var(--bg)]">
                                    <div className="grid grid-cols-[0.9fr_1.1fr] bg-[var(--text)] text-[var(--bg)] text-xs font-black uppercase tracking-[0.18em]">
                                        <div className="px-6 py-4">Specification</div>
                                        <div className="px-6 py-4">Details</div>
                                    </div>
                                    {displaySpecifications.map((spec, index) => (
                                        <div key={`${spec.title}-${index}`} className={`grid grid-cols-[0.9fr_1.1fr] border-t border-[var(--secondary)]/10 ${index % 2 === 0 ? 'bg-[var(--secondary)]/5' : 'bg-[var(--bg)]'}`}>
                                            <div className="px-6 py-5 text-sm font-black text-[var(--secondary)]/75 uppercase tracking-wider">{spec.title}</div>
                                            <div className="px-6 py-5 text-base font-bold text-[var(--text)]">{spec.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-12 max-w-4xl mx-auto">
                                    <div className="flex items-center justify-center gap-16 mb-12 pb-12 border-b border-[var(--secondary)]/10">
                                        <div className="text-center group">
                                            <div className="text-7xl font-black text-[var(--primary)] mb-4 drop-shadow-md group-hover:scale-110 transition-transform duration-500">{reviewStats.averageRating || "0.0"}</div>
                                            <div className="flex justify-center scale-125 mb-4">{renderStars(Math.round(reviewStats.averageRating || 0))}</div>
                                            <div className="text-sm font-black opacity-50 uppercase tracking-widest">Based on {reviewStats.total} reviews</div>
                                        </div>
                                        <div className="h-32 w-px bg-[var(--secondary)]/20 hidden sm:block"></div>
                                        <form onSubmit={handleSubmitReview} className="w-full max-w-md space-y-4">
                                            <div className="flex items-center gap-2">
                                                {[1, 2, 3, 4, 5].map((rating) => (
                                                    <button key={rating} type="button" onClick={() => setReviewRating(rating)} className="p-1">
                                                        <svg className={`w-7 h-7 ${rating <= reviewRating ? 'text-yellow-400' : 'text-[var(--secondary)]/25'}`} fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea value={reviewMessage} onChange={(e) => setReviewMessage(e.target.value)} className="w-full min-h-28 rounded-2xl border border-[var(--secondary)]/15 p-4 outline-none focus:ring-2 focus:ring-[var(--primary)]/30 bg-[var(--bg)]" placeholder="Share your product experience..." />
                                            <input type="file" accept="image/*" multiple onChange={(e) => setReviewImages(Array.from(e.target.files || []))} className="block w-full text-sm" />
                                            <button disabled={reviewSubmitting} className="relative overflow-hidden bg-[var(--text)] text-[var(--bg)] font-black px-8 py-4 rounded-full hover:bg-[var(--primary)] hover:text-white transition-all duration-300 shadow-xl disabled:opacity-60">
                                                {reviewSubmitting ? "Submitting..." : "Submit Review"}
                                            </button>
                                        </form>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-6">
                                        {reviews.length === 0 && (
                                            <div className="text-center rounded-3xl border border-[var(--secondary)]/10 p-10 font-bold opacity-60">No public reviews yet.</div>
                                        )}
                                        {reviews.map((review) => (
                                            <div key={review._id} className="bg-[var(--bg)] p-8 rounded-3xl shadow-xl border border-[var(--secondary)]/10 hover:-translate-y-1 transition-all duration-300">
                                                <div className="flex items-start gap-5">
                                                    <img src={resolveImage(review.userImage) || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.username || 'Customer')}`} alt={review.username} className="w-16 h-16 rounded-2xl object-cover border border-[var(--secondary)]/10" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                                            <h4 className="font-black text-xl">{review.username}</h4>
                                                            <span className="text-xs font-black opacity-40 uppercase tracking-widest">{formatReviewDate(review.createdAt)}</span>
                                                        </div>
                                                        <div className="mt-2">{renderStars(review.rating)}</div>
                                                        <p className="mt-4 font-medium opacity-80 leading-relaxed">{review.message}</p>
                                                        {review.reviewImages?.length > 0 && (
                                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-5">
                                                                {review.reviewImages.map((image) => (
                                                                    <img key={image} src={resolveImage(image)} alt="Review upload" className="aspect-square rounded-2xl object-cover border border-[var(--secondary)]/10" />
                                                                ))}
                                                            </div>
                                                        )}
                                                        {review.adminReply?.message && (
                                                            <div className="mt-5 rounded-2xl bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 p-4">
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] mb-1">Design Team Reply</p>
                                                                <p className="text-sm font-semibold opacity-80">{review.adminReply.message}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Vertically Stacked UI (Hidden on desktop) */}
                <div className="block md:hidden mb-16 px-4 sm:px-0 max-w-4xl mx-auto space-y-16 border-t border-[var(--secondary)]/10 pt-16">
                    {/* Description Section */}
                    <div className="group flex flex-col items-center">
                        <h3 className="text-3xl md:text-4xl font-black mb-8 relative inline-block text-center transition-transform duration-500 hover:scale-105 hover:text-[var(--primary)]">
                            Description
                            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-[var(--primary)] rounded-full transition-all duration-500 group-hover:w-full group-hover:shadow-[0_0_15px_var(--primary)]"></span>
                        </h3>
                        <div className="text-base sm:text-lg opacity-80 leading-relaxed whitespace-pre-line text-center max-w-3xl mt-4">
                            {product.description || `Discover the pinnacle of quality and elegant design with the ${product.name}. This premium piece is crafted purposefully to integrate seamlessly into your daily life.
                            
                            Each unit undergoes strict quality control checks throughout the manufacturing process. Unlike standard alternatives on the market, we utilize a proprietary blend of materials that provide both aesthetic appeal and long-term durability. 
                            
                            Whether you're treating yourself or looking for the perfect gift, the uncompromising build quality ensures this is a purchase you won't regret.`}
                        </div>
                    </div>
                    
                    {/* Specifications Section */}
                    <div className="group flex flex-col items-center">
                        <h3 className="text-3xl md:text-4xl font-black mb-12 relative inline-block text-center transition-transform duration-500 hover:scale-105 hover:text-[var(--primary)]">
                            Specifications
                            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-[var(--primary)] rounded-full transition-all duration-500 group-hover:w-full group-hover:shadow-[0_0_15px_var(--primary)]"></span>
                        </h3>
                        <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--secondary)]/10 shadow-inner">
                            {displaySpecifications.map((spec, index) => (
                                <div key={`${spec.title}-mobile-${index}`} className={`p-5 text-center border-b last:border-b-0 border-[var(--secondary)]/10 ${index % 2 === 0 ? 'bg-[var(--secondary)]/5' : 'bg-[var(--bg)]'}`}>
                                    <div className="font-black text-[var(--secondary)]/70 uppercase tracking-wider text-xs mb-2">{spec.title}</div>
                                    <div className="font-bold text-lg">{spec.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="group flex flex-col items-center w-full">
                        <h3 className="text-3xl md:text-4xl font-black mb-12 relative inline-block text-center transition-transform duration-500 hover:scale-105 hover:text-[var(--primary)]">
                            Customer Reviews
                            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-[var(--primary)] rounded-full transition-all duration-500 group-hover:w-full group-hover:shadow-[0_0_15px_var(--primary)]"></span>
                        </h3>
                        <div className="w-full space-y-12">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 pb-12 border-b border-[var(--secondary)]/10">
                                <div className="text-center hover:scale-110 transition-transform duration-500 cursor-default">
                                    <div className="text-6xl font-black text-[var(--primary)] drop-shadow-md mb-2">{reviewStats.averageRating || "0.0"}</div>
                                    <div className="flex justify-center scale-125 mb-3">{renderStars(Math.round(reviewStats.averageRating || 0))}</div>
                                    <div className="text-sm font-black opacity-50 uppercase tracking-widest">Based on {reviewStats.total} reviews</div>
                                </div>
                                <div className="h-24 w-px bg-[var(--secondary)]/20 hidden sm:block"></div>
                                <form onSubmit={handleSubmitReview} className="w-full space-y-3">
                                    <div className="flex justify-center gap-1">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <button key={rating} type="button" onClick={() => setReviewRating(rating)} className={`text-3xl ${rating <= reviewRating ? 'text-yellow-400' : 'text-[var(--secondary)]/25'}`}>★</button>
                                        ))}
                                    </div>
                                    <textarea value={reviewMessage} onChange={(e) => setReviewMessage(e.target.value)} className="w-full min-h-28 rounded-2xl border border-[var(--secondary)]/15 p-4 outline-none bg-[var(--bg)]" placeholder="Share your product experience..." />
                                    <input type="file" accept="image/*" multiple onChange={(e) => setReviewImages(Array.from(e.target.files || []))} className="block w-full text-sm" />
                                    <button disabled={reviewSubmitting} className="bg-[var(--text)] text-[var(--bg)] font-black px-8 py-4 rounded-full disabled:opacity-60">{reviewSubmitting ? "Submitting..." : "Submit Review"}</button>
                                </form>
                            </div>
                            
                            <div className="space-y-5">
                                {reviews.length === 0 && <div className="text-center rounded-3xl border border-[var(--secondary)]/10 p-8 font-bold opacity-60">No public reviews yet.</div>}
                                {reviews.map((review) => (
                                    <div key={review._id} className="max-w-2xl mx-auto bg-[var(--bg)] p-6 rounded-3xl shadow-lg border border-[var(--secondary)]/10">
                                        <div className="flex flex-col items-center text-center gap-3 mb-4">
                                            <img src={resolveImage(review.userImage) || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.username || 'Customer')}`} alt={review.username} className="w-16 h-16 rounded-2xl object-cover border border-[var(--secondary)]/10" />
                                            <div>
                                                <div className="font-black text-lg">{review.username}</div>
                                                <div className="flex justify-center mt-1">{renderStars(review.rating)}</div>
                                                <div className="text-xs font-black opacity-40 uppercase tracking-widest mt-2">{formatReviewDate(review.createdAt)}</div>
                                            </div>
                                        </div>
                                        <p className="font-medium text-[var(--text)] opacity-80 leading-relaxed text-center text-base">{review.message}</p>
                                        {review.reviewImages?.length > 0 && (
                                            <div className="grid grid-cols-3 gap-2 mt-4">
                                                {review.reviewImages.map((image) => (
                                                    <img key={image} src={resolveImage(image)} alt="Review upload" className="aspect-square rounded-xl object-cover border border-[var(--secondary)]/10" />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                </>

                {/* FAQs Section */}
                <ProductFAQ faqs={product.faqs} />

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <Reveal className="mb-10 pt-16 border-t border-[var(--secondary)]/20">
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
                                        href={`/product/${related.slug || related._id}`}
                                        className="w-64 sm:w-72 flex-shrink-0 flex flex-col bg-[var(--bg)] rounded-3xl overflow-hidden border border-[var(--secondary)]/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--secondary)]/5 p-4">
                                                <img 
                                                    src={resolveImage(related.coverImage || related.primaryImage || (related.images && related.images[0]) || related.image)} 
                                                    alt={related.name}
                                                className="w-full h-full object-cover object-center rounded-2xl group-hover:scale-105 transition-transform duration-500 ease-out shadow-sm"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <div className="text-xs uppercase tracking-widest font-bold opacity-50 mb-1">{categoryName}</div>
                                            <h3 className="text-lg font-bold group-hover:text-[var(--primary)] transition-colors mb-1 truncate">
                                                {related.name}
                                            </h3>
                                            <p className="mb-2 text-[11px] font-medium leading-snug text-[var(--text)] opacity-60 line-clamp-1">
                                                {related.shortDescription || "Premium bespoke custom printing."}
                                            </p>
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
                    </Reveal>
                )}

                {/* Recently Viewed */}
                <RecentlyViewed product={product} />

                {/* Printvoz Phase 2 SEO Sections (RelatedCategories is hidden) */}
                <RelatedCategories categories={product.relatedCategories} />

            </main>

            {/* Our Product Categories (reused home page component) */}
            <Reveal>
                <CategoryUI />
            </Reveal>

            <CustomizationModal 
                isOpen={isCustomModalOpen} 
                onClose={() => setIsCustomModalOpen(false)} 
                product={product} 
            />

            <Footer />
        </div>
    );
}
