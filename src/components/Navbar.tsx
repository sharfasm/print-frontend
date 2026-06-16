"use client";
// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import config from '../brand/config';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { resolveImage } from '../lib/imageUtils';
import api from '../lib/axios';
import AuthNotification from './AuthNotification';
import AuthModal from './AuthModal';

/* ─────────────────────────────────────────────
   ICON COMPONENTS (inline SVGs for zero deps)
   ───────────────────────────────────────────── */

const IconHamburger = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const IconX = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const IconGrid = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

const IconHeart = ({ className = "w-[22px] h-[22px]" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

const IconCart = ({ className = "w-[22px] h-[22px]" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

const IconMoon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

const IconSun = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);

const IconUser = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const IconSearch = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const IconChevron = ({ className = "w-4 h-4", open = false }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`chevron-rotate ${open ? 'open' : ''} ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

const IconTruck = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
);

const IconPhone = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
);

const IconInfo = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
);

const IconLogout = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);

const IconShoppingBag = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

const IconPaintBrush = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
);

const IconCube = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
);

/* ─────────────────────────────────────────────
   TOOLTIP COMPONENT
   ───────────────────────────────────────────── */
const Tooltip = ({ label, visible }) => {
    if (!visible) return null;
    return (
        <span className="absolute -top-9 left-1/2 animate-tooltip pointer-events-none z-[60] whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide text-white bg-black/40 backdrop-blur-md border border-white/15 shadow-lg">
            {label}
        </span>
    );
};

/* ─────────────────────────────────────────────
   NAVBAR ICON BUTTON (with tooltip on mobile)
   ───────────────────────────────────────────── */
const NavIconBtn = ({
    children,
    label,
    onClick = null,
    href = null,
    badge = 0,
    badgeAnimate = false,
    className = "",
    isTransparentPage = false,
    heroExited = false,
    showOnboarding = false
}) => {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [tapActive, setTapActive] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const executeAction = () => {
        if (href) {
            router.push(href);
        } else if (onClick) {
            onClick();
        }
    };

    const handleClick = (e) => {
        if (isMobile) {
            e.preventDefault();
            e.stopPropagation();
            if (tapActive) return;

            setTapActive(true);
            setTimeout(() => {
                setTapActive(false);
                executeAction();
            }, 150); // 150ms animation, then auto navigate
        } else {
            executeAction();
        }
    };

    const isLightHeader = isTransparentPage && !heroExited;
    
    // Background tint on hover/active for desktop
    const hoverBg = isLightHeader ? 'hover:bg-white/10' : 'hover:bg-[var(--text)]/5';
    const activeBg = isLightHeader ? 'bg-white/10' : 'bg-[var(--text)]/5';

    // Is currently forced to expand (due to first-time onboarding or active mobile tap)
    const forceExpand = showOnboarding || tapActive;

    // Base button classes
    const buttonClass = `
        group relative flex items-center h-11 rounded-full active:scale-95 
        transition-all duration-300 ease-out touch-manipulation overflow-hidden
        ${forceExpand 
            ? `max-w-[200px] min-w-[44px] px-4.5 justify-start ${activeBg}` 
            : (isMobile 
                ? 'max-w-[44px] min-w-[44px] px-0 justify-center bg-transparent' 
                : `max-w-[44px] min-w-[44px] px-0 justify-center hover:max-w-[200px] hover:px-4.5 hover:justify-start ${hoverBg}`
              )
        }
        ${className}
    `;

    return (
        <div className="relative flex flex-col items-center">
            <button 
                onClick={handleClick} 
                className={buttonClass} 
                aria-label={label}
            >
                <div className="flex-shrink-0 flex items-center justify-center w-11 h-11">
                    {children}
                </div>
                <span 
                    className={`overflow-hidden whitespace-nowrap text-[13px] font-bold tracking-wide transition-all duration-300 ease-out text-current ${
                        forceExpand 
                            ? 'opacity-100 max-w-[120px] ml-1.5' 
                            : (!isMobile ? 'opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[120px] group-hover:ml-1.5' : 'opacity-0 max-w-0')
                    }`}
                >
                    {label}
                </span>
            </button>
            {badge > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 bg-[var(--primary)] text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center shadow-lg px-0.5 ${badgeAnimate ? 'animate-cart-bounce' : ''} pointer-events-none`}>
                    {badge}
                </span>
            )}
        </div>
    );
};


/* ═════════════════════════════════════════════
   MAIN NAVBAR COMPONENT
   ═════════════════════════════════════════════ */
