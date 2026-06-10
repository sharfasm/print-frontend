// @ts-nocheck
"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Footer from '../components/Footer';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import config from '../brand/config';
import CategoryUI from './HomeUI/CategoryUI';
import ProductCard from '../components/ProductCard';
import { useShop } from '../context/ShopContext';
import CategorySEOContent from '../components/category/CategorySEOContent';
import CategoryFAQ from '../components/category/CategoryFAQ';
import RelatedCategories from '../components/category/RelatedCategories';
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
  Printer,
  ShieldCheck,
  Flame,
  TrendingUp,
  Palette,
  Loader2
} from 'lucide-react';

// ============================================================
// CONSTANTS
// ============================================================
const PRODUCTS_PER_PAGE = 8;

// ============================================================
// SKELETON CARD (PRODUCT SIZE)
// ============================================================
const SkeletonProductCard = memo(({ index }: { index: number }) => (
  <div 
    className="bg-white dark:bg-[#1a2526] rounded-2xl border border-[var(--secondary)]/10 overflow-hidden flex flex-col h-full"
    style={{ animationDelay: `${index * 60}ms` }}
  >
    <div className="relative aspect-square skeleton-shimmer" />
    <div className="p-2.5 sm:p-3 flex flex-col gap-2">
      <div className="h-3 w-4/5 rounded-full skeleton-shimmer" />
      <div className="h-3 w-3/5 rounded-full skeleton-shimmer" />
      <div className="flex items-center gap-2 mt-1">
        <div className="h-4 w-14 rounded-full skeleton-shimmer" />
        <div className="h-3 w-10 rounded-full skeleton-shimmer" />
      </div>
      <div className="h-5 w-20 rounded-full skeleton-shimmer mt-1" />
      <div className="flex items-center justify-between mt-1 pt-2 border-t border-[var(--secondary)]/5">
        <div className="h-3 w-12 rounded skeleton-shimmer" />
        <div className="h-8 w-8 rounded-full skeleton-shimmer" />
      </div>
    </div>
  </div>
));
SkeletonProductCard.displayName = 'SkeletonProductCard';

// ============================================================
// SKELETON SUBCATEGORY CARD (3-COL COMPACT)
// ============================================================
const SkeletonSubcategoryCard = memo(({ index }: { index: number }) => (
  <div 
    className="bg-white dark:bg-[#1a2526] rounded-xl border border-[var(--secondary)]/10 overflow-hidden flex flex-col"
    style={{ animationDelay: `${index * 40}ms` }}
  >
    <div className="aspect-square skeleton-shimmer" />
    <div className="p-2 flex flex-col gap-1.5">
      <div className="h-3 w-3/4 rounded-full skeleton-shimmer mx-auto" />
      <div className="h-2.5 w-1/2 rounded-full skeleton-shimmer mx-auto" />
    </div>
  </div>
));
SkeletonSubcategoryCard.displayName = 'SkeletonSubcategoryCard';

// ============================================================
// SUBCATEGORY CARD (3-COL COMPACT FLIPKART STYLE)
// ============================================================
const SubcategoryCard = memo(({ sub, isSelected, productCount, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`group cursor-pointer bg-white dark:bg-[#1a2526] rounded-xl overflow-hidden flex flex-col transition-all duration-200 active:scale-[0.97] touch-manipulation
      ${isSelected 
        ? 'ring-2 ring-[var(--primary)] shadow-md border-[var(--primary)]' 
        : 'border border-[var(--secondary)]/10 shadow-sm hover:shadow-md'
      }`}
  >
    {/* Image */}
    <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-[#121A1B]">
      {sub.image ? (
        <img 
          src={resolveImage(sub.image)} 
          alt={sub.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[var(--primary)]/15 to-[var(--secondary)]/10 flex items-center justify-center">
          <Grid size={20} className="text-[var(--primary)] opacity-40" />
        </div>
      )}
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[var(--primary)] rounded-full flex items-center justify-center shadow-sm">
          <Check size={10} className="text-white" />
        </div>
      )}
    </div>
    
    {/* Text */}
    <div className="p-2 text-center">
      <h4 className={`text-[10px] sm:text-[11px] font-bold leading-tight line-clamp-2 transition-colors ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--text)]'}`}>
        {sub.name}
      </h4>
      <p className="text-[8px] sm:text-[9px] text-gray-400 font-medium mt-0.5">
        {productCount} {productCount === 1 ? 'item' : 'items'}
      </p>
    </div>
  </div>
));
SubcategoryCard.displayName = 'SubcategoryCard';

// ProductCard imported from components

// ============================================================
// INFINITE SCROLL SENTINEL
// ============================================================
const ScrollSentinel = memo(({ onVisible, hasMore, isLoading }: any) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onVisible();
        }
      },
      { rootMargin: '200px', threshold: 0 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [onVisible, hasMore, isLoading]);

  if (!hasMore) return null;

  return (
    <div ref={sentinelRef} className="col-span-full flex justify-center py-6">
      {isLoading ? (
        <div className="flex items-center gap-2 text-[var(--primary)]">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Loading more...</span>
        </div>
      ) : (
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] loading-dot" />
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] loading-dot" />
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] loading-dot" />
        </div>
      )}
    </div>
  );
});
ScrollSentinel.displayName = 'ScrollSentinel';


