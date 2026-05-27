// @ts-nocheck
"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Footer from '../components/Footer';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import config from '../brand/config';
import CategoryUI from './HomeUI/CategoryUI';
import { useShop } from '../context/ShopContext';
import { resolveImage } from '../lib/imageUtils';
import api from '../lib/axios';
import { 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Check, 
  X, 
  Star, 
  Heart, 
  ShoppingBag, 
  ArrowRight, 
  RotateCcw, 
  Sliders, 
  Search, 
  Tag, 
  Grid, 
  Eye,
  SlidersHorizontal,
  Sparkles,
  Printer
} from 'lucide-react';

export default function Products() {
    const searchParams = useSearchParams();
    const categoryIdFromUrl = searchParams.get('categoryId');
    const navigate = useRouter();
    const { addToCart, toggleWishlist, isInWishlist, brandInfo } = useShop();
    const brandName = brandInfo?.name || config.brand;

    // Core States
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [loading, setLoading] = useState(true);

    // Advanced Filtering States
    const [sortOption, setSortOption] = useState('Popular');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [maxPriceLimit, setMaxPriceLimit] = useState(10000); // dynamic maximum
    const [selectedUseCases, setSelectedUseCases] = useState([]);
    const [selectedPrintStyles, setSelectedPrintStyles] = useState([]);
    const [selectedHighlights, setSelectedHighlights] = useState([]); // 'featured', 'bestSeller', 'newArrival', 'customizable'
    const [searchQuery, setSearchQuery] = useState('');

    // Metadata / Preset options extracted from DB dynamically
    const [availableUseCases, setAvailableUseCases] = useState(["Business", "Wedding", "Festival", "Birthday", "Corporate", "College Event"]);
    const [availablePrintStyles, setAvailablePrintStyles] = useState(["DTF", "UV", "Screen Print", "Embroidery", "Offset"]);

    // UI Interaction States
    const [activeDropdown, setActiveDropdown] = useState(null); // 'category' | 'price' | 'useCase' | 'printStyle' | 'highlights' | null
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [cartSuccessId, setCartSuccessId] = useState(null); // ID of product recently added to cart
    
    // Mobile filter accordion sections (all open by default)
    const [mobileFilterSections, setMobileFilterSections] = useState({
        categories: true,
        price: true,
        occasion: false,
        printStyle: false,
        highlights: false,
    });

    const dropdownRef = useRef(null);
    
    // Toggle mobile filter accordion section
    const toggleFilterSection = useCallback((section) => {
        setMobileFilterSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    }, []);

    // Active filter count for mobile badge
    const activeFilterCount = [
        selectedCategory ? 1 : 0,
        selectedSubcategory ? 1 : 0,
        (minPrice > 0 || maxPrice < maxPriceLimit) ? 1 : 0,
        selectedUseCases.length,
        selectedPrintStyles.length,
        selectedHighlights.length,
        searchQuery ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    // Close dropdowns on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Load initial metadata, categories, subcategories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await api.get('/category');
                setCategories(res.data);
                if (categoryIdFromUrl) {
                    const catToSelect = res.data.find(c => String(c._id) === String(categoryIdFromUrl));
                    if (catToSelect) {
                        setSelectedCategory(catToSelect);
                    }
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const loadSubcategories = async () => {
            try {
                const res = await api.get('/subcategory');
                setSubcategories(res.data);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            }
        };

        const fetchMetadata = async () => {
            try {
                const res = await api.get('/products');
                const allProds = res.data;
                setAllProducts(allProds);
                if (allProds.length > 0) {
                    const prices = allProds.map(p => p.offerPrice || p.price || 0);
                    const highest = Math.max(...prices);
                    setMaxPriceLimit(highest || 10000);
                    setMaxPrice(highest || 10000);

                    // Dynamic merge of database tags for Use Cases
                    const useCaseSet = new Set(["Business", "Wedding", "Festival", "Birthday", "Corporate", "College Event"]);
                    allProds.forEach(p => {
                        if (p.useCase && Array.isArray(p.useCase)) {
                            p.useCase.forEach(u => useCaseSet.add(u));
                        }
                    });
                    setAvailableUseCases(Array.from(useCaseSet));

                    // Dynamic merge of database tags for Print Styles
                    const printStyleSet = new Set(["DTF", "UV", "Screen Print", "Embroidery", "Offset"]);
                    allProds.forEach(p => {
                        if (p.printStyle && Array.isArray(p.printStyle)) {
                            p.printStyle.forEach(ps => printStyleSet.add(ps));
                        }
                    });
                    setAvailablePrintStyles(Array.from(printStyleSet));
                }
            } catch (error) {
                console.error("Error loading products metadata:", error);
            }
        };

        const init = async () => {
            setLoading(true);
            await Promise.allSettled([loadCategories(), loadSubcategories(), fetchMetadata()]);
            setLoading(false);
        };
        init();
    }, [categoryIdFromUrl]);

    // Query Products from Backend Server with Query Parameters (Server-side filtering!)
    const fetchProducts = async () => {
        // If we are showing subcategory cards, don't fetch products
        if (selectedCategory && subcategories.length > 0) {
            const categorySubs = subcategories.filter(s => {
                const parentId = s.parentCategory?._id || s.parentCategory;
                return String(parentId) === String(selectedCategory._id);
            });
            if (categorySubs.length > 0 && !selectedSubcategory && !showAllProducts) {
                setProducts([]);
                setLoading(false);
                return;
            }
        }

        setLoading(true);
        try {
            let url = '/products';
            const params = new URLSearchParams();
            
            if (selectedCategory) {
                params.append('category', selectedCategory._id);
            }
            if (selectedSubcategory) {
                params.append('subcategory', selectedSubcategory._id);
            }
            
            // Set price bound
            if (minPrice > 0 || maxPrice < maxPriceLimit) {
                params.append('minPrice', String(minPrice));
                params.append('maxPrice', String(maxPrice));
            }
            
            if (selectedUseCases.length > 0) {
                params.append('useCase', selectedUseCases.join(','));
            }
            if (selectedPrintStyles.length > 0) {
                params.append('printStyle', selectedPrintStyles.join(','));
            }
            if (selectedHighlights.length > 0) {
                params.append('highlights', selectedHighlights.join(','));
            }
            if (searchQuery) {
                params.append('search', searchQuery);
            }
            
            // Sort parameter
            let mappedSort = 'newest';
            if (sortOption === 'Popular') mappedSort = 'popular';
            if (sortOption === 'PriceLowToHigh') mappedSort = 'priceLow';
            if (sortOption === 'PriceHighToLow') mappedSort = 'priceHigh';
            if (sortOption === 'Newest') mappedSort = 'newest';
            params.append('sort', mappedSort);

            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }

            const response = await api.get(url);
            setProducts(response.data);
        } catch (error) {
            console.error("Error loading products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Debounced trigger for input modifications
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 150);
        return () => clearTimeout(timer);
    }, [
        selectedCategory, 
        selectedSubcategory, 
        subcategories,
        showAllProducts,
        sortOption, 
        minPrice, 
        maxPrice, 
        selectedUseCases, 
        selectedPrintStyles, 
        selectedHighlights, 
        searchQuery
    ]);

    // Handle Active Filters Display
    const activeFiltersList = [];
    if (selectedCategory) activeFiltersList.push({ type: 'category', label: selectedCategory.name });
    if (selectedSubcategory) activeFiltersList.push({ type: 'subcategory', label: `Subcategory: ${selectedSubcategory.name}` });
    if (minPrice > 0 || maxPrice < maxPriceLimit) activeFiltersList.push({ type: 'price', label: `₹${minPrice} - ₹${maxPrice}` });
    selectedUseCases.forEach(u => activeFiltersList.push({ type: 'useCase', label: u }));
    selectedPrintStyles.forEach(ps => activeFiltersList.push({ type: 'printStyle', label: ps }));
    selectedHighlights.forEach(h => {
        let label = h;
        if (h === 'featured') label = 'Featured';
        if (h === 'bestSeller') label = 'Best Seller';
        if (h === 'newArrival') label = 'New Arrival';
        if (h === 'customizable') label = 'Customizable';
        activeFiltersList.push({ type: 'highlight', val: h, label });
    });
    if (searchQuery) activeFiltersList.push({ type: 'search', label: `"${searchQuery}"` });

    const handleDismissFilter = (filter) => {
        if (filter.type === 'category') {
            setSelectedCategory(null);
            setSelectedSubcategory(null);
        }
        if (filter.type === 'subcategory') {
            setSelectedSubcategory(null);
        }
        if (filter.type === 'price') {
            setMinPrice(0);
            setMaxPrice(maxPriceLimit);
        }
        if (filter.type === 'useCase') {
            setSelectedUseCases(prev => prev.filter(x => x !== filter.label));
        }
        if (filter.type === 'printStyle') {
            setSelectedPrintStyles(prev => prev.filter(x => x !== filter.label));
        }
        if (filter.type === 'highlight') {
            setSelectedHighlights(prev => prev.filter(x => x !== filter.val));
        }
        if (filter.type === 'search') {
            setSearchQuery('');
        }
    };

    const handleClearAllFilters = () => {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setShowAllProducts(false);
        setMinPrice(0);
        setMaxPrice(maxPriceLimit);
        setSelectedUseCases([]);
        setSelectedPrintStyles([]);
        setSelectedHighlights([]);
        setSearchQuery('');
        setSortOption('Popular');
    };

    const handleCartClick = (e, prod) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(prod, 1);
        
        // Trigger success bounce animation
        setCartSuccessId(prod._id);
        setTimeout(() => setCartSuccessId(null), 1000);
    };

    const handleWishlistClick = (e, prod) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(prod);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
            
            {/* 1. HERO BANNER */}
            <div className="relative w-full h-[35vh] sm:h-[40vh] md:h-[45vh] min-h-[280px] sm:min-h-[320px] md:min-h-[350px] flex flex-col items-center justify-center pt-20 sm:pt-24 pb-6 sm:pb-8 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop" 
                        alt={`${brandName} Products Header`} 
                        className="w-full h-full object-cover scale-105 filter brightness-45 contrast-105 transition-transform duration-10000 ease-out"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-[var(--bg)] transition-colors duration-300" />
                </div>
                
                <div className="relative z-10 text-center text-white space-y-3 sm:space-y-4 px-5 sm:px-6 max-w-4xl flex flex-col items-center mt-4 sm:mt-6">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8 }}
                        className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-bold tracking-widest text-[#A7AA63] uppercase border border-white/10"
                    >
                        <Sparkles size={12} className="animate-pulse sm:w-3.5 sm:h-3.5" /> Custom Premium Printing
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-black tracking-tight drop-shadow-xl uppercase leading-tight"
                    >
                        The Collection
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-xs sm:text-sm md:text-xl font-medium opacity-90 drop-shadow-lg tracking-wide max-w-2xl text-gray-200 leading-relaxed px-2"
                    >
                        Impeccable printing and bespoke craftsmanship tailored for corporate events, modern businesses, and life's special occasions.
                    </motion.p>
                </div>
            </div>

            {/* 2. BREADCRUMBS & SEARCH */}
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 pt-6 sm:pt-8 pb-3 sm:pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 relative z-20">
                <nav className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider flex flex-nowrap items-center gap-1.5 sm:gap-2 opacity-80 overflow-x-auto max-w-full no-scrollbar">
                    <Link href="/" className="hover:text-[var(--primary)] transition-colors whitespace-nowrap touch-manipulation">Home</Link>
                    <span className="text-[var(--secondary)]">/</span>
                    <button onClick={handleClearAllFilters} className="hover:text-[var(--primary)] transition-colors whitespace-nowrap touch-manipulation">Products</button>
                    {selectedCategory && (
                        <>
                            <span className="text-[var(--secondary)]">/</span>
                            <span className={`whitespace-nowrap ${selectedSubcategory ? 'opacity-65' : 'text-[var(--primary)] font-bold'}`}>{selectedCategory.name}</span>
                            {selectedSubcategory && (
                                <>
                                    <span className="text-[var(--secondary)]">/</span>
                                    <span className="text-[var(--primary)] font-bold whitespace-nowrap">{selectedSubcategory.name}</span>
                                </>
                            )}
                        </>
                    )}
                </nav>

                {/* Premium Search Bar */}
                <div className="relative w-full sm:w-72 md:w-80 group">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" />
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-10 pr-10 py-2.5 sm:py-2 text-sm bg-[#A7AA63]/15 dark:bg-white/5 backdrop-blur-md border border-[var(--secondary)]/20 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all shadow-sm min-h-[44px] touch-manipulation"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-150 dark:hover:bg-white/10 touch-manipulation"
                        >
                            <X size={12} className="text-gray-400" />
                        </button>
                    )}
                </div>
            </div>

            {/* 3. PREMIUM STICKY FILTER BAR (DESKTOP + MOBILE) */}
            <div className="sticky top-[64px] sm:top-[72px] lg:top-[80px] z-30 w-full transition-all duration-300">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14">
                    <div className="bg-[#A7AA63]/20 dark:bg-[#121A1B]/80 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 border border-[var(--secondary)]/15 shadow-xl shadow-black/5 dark:shadow-none">
                        
                        {/* Horizontal Desktop Filter Pills */}
                        <div className="hidden lg:flex items-center gap-3" ref={dropdownRef}>
                            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--primary)] mr-2">
                                <SlidersHorizontal size={14} /> Filters:
                            </div>

                            {/* Dropdown 1: Category */}
                            <div className="relative">
                                <button 
                                    onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                                    className={`px-4 py-2 text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                                        selectedCategory 
                                            ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--bg)]' 
                                            : 'bg-white/40 dark:bg-white/5 border-[var(--secondary)]/30 hover:border-[var(--secondary)]'
                                    }`}
                                >
                                    Category {selectedCategory && `(${selectedCategory.name})`}
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeDropdown === 'category' && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute left-0 mt-2 w-64 bg-[#fbfbf6] dark:bg-[#121A1B] border border-[var(--secondary)]/25 rounded-2xl p-4 shadow-2xl z-50 space-y-3"
                                        >
                                            <button 
                                                onClick={() => {
                                                    setSelectedCategory(null);
                                                    setSelectedSubcategory(null);
                                                    setActiveDropdown(null);
                                                }}
                                                className={`w-full text-left text-xs font-semibold px-2 py-1.5 rounded-lg flex items-center justify-between ${!selectedCategory ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                            >
                                                <span>All Categories</span>
                                                {!selectedCategory && <Check size={12} />}
                                            </button>
                                            <div className="max-h-60 overflow-y-auto pr-1 custom-scrollbar space-y-1">
                                                {categories.map((cat) => {
                                                    const isCatSelected = selectedCategory?._id === cat._id;
                                                    return (
                                                        <div key={cat._id} className="space-y-1">
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedCategory(cat);
                                                                    setSelectedSubcategory(null);
                                                                }}
                                                                className={`w-full text-left text-xs font-bold px-2 py-1.5 rounded-lg flex items-center justify-between ${isCatSelected ? 'bg-[var(--primary)]/15 text-[var(--primary)]' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                                            >
                                                                <span>{cat.name}</span>
                                                                {isCatSelected && <Check size={12} />}
                                                            </button>
                                                            {isCatSelected && subcategories.filter(s => (s.parentCategory?._id || s.parentCategory) === cat._id).length > 0 && (
                                                                <div className="pl-4 border-l border-gray-100 dark:border-white/5 py-1 space-y-1">
                                                                    {subcategories.filter(s => (s.parentCategory?._id || s.parentCategory) === cat._id).map(sub => {
                                                                        const isSubSelected = selectedSubcategory?._id === sub._id;
                                                                        return (
                                                                            <button 
                                                                                key={sub._id}
                                                                                onClick={() => setSelectedSubcategory(sub)}
                                                                                className={`w-full text-left text-[11px] font-semibold px-2 py-1 rounded-md flex items-center justify-between ${isSubSelected ? 'bg-[var(--primary)]/20 text-[var(--primary)] font-bold' : 'text-gray-500 hover:text-[var(--primary)] hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                                                            >
                                                                                <span>{sub.name}</span>
                                                                                {isSubSelected && <Check size={10} />}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Dropdown 2: Price Slider */}
                            <div className="relative">
                                <button 
                                    onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
                                    className={`px-4 py-2 text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                                        minPrice > 0 || maxPrice < maxPriceLimit
                                            ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--bg)]' 
                                            : 'bg-white/40 dark:bg-white/5 border-[var(--secondary)]/30 hover:border-[var(--secondary)]'
                                    }`}
                                >
                                    Price Range {minPrice > 0 || maxPrice < maxPriceLimit ? `(₹${minPrice}-₹${maxPrice})` : ''}
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeDropdown === 'price' && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute left-0 mt-2 w-72 bg-white dark:bg-[#121A1B] border border-[var(--secondary)]/25 rounded-2xl p-5 shadow-2xl z-50 space-y-4"
                                        >
                                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-500">
                                                <span>Budget Bounds</span>
                                                <button onClick={() => { setMinPrice(0); setMaxPrice(maxPriceLimit); }} className="text-[10px] text-[var(--primary)] underline lowercase">reset</button>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <div className="flex justify-between text-xs font-bold">
                                                        <span>Min: ₹{minPrice}</span>
                                                        <span>Max: ₹{maxPrice}</span>
                                                    </div>
                                                    <input 
                                                        type="range"
                                                        min="0"
                                                        max={maxPriceLimit}
                                                        value={maxPrice}
                                                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                                                        className="premium-range-slider"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="flex-1 bg-gray-50 dark:bg-white/5 p-2 rounded-lg text-center border border-gray-100 dark:border-white/5">
                                                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Min Price</span>
                                                        <span className="text-xs font-black text-gray-700 dark:text-gray-300">₹0</span>
                                                    </div>
                                                    <div className="flex-1 bg-gray-50 dark:bg-white/5 p-2 rounded-lg text-center border border-gray-100 dark:border-white/5">
                                                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Max Bound</span>
                                                        <span className="text-xs font-black text-gray-700 dark:text-gray-300">₹{maxPrice}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Dropdown 3: Use Case */}
                            <div className="relative">
                                <button 
                                    onClick={() => setActiveDropdown(activeDropdown === 'useCase' ? null : 'useCase')}
                                    className={`px-4 py-2 text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                                        selectedUseCases.length > 0 
                                            ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--bg)]' 
                                            : 'bg-white/40 dark:bg-white/5 border-[var(--secondary)]/30 hover:border-[var(--secondary)]'
                                    }`}
                                >
                                    Occasion / Use Case {selectedUseCases.length > 0 && `(${selectedUseCases.length})`}
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'useCase' ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeDropdown === 'useCase' && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#121A1B] border border-[var(--secondary)]/25 rounded-2xl p-4 shadow-2xl z-50 space-y-3"
                                        >
                                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-500">
                                                <span>Select Occasion</span>
                                                {selectedUseCases.length > 0 && (
                                                    <button onClick={() => setSelectedUseCases([])} className="text-[10px] text-[var(--primary)] underline lowercase">clear</button>
                                                )}
                                            </div>
                                            <div className="max-h-60 overflow-y-auto pr-1 custom-scrollbar space-y-1">
                                                {availableUseCases.map((uc) => {
                                                    const isChecked = selectedUseCases.includes(uc);
                                                    return (
                                                        <button
                                                            key={uc}
                                                            onClick={() => {
                                                                if (isChecked) {
                                                                    setSelectedUseCases(prev => prev.filter(x => x !== uc));
                                                                } else {
                                                                    setSelectedUseCases(prev => [...prev, uc]);
                                                                }
                                                            }}
                                                            className={`w-full text-left text-xs font-bold px-2 py-1.5 rounded-lg flex items-center justify-between ${isChecked ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                                        >
                                                            <span>{uc}</span>
                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'border-gray-300'}`}>
                                                                {isChecked && <Check size={10} />}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Dropdown 4: Print Style */}
                            <div className="relative">
                                <button 
                                    onClick={() => setActiveDropdown(activeDropdown === 'printStyle' ? null : 'printStyle')}
                                    className={`px-4 py-2 text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                                        selectedPrintStyles.length > 0 
                                            ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--bg)]' 
                                            : 'bg-white/40 dark:bg-white/5 border-[var(--secondary)]/30 hover:border-[var(--secondary)]'
                                    }`}
                                >
                                    Print Style {selectedPrintStyles.length > 0 && `(${selectedPrintStyles.length})`}
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'printStyle' ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeDropdown === 'printStyle' && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#121A1B] border border-[var(--secondary)]/25 rounded-2xl p-4 shadow-2xl z-50 space-y-3"
                                        >
                                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-500">
                                                <span>Print Technique</span>
                                                {selectedPrintStyles.length > 0 && (
                                                    <button onClick={() => setSelectedPrintStyles([])} className="text-[10px] text-[var(--primary)] underline lowercase">clear</button>
                                                )}
                                            </div>
                                            <div className="max-h-60 overflow-y-auto pr-1 custom-scrollbar space-y-1">
                                                {availablePrintStyles.map((ps) => {
                                                    const isChecked = selectedPrintStyles.includes(ps);
                                                    return (
                                                        <button
                                                            key={ps}
                                                            onClick={() => {
                                                                if (isChecked) {
                                                                    setSelectedPrintStyles(prev => prev.filter(x => x !== ps));
                                                                } else {
                                                                    setSelectedPrintStyles(prev => [...prev, ps]);
                                                                }
                                                            }}
                                                            className={`w-full text-left text-xs font-bold px-2 py-1.5 rounded-lg flex items-center justify-between ${isChecked ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                                        >
                                                            <span>{ps}</span>
                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'border-gray-300'}`}>
                                                                {isChecked && <Check size={10} />}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Dropdown 5: Highlights */}
                            <div className="relative">
                                <button 
                                    onClick={() => setActiveDropdown(activeDropdown === 'highlights' ? null : 'highlights')}
                                    className={`px-4 py-2 text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                                        selectedHighlights.length > 0 
                                            ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--bg)]' 
                                            : 'bg-white/40 dark:bg-white/5 border-[var(--secondary)]/30 hover:border-[var(--secondary)]'
                                    }`}
                                >
                                    Highlights {selectedHighlights.length > 0 && `(${selectedHighlights.length})`}
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'highlights' ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeDropdown === 'highlights' && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#121A1B] border border-[var(--secondary)]/25 rounded-2xl p-4 shadow-2xl z-50 space-y-3"
                                        >
                                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-500">
                                                <span>Highlights / Features</span>
                                                {selectedHighlights.length > 0 && (
                                                    <button onClick={() => setSelectedHighlights([])} className="text-[10px] text-[var(--primary)] underline lowercase">clear</button>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                {[
                                                    { id: 'featured', label: 'Featured Collection' },
                                                    { id: 'bestSeller', label: 'Best Sellers' },
                                                    { id: 'newArrival', label: 'New Arrivals' },
                                                    { id: 'customizable', label: 'Supports Customization' },
                                                ].map((hl) => {
                                                    const isChecked = selectedHighlights.includes(hl.id);
                                                    return (
                                                        <button
                                                            key={hl.id}
                                                            onClick={() => {
                                                                if (isChecked) {
                                                                    setSelectedHighlights(prev => prev.filter(x => x !== hl.id));
                                                                } else {
                                                                    setSelectedHighlights(prev => [...prev, hl.id]);
                                                                }
                                                            }}
                                                            className={`w-full text-left text-xs font-bold px-2 py-1.5 rounded-lg flex items-center justify-between ${isChecked ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                                        >
                                                            <span>{hl.label}</span>
                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'border-gray-300'}`}>
                                                                {isChecked && <Check size={10} />}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Mobile Filter Toggle Button with Badge */}
                        <div className="flex lg:hidden items-center gap-2 flex-1 min-w-0">
                            <button 
                                onClick={() => setIsMobileFilterOpen(true)}
                                className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-[var(--bg)] rounded-xl text-xs font-bold uppercase tracking-wider shadow-md active:scale-95 transition-transform cursor-pointer min-h-[44px] touch-manipulation"
                            >
                                <Filter size={14} /> 
                                <span className="sm:inline">Filters</span>
                                {activeFilterCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-chip-bounce">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Sorting Dropdown (Right Side, Desktop + Mobile) */}
                        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                            <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:inline">Sort:</span>
                            <select 
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="bg-transparent dark:text-[var(--text)] text-[11px] sm:text-xs font-black border-b-2 border-[var(--primary)] px-1.5 sm:px-2 py-1 outline-none min-w-[100px] sm:min-w-[140px] cursor-pointer min-h-[44px] touch-manipulation"
                            >
                                <option value="Popular">Popularity</option>
                                <option value="PriceLowToHigh">Price: Low → High</option>
                                <option value="PriceHighToLow">Price: High → Low</option>
                                <option value="Newest">New Arrivals</option>
                            </select>
                        </div>

                    </div>
                </div>
            </div>

            {/* 4. ACTIVE FILTERS DISMISSAL BADGES */}
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 py-2 sm:py-3">
                <AnimatePresence>
                    {activeFiltersList.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 bg-white/40 dark:bg-white/5 backdrop-blur-md p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-[var(--secondary)]/15 shadow-sm overflow-x-auto no-scrollbar"
                        >
                            <span className="text-[10px] sm:text-xs font-bold opacity-60 mr-1 flex items-center gap-1 uppercase whitespace-nowrap shrink-0">
                                <Sliders size={10} className="sm:w-3 sm:h-3" /> Active:
                            </span>
                            <div className="flex gap-1.5 flex-nowrap sm:flex-wrap overflow-x-auto no-scrollbar">
                                {activeFiltersList.map((filter, idx) => (
                                    <motion.span 
                                        key={idx} 
                                        layout
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        className="bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] sm:text-xs font-bold pl-2.5 sm:pl-3 pr-1 sm:pr-1.5 py-1 sm:py-1.5 rounded-full flex items-center gap-1 shadow-sm border border-[var(--primary)]/15 whitespace-nowrap shrink-0"
                                    >
                                        {filter.label}
                                        <button 
                                            onClick={() => handleDismissFilter(filter)}
                                            className="p-1 hover:bg-[var(--primary)]/20 rounded-full transition-colors touch-manipulation min-w-[28px] min-h-[28px] flex items-center justify-center"
                                        >
                                            <X size={10} className="sm:w-3 sm:h-3" />
                                        </button>
                                    </motion.span>
                                ))}
                            </div>
                            <button 
                                onClick={handleClearAllFilters} 
                                className="text-[10px] sm:text-xs text-[var(--primary)] font-black hover:underline flex items-center gap-1 pl-3 sm:pl-4 border-l border-gray-300 dark:border-white/10 whitespace-nowrap shrink-0 touch-manipulation min-h-[28px]"
                            >
                                <RotateCcw size={10} className="sm:w-3 sm:h-3" /> Reset
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 5. MAIN CONTENT LAYOUT */}
            <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 py-4 sm:py-6">
                
                {loading ? (
                    <div className="w-full flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
                        <div className="animate-spin w-8 h-8 sm:w-10 sm:h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full mb-4"></div>
                        <p className="font-bold opacity-75 text-[10px] sm:text-xs uppercase tracking-widest">Compiling Collection...</p>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 lg:gap-8 items-start">
                        
                        {/* Left Side: Category Sidebar (Sticky) */}
                        <aside className="w-full lg:w-[280px] shrink-0 sticky top-[150px] bg-[#A7AA63]/25 dark:bg-[#121A1B]/60 p-6 rounded-[24px] border border-[var(--secondary)]/30 shadow-md hidden lg:block z-20">
                            <h3 className="text-xl font-serif font-black mb-6 uppercase tracking-wider border-b border-[var(--text)] inline-block pb-1">
                                CATEGORIES
                            </h3>
                            <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                <li>
                                    <button 
                                        onClick={() => {
                                            setSelectedCategory(null);
                                            setSelectedSubcategory(null);
                                            setShowAllProducts(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${!selectedCategory ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--text)] hover:bg-[var(--text)]/5'}`}
                                    >
                                        <span className={!selectedCategory ? 'text-white' : 'text-[var(--primary)] font-black'}>•</span>
                                        View All
                                    </button>
                                </li>
                                {categories.map((cat) => {
                                    const isCatSelected = selectedCategory?._id === cat._id;
                                    return (
                                        <li key={cat._id} className="space-y-1.5">
                                            <button 
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setSelectedSubcategory(null);
                                                    setShowAllProducts(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full transition-all duration-300 cursor-pointer ${isCatSelected ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--text)] hover:bg-[var(--text)]/5'}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className={isCatSelected ? 'text-white' : 'text-[var(--primary)] font-black'}>•</span>
                                                    <span className="text-sm font-bold">{cat.name}</span>
                                                </div>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`w-3.5 h-3.5 transition-transform duration-300 ${isCatSelected ? 'rotate-90 text-white' : 'text-gray-500'}`}><polyline points="9 18 15 12 9 6"></polyline></svg>
                                            </button>
 
                                            {/* Subcategories (Visible if category is selected) */}
                                            {isCatSelected && subcategories.filter(s => {
                                                const parentId = s.parentCategory?._id || s.parentCategory;
                                                return String(parentId) === String(cat._id);
                                            }).length > 0 && (
                                                <ul className="pl-8 space-y-1.5 mt-1 animate-in slide-in-from-top-2 duration-300">
                                                    {subcategories
                                                        .filter(s => {
                                                            const parentId = s.parentCategory?._id || s.parentCategory;
                                                            return String(parentId) === String(cat._id);
                                                        })
                                                        .map(sub => {
                                                            const isSubSelected = selectedSubcategory?._id === sub._id;
                                                            return (
                                                                <li key={sub._id}>
                                                                    <button 
                                                                        onClick={() => {
                                                                            setSelectedSubcategory(sub);
                                                                            setShowAllProducts(false);
                                                                        }}
                                                                        className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-all duration-200 cursor-pointer ${isSubSelected ? 'text-[var(--primary)] font-black' : 'text-gray-500 hover:text-[var(--primary)]'}`}
                                                                    >
                                                                        {sub.name}
                                                                    </button>
                                                                </li>
                                                            );
                                                        })
                                                    }
                                                </ul>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </aside>

                        {/* Right Side Column */}
                        <div className="w-full flex-grow min-h-[50vh]">
                            {!selectedCategory ? (
                                <div className="space-y-6">
                                    <div className="border-b border-[var(--secondary)]/15 pb-3">
                                        <h2 className="text-2xl font-serif font-black uppercase tracking-tight">Browse Collections</h2>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Select a category to unlock our tailored filters</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {categories.map((cat) => (
                                            <motion.div 
                                                key={cat._id}
                                                whileHover={{ y: -6 }}
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setSelectedSubcategory(null);
                                                    setShowAllProducts(false);
                                                }}
                                                className="group cursor-pointer relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-[#A7AA63]/12 dark:bg-[#121A1B]/40 aspect-[4/5] flex items-end border border-[var(--secondary)]/15"
                                            >
                                                <img 
                                                    src={resolveImage(cat.image)} 
                                                    alt={cat.name} 
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" 
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                                                <div className="relative z-10 p-6 w-full transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 space-y-1">
                                                    <span className="text-[10px] font-bold text-[#A7AA63] uppercase tracking-widest">Premium collection</span>
                                                    <h3 className="text-white text-xl font-bold tracking-wide">{cat.name}</h3>
                                                    <div className="h-0 overflow-hidden group-hover:h-auto group-hover:mt-1 transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs font-bold text-gray-300">
                                                        <span>Explore Studio</span> &rarr;
                                                    </div>
                                                </div>
                                             </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ) : (() => {
                                 const categorySubs = subcategories.filter(s => {
                                     const parentId = s.parentCategory?._id || s.parentCategory;
                                     return String(parentId) === String(selectedCategory._id);
                                 });

                                 const showSubcategoryCards = categorySubs.length > 0 && !selectedSubcategory && !showAllProducts;

                                 if (showSubcategoryCards) {
                                     return (
                                         <div className="space-y-6">
                                             <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[var(--secondary)]/15 pb-4 mb-8 gap-4">
                                                 <div>
                                                     <h2 className="text-3xl font-serif font-black uppercase tracking-tight text-[var(--text)]">
                                                         {selectedCategory.name}
                                                     </h2>
                                                     <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">
                                                         Select a subcategory style to browse custom products
                                                     </p>
                                                 </div>
                                                 
                                                 {/* Subcategories pill chips list on the right (none selected during subcategory cards display) */}
                                                 <div className="flex flex-wrap items-center gap-2">
                                                     <button
                                                         onClick={() => {
                                                             setSelectedSubcategory(null);
                                                             setShowAllProducts(true);
                                                         }}
                                                         className="px-4 py-2 text-xs font-bold rounded-full border border-[var(--secondary)]/20 bg-white/40 dark:bg-white/5 text-[var(--text)] hover:border-[var(--secondary)] transition-all cursor-pointer"
                                                     >
                                                         All Products
                                                     </button>
                                                     {categorySubs.map((sub) => (
                                                         <button
                                                             key={sub._id}
                                                             onClick={() => {
                                                                 setSelectedSubcategory(sub);
                                                                 setShowAllProducts(false);
                                                             }}
                                                             className="px-4 py-2 text-xs font-bold rounded-full border border-[var(--secondary)]/20 bg-white/40 dark:bg-white/5 text-[var(--text)] hover:border-[var(--secondary)] transition-all cursor-pointer"
                                                         >
                                                             {sub.name}
                                                         </button>
                                                     ))}
                                                 </div>
                                             </div>

                                             <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-8 gap-6 pb-6 lg:pb-0 scroll-smooth custom-scrollbar lg:overflow-x-visible">
                                                 {categorySubs.map((sub) => {
                                                     const isSelected = selectedSubcategory?._id === sub._id;
                                                     const subProductCount = allProducts.filter(p => {
                                                         const pSubId = typeof p.subcategory === 'object' ? p.subcategory?._id : p.subcategory;
                                                         return String(pSubId) === String(sub._id);
                                                     }).length;
                                                     return (
                                                         <div 
                                                             key={sub._id}
                                                             onClick={() => {
                                                                 setSelectedSubcategory(sub);
                                                                 setShowAllProducts(false);
                                                             }}
                                                             className="group cursor-pointer flex-shrink-0 w-[280px] sm:w-[320px] lg:w-auto snap-start flex flex-col"
                                                         >
                                                             {/* Image wrapper */}
                                                             <div className={`relative overflow-hidden rounded-2xl aspect-[4/5] bg-[#A7AA63]/10 border transition-all duration-300 ${
                                                                 isSelected 
                                                                     ? 'border-[var(--primary)] ring-2 ring-[var(--primary)] shadow-[0_0_20px_rgba(167,170,99,0.35)] dark:shadow-[0_0_20px_rgba(167,170,99,0.2)]' 
                                                                     : 'border-[var(--secondary)]/15 group-hover:border-[var(--secondary)]/40 shadow-md group-hover:shadow-xl'
                                                             }`}>
                                                                 {sub.image ? (
                                                                     <img 
                                                                         src={resolveImage(sub.image)} 
                                                                         alt={sub.name} 
                                                                         className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108" 
                                                                     />
                                                                 ) : (
                                                                     <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/10" />
                                                                 )}
                                                                 
                                                                 {/* Hover overlay with smooth gradient fade */}
                                                                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                                                                     <h4 className="text-xl font-bold tracking-wide transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-75">{sub.name}</h4>
                                                                     <p className="text-[11px] font-bold text-[#A7AA63] uppercase tracking-wider mt-0.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                                                                         {subProductCount} {subProductCount === 1 ? 'Product' : 'Products'}
                                                                     </p>
                                                                     {sub.description && (
                                                                         <p className="text-xs text-gray-300 line-clamp-3 mt-2 font-medium leading-relaxed transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                                                                             {sub.description}
                                                                         </p>
                                                                     )}
                                                                     <div className="flex items-center gap-1 mt-4 text-xs font-bold text-[#A7AA63] hover:text-white transition-colors transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-200 group/explore">
                                                                         <span>Explore</span> &rarr;
                                                                     </div>
                                                                 </div>
                                                             </div>

                                                             {/* Outer text details */}
                                                             <div className="mt-4 flex flex-col items-start">
                                                                 <h3 className="text-lg font-serif font-black tracking-tight text-[var(--text)] group-hover:text-[var(--primary)] transition-colors leading-tight">
                                                                     {sub.name}
                                                                 </h3>
                                                                 <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-gray-400 dark:text-gray-500 group-hover:text-[var(--primary)] transition-colors group/explore-link">
                                                                     <span>Explore</span>
                                                                     <span className="transition-transform group-hover/explore-link:translate-x-1">&rarr;</span>
                                                                 </div>
                                                             </div>
                                                         </div>
                                                     );
                                                 })}
                                             </div>
                                         </div>
                                     );
                                 } else {
                                     return (
                                         <div className="space-y-6">
                                             <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[var(--secondary)]/15 pb-4 mb-8 gap-4">
                                                 <div>
                                                     <div className="flex items-center gap-3">
                                                         {(selectedSubcategory || showAllProducts) && (
                                                             <button
                                                                 onClick={() => {
                                                                     setSelectedSubcategory(null);
                                                                     setShowAllProducts(false);
                                                                 }}
                                                                 className="px-4 py-2 text-xs font-bold rounded-full border border-[var(--secondary)]/20 bg-white/40 dark:bg-white/5 text-[var(--text)] hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm"
                                                             >
                                                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                                                                 Back
                                                             </button>
                                                         )}
                                                         <h2 className="text-3xl font-serif font-black uppercase tracking-tight text-[var(--text)]">
                                                             {selectedCategory.name}
                                                         </h2>
                                                     </div>
                                                     <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">
                                                         {products.length} BESPOKE RESULTS FOUND
                                                     </p>
                                                 </div>
                                                 
                                                 {/* Subcategories pill chips list on the right */}
                                                 {categorySubs.length > 0 ? (
                                                     <div className="flex flex-wrap items-center gap-2">
                                                         <button
                                                             onClick={() => {
                                                                 setSelectedSubcategory(null);
                                                                 setShowAllProducts(true);
                                                             }}
                                                             className={`px-4 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                                                                 showAllProducts && !selectedSubcategory
                                                                     ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm'
                                                                     : 'bg-white/40 dark:bg-white/5 border-[var(--secondary)]/20 text-[var(--text)] hover:border-[var(--secondary)]'
                                                             }`}
                                                         >
                                                             All Products
                                                         </button>
                                                         {categorySubs.map((sub) => {
                                                             const isSubSelected = selectedSubcategory?._id === sub._id;
                                                             return (
                                                                 <button
                                                                     key={sub._id}
                                                                     onClick={() => {
                                                                         setSelectedSubcategory(sub);
                                                                         setShowAllProducts(false);
                                                                     }}
                                                                     className={`px-4 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                                                                         isSubSelected
                                                                             ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm'
                                                                             : 'bg-white/40 dark:bg-white/5 border-[var(--secondary)]/20 text-[var(--text)] hover:border-[var(--secondary)]'
                                                                     }`}
                                                                 >
                                                                     {sub.name}
                                                                 </button>
                                                             );
                                                         })}
                                                     </div>
                                                 ) : (
                                                     <button
                                                         onClick={() => setSelectedCategory(null)}
                                                         className="text-xs font-bold text-[var(--primary)] hover:underline cursor-pointer"
                                                     >
                                                         &larr; Back to Collections
                                                     </button>
                                                 )}
                                             </div>

                                             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                                                 {products.length === 0 ? (
                                                     <div className="col-span-full py-20 text-center bg-[#A7AA63]/12 dark:bg-[#121A1B]/40 rounded-2xl border border-[var(--secondary)]/15">
                                                         <p className="text-lg font-bold opacity-75">No products found in this category.</p>
                                                         <button 
                                                             onClick={() => {
                                                                 setSelectedSubcategory(null);
                                                                 setSelectedCategory(null);
                                                                 setShowAllProducts(false);
                                                             }} 
                                                             className="mt-4 px-6 py-2 bg-[var(--primary)] text-[var(--bg)] rounded-full text-sm font-bold shadow-md hover:bg-opacity-90 transition-all cursor-pointer"
                                                         >
                                                             Clear Filters
                                                         </button>
                                                     </div>
                                                 ) : (
                                                     products.map((prod) => {
                                                         const isWish = isInWishlist(prod._id);
                                                         
                                                         // Determine single badge maximum
                                                         let badgeText = null;
                                                         if (prod.isBestSeller) {
                                                             badgeText = "🔥 Best Seller";
                                                         } else if (prod.isNewArrival) {
                                                             badgeText = "🆕 New Arrival";
                                                         }

                                                         return (
                                                             <Link 
                                                                 href={`/product/${prod._id}`} 
                                                                 key={prod._id} 
                                                                 className="group bg-[#A7AA63]/12 dark:bg-[#121A1B]/45 rounded-[24px] border border-[var(--secondary)]/15 hover:border-[var(--secondary)]/35 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden flex flex-col h-full cursor-pointer relative"
                                                             >
                                                                 {/* Image Wrapper */}
                                                                 <div className="relative aspect-square overflow-hidden bg-black/5 p-0">
                                                                     <img 
                                                                         src={resolveImage(prod.coverImage || prod.primaryImage || (prod.images && prod.images[0]))} 
                                                                         alt={prod.name} 
                                                                         className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
                                                                     />
                                                                     
                                                                     {/* Cinematic Darken Hover Overlay */}
                                                                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10" />
 
                                                                     {/* Premium Single Badge */}
                                                                     {badgeText && (
                                                                         <span className="absolute top-3 left-3 bg-white/95 dark:bg-black/90 text-black dark:text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider z-20 shadow-sm border border-black/5 dark:border-white/10 flex items-center gap-1">
                                                                             {badgeText}
                                                                         </span>
                                                                     )}
                                                                     
                                                                     {/* Wishlist Button */}
                                                                     <button 
                                                                         onClick={(e) => handleWishlistClick(e, prod)}
                                                                         className={`absolute top-3 right-3 w-11 h-11 sm:w-9 sm:h-9 backdrop-blur-md rounded-full flex items-center justify-center shadow-md transition-all duration-300 z-20 group/wishlist
                                                                             ${isWish 
                                                                                 ? 'bg-red-500 text-white hover:bg-red-600' 
                                                                                 : 'bg-white/80 dark:bg-black/50 text-gray-700 dark:text-gray-300 hover:text-red-500 hover:bg-white'
                                                                             }
                                                                             hover:scale-105 active:scale-95
                                                                         `}
                                                                         title={isWish ? "Remove from Wishlist" : "Add to Wishlist"}
                                                                     >
                                                                         <Heart 
                                                                             size={15} 
                                                                             fill={isWish ? "currentColor" : "none"} 
                                                                             className={`transition-transform duration-300 ${isWish ? 'scale-105' : 'group-hover/wishlist:scale-105'}`} 
                                                                         />
                                                                     </button>
                                                                 </div>
                                                                 
                                                                 {/* Content */}
                                                                 <div className="p-3 sm:p-4 flex flex-col flex-grow">
                                                                     <h3 className="text-xs sm:text-sm font-bold text-[var(--text)] line-clamp-2 leading-snug group-hover:text-[var(--primary)] transition-colors">
                                                                         {prod.name}
                                                                     </h3>
                                                                     <p className="mt-1 text-[10px] sm:text-[11px] font-medium leading-snug text-[var(--text)] opacity-60 line-clamp-1">
                                                                         {prod.shortDescription || "Premium bespoke custom printing."}
                                                                     </p>
                                                                     
                                                                     {/* Footer of Card */}
                                                                     <div className="mt-auto flex items-end justify-between gap-3 pt-3 border-t border-[var(--secondary)]/10">
                                                                         <div className="min-w-0">
                                                                             {/* Price Section */}
                                                                             <div className="flex items-baseline gap-1.5">
                                                                                 {prod.offerPrice && prod.offerPrice < prod.price ? (
                                                                                     <>
                                                                                         <span className="text-sm sm:text-base font-black text-[var(--text)]">₹{prod.offerPrice}</span>
                                                                                         <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 line-through">₹{prod.price}</span>
                                                                                     </>
                                                                                 ) : (
                                                                                     <span className="text-sm sm:text-base font-black text-[var(--text)]">₹{prod.price}</span>
                                                                                 )}
                                                                             </div>
                                                                             
                                                                             {/* Rating */}
                                                                             <div className="flex items-center gap-1 mt-1.5">
                                                                                 <span className="text-[9px] font-bold bg-[color-mix(in_srgb,var(--text)_10%,transparent)] px-1.5 py-0.5 rounded flex items-center gap-1 text-[var(--text)]">
                                                                                     {prod.rating || "5.0"} 
                                                                                     <Star size={9} className="fill-amber-500 stroke-amber-500" />
                                                                                 </span>
                                                                             </div>
                                                                         </div>
                                                                         
                                                                         {/* Cart Button */}
                                                                         <button 
                                                                             onClick={(e) => handleCartClick(e, prod)}
                                                                             className={`w-11 h-11 sm:w-9 sm:h-9 bg-[var(--primary)] text-white rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-105 active:scale-95 group/cart ${
                                                                                 cartSuccessId === prod._id ? 'bg-emerald-600 scale-105' : 'hover:bg-opacity-95'
                                                                             }`}
                                                                             title="Add to Cart"
                                                                         >
                                                                             {cartSuccessId === prod._id ? (
                                                                                 <Check size={14} className="text-white" />
                                                                             ) : (
                                                                                 <ShoppingBag size={14} className="text-white transition-transform duration-300 group-hover/cart:scale-105" />
                                                                             )}
                                                                         </button>
                                                                     </div>
                                                                 </div>
                                                             </Link>
                                                         );
                                                     })
                                                 )}
                                             </div>
                                         </div>
                                     );
                                 }
                             })()}
                        </div>
                    </div>
                )}
            </main>

            {/* Extra category list carousel preview */}
            <CategoryUI />

            <Footer />

            {/* 6. MOBILE FILTER DRAWER BOTTOM SHEET */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        {/* Overlay backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="fixed inset-0 z-50 mobile-filter-drawer-overlay cursor-pointer"
                        />
                        
                        {/* Bottom sheet */}
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 220 }}
                            className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-[#121A1B] rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col border-t border-[var(--secondary)]/25 pb-safe"
                        >
                            {/* Drag handle */}
                            <div className="pt-3 pb-1 shrink-0">
                                <div className="drawer-handle" />
                            </div>

                            {/* Drawer header */}
                            <div className="px-5 py-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-1.5">
                                    <Sliders size={18} className="text-[var(--primary)]" />
                                    <h3 className="text-base font-bold uppercase tracking-wider text-[var(--text)]">Advanced Filters</h3>
                                </div>
                                <button 
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
                                >
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Scrollable Filters Content */}
                            <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-4">
                                
                                {/* Section A: Categories Accordion */}
                                <div className="border-b border-gray-100 dark:border-white/5 pb-3">
                                    <button 
                                        onClick={() => toggleFilterSection('categories')}
                                        className="filter-section-header w-full text-left py-3 flex items-center justify-between text-[var(--text)]"
                                    >
                                        <span className="text-xs font-black uppercase tracking-wider text-gray-500">Categories</span>
                                        {mobileFilterSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    {mobileFilterSections.categories && (
                                        <div className="space-y-4 pt-1 pb-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedCategory(null);
                                                        setSelectedSubcategory(null);
                                                        setShowAllProducts(false);
                                                    }}
                                                    className={`px-3 py-2 text-xs font-bold rounded-xl border text-center transition-all min-h-[44px] touch-manipulation ${
                                                        !selectedCategory 
                                                            ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-md' 
                                                            : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5'
                                                    }`}
                                                >
                                                    All Categories
                                                </button>
                                                {categories.map(cat => {
                                                    const isSelected = selectedCategory?._id === cat._id;
                                                    return (
                                                        <button 
                                                            key={cat._id}
                                                            onClick={() => {
                                                                setSelectedCategory(cat);
                                                                setSelectedSubcategory(null);
                                                                setShowAllProducts(false);
                                                            }}
                                                            className={`relative flex items-center justify-between pl-3 pr-8 py-2 text-xs font-bold rounded-xl border transition-all min-h-[44px] touch-manipulation overflow-hidden ${
                                                                isSelected 
                                                                    ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-md' 
                                                                    : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5'
                                                            }`}
                                                        >
                                                            <span className="relative z-10 truncate pr-1">{cat.name}</span>
                                                            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none">
                                                                <img src={resolveImage(cat.image)} className="w-full h-full object-cover" />
                                                            </div>
                                                            {isSelected && <Check size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white z-10" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            
                                            {/* Subcategories snap scroll chips row */}
                                            {selectedCategory && subcategories.filter(s => (s.parentCategory?._id || s.parentCategory) === selectedCategory._id).length > 0 && (
                                                <div className="pt-1">
                                                    <span className="block text-[10px] text-gray-400 font-bold uppercase mb-2">Subcategories</span>
                                                    <div className="flex overflow-x-auto gap-2 pb-2 mobile-snap-scroll">
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedSubcategory(null);
                                                                setShowAllProducts(true);
                                                            }}
                                                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all shrink-0 min-h-[44px] flex items-center justify-center ${
                                                                !selectedSubcategory && showAllProducts
                                                                    ? 'bg-[var(--primary)] border-[var(--primary)] text-white' 
                                                                    : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-500'
                                                            }`}
                                                        >
                                                            All Products
                                                        </button>
                                                        {subcategories.filter(s => (s.parentCategory?._id || s.parentCategory) === selectedCategory._id).map(sub => {
                                                            const isSubSelected = selectedSubcategory?._id === sub._id;
                                                            return (
                                                                <button 
                                                                    key={sub._id}
                                                                    onClick={() => setSelectedSubcategory(sub)}
                                                                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all shrink-0 min-h-[44px] flex items-center justify-center ${
                                                                        isSubSelected 
                                                                            ? 'bg-[var(--primary)]/15 border-[var(--primary)] text-[var(--primary)] font-black' 
                                                                            : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-500'
                                                                    }`}
                                                                >
                                                                    {sub.name}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Section B: Budget Range */}
                                <div className="border-b border-gray-100 dark:border-white/5 pb-3">
                                    <button 
                                        onClick={() => toggleFilterSection('price')}
                                        className="filter-section-header w-full text-left py-3 flex items-center justify-between text-[var(--text)]"
                                    >
                                        <span className="text-xs font-black uppercase tracking-wider text-gray-500">Budget Range</span>
                                        {mobileFilterSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    {mobileFilterSections.price && (
                                        <div className="space-y-4 pt-1 pb-3">
                                            <div className="flex justify-between items-center text-xs font-black text-[var(--primary)]">
                                                <span>₹0</span>
                                                <span className="px-3 py-1 bg-[var(--primary)]/10 rounded-full">Max: ₹{maxPrice}</span>
                                            </div>
                                            <div className="px-1 py-1">
                                                <input 
                                                    type="range"
                                                    min="0"
                                                    max={maxPriceLimit}
                                                    value={maxPrice}
                                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                                    className="premium-range-slider"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Section C: Occasion */}
                                <div className="border-b border-gray-100 dark:border-white/5 pb-3">
                                    <button 
                                        onClick={() => toggleFilterSection('occasion')}
                                        className="filter-section-header w-full text-left py-3 flex items-center justify-between text-[var(--text)]"
                                    >
                                        <span className="text-xs font-black uppercase tracking-wider text-gray-500">Target Occasion</span>
                                        {mobileFilterSections.occasion ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    {mobileFilterSections.occasion && (
                                        <div className="flex flex-wrap gap-2 pt-1 pb-2">
                                            {availableUseCases.map((uc) => {
                                                const isChecked = selectedUseCases.includes(uc);
                                                return (
                                                    <button
                                                        key={uc}
                                                        onClick={() => {
                                                            if (isChecked) {
                                                                setSelectedUseCases(prev => prev.filter(x => x !== uc));
                                                            } else {
                                                                setSelectedUseCases(prev => [...prev, uc]);
                                                            }
                                                        }}
                                                        className={`px-3.5 py-2.5 rounded-full text-xs font-bold border transition-all min-h-[44px] flex items-center justify-center ${
                                                            isChecked 
                                                                ? 'bg-[var(--primary)]/15 border-[var(--primary)] text-[var(--primary)] font-black' 
                                                                : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-300'
                                                        }`}
                                                    >
                                                        {uc}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Section D: Print Technique */}
                                <div className="border-b border-gray-100 dark:border-white/5 pb-3">
                                    <button 
                                        onClick={() => toggleFilterSection('printStyle')}
                                        className="filter-section-header w-full text-left py-3 flex items-center justify-between text-[var(--text)]"
                                    >
                                        <span className="text-xs font-black uppercase tracking-wider text-gray-500">Print Technique</span>
                                        {mobileFilterSections.printStyle ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    {mobileFilterSections.printStyle && (
                                        <div className="flex flex-wrap gap-2 pt-1 pb-2">
                                            {availablePrintStyles.map((ps) => {
                                                const isChecked = selectedPrintStyles.includes(ps);
                                                return (
                                                    <button
                                                        key={ps}
                                                        onClick={() => {
                                                            if (isChecked) {
                                                                setSelectedPrintStyles(prev => prev.filter(x => x !== ps));
                                                            } else {
                                                                setSelectedPrintStyles(prev => [...prev, ps]);
                                                            }
                                                        }}
                                                        className={`px-3.5 py-2.5 rounded-full text-xs font-bold border transition-all min-h-[44px] flex items-center justify-center ${
                                                            isChecked 
                                                                ? 'bg-[var(--primary)]/15 border-[var(--primary)] text-[var(--primary)] font-black' 
                                                                : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-300'
                                                        }`}
                                                    >
                                                        {ps}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Section E: Highlights */}
                                <div className="border-b border-gray-100 dark:border-white/5 pb-3">
                                    <button 
                                        onClick={() => toggleFilterSection('highlights')}
                                        className="filter-section-header w-full text-left py-3 flex items-center justify-between text-[var(--text)]"
                                    >
                                        <span className="text-xs font-black uppercase tracking-wider text-gray-500">Highlights</span>
                                        {mobileFilterSections.highlights ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    {mobileFilterSections.highlights && (
                                        <div className="grid grid-cols-2 gap-2 pt-1 pb-2">
                                            {[
                                                { id: 'featured', label: 'Featured' },
                                                { id: 'bestSeller', label: 'Best Sellers' },
                                                { id: 'newArrival', label: 'New Arrivals' },
                                                { id: 'customizable', label: 'Customizable' },
                                            ].map((hl) => {
                                                const isChecked = selectedHighlights.includes(hl.id);
                                                return (
                                                    <button
                                                        key={hl.id}
                                                        onClick={() => {
                                                            if (isChecked) {
                                                                setSelectedHighlights(prev => prev.filter(x => x !== hl.id));
                                                            } else {
                                                                setSelectedHighlights(prev => [...prev, hl.id]);
                                                            }
                                                        }}
                                                        className={`px-3 py-2 text-xs font-bold rounded-xl border text-center transition-all min-h-[44px] ${
                                                            isChecked 
                                                                ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-md font-black' 
                                                                : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5'
                                                        }`}
                                                    >
                                                        {hl.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                            </div>

                            {/* Sticky Drawer Actions */}
                            <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/25 flex flex-col gap-2 shrink-0">
                                <div className="text-center text-[11px] font-black text-gray-500 uppercase tracking-widest">
                                    {products.length} {products.length === 1 ? 'Bespoke Result' : 'Bespoke Results'} Found
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={handleClearAllFilters}
                                        className="flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-350 text-gray-500 bg-white hover:bg-gray-50 active:scale-98 transition-transform cursor-pointer min-h-[48px]"
                                    >
                                        Reset All
                                    </button>
                                    <button 
                                        onClick={() => setIsMobileFilterOpen(false)}
                                        className="flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl bg-[var(--primary)] text-[var(--bg)] shadow-md active:scale-98 transition-transform cursor-pointer min-h-[48px]"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}