const Navbar = () => {
    const pathname = usePathname();
    const navigate = useRouter();
    const { cart, wishlist, triggerAuthGuard, brandInfo } = useShop();
    const { isLoggedIn, user, logout } = useAuth();

    const brandName = brandInfo?.name || config.brand;

    // ── State ──
    const [mode, setMode] = useState("light");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerClosing, setDrawerClosing] = useState(false);
    const [heroExited, setHeroExited] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false); // animation state: true = revealed
    const [searchHiding, setSearchHiding] = useState(false);

    // Badge animation
    const [cartAnimate, setCartAnimate] = useState(false);
    const [wishAnimate, setWishAnimate] = useState(false);

    // Drawer data
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [openCategory, setOpenCategory] = useState(null);
    const [openSubcategory, setOpenSubcategory] = useState(null);
    const [openQuickLink, setOpenQuickLink] = useState(null);
    const [productsSectionOpen, setProductsSectionOpen] = useState(false);
    const [drawerDataLoaded, setDrawerDataLoaded] = useState(false);
    const [navSearchVal, setNavSearchVal] = useState("");
    const [subProducts, setSubProducts] = useState({}); // { subcatId: [products] }
    const [loadingProducts, setLoadingProducts] = useState({});
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const seen = localStorage.getItem("navbarHintSeen");
            if (!seen) {
                const startTimer = setTimeout(() => {
                    setShowOnboarding(true);
                }, 100);

                const hideTimer = setTimeout(() => {
                    setShowOnboarding(false);
                    localStorage.setItem("navbarHintSeen", "true");
                }, 2100);

                return () => {
                    clearTimeout(startTimer);
                    clearTimeout(hideTimer);
                };
            }
        }
    }, []);

    const searchVisibleRef = useRef(false);

    const sentinelRef = useRef(null);

    const cartCount = (cart || []).reduce((acc, item) => acc + item.quantity, 0);
    const wishlistCount = (wishlist || []).length;

    // ── Transparent page check ──
    const isTransparentPage = pathname === '/' || pathname === '/about' || pathname === '/lookbook' || pathname === '/contact' || pathname === '/news' || pathname === '/products';

    // ── Badge bounce ──
    useEffect(() => {
        if (cartCount > 0) { setCartAnimate(true); const t = setTimeout(() => setCartAnimate(false), 500); return () => clearTimeout(t); }
    }, [cartCount]);

    useEffect(() => {
        if (wishlistCount > 0) { setWishAnimate(true); const t = setTimeout(() => setWishAnimate(false), 500); return () => clearTimeout(t); }
    }, [wishlistCount]);

    // ── Theme ──
    useEffect(() => {
        const saved = localStorage.getItem("theme-mode");
        if (saved) { setMode(saved); }
        else {
            const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setMode(dark ? "dark" : "light");
        }
    }, []);

    useEffect(() => {
        // Prefer admin-set theme from brandInfo, fallback to config
        const themeData = brandInfo?.theme || config.theme;
        const theme = themeData[mode];
        if (theme) {
            document.documentElement.style.setProperty("--primary", theme.primary);
            document.documentElement.style.setProperty("--secondary", theme.secondary);
            document.documentElement.style.setProperty("--bg", theme.bg);
            document.documentElement.style.setProperty("--text", theme.text);
            if (mode === "dark") {
                document.documentElement.classList.add("dark");
                document.documentElement.setAttribute("data-theme", "dark");
            } else {
                document.documentElement.classList.remove("dark");
                document.documentElement.setAttribute("data-theme", "light");
            }
        }
    }, [mode, brandInfo]);

    const toggleTheme = useCallback(() => {
        const newMode = mode === "light" ? "dark" : "light";
        setMode(newMode);
        localStorage.setItem("theme-mode", newMode);
    }, [mode]);

    // ── Scroll listener for search bar reveal ──
    useEffect(() => {
        if (!isTransparentPage) {
            setHeroExited(true);
            setSearchVisible(true);
            setSearchHiding(false);
            searchVisibleRef.current = true;
            return;
        }

        setHeroExited(false);
        setSearchVisible(false);
        setSearchHiding(false);
        searchVisibleRef.current = false;

        let active = true;
        let timeoutId = null;

        const handleScroll = () => {
            const scrolled = window.scrollY > 120;
            setHeroExited(scrolled);
            
            if (scrolled) {
                if (timeoutId) clearTimeout(timeoutId);
                setSearchHiding(false);
                setSearchVisible(true);
                searchVisibleRef.current = true;
            } else {
                if (searchVisibleRef.current) {
                    searchVisibleRef.current = false;
                    setSearchHiding(true);
                    if (timeoutId) clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        if (active) {
                            setSearchVisible(false);
                            setSearchHiding(false);
                        }
                    }, 250);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            active = false;
            if (timeoutId) clearTimeout(timeoutId);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [pathname, isTransparentPage]);

    // ── Lock body scroll when drawer is open ──
    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    // ── Close drawer on route change ──
    useEffect(() => {
        closeDrawer();
    }, [pathname]);

    // ── Drawer open/close ──
    const openDrawer = useCallback(() => {
        setDrawerOpen(true);
        setDrawerClosing(false);
        // Fetch category data if not yet loaded
        if (!drawerDataLoaded) {
            loadDrawerData();
        }
    }, [drawerDataLoaded]);

    const closeDrawer = useCallback(() => {
        if (!drawerOpen) return;
        setDrawerClosing(true);
        setTimeout(() => {
            setDrawerOpen(false);
            setDrawerClosing(false);
        }, 300);
    }, [drawerOpen]);

    const loadDrawerData = useCallback(async () => {
        try {
            const [catRes, subRes] = await Promise.all([
                api.get('/category'),
                api.get('/subcategory')
            ]);
            setCategories(catRes.data || []);
            setSubcategories(subRes.data || []);
            setDrawerDataLoaded(true);
        } catch (err) {
            console.error("Failed to load drawer data:", err);
        }
    }, []);

    const handleNavSearch = useCallback(() => {
        if (navSearchVal.trim()) {
            navigate.push(`/products?search=${encodeURIComponent(navSearchVal.trim())}`);
        }
    }, [navSearchVal, navigate]);

    const toggleCategory = useCallback((catId) => {
        setOpenCategory(prev => prev === catId ? null : catId);
        setOpenSubcategory(null);
    }, []);

    const loadSubcategoryProducts = useCallback(async (subcatId) => {
        if (subProducts[subcatId] || loadingProducts[subcatId]) return;
        setLoadingProducts(prev => ({ ...prev, [subcatId]: true }));
        try {
            const res = await api.get(`/products?subcategory=${subcatId}`);
            setSubProducts(prev => ({ ...prev, [subcatId]: res.data || [] }));
        } catch (err) {
            console.error("Failed to load subcategory products:", err);
            setSubProducts(prev => ({ ...prev, [subcatId]: [] }));
        } finally {
            setLoadingProducts(prev => ({ ...prev, [subcatId]: false }));
        }
    }, [subProducts, loadingProducts]);

    const toggleSubcategory = useCallback((subId) => {
        setOpenSubcategory(prev => {
            const next = prev === subId ? null : subId;
            if (next) loadSubcategoryProducts(subId);
            return next;
        });
    }, [loadSubcategoryProducts]);

    const handleCategoryNameClick = useCallback((e, catId) => {
        e.stopPropagation();
        if (openCategory === catId) {
            navigate.push(`/products?categoryId=${catId}`);
            closeDrawer();
        } else {
            toggleCategory(catId);
        }
    }, [openCategory, navigate, closeDrawer, toggleCategory]);

    const handleSubcategoryNameClick = useCallback((e, catId, subId) => {
        e.stopPropagation();
        if (openSubcategory === subId) {
            navigate.push(`/products?categoryId=${catId}&subcategoryId=${subId}`);
            closeDrawer();
        } else {
            toggleSubcategory(subId);
        }
    }, [openSubcategory, navigate, closeDrawer, toggleSubcategory]);

    // ── Get subcategories for a category ──
    const getSubsForCategory = useCallback((catId) => {
        return subcategories.filter(s => {
            const parent = s.parentCategory?._id || s.parentCategory;
            return String(parent) === String(catId);
        });
    }, [subcategories]);

    // ── Nav styling ──
    const navBg = (!isTransparentPage || heroExited)
        ? 'bg-[var(--bg)]/80 backdrop-blur-lg shadow-sm border-b border-[var(--secondary)]/10'
        : 'bg-transparent';

    const textColor = (!isTransparentPage || heroExited)
        ? 'text-[var(--text)]'
        : 'text-white';

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${navBg} ${textColor}`}>
                {/* ═══ MAIN NAV BAR ═══ */}
                <div className="flex items-center justify-between w-full px-4 sm:px-6 md:px-10 lg:px-14 py-3 md:py-4">
                    {/* ── LEFT: Hamburger + Logo + Brand ── */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 shrink-0 lg:w-[280px]">
                        <button
                            onClick={openDrawer}
                            className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-white/10 active:scale-95 transition-all duration-200 touch-manipulation shrink-0"
                            aria-label="Open menu"
                        >
                            <IconHamburger />
                        </button>

                        <Link href="/" className="flex items-center gap-2 min-w-0 group">
                            {/* Logo mark - stylized P */}
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[var(--primary)] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                <span className="text-white text-sm sm:text-base font-black leading-none">P</span>
                            </div>
                            <span className="text-base sm:text-lg font-black tracking-tight uppercase truncate group-hover:opacity-80 transition-opacity">
                                {brandName}
                            </span>
                        </Link>
                    </div>

                    {/* ── MIDDLE: Desktop Search Bar (Always visible on >= 1024px) ── */}
                    <div className="hidden lg:block flex-grow max-w-xl mx-auto w-full px-4">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={navSearchVal}
                                onChange={(e) => setNavSearchVal(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleNavSearch(); }}
                                placeholder="Search T-Shirts, Mugs, Stickers..."
                                className={`w-full py-2.5 pl-10 pr-10 rounded-full text-sm border focus:outline-none focus:ring-1 transition-colors ${
                                    !isTransparentPage || heroExited
                                        ? 'bg-[var(--text)]/5 border-[var(--secondary)]/20 text-[var(--text)] placeholder-[var(--text)]/50 focus:ring-[var(--primary)]'
                                        : 'bg-white/10 border-white/15 text-white placeholder-white/60 focus:bg-white/15 focus:ring-white/30 backdrop-blur-sm'
                                }`}
                            />
                            <IconSearch className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                                !isTransparentPage || heroExited ? 'text-[var(--text)]/50' : 'text-white/60'
                            }`} />
                            {navSearchVal && (
                                <button
                                    onClick={() => setNavSearchVal('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-current opacity-60 hover:opacity-100 transition-opacity"
                                >
                                    <IconX className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT: Icon buttons ── */}
                    <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 lg:w-[280px] lg:justify-end">
                        <NavIconBtn href="/products" label="Products" isTransparentPage={isTransparentPage} heroExited={heroExited} showOnboarding={showOnboarding}>
                            <IconGrid />
                        </NavIconBtn>

                        <NavIconBtn
                            label="Wishlist"
                            badge={wishlistCount}
                            badgeAnimate={wishAnimate}
                            onClick={() => {
                                if (!isLoggedIn) { triggerAuthGuard("Login to view your saved wishlist"); }
                                else { navigate.push("/wishlist"); }
                            }}
                            isTransparentPage={isTransparentPage}
                            heroExited={heroExited}
                            showOnboarding={showOnboarding}
                        >
                            <IconHeart />
                        </NavIconBtn>

                        <NavIconBtn
                            label="Cart"
                            badge={cartCount}
                            badgeAnimate={cartAnimate}
                            onClick={() => {
                                if (!isLoggedIn) { triggerAuthGuard("Login to view your shopping cart"); }
                                else { navigate.push("/cart"); }
                            }}
                            isTransparentPage={isTransparentPage}
                            heroExited={heroExited}
                            showOnboarding={showOnboarding}
                        >
                            <IconCart />
                        </NavIconBtn>

                        <NavIconBtn 
                            label="Theme" 
                            onClick={toggleTheme}
                            isTransparentPage={isTransparentPage}
                            heroExited={heroExited}
                            showOnboarding={showOnboarding}
                        >
                            {mode === "light" ? <IconMoon /> : <IconSun />}
                        </NavIconBtn>

                        <NavIconBtn
                            label="Account"
                            href={isLoggedIn ? "/dashboard" : "/login"}
                            isTransparentPage={isTransparentPage}
                            heroExited={heroExited}
                            showOnboarding={showOnboarding}
                        >
                            {isLoggedIn && user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full border border-white/20 shadow-sm" />
                            ) : (
                                <IconUser />
                            )}
                        </NavIconBtn>
                    </div>
                </div>

                {/* ═══ MOBILE SEARCH BAR (scroll-reveal) ═══ */}
                {searchVisible && (
                    <div className={`lg:hidden px-4 sm:px-6 md:px-10 lg:px-14 overflow-hidden ${searchHiding ? 'animate-search-hide' : 'animate-search-reveal'}`}>
                        <div className="relative w-full max-w-2xl mx-auto">
                            <input
                                type="text"
                                value={navSearchVal}
                                onChange={(e) => setNavSearchVal(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleNavSearch(); }}
                                placeholder="Search T-Shirts, Mugs, Stickers..."
                                className={`w-full py-2.5 pl-10 pr-10 rounded-full text-sm border focus:outline-none focus:ring-1 transition-colors ${
                                    !isTransparentPage || heroExited
                                        ? 'bg-[var(--text)]/5 border-[var(--secondary)]/20 text-[var(--text)] placeholder-[var(--text)]/50 focus:ring-[var(--primary)]'
                                        : 'bg-white/10 border-white/15 text-white placeholder-white/60 focus:bg-white/15 focus:ring-white/30 backdrop-blur-sm'
                                }`}
                            />
                            <IconSearch className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                                !isTransparentPage || heroExited ? 'text-[var(--text)]/50' : 'text-white/60'
                            }`} />
                            {navSearchVal && (
                                <button
                                    onClick={() => setNavSearchVal('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-current opacity-60 hover:opacity-100 transition-opacity"
                                >
                                    <IconX className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* ═══════════════════════════════════
                 SLIDE-IN DRAWER
                 ═══════════════════════════════════ */}
            {drawerOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${drawerClosing ? 'opacity-0' : 'opacity-100'}`}
                        onClick={closeDrawer}
                    />

                    {/* Drawer Panel */}
                    <aside
                        className={`fixed top-0 left-0 bottom-0 z-[70] w-[85%] max-w-sm bg-[var(--bg)] text-[var(--text)] shadow-2xl flex flex-col rounded-r-3xl ${drawerClosing ? 'animate-slide-out-left' : 'animate-slide-in-left'}`}
                    >
                        {/* ── Drawer Header ── */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--secondary)]/10 shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-sm">
                                    <span className="text-white text-base font-black leading-none">P</span>
                                </div>
                                <span className="text-lg font-black tracking-tight uppercase">{brandName}</span>
                            </div>
                            <button
                                onClick={closeDrawer}
                                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--secondary)]/10 active:scale-95 transition-all touch-manipulation"
                                aria-label="Close menu"
                            >
                                <IconX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* ── Drawer Scrollable Content ── */}
                        <div className="flex-1 overflow-y-auto drawer-scrollbar" data-lenis-prevent>
                            {/* ═══ ACCOUNT SECTION ═══ */}
                            <div className="px-5 py-4 border-b border-[var(--secondary)]/10">
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text)]/40 mb-3">Account</p>
                                {isLoggedIn ? (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            {user?.avatar && (
                                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-[var(--primary)]/20 shadow-sm" />
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm truncate">{user?.name || "User"}</p>
                                                <p className="text-[11px] text-[var(--text)]/50 truncate">{user?.email}</p>
                                            </div>
                                        </div>
                                        <Link href="/dashboard" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--secondary)]/8 transition-colors text-sm font-medium touch-manipulation">
                                            <IconUser className="w-[18px] h-[18px] opacity-60" /> My Account
                                        </Link>
                                        <Link href="/wishlist" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--secondary)]/8 transition-colors text-sm font-medium touch-manipulation">
                                            <IconHeart className="w-[18px] h-[18px] opacity-60" /> Wishlist
                                            {wishlistCount > 0 && <span className="ml-auto text-[11px] font-bold bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 rounded-full">{wishlistCount}</span>}
                                        </Link>
                                        <Link href="/cart" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--secondary)]/8 transition-colors text-sm font-medium touch-manipulation">
                                            <IconCart className="w-[18px] h-[18px] opacity-60" /> Cart
                                            {cartCount > 0 && <span className="ml-auto text-[11px] font-bold bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 rounded-full">{cartCount}</span>}
                                        </Link>
                                        <Link href="/dashboard/orders" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--secondary)]/8 transition-colors text-sm font-medium touch-manipulation">
                                            <IconShoppingBag className="w-[18px] h-[18px] opacity-60" /> Orders
                                        </Link>
                                        <button
                                            onClick={toggleTheme}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--secondary)]/8 transition-colors text-sm font-medium touch-manipulation"
                                        >
                                            {mode === "light" ? <IconMoon className="w-[18px] h-[18px] opacity-60" /> : <IconSun className="w-[18px] h-[18px] opacity-60" />}
                                            {mode === "light" ? "Dark Mode" : "Light Mode"}
                                            <div className={`ml-auto w-9 h-5 rounded-full relative transition-colors ${mode === "dark" ? "bg-[var(--primary)]" : "bg-[var(--secondary)]/30"}`}>
                                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${mode === "dark" ? "translate-x-4" : "translate-x-0.5"}`} />
                                            </div>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Link href="/login" onClick={closeDrawer} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:opacity-90 transition-opacity touch-manipulation">
                                            Login
                                        </Link>
                                        <Link href="/register" onClick={closeDrawer} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--secondary)]/20 font-semibold text-sm hover:bg-[var(--secondary)]/8 transition-colors touch-manipulation">
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* ═══ PRODUCTS SECTION ═══ */}
                            <div className="px-5 py-4 border-b border-[var(--secondary)]/10">
                                {/* Level 1: PRODUCTS Accordion Header */}
                                <button
                                    onClick={() => setProductsSectionOpen(!productsSectionOpen)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[var(--secondary)]/5 hover:bg-[var(--secondary)]/10 border border-[var(--secondary)]/5 shadow-sm active:scale-95 transition-all duration-200 text-left touch-manipulation cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <IconCube className="w-5 h-5 text-[var(--primary)] opacity-70 shrink-0" />
                                        <span className="text-sm font-black uppercase tracking-[0.1em] text-[var(--text)]/80">Products</span>
                                    </div>
                                    <IconChevron className="w-4 h-4 opacity-50 shrink-0" open={productsSectionOpen} />
                                </button>

                                {/* Level 2: Expanded Content (Categories) */}
                                {productsSectionOpen && (
                                    <div className="pl-3.5 space-y-1.5 mt-2 animate-subcat-fade">
                                        {/* Browse all link */}
                                        <Link 
                                            href="/products" 
                                            onClick={closeDrawer} 
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[var(--secondary)]/8 transition-colors text-xs font-semibold touch-manipulation mb-1"
                                        >
                                            <IconGrid className="w-4 h-4 opacity-60" /> Browse All Products
                                        </Link>

                                        {/* Category Accordions */}
                                        <div className="space-y-1 mt-1">
                                            {categories.map(cat => {
                                                const isOpen = openCategory === cat._id;
                                                const subs = getSubsForCategory(cat._id);

                                                return (
                                                    <div key={cat._id} className="rounded-xl overflow-hidden">
                                                        {/* Category Header */}
                                                        <div
                                                            onClick={() => toggleCategory(cat._id)}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--secondary)]/8 transition-colors touch-manipulation text-left cursor-pointer"
                                                        >
                                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-[var(--secondary)]/10 shrink-0">
                                                                {cat.image ? (
                                                                    <img src={resolveImage(cat.image)} alt={cat.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-[var(--text)]/30">
                                                                        <IconCube className="w-5 h-5" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span
                                                                onClick={(e) => handleCategoryNameClick(e, cat._id)}
                                                                className="text-sm font-semibold flex-1 truncate hover:text-[var(--primary)] transition-colors z-10 cursor-pointer"
                                                            >
                                                                {cat.name}
                                                            </span>
                                                            {subs.length > 0 && (
                                                                <IconChevron className="w-4 h-4 opacity-50 shrink-0" open={isOpen} />
                                                            )}
                                                        </div>

                                                        {/* Subcategories (expanded) */}
                                                        {isOpen && subs.length > 0 && (
                                                            <div className="pl-3.5 pr-1 py-1.5 space-y-2 animate-subcat-fade">
                                                                {subs.map(sub => {
                                                                    const isSubOpen = openSubcategory === sub._id;
                                                                    const prods = subProducts[sub._id] || [];
                                                                    const isLoadingProds = loadingProducts[sub._id];

                                                                    return (
                                                                        <div key={sub._id} className="space-y-1">
                                                                            <div
                                                                                onClick={() => toggleSubcategory(sub._id)}
                                                                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--secondary)]/5 hover:bg-[var(--secondary)]/10 transition-all touch-manipulation text-left border border-[var(--secondary)]/5 shadow-sm cursor-pointer"
                                                                                role="button"
                                                                            >
                                                                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-[var(--secondary)]/10 shrink-0 shadow-sm border border-[var(--secondary)]/10">
                                                                                    {sub.image ? (
                                                                                        <img src={resolveImage(sub.image)} alt={sub.name} className="w-full h-full object-cover" />
                                                                                    ) : (
                                                                                        <div className="w-full h-full flex items-center justify-center text-[var(--text)]/20">
                                                                                            <IconCube className="w-4 h-4" />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <span
                                                                                    onClick={(e) => handleSubcategoryNameClick(e, cat._id, sub._id)}
                                                                                    className="text-[13px] font-semibold text-[var(--text)]/80 flex-1 truncate hover:text-[var(--primary)] transition-colors z-10 cursor-pointer"
                                                                                >
                                                                                    {sub.name}
                                                                                </span>
                                                                                <IconChevron className="w-3.5 h-3.5 opacity-40 shrink-0" open={isSubOpen} />
                                                                            </div>

                                                                            {/* Product Links (Level 4 - with thumbnails) */}
                                                                            {isSubOpen && (
                                                                                <div className="pl-3.5 pr-2 py-1.5 space-y-1.5 animate-subcat-fade">
                                                                                    {isLoadingProds ? (
                                                                                        <div className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-[var(--text)]/40">
                                                                                            <div className="w-3 h-3 border-2 border-[var(--primary)]/40 border-t-transparent rounded-full animate-spin" />
                                                                                            Loading...
                                                                                        </div>
                                                                                    ) : (
                                                                                        <>
                                                                                            {prods.slice(0, 10).map(prod => (
                                                                                                <Link
                                                                                                    key={prod._id}
                                                                                                    href={`/product/${prod.slug || prod._id}`}
                                                                                                    onClick={closeDrawer}
                                                                                                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-[var(--secondary)]/8 hover:text-[var(--primary)] transition-all touch-manipulation text-left"
                                                                                                >
                                                                                                    <div className="w-7 h-7 rounded-lg overflow-hidden bg-[var(--secondary)]/10 shrink-0 border border-[var(--secondary)]/10 shadow-sm">
                                                                                                        {prod.primaryImage || prod.coverImage || (prod.images && prod.images[0]) ? (
                                                                                                            <img src={resolveImage(prod.primaryImage || prod.coverImage || prod.images[0])} alt={prod.name} className="w-full h-full object-cover" />
                                                                                                        ) : (
                                                                                                            <div className="w-full h-full flex items-center justify-center text-[var(--text)]/20">
                                                                                                                <IconCube className="w-3.5 h-3.5" />
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                    <span className="text-[12px] font-semibold text-[var(--text)]/80 hover:text-[var(--primary)] transition-colors truncate">{prod.name}</span>
                                                                                                </Link>
                                                                                            ))}
                                                                                            {prods.length > 10 && (
                                                                                                <Link
                                                                                                    href={`/products?categoryId=${cat._id}&subcategoryId=${sub._id}`}
                                                                                                    onClick={closeDrawer}
                                                                                                    className="block px-3 py-1.5 text-[11px] font-bold text-[var(--primary)] hover:underline touch-manipulation"
                                                                                                >
                                                                                                    View all {prods.length} products →
                                                                                                </Link>
                                                                                            )}
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                                
                                                                {/* Optional View All for this Category */}
                                                                <Link
                                                                    href={`/products?categoryId=${cat._id}`}
                                                                    onClick={closeDrawer}
                                                                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-[var(--secondary)]/20 hover:border-[var(--primary)]/40 text-[11px] font-bold text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all text-center touch-manipulation mt-2"
                                                                >
                                                                    View All {cat.name} →
                                                                </Link>
                                                            </div>
                                                        )}

                                                        {/* If category has no subs, clicking/expanded shows View All */}
                                                        {isOpen && subs.length === 0 && (
                                                            <div className="pl-3.5 pr-4 pb-3">
                                                                <Link
                                                                    href={`/products?categoryId=${cat._id}`}
                                                                    onClick={closeDrawer}
                                                                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-dashed border-[var(--secondary)]/20 hover:border-[var(--primary)]/40 text-[12px] font-bold text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all text-center touch-manipulation"
                                                                >
                                                                    View All {cat.name} Products →
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ═══ QUICK LINKS SECTION ═══ */}
                            <div className="px-5 py-4 border-b border-[var(--secondary)]/10">
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text)]/40 mb-3">Quick Links</p>
                                <div className="space-y-1">

                                    <Link href="/about" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--secondary)]/8 transition-colors text-sm font-medium touch-manipulation">
                                        <IconInfo className="w-[18px] h-[18px] opacity-60" /> About Us
                                    </Link>

                                    <Link href="/dashboard/delivery-tracking" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--secondary)]/8 transition-colors text-sm font-medium touch-manipulation">
                                        <IconTruck className="w-[18px] h-[18px] opacity-60" /> Track Order
                                    </Link>

                                    {/* Contact Us Accordion */}
                                    <div>
                                        <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--secondary)]/8 transition-colors text-sm font-medium">
                                            <IconPhone className="w-[18px] h-[18px] opacity-60 shrink-0" />
                                            {/* First click opens the dropdown; once open, clicking the name navigates to the contact page. */}
                                            <Link
                                                href="/contact"
                                                onClick={(e) => {
                                                    if (openQuickLink !== 'contact') {
                                                        e.preventDefault();
                                                        setOpenQuickLink('contact');
                                                    } else {
                                                        closeDrawer();
                                                    }
                                                }}
                                                className="flex-1 text-left touch-manipulation"
                                            >
                                                Contact Us
                                            </Link>
                                            {/* Chevron only toggles the dropdown — never navigates. */}
                                            <button
                                                type="button"
                                                aria-label="Toggle contact options"
                                                onClick={() => setOpenQuickLink(openQuickLink === 'contact' ? null : 'contact')}
                                                className="p-1 -mr-1 touch-manipulation"
                                            >
                                                <IconChevron className="w-3.5 h-3.5 opacity-40" open={openQuickLink === 'contact'} />
                                            </button>
                                        </div>
                                        {openQuickLink === 'contact' && (
                                            <div className="pl-4 pr-1.5 pt-2 pb-3 space-y-2 animate-subcat-fade text-[var(--text)]">
                                                {/* Live Chat Card */}
                                                <Link 
                                                    href="/dashboard/requests?type=support" 
                                                    onClick={closeDrawer} 
                                                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-[var(--primary)]/[0.02] transition-all duration-300 group/btn active:scale-[0.98] shadow-sm border border-l-4 overflow-hidden text-left w-full"
                                                    style={{ borderColor: 'rgba(80, 80, 57, 0.08)', borderLeftColor: '#10b981' }}
                                                >
                                                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 transition-colors group-hover/btn:bg-emerald-100 shrink-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a.596.596 0 0 1-.748-.688 4.01 4.01 0 0 0 .979-2.174C3.839 16.637 3 14.423 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-xs font-black uppercase tracking-wider text-[var(--text)] leading-none">Live Support</span>
                                                            <span className="flex h-1.5 w-1.5 relative shrink-0">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                                            </span>
                                                        </div>
                                                        <p className="text-[9px] font-bold text-[var(--text)]/40 mt-1 truncate leading-none">Chat online with design desk</p>
                                                    </div>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 shrink-0">Start →</span>
                                                </Link>

                                                {/* WhatsApp Card */}
                                                <a 
                                                    href="https://wa.me/919747723150" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-[var(--primary)]/[0.02] transition-all duration-300 group/btn active:scale-[0.98] shadow-sm border border-l-4 overflow-hidden text-left w-full"
                                                    style={{ borderColor: 'rgba(80, 80, 57, 0.08)', borderLeftColor: '#25D366' }}
                                                >
                                                    <div className="p-1.5 rounded-lg bg-green-50 text-green-600 transition-colors group-hover/btn:bg-green-100 shrink-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-xs font-black uppercase tracking-wider text-[var(--text)] leading-none">WhatsApp Support</span>
                                                        <p className="text-[9px] font-bold text-[var(--text)]/40 mt-1 leading-none">Instant response channel</p>
                                                    </div>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-[#128C4A] shrink-0">Open →</span>
                                                </a>

                                                {/* Call Card */}
                                                <a 
                                                    href="tel:+919747723150" 
                                                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-[var(--primary)]/[0.02] transition-all duration-300 group/btn active:scale-[0.98] shadow-sm border border-l-4 overflow-hidden text-left w-full"
                                                    style={{ borderColor: 'rgba(80, 80, 57, 0.08)', borderLeftColor: 'var(--primary)' }}
                                                >
                                                    <div className="p-1.5 rounded-lg bg-[var(--primary)]/5 text-[var(--primary)] transition-colors group-hover/btn:bg-[var(--primary)]/10 shrink-0">
                                                        <IconPhone className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-[9px] font-black uppercase tracking-wider text-[var(--text)]/40 leading-none">Call Support Desk</span>
                                                        <p className="text-[13.5px] font-black mt-1 text-[var(--text)] tracking-wide leading-none">+91 97477 23150</p>
                                                    </div>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--primary)] shrink-0 opacity-0 group-hover/btn:opacity-100 transition-opacity">Call →</span>
                                                </a>

                                                {/* Office Address Card */}
                                                <div 
                                                    className="p-3 rounded-xl bg-white space-y-3 shadow-sm border border-l-4 overflow-hidden text-left"
                                                    style={{ borderColor: 'rgba(80, 80, 57, 0.08)', borderLeftColor: 'var(--secondary)' }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-0.5 p-1.5 rounded-lg bg-[var(--primary)]/5 text-[var(--primary)] shrink-0">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-black uppercase tracking-wider text-[var(--text)]/40 mb-1">Office Address</span>
                                                            <span className="font-bold text-[11px] leading-normal text-[var(--text)]/85">
                                                                123, Print Street,<br />
                                                                Koduvally, Kerala, India
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <a 
                                                        href="https://maps.google.com/?q=Koduvally,Kerala,India" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="flex items-center justify-center gap-2 py-2 rounded-lg bg-[var(--primary)] hover:opacity-95 text-white text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all w-full shadow-md shadow-[var(--primary)]/10"
                                                    >
                                                        <span>Open in Maps</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Link href="/products?highlights=bulkOrder" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--secondary)]/8 transition-colors text-sm font-medium touch-manipulation">
                                        <IconCube className="w-[18px] h-[18px] opacity-60" /> Bulk Orders
                                    </Link>
                                    <Link href="/products?highlights=customizable" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--secondary)]/8 transition-colors text-sm font-medium touch-manipulation">
                                        <IconPaintBrush className="w-[18px] h-[18px] opacity-60" /> Customization
                                    </Link>

                                </div>
                            </div>

                            {/* ═══ INFORMATION SECTION ═══ */}
                            <div className="px-5 py-4 border-b border-[var(--secondary)]/10">
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text)]/40 mb-3">Information</p>
                                <div className="space-y-1">
                                    <Link href="/privacy-policy" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--secondary)]/8 transition-colors text-sm font-medium touch-manipulation">
                                        <IconInfo className="w-[18px] h-[18px] opacity-60" /> Privacy Policy
                                    </Link>
                                    <Link href="/terms-and-conditions" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--secondary)]/8 transition-colors text-sm font-medium touch-manipulation">
                                        <IconInfo className="w-[18px] h-[18px] opacity-60" /> Terms & Conditions
                                    </Link>
                                    <Link href="/refund-policy" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--secondary)]/8 transition-colors text-sm font-medium touch-manipulation">
                                        <IconInfo className="w-[18px] h-[18px] opacity-60" /> Refund Policy
                                    </Link>
                                    <Link href="/shipping-policy" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--secondary)]/8 transition-colors text-sm font-medium touch-manipulation">
                                        <IconInfo className="w-[18px] h-[18px] opacity-60" /> Shipping Policy
                                    </Link>
                                    <Link href="/faq" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--secondary)]/8 transition-colors text-sm font-medium touch-manipulation">
                                        <IconInfo className="w-[18px] h-[18px] opacity-60" /> FAQs
                                    </Link>
                                </div>
                            </div>

                            {/* ═══ LOGOUT (logged-in only) ═══ */}
                            {isLoggedIn && (
                                <div className="px-5 py-4 border-b border-[var(--secondary)]/10">
                                    <button
                                        onClick={() => { logout(); closeDrawer(); }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500/8 transition-colors text-sm font-semibold touch-manipulation"
                                    >
                                        <IconLogout className="w-[18px] h-[18px]" /> Logout
                                    </button>
                                </div>
                            )}

                            {/* ═══ FOOTER ═══ */}
                            <div className="px-5 py-6 text-center">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text)]/25">
                                    © {new Date().getFullYear()} {brandName}
                                </p>
                            </div>
                        </div>
                    </aside>
                </>
            )}

            {/* Premium Auth Components */}
            <AuthNotification />
            <AuthModal />
        </>
    );
};

export default Navbar;