// ============================================================
// MAIN PRODUCTS COMPONENT
// ============================================================
export default function Products({ initialCategory, initialSubcategory, initialSeoData }: { initialCategory?: any, initialSubcategory?: any, initialSeoData?: any } = {}) {
    const searchParams = useSearchParams();
    const categoryIdFromUrl = searchParams.get('categoryId');
    const subcategoryIdFromUrl = searchParams.get('subcategoryId');
    const navigate = useRouter();
    const { addToCart, toggleWishlist, isInWishlist, brandInfo } = useShop();
    const brandName = brandInfo?.name || config.brand;

    // Core States
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory || null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory || null);
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [loading, setLoading] = useState(true);
    const [defaultBanner, setDefaultBanner] = useState(null);
    const [seoData, setSeoData] = useState(initialSeoData || null);

    // Client-side SEO details loader
    useEffect(() => {
        const currentCategorySlug = selectedCategory?.slug;
        const currentSubcategorySlug = selectedSubcategory?.slug;
        const initialCategorySlug = initialCategory?.slug;
        const initialSubcategorySlug = initialSubcategory?.slug;

        if (currentCategorySlug === initialCategorySlug && currentSubcategorySlug === initialSubcategorySlug) {
            setSeoData(initialSeoData || null);
            return;
        }

        const fetchSeoData = async () => {
            const targetSlug = selectedSubcategory?.slug || selectedCategory?.slug;
            if (!targetSlug) {
                setSeoData(null);
                return;
            }
            try {
                const res = await api.get(`/seo/category/${targetSlug}`);
                setSeoData(res.data);
            } catch (err) {
                console.error("Error fetching category SEO data:", err);
                setSeoData(null);
            }
        };
        fetchSeoData();
    }, [selectedCategory, selectedSubcategory, initialCategory, initialSubcategory, initialSeoData]);

    const activeBanner = useMemo(() => {
        if (selectedSubcategory && (selectedSubcategory.bannerMedia || selectedSubcategory.bannerHeading || selectedSubcategory.bannerSubtitle)) {
            return {
                bannerType: selectedSubcategory.bannerType || selectedCategory?.bannerType || defaultBanner?.bannerType || "image",
                bannerMedia: selectedSubcategory.bannerMedia || selectedCategory?.bannerMedia || defaultBanner?.bannerMedia || "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop",
                bannerHeading: selectedSubcategory.bannerHeading || selectedSubcategory.name,
                bannerSubtitle: selectedSubcategory.bannerSubtitle || selectedSubcategory.description || ""
            };
        }
        if (selectedCategory && (selectedCategory.bannerMedia || selectedCategory.bannerHeading || selectedCategory.bannerSubtitle)) {
            return {
                bannerType: selectedCategory.bannerType || defaultBanner?.bannerType || "image",
                bannerMedia: selectedCategory.bannerMedia || defaultBanner?.bannerMedia || "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop",
                bannerHeading: selectedCategory.bannerHeading || selectedCategory.name,
                bannerSubtitle: selectedCategory.bannerSubtitle || ""
            };
        }
        return {
            bannerType: defaultBanner?.bannerType || "image",
            bannerMedia: defaultBanner?.bannerMedia || "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop",
            bannerHeading: defaultBanner?.bannerHeading || "The Collection",
            bannerSubtitle: defaultBanner?.bannerSubtitle || "Impeccable printing and bespoke craftsmanship tailored for corporate events, modern businesses, and life's special occasions."
        };
    }, [selectedSubcategory, selectedCategory, defaultBanner]);

    // Infinite Scroll State
    const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Advanced Filtering States
    const [sortOption, setSortOption] = useState('Popular');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [maxPriceLimit, setMaxPriceLimit] = useState(10000);
    const [selectedUseCases, setSelectedUseCases] = useState([]);
    const [selectedPrintStyles, setSelectedPrintStyles] = useState([]);
    const [selectedHighlights, setSelectedHighlights] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Metadata
    const [availableUseCases, setAvailableUseCases] = useState(["Business", "Wedding", "Festival", "Birthday", "Corporate", "College Event"]);
    const [availablePrintStyles, setAvailablePrintStyles] = useState(["DTF", "UV", "Screen Print", "Embroidery", "Offset"]);

    // UI States
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [cartSuccessId, setCartSuccessId] = useState(null);
    
    const [mobileFilterSections, setMobileFilterSections] = useState({
        categories: true,
        price: true,
        occasion: false,
        printStyle: false,
        highlights: false,
    });

    const dropdownRef = useRef(null);
    const chipsScrollRef = useRef(null);
    const filterBarRef = useRef<HTMLDivElement>(null);
    const [navbarHeight, setNavbarHeight] = useState(76);
    const [filterBarHeight, setFilterBarHeight] = useState(88);
    const [isDesktopOrTablet, setIsDesktopOrTablet] = useState(false);

    // Active Filters List (defined here to avoid Temporal Dead Zone ReferenceError in useEffect below)
    const activeFiltersList = useMemo(() => {
        const list = [];
        if (selectedCategory) list.push({ type: 'category', label: selectedCategory.name });
        if (selectedSubcategory) list.push({ type: 'subcategory', label: `Subcategory: ${selectedSubcategory.name}` });
        if (minPrice > 0 || maxPrice < maxPriceLimit) list.push({ type: 'price', label: `₹${minPrice} - ₹${maxPrice}` });
        selectedUseCases.forEach(u => list.push({ type: 'useCase', label: u }));
        selectedPrintStyles.forEach(ps => list.push({ type: 'printStyle', label: ps }));
        selectedHighlights.forEach(h => {
            let label = h;
            if (h === 'featured') label = 'Featured';
            if (h === 'bestSeller') label = 'Best Seller';
            if (h === 'newArrival') label = 'New Arrival';
            if (h === 'customizable') label = 'Customizable';
            list.push({ type: 'highlight', val: h, label });
        });
        if (searchQuery) list.push({ type: 'search', label: `"${searchQuery}"` });
        return list;
    }, [selectedCategory, selectedSubcategory, minPrice, maxPrice, maxPriceLimit, selectedUseCases, selectedPrintStyles, selectedHighlights, searchQuery]);

    // Measure heights and screen sizes dynamically using ResizeObserver
    useEffect(() => {
        let resizeObserver: ResizeObserver | null = null;
        let navEl = document.querySelector('nav');
        let filterBarEl = filterBarRef.current;

        const setupObserver = () => {
            if (!resizeObserver && typeof window !== 'undefined' && 'ResizeObserver' in window) {
                resizeObserver = new ResizeObserver((entries) => {
                    for (let entry of entries) {
                        if (entry.target === navEl && navEl) {
                            setNavbarHeight(navEl.offsetHeight);
                        } else if (entry.target === filterBarEl && filterBarEl) {
                            setFilterBarHeight(filterBarEl.offsetHeight);
                        }
                    }
                });
            }
            if (resizeObserver) {
                if (navEl) resizeObserver.observe(navEl);
                if (filterBarEl) resizeObserver.observe(filterBarEl);
            }
        };

        setupObserver();

        // Fallback check if navEl was not loaded yet
        let checkTimer = setInterval(() => {
            const currentNav = document.querySelector('nav');
            if (currentNav && currentNav !== navEl) {
                if (navEl && resizeObserver) resizeObserver.unobserve(navEl);
                navEl = currentNav;
                setupObserver();
                clearInterval(checkTimer);
            }
        }, 100);

        const handleResize = () => {
            setIsDesktopOrTablet(window.innerWidth >= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        
        return () => {
            clearInterval(checkTimer);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const stickyTopOffset = navbarHeight + filterBarHeight;
    
    // Reset visible count on filter changes
    useEffect(() => {
        setVisibleCount(PRODUCTS_PER_PAGE);
    }, [selectedCategory, selectedSubcategory, sortOption, minPrice, maxPrice, selectedUseCases, selectedPrintStyles, selectedHighlights, searchQuery]);

    // Paginated products for infinite scroll
    const visibleProducts = useMemo(() => {
        return products.slice(0, visibleCount);
    }, [products, visibleCount]);

    const hasMoreProducts = visibleCount < products.length;

    const loadMoreProducts = useCallback(() => {
        if (isLoadingMore || !hasMoreProducts) return;
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + PRODUCTS_PER_PAGE, products.length));
            setIsLoadingMore(false);
        }, 300);
    }, [isLoadingMore, hasMoreProducts, products.length]);
    
    const toggleFilterSection = useCallback((section) => {
        setMobileFilterSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    }, []);

    // Active filter count
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

    // Load initial data
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await api.get('/category');
                setCategories(res.data);
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

                    const useCaseSet = new Set(["Business", "Wedding", "Festival", "Birthday", "Corporate", "College Event"]);
                    allProds.forEach(p => {
                        if (p.useCase && Array.isArray(p.useCase)) {
                            p.useCase.forEach(u => useCaseSet.add(u));
                        }
                    });
                    setAvailableUseCases(Array.from(useCaseSet));

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

        const loadDefaultBanner = async () => {
            try {
                const res = await api.get('/products-settings');
                setDefaultBanner(res.data);
            } catch (error) {
                console.error("Error loading default banner:", error);
            }
        };

        const init = async () => {
            setLoading(true);
            await Promise.allSettled([loadCategories(), loadSubcategories(), fetchMetadata(), loadDefaultBanner()]);
            setLoading(false);
        };
        init();
    }, []);

    // Sync state with URL parameters
    useEffect(() => {
        const searchFromUrl = searchParams.get('search') || '';
        setSearchQuery(searchFromUrl);

        if (initialCategory) {
            setSelectedCategory(initialCategory);
            if (initialSubcategory) {
                setSelectedSubcategory(initialSubcategory);
                setShowAllProducts(false);
            } else if (subcategoryIdFromUrl && subcategories.length > 0) {
                const subToSelect = subcategories.find(s => String(s._id) === String(subcategoryIdFromUrl)) || null;
                setSelectedSubcategory(subToSelect);
                if (subToSelect) setShowAllProducts(false);
            }
            return;
        }

        if (categories.length > 0) {
            let catToSelect = null;
            if (categoryIdFromUrl) {
                catToSelect = categories.find(c => String(c._id) === String(categoryIdFromUrl)) || null;
            }
            setSelectedCategory(catToSelect);

            if (subcategories.length > 0) {
                let subToSelect = null;
                if (catToSelect && subcategoryIdFromUrl) {
                    subToSelect = subcategories.find(s => String(s._id) === String(subcategoryIdFromUrl)) || null;
                }
                setSelectedSubcategory(subToSelect);
                if (subToSelect) {
                    setShowAllProducts(false);
                }
            }
        }
    }, [categoryIdFromUrl, subcategoryIdFromUrl, searchParams, categories, subcategories, initialCategory, initialSubcategory]);

    // ===== FETCH PRODUCTS =====
    // KEY CHANGE: Always fetch products when a category is selected (no early return for subcategory cards)
    const fetchProducts = async () => {
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

    // Active Filters - Moved to top of component to resolve initialization ReferenceError

    const handleDismissFilter = (filter) => {
        if (filter.type === 'category') { setSelectedCategory(null); setSelectedSubcategory(null); setShowAllProducts(false); }
        if (filter.type === 'subcategory') { setSelectedSubcategory(null); setShowAllProducts(false); }
        if (filter.type === 'price') { setMinPrice(0); setMaxPrice(maxPriceLimit); }
        if (filter.type === 'useCase') { setSelectedUseCases(prev => prev.filter(x => x !== filter.label)); }
        if (filter.type === 'printStyle') { setSelectedPrintStyles(prev => prev.filter(x => x !== filter.label)); }
        if (filter.type === 'highlight') { setSelectedHighlights(prev => prev.filter(x => x !== filter.val)); }
        if (filter.type === 'search') { setSearchQuery(''); }
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
        setCartSuccessId(prod._id);
        setTimeout(() => setCartSuccessId(null), 1000);
    };

    const handleWishlistClick = (e, prod) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(prod);
    };

    // Compute category subcategories
    const categorySubs = useMemo(() => {
        if (!selectedCategory) return [];
        return subcategories.filter(s => {
            const parentId = s.parentCategory?._id || s.parentCategory;
            return String(parentId) === String(selectedCategory._id);
        });
    }, [selectedCategory, subcategories]);

    return (
        <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
            
            {/* ========== 1. HERO BANNER ========== */}
            <div data-hero-sentinel className="relative w-full h-[35vh] sm:h-[40vh] md:h-[45vh] min-h-[280px] sm:min-h-[320px] md:min-h-[350px] flex flex-col items-center justify-center pt-20 sm:pt-24 pb-6 sm:pb-8 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeBanner.bannerMedia}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 z-0"
                    >
                        {activeBanner.bannerType === "video" ? (
                            <video
                                src={resolveImage(activeBanner.bannerMedia)!}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover scale-105 filter brightness-45 contrast-105"
                            />
                        ) : (
                            <img 
                                src={resolveImage(activeBanner.bannerMedia)!} 
                                alt={`${brandName} Products Header`} 
                                className="w-full h-full object-cover scale-105 filter brightness-45 contrast-105"
                                loading="eager"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-[var(--bg)] transition-colors duration-300" />
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    <motion.div 
                        key={`${activeBanner.bannerHeading}-${activeBanner.bannerSubtitle}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10 text-center text-white space-y-3 sm:space-y-4 px-5 sm:px-6 max-w-4xl flex flex-col items-center mt-4 sm:mt-6"
                    >
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-bold tracking-widest text-[#A7AA63] uppercase border border-white/10">
                            <Sparkles size={12} className="animate-pulse sm:w-3.5 sm:h-3.5" /> Custom Premium Printing
                        </div>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-black tracking-tight drop-shadow-xl uppercase leading-tight">
                            {activeBanner.bannerHeading}
                        </h1>
                        <p className="text-xs sm:text-sm md:text-xl font-medium opacity-90 drop-shadow-lg tracking-wide max-w-2xl text-gray-200 leading-relaxed px-2">
                            {activeBanner.bannerSubtitle}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ========== 2. BREADCRUMBS & SEARCH ========== */}
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
                        <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-150 dark:hover:bg-white/10 touch-manipulation">
                            <X size={12} className="text-gray-400" />
                        </button>
                    )}
                </div>
            </div>



            {/* ========================================================================
                5. MAIN CONTENT — FLIPKART/AMAZON HIERARCHY
                   Title → Chips → 3-col Subcategory Cards → 2-col Products Grid
            ======================================================================== */}
            <main className="flex-grow w-full flex flex-col" style={{ '--sticky-top': `${stickyTopOffset}px` } as any}>
                
                {loading && products.length === 0 ? (
                    /* ===== SKELETON STATE ===== */
                    <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 md:px-10 lg:px-14 py-4 sm:py-6 flex flex-col md:flex-row gap-5 md:gap-8 items-start">
                        <aside className="w-full md:w-[280px] shrink-0 hidden md:block" style={isDesktopOrTablet ? { width: '280px' } : {}}>
                            <div className="bg-white dark:bg-[#1a2526] p-6 rounded-[24px] border border-[var(--secondary)]/10 space-y-4">
                                <div className="h-6 w-32 rounded skeleton-shimmer" />
                                {[...Array(6)].map((_, i) => <div key={i} className="h-10 rounded-full skeleton-shimmer" />)}
                            </div>
                        </aside>
                        <div className="w-full flex-grow space-y-6">
                            {/* Skeleton chips */}
                            <div className="flex gap-2 overflow-hidden">
                                {[...Array(5)].map((_, i) => <div key={i} className="h-8 w-20 rounded-full skeleton-shimmer shrink-0" />)}
                            </div>

                            {/* Skeleton products */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {[...Array(PRODUCTS_PER_PAGE)].map((_, i) => <SkeletonProductCard key={i} index={i} />)}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Products Scroll Context Wrapper: Constrains the sticky filter bar so it doesn't stick in the next section */}
                        <div className="w-full flex flex-col">
                            {/* ========== 3. STICKY FILTER BAR ========== */}
                            <div ref={filterBarRef} className="sticky z-30 w-full md:bg-[var(--bg)] md:py-3 transition-none" style={{ top: `${navbarHeight}px` }}>
                                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 flex flex-col gap-2">
                                    <div className="bg-[#A7AA63]/20 dark:bg-[#121A1B]/80 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 border border-[var(--secondary)]/15 shadow-xl shadow-black/5 dark:shadow-none">
                                        
                                        {/* Desktop Filter Pills */}
                                        <div className="hidden lg:flex items-center gap-3" ref={dropdownRef}>
                                            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--primary)] mr-2">
                                                <SlidersHorizontal size={14} /> Filters:
                                            </div>

                                            {/* Price Dropdown */}
                                            <div className="relative">
                                                <button onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
                                                    className={`px-4 py-2 text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${minPrice > 0 || maxPrice < maxPriceLimit ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--bg)]' : 'bg-white/40 dark:bg-white/5 border-[var(--secondary)]/30 hover:border-[var(--secondary)]'}`}>
                                                    Price {minPrice > 0 || maxPrice < maxPriceLimit ? `(₹${minPrice}-₹${maxPrice})` : ''}
                                                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
                                                </button>
                                                <AnimatePresence>
                                                    {activeDropdown === 'price' && (
                                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                                            className="absolute left-0 mt-2 w-72 bg-white dark:bg-[#121A1B] border border-[var(--secondary)]/25 rounded-2xl p-5 shadow-2xl z-50 space-y-4">
                                                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-500">
                                                                <span>Budget</span>
                                                                <button onClick={() => { setMinPrice(0); setMaxPrice(maxPriceLimit); }} className="text-[10px] text-[var(--primary)] underline lowercase">reset</button>
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <div className="flex justify-between text-xs font-bold"><span>Min: ₹{minPrice}</span><span>Max: ₹{maxPrice}</span></div>
                                                                <input type="range" min="0" max={maxPriceLimit} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="premium-range-slider" />
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Occasion Dropdown */}
                                            <div className="relative">
                                                <button onClick={() => setActiveDropdown(activeDropdown === 'useCase' ? null : 'useCase')}
                                                    className={`px-4 py-2 text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${selectedUseCases.length > 0 ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--bg)]' : 'bg-white/40 dark:bg-white/5 border-[var(--secondary)]/30 hover:border-[var(--secondary)]'}`}>
                                                    Occasion {selectedUseCases.length > 0 && `(${selectedUseCases.length})`}
                                                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'useCase' ? 'rotate-180' : ''}`} />
                                                </button>
                                                <AnimatePresence>
                                                    {activeDropdown === 'useCase' && (
                                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                                            className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#121A1B] border border-[var(--secondary)]/25 rounded-2xl p-4 shadow-2xl z-50 space-y-3">
                                                            <div className="flex justify-between items-center text-xs font-bold uppercase text-gray-500">
                                                                <span>Occasion</span>
                                                                {selectedUseCases.length > 0 && <button onClick={() => setSelectedUseCases([])} className="text-[10px] text-[var(--primary)] underline lowercase">clear</button>}
                                                            </div>
                                                            <div className="max-h-60 overflow-y-auto pr-1 custom-scrollbar space-y-1">
                                                                {availableUseCases.map((uc) => {
                                                                    const isChecked = selectedUseCases.includes(uc);
                                                                    return (
                                                                        <button key={uc} onClick={() => { isChecked ? setSelectedUseCases(prev => prev.filter(x => x !== uc)) : setSelectedUseCases(prev => [...prev, uc]); }}
                                                                            className={`w-full text-left text-xs font-bold px-2 py-1.5 rounded-lg flex items-center justify-between ${isChecked ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                                                            <span>{uc}</span>
                                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'border-gray-300'}`}>{isChecked && <Check size={10} />}</div>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Print Style Dropdown */}
                                            <div className="relative">
                                                <button onClick={() => setActiveDropdown(activeDropdown === 'printStyle' ? null : 'printStyle')}
                                                    className={`px-4 py-2 text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${selectedPrintStyles.length > 0 ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--bg)]' : 'bg-white/40 dark:bg-white/5 border-[var(--secondary)]/30 hover:border-[var(--secondary)]'}`}>
                                                    Print Style {selectedPrintStyles.length > 0 && `(${selectedPrintStyles.length})`}
                                                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'printStyle' ? 'rotate-180' : ''}`} />
                                                </button>
                                                <AnimatePresence>
                                                    {activeDropdown === 'printStyle' && (
                                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                                            className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#121A1B] border border-[var(--secondary)]/25 rounded-2xl p-4 shadow-2xl z-50 space-y-3">
                                                            <div className="flex justify-between items-center text-xs font-bold uppercase text-gray-500">
                                                                <span>Print Technique</span>
                                                                {selectedPrintStyles.length > 0 && <button onClick={() => setSelectedPrintStyles([])} className="text-[10px] text-[var(--primary)] underline lowercase">clear</button>}
                                                            </div>
                                                            <div className="max-h-60 overflow-y-auto pr-1 custom-scrollbar space-y-1">
                                                                {availablePrintStyles.map((ps) => {
                                                                    const isChecked = selectedPrintStyles.includes(ps);
                                                                    return (
                                                                        <button key={ps} onClick={() => { isChecked ? setSelectedPrintStyles(prev => prev.filter(x => x !== ps)) : setSelectedPrintStyles(prev => [...prev, ps]); }}
                                                                            className={`w-full text-left text-xs font-bold px-2 py-1.5 rounded-lg flex items-center justify-between ${isChecked ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                                                            <span>{ps}</span>
                                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'border-gray-300'}`}>{isChecked && <Check size={10} />}</div>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Highlights Dropdown */}
                                            <div className="relative">
                                                <button onClick={() => setActiveDropdown(activeDropdown === 'highlights' ? null : 'highlights')}
                                                    className={`px-4 py-2 text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${selectedHighlights.length > 0 ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--bg)]' : 'bg-white/40 dark:bg-white/5 border-[var(--secondary)]/30 hover:border-[var(--secondary)]'}`}>
                                                    Highlights {selectedHighlights.length > 0 && `(${selectedHighlights.length})`}
                                                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'highlights' ? 'rotate-180' : ''}`} />
                                                </button>
                                                <AnimatePresence>
                                                    {activeDropdown === 'highlights' && (
                                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                                            className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#121A1B] border border-[var(--secondary)]/25 rounded-2xl p-4 shadow-2xl z-50 space-y-3">
                                                            <div className="flex justify-between items-center text-xs font-bold uppercase text-gray-500">
                                                                <span>Highlights</span>
                                                                {selectedHighlights.length > 0 && <button onClick={() => setSelectedHighlights([])} className="text-[10px] text-[var(--primary)] underline lowercase">clear</button>}
                                                            </div>
                                                            {[{ id: 'featured', label: 'Featured' }, { id: 'bestSeller', label: 'Best Sellers' }, { id: 'newArrival', label: 'New Arrivals' }, { id: 'customizable', label: 'Customizable' }].map((hl) => {
                                                                const isChecked = selectedHighlights.includes(hl.id);
                                                                return (
                                                                    <button key={hl.id} onClick={() => { isChecked ? setSelectedHighlights(prev => prev.filter(x => x !== hl.id)) : setSelectedHighlights(prev => [...prev, hl.id]); }}
                                                                        className={`w-full text-left text-xs font-bold px-2 py-1.5 rounded-lg flex items-center justify-between ${isChecked ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                                                        <span>{hl.label}</span>
                                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'border-gray-300'}`}>{isChecked && <Check size={10} />}</div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        {/* Desktop Sort */}
                                        <div className="hidden lg:flex items-center gap-3 ml-auto">
                                            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}
                                                className="bg-white/60 dark:bg-white/5 text-xs font-bold px-4 py-2 rounded-full border border-[var(--secondary)]/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                                                <option value="Popular">Popular</option>
                                                <option value="Newest">Newest</option>
                                                <option value="PriceLowToHigh">Price: Low → High</option>
                                                <option value="PriceHighToLow">Price: High → Low</option>
                                            </select>
                                        </div>
                                        
                                        {/* Mobile: Filter + Sort */}
                                        <div className="flex lg:hidden items-center gap-2 w-full">
                                            <button onClick={() => setIsMobileFilterOpen(true)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-white/60 dark:bg-white/5 border border-[var(--secondary)]/20 relative min-h-[44px] touch-manipulation">
                                                <SlidersHorizontal size={14} /><span>Filters</span>
                                                {activeFilterCount > 0 && (
                                                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[var(--primary)] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">{activeFilterCount}</span>
                                                )}
                                            </button>
                                            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}
                                                className="flex-1 bg-white/60 dark:bg-white/5 text-xs font-bold px-4 py-2.5 rounded-xl border border-[var(--secondary)]/20 cursor-pointer focus:outline-none min-h-[44px] touch-manipulation text-center">
                                                <option value="Popular">↕ Popular</option>
                                                <option value="Newest">↕ Newest</option>
                                                <option value="PriceLowToHigh">↕ Price: Low → High</option>
                                                <option value="PriceHighToLow">↕ Price: High → Low</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* ========== 4. ACTIVE FILTERS CHIPS ========== */}
                                    <AnimatePresence>
                                        {activeFiltersList.length > 0 && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                                className="flex items-center gap-2 py-1 overflow-x-auto no-scrollbar">
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {activeFiltersList.map((filter, idx) => (
                                                        <motion.span key={idx} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                                                            className="inline-flex items-center gap-1 bg-[var(--primary)]/10 text-[var(--primary)] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap shrink-0 min-h-[28px]">
                                                            {filter.label}
                                                            <button onClick={() => handleDismissFilter(filter)} className="ml-0.5 hover:text-red-500 transition-colors touch-manipulation"><X size={10} /></button>
                                                        </motion.span>
                                                    ))}
                                                </div>
                                                <button onClick={handleClearAllFilters} className="text-[10px] sm:text-xs text-[var(--primary)] font-black hover:underline flex items-center gap-1 pl-3 border-l border-gray-300 dark:border-white/10 whitespace-nowrap shrink-0 touch-manipulation min-h-[28px]">
                                                    <RotateCcw size={10} /> Reset
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 md:px-10 lg:px-14 py-4 sm:py-6">
                                <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-start">
                        
                        {/* ===== SIDEBAR (Desktop) ===== */}
                        <aside
                            data-lenis-prevent
                            className="w-full md:w-[280px] shrink-0 hidden md:block z-20"
                            style={{ position: 'sticky', top: `${stickyTopOffset}px`, width: isDesktopOrTablet ? '280px' : '100%' }}
                        >
                            <div 
                                className="bg-[#A7AA63]/25 dark:bg-[#121A1B]/60 p-6 rounded-[24px] border border-[var(--secondary)]/30 shadow-md overflow-y-auto custom-scrollbar"
                                style={{ maxHeight: `calc(100vh - ${stickyTopOffset}px - 24px)` }}
                            >
                            <h3 className="text-xl font-serif font-black mb-6 uppercase tracking-wider border-b border-[var(--text)] inline-block pb-1">CATEGORIES</h3>
                            <ul className="space-y-2 pr-2">
                                <li>
                                    <button onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); setShowAllProducts(false); }}
                                        className={`w-full text-left px-4 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${!selectedCategory ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--text)] hover:bg-[var(--text)]/5'}`}>
                                        <span className={!selectedCategory ? 'text-white' : 'text-[var(--primary)] font-black'}>•</span> View All
                                    </button>
                                </li>
                                {categories.map((cat) => {
                                    const isCatSelected = selectedCategory?._id === cat._id;
                                    return (
                                        <li key={cat._id} className="space-y-1.5">
                                            <button onClick={() => { setSelectedCategory(cat); setSelectedSubcategory(null); setShowAllProducts(false); }}
                                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full transition-all duration-300 cursor-pointer ${isCatSelected ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--text)] hover:bg-[var(--text)]/5'}`}>
                                                <div className="flex items-center gap-2"><span className={isCatSelected ? 'text-white' : 'text-[var(--primary)] font-black'}>•</span><span className="text-sm font-bold">{cat.name}</span></div>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`w-3.5 h-3.5 transition-transform duration-300 ${isCatSelected ? 'rotate-90 text-white' : 'text-gray-500'}`}><polyline points="9 18 15 12 9 6"></polyline></svg>
                                            </button>
                                            {isCatSelected && subcategories.filter(s => String(s.parentCategory?._id || s.parentCategory) === String(cat._id)).length > 0 && (
                                                <ul className="pl-8 space-y-1.5 mt-1">
                                                    {subcategories.filter(s => String(s.parentCategory?._id || s.parentCategory) === String(cat._id)).map(sub => {
                                                        const isSubSelected = selectedSubcategory?._id === sub._id;
                                                        return (
                                                            <li key={sub._id}>
                                                                <button onClick={() => { setSelectedSubcategory(sub); setShowAllProducts(false); }}
                                                                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-all duration-200 cursor-pointer ${isSubSelected ? 'text-[var(--primary)] font-black' : 'text-gray-500 hover:text-[var(--primary)]'}`}>
                                                                    {sub.name}
                                                                </button>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                            </div>
                        </aside>

                        {/* ===== RIGHT SIDE — MAIN CONTENT ===== */}
                        <div className="w-full flex-grow min-h-[50vh]">
                            
                            {/* ===== NO CATEGORY SELECTED: Show Category Browsing Cards ===== */}
                            {!selectedCategory ? (
                                <div className="space-y-10">
                                    {/* Browse Collections */}
                                    <div className="space-y-4">
                                        <div className="border-b border-[var(--secondary)]/15 pb-3">
                                            <h2 className="text-xl sm:text-2xl font-serif font-black uppercase tracking-tight">Browse Collections</h2>
                                            <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">Select a category to unlock our tailored filters</p>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                                            {categories.map((cat) => (
                                                <motion.div key={cat._id} whileHover={{ y: -4 }}
                                                    onClick={() => { setSelectedCategory(cat); setSelectedSubcategory(null); setShowAllProducts(false); }}
                                                    className="group cursor-pointer relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-[#A7AA63]/12 dark:bg-[#121A1B]/40 aspect-[4/5] flex items-end border border-[var(--secondary)]/15"
                                                >
                                                    <img src={resolveImage(cat.image)} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" loading="lazy" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                                                    <div className="relative z-10 p-4 sm:p-6 w-full space-y-0.5">
                                                        <span className="text-[8px] sm:text-[10px] font-bold text-[#A7AA63] uppercase tracking-widest">Premium</span>
                                                        <h3 className="text-white text-sm sm:text-xl font-bold tracking-wide">{cat.name}</h3>
                                                        <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            Explore &rarr;
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Products Grid */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 mb-3 pt-1">
                                            <div className="h-px flex-grow bg-[var(--secondary)]/15" />
                                            <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">
                                                All Products
                                            </span>
                                            <div className="h-px flex-grow bg-[var(--secondary)]/15" />
                                        </div>

                                        {loading ? (
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {[...Array(PRODUCTS_PER_PAGE)].map((_, i) => <SkeletonProductCard key={i} index={i} />)}
                                            </div>
                                        ) : visibleProducts.length === 0 ? (
                                            <div className="py-16 text-center bg-white dark:bg-[#1a2526] rounded-2xl border border-[var(--secondary)]/10">
                                                <p className="text-sm font-bold opacity-60">No products found.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {visibleProducts.map((prod, index) => (
                                                    <ProductCard
                                                        key={prod._id}
                                                        prod={prod}
                                                        index={index}
                                                        isWish={isInWishlist(prod._id)}
                                                        cartSuccessId={cartSuccessId}
                                                        onWishlistClick={handleWishlistClick}
                                                        onCartClick={handleCartClick}
                                                    />
                                                ))}
                                                <ScrollSentinel onVisible={loadMoreProducts} hasMore={hasMoreProducts} isLoading={isLoadingMore} />
                                            </div>
                                        )}
                                        
                                        {visibleProducts.length > 0 && !hasMoreProducts && products.length > PRODUCTS_PER_PAGE && (
                                            <div className="text-center py-4">
                                                <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Showing all {products.length} products</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    {(() => {
                                        const showSubcategoryCards = categorySubs.length > 0 && !selectedSubcategory && !showAllProducts;

                                if (showSubcategoryCards) {
                                    return (
                                        <div className="space-y-4 sm:space-y-5">
                                            <div className="space-y-4 pb-3">
                                                {/* Header */}
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <button onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); setShowAllProducts(false); }}
                                                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-white/10 border border-[var(--secondary)]/15 flex items-center justify-center shadow-sm hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all active:scale-90 shrink-0 touch-manipulation">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                                                        </button>
                                                        <div className="min-w-0">
                                                            <h2 className="text-lg sm:text-2xl font-serif font-black uppercase tracking-tight text-[var(--text)] truncate">
                                                                {selectedCategory.name}
                                                            </h2>
                                                            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                                Select a style to browse custom products
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap shrink-0">
                                                        {categorySubs.length} styles
                                                    </span>
                                                </div>

                                                {/* Horizontal subcategory chips */}
                                                {categorySubs.length > 0 && (
                                                    <div className="relative -mx-3 sm:-mx-0">
                                                        <div ref={chipsScrollRef} className="flex gap-2 overflow-x-auto px-3 sm:px-0 pb-1 no-scrollbar scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
                                                            {/* All chip */}
                                                            <button
                                                                onClick={() => { setSelectedSubcategory(null); setShowAllProducts(true); }}
                                                                className={`shrink-0 px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-200 min-h-[36px] touch-manipulation whitespace-nowrap ${
                                                                    showAllProducts && !selectedSubcategory
                                                                        ? 'bg-[var(--text)] text-[var(--bg)] shadow-md'
                                                                        : 'bg-white dark:bg-white/5 text-[var(--text)] border border-[var(--secondary)]/20 hover:border-[var(--secondary)]/40'
                                                                }`}
                                                            >
                                                                All Products
                                                            </button>
                                                            {categorySubs.map((sub) => {
                                                                const isActive = selectedSubcategory?._id === sub._id;
                                                                return (
                                                                    <button
                                                                        key={sub._id}
                                                                        onClick={() => { setSelectedSubcategory(sub); setShowAllProducts(false); }}
                                                                        className={`shrink-0 px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-200 min-h-[36px] touch-manipulation whitespace-nowrap ${
                                                                            isActive
                                                                                ? 'bg-[var(--text)] text-[var(--bg)] shadow-md'
                                                                                : 'bg-white dark:bg-white/5 text-[var(--text)] border border-[var(--secondary)]/20 hover:border-[var(--secondary)]/40'
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

                                            {/* Subcategory Grid Cards */}
                                            <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-8 gap-6 pb-6 lg:pb-0 scroll-smooth custom-scrollbar lg:overflow-x-visible pt-2">
                                                {categorySubs.map((sub) => {
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
                                                            <div className={`relative overflow-hidden rounded-2xl aspect-[4/5] bg-[#A7AA63]/10 border transition-all duration-300 border-[var(--secondary)]/15 group-hover:border-[var(--secondary)]/40 shadow-md group-hover:shadow-xl`}>
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
                                        <div className="space-y-4 sm:space-y-5">
                                            <div className="space-y-4 pb-3">
                                                {/* Category Header */}
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <button onClick={() => { 
                                                            if (selectedSubcategory) {
                                                                setSelectedSubcategory(null);
                                                                setShowAllProducts(false);
                                                            } else if (showAllProducts) {
                                                                setShowAllProducts(false);
                                                            }
                                                        }}
                                                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-white/10 border border-[var(--secondary)]/15 flex items-center justify-center shadow-sm hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all active:scale-90 shrink-0 touch-manipulation">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                                                        </button>
                                                        <div className="min-w-0">
                                                            <h2 className="text-lg sm:text-2xl font-serif font-black uppercase tracking-tight text-[var(--text)] truncate">
                                                                {selectedCategory.name}
                                                            </h2>
                                                            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                                {selectedSubcategory ? selectedSubcategory.name : 'All Products'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap shrink-0">
                                                        {products.length} items
                                                    </span>
                                                </div>

                                                {/* Horizontal subcategory chips */}
                                                {categorySubs.length > 0 && (
                                                    <div className="relative -mx-3 sm:-mx-0">
                                                        <div ref={chipsScrollRef} className="flex gap-2 overflow-x-auto px-3 sm:px-0 pb-1 no-scrollbar scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
                                                            {/* All chip */}
                                                            <button
                                                                onClick={() => { setSelectedSubcategory(null); setShowAllProducts(true); }}
                                                                className={`shrink-0 px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-200 min-h-[36px] touch-manipulation whitespace-nowrap ${
                                                                    showAllProducts && !selectedSubcategory
                                                                        ? 'bg-[var(--text)] text-[var(--bg)] shadow-md'
                                                                        : 'bg-white dark:bg-white/5 text-[var(--text)] border border-[var(--secondary)]/20 hover:border-[var(--secondary)]/40'
                                                                }`}
                                                            >
                                                                All Products
                                                            </button>
                                                            {categorySubs.map((sub) => {
                                                                const isActive = selectedSubcategory?._id === sub._id;
                                                                return (
                                                                    <button
                                                                        key={sub._id}
                                                                        onClick={() => { setSelectedSubcategory(sub); setShowAllProducts(false); }}
                                                                        className={`shrink-0 px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-200 min-h-[36px] touch-manipulation whitespace-nowrap ${
                                                                            isActive
                                                                                ? 'bg-[var(--text)] text-[var(--bg)] shadow-md'
                                                                                : 'bg-white dark:bg-white/5 text-[var(--text)] border border-[var(--secondary)]/20 hover:border-[var(--secondary)]/40'
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

                                            {/* Products Grid */}
                                            <div>
                                                <div className="flex items-center gap-3 mb-3 pt-1">
                                                    <div className="h-px flex-grow bg-[var(--secondary)]/15" />
                                                    <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">
                                                        {selectedSubcategory ? selectedSubcategory.name : 'All'} Products
                                                    </span>
                                                    <div className="h-px flex-grow bg-[var(--secondary)]/15" />
                                                </div>

                                                {loading ? (
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                        {[...Array(PRODUCTS_PER_PAGE)].map((_, i) => <SkeletonProductCard key={i} index={i} />)}
                                                    </div>
                                                ) : visibleProducts.length === 0 ? (
                                                    <div className="py-16 text-center bg-white dark:bg-[#1a2526] rounded-2xl border border-[var(--secondary)]/10">
                                                        <p className="text-sm font-bold opacity-60">No products found.</p>
                                                        <button onClick={() => { setSelectedSubcategory(null); setShowAllProducts(true); }}
                                                            className="mt-3 px-5 py-2 bg-[var(--primary)] text-[var(--bg)] rounded-full text-xs font-bold shadow-md hover:opacity-90 transition-all cursor-pointer">
                                                            View All Products
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                        {visibleProducts.map((prod, index) => (
                                                            <ProductCard
                                                                key={prod._id}
                                                                prod={prod}
                                                                index={index}
                                                                isWish={isInWishlist(prod._id)}
                                                                cartSuccessId={cartSuccessId}
                                                                onWishlistClick={handleWishlistClick}
                                                                onCartClick={handleCartClick}
                                                            />
                                                        ))}
                                                        <ScrollSentinel onVisible={loadMoreProducts} hasMore={hasMoreProducts} isLoading={isLoadingMore} />
                                                    </div>
                                                )}
                                                
                                                {visibleProducts.length > 0 && !hasMoreProducts && products.length > PRODUCTS_PER_PAGE && (
                                                    <div className="text-center py-4">
                                                        <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Showing all {products.length} products</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                            })()}
                            </div>
                        )}
                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transition Sections: Rendered directly below the grid flex container, full width inside <main> */}
                        <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 md:px-10 lg:px-14 pb-12">
                            {!selectedCategory ? (
                                <div className="mt-10 pt-10 border-t border-[var(--secondary)]/15">
                                    <CategoryUI />
                                </div>
                            ) : (
                                seoData && (
                                    <div className="mt-10 pt-10 border-t border-[var(--secondary)]/15 space-y-10">
                                        <CategorySEOContent entity={seoData.entity} seoContent={seoData.seoContent} />
                                        <CategoryFAQ entity={seoData.entity} faqs={seoData.faqs} />
                                        <RelatedCategories 
                                            parentCategory={seoData.parentCategory} 
                                            siblingCategories={seoData.siblingCategories} 
                                            popularCategories={seoData.popularCategories} 
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </>
                )}
            </main>

            <Footer />

            {/* ========== MOBILE FILTER DRAWER ========== */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFilterOpen(false)} className="fixed inset-0 z-50 mobile-filter-drawer-overlay cursor-pointer" />
                        
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 220 }}
                            className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-[#121A1B] rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col border-t border-[var(--secondary)]/25 pb-safe">
                            
                            <div className="pt-3 pb-1 shrink-0"><div className="drawer-handle" /></div>

                            <div className="px-5 py-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-1.5">
                                    <Sliders size={18} className="text-[var(--primary)]" />
                                    <h3 className="text-base font-bold uppercase tracking-wider text-[var(--text)]">Advanced Filters</h3>
                                </div>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/5">
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-4">
                                {/* Categories */}
                                <div className="border-b border-gray-100 dark:border-white/5 pb-3">
                                    <button onClick={() => toggleFilterSection('categories')} className="filter-section-header w-full text-left py-3 flex items-center justify-between text-[var(--text)]">
                                        <span className="text-xs font-black uppercase tracking-wider text-gray-500">Categories</span>
                                        {mobileFilterSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    {mobileFilterSections.categories && (
                                        <div className="space-y-4 pt-1 pb-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <button onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); setShowAllProducts(false); }}
                                                    className={`px-3 py-2 text-xs font-bold rounded-xl border text-center transition-all min-h-[44px] touch-manipulation ${!selectedCategory ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-md' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5'}`}>
                                                    All Categories
                                                </button>
                                                {categories.map(cat => {
                                                    const isSelected = selectedCategory?._id === cat._id;
                                                    return (
                                                        <button key={cat._id} onClick={() => { setSelectedCategory(cat); setSelectedSubcategory(null); setShowAllProducts(false); }}
                                                            className={`relative flex items-center justify-between pl-3 pr-8 py-2 text-xs font-bold rounded-xl border transition-all min-h-[44px] touch-manipulation overflow-hidden ${isSelected ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-md' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5'}`}>
                                                            <span className="relative z-10 truncate pr-1">{cat.name}</span>
                                                            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none"><img src={resolveImage(cat.image)} className="w-full h-full object-cover" /></div>
                                                            {isSelected && <Check size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white z-10" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {selectedCategory && categorySubs.length > 0 && (
                                                <div className="pt-1">
                                                    <span className="block text-[10px] text-gray-400 font-bold uppercase mb-2">Subcategories</span>
                                                    <div className="flex overflow-x-auto gap-2 pb-2 mobile-snap-scroll">
                                                        <button onClick={() => { setSelectedSubcategory(null); setShowAllProducts(true); }}
                                                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all shrink-0 min-h-[44px] flex items-center justify-center ${(!selectedSubcategory && showAllProducts) ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-500'}`}>
                                                            All
                                                        </button>
                                                        {categorySubs.map(sub => {
                                                            const isSubSelected = selectedSubcategory?._id === sub._id;
                                                            return (
                                                                <button key={sub._id} onClick={() => { setSelectedSubcategory(sub); setShowAllProducts(false); }}
                                                                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all shrink-0 min-h-[44px] flex items-center justify-center ${isSubSelected ? 'bg-[var(--primary)]/15 border-[var(--primary)] text-[var(--primary)] font-black' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-500'}`}>
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

                                {/* Price */}
                                <div className="border-b border-gray-100 dark:border-white/5 pb-3">
                                    <button onClick={() => toggleFilterSection('price')} className="filter-section-header w-full text-left py-3 flex items-center justify-between text-[var(--text)]">
                                        <span className="text-xs font-black uppercase tracking-wider text-gray-500">Budget Range</span>
                                        {mobileFilterSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    {mobileFilterSections.price && (
                                        <div className="space-y-4 pt-1 pb-3">
                                            <div className="flex justify-between items-center text-xs font-black text-[var(--primary)]">
                                                <span>₹0</span><span className="px-3 py-1 bg-[var(--primary)]/10 rounded-full">Max: ₹{maxPrice}</span>
                                            </div>
                                            <div className="px-1 py-1"><input type="range" min="0" max={maxPriceLimit} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="premium-range-slider" /></div>
                                        </div>
                                    )}
                                </div>

                                {/* Occasion */}
                                <div className="border-b border-gray-100 dark:border-white/5 pb-3">
                                    <button onClick={() => toggleFilterSection('occasion')} className="filter-section-header w-full text-left py-3 flex items-center justify-between text-[var(--text)]">
                                        <span className="text-xs font-black uppercase tracking-wider text-gray-500">Target Occasion</span>
                                        {mobileFilterSections.occasion ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    {mobileFilterSections.occasion && (
                                        <div className="flex flex-wrap gap-2 pt-1 pb-2">
                                            {availableUseCases.map((uc) => {
                                                const isChecked = selectedUseCases.includes(uc);
                                                return (
                                                    <button key={uc} onClick={() => { isChecked ? setSelectedUseCases(prev => prev.filter(x => x !== uc)) : setSelectedUseCases(prev => [...prev, uc]); }}
                                                        className={`px-3.5 py-2.5 rounded-full text-xs font-bold border transition-all min-h-[44px] flex items-center justify-center ${isChecked ? 'bg-[var(--primary)]/15 border-[var(--primary)] text-[var(--primary)] font-black' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-300'}`}>
                                                        {uc}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Print Technique */}
                                <div className="border-b border-gray-100 dark:border-white/5 pb-3">
                                    <button onClick={() => toggleFilterSection('printStyle')} className="filter-section-header w-full text-left py-3 flex items-center justify-between text-[var(--text)]">
                                        <span className="text-xs font-black uppercase tracking-wider text-gray-500">Print Technique</span>
                                        {mobileFilterSections.printStyle ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    {mobileFilterSections.printStyle && (
                                        <div className="flex flex-wrap gap-2 pt-1 pb-2">
                                            {availablePrintStyles.map((ps) => {
                                                const isChecked = selectedPrintStyles.includes(ps);
                                                return (
                                                    <button key={ps} onClick={() => { isChecked ? setSelectedPrintStyles(prev => prev.filter(x => x !== ps)) : setSelectedPrintStyles(prev => [...prev, ps]); }}
                                                        className={`px-3.5 py-2.5 rounded-full text-xs font-bold border transition-all min-h-[44px] flex items-center justify-center ${isChecked ? 'bg-[var(--primary)]/15 border-[var(--primary)] text-[var(--primary)] font-black' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-300'}`}>
                                                        {ps}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Highlights */}
                                <div className="border-b border-gray-100 dark:border-white/5 pb-3">
                                    <button onClick={() => toggleFilterSection('highlights')} className="filter-section-header w-full text-left py-3 flex items-center justify-between text-[var(--text)]">
                                        <span className="text-xs font-black uppercase tracking-wider text-gray-500">Highlights</span>
                                        {mobileFilterSections.highlights ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    {mobileFilterSections.highlights && (
                                        <div className="grid grid-cols-2 gap-2 pt-1 pb-2">
                                            {[{ id: 'featured', label: 'Featured' }, { id: 'bestSeller', label: 'Best Sellers' }, { id: 'newArrival', label: 'New Arrivals' }, { id: 'customizable', label: 'Customizable' }].map((hl) => {
                                                const isChecked = selectedHighlights.includes(hl.id);
                                                return (
                                                    <button key={hl.id} onClick={() => { isChecked ? setSelectedHighlights(prev => prev.filter(x => x !== hl.id)) : setSelectedHighlights(prev => [...prev, hl.id]); }}
                                                        className={`px-3 py-2 text-xs font-bold rounded-xl border text-center transition-all min-h-[44px] ${isChecked ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-md font-black' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5'}`}>
                                                        {hl.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Drawer Actions */}
                            <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/25 flex flex-col gap-2 shrink-0">
                                <div className="text-center text-[11px] font-black text-gray-500 uppercase tracking-widest">
                                    {products.length} {products.length === 1 ? 'Result' : 'Results'} Found
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={handleClearAllFilters} className="flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-350 text-gray-500 bg-white hover:bg-gray-50 active:scale-98 transition-transform cursor-pointer min-h-[48px]">Reset All</button>
                                    <button onClick={() => setIsMobileFilterOpen(false)} className="flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl bg-[var(--primary)] text-[var(--bg)] shadow-md active:scale-98 transition-transform cursor-pointer min-h-[48px]">Apply Filters</button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}
