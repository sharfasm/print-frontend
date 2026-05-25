"use client";
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import config from '../brand/config';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import AuthNotification from './AuthNotification';
import AuthModal from './AuthModal';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mode, setMode] = useState("light");
    const pathname = usePathname();
    const navigate = useRouter();
    const { cart, wishlist, triggerAuthGuard, brandInfo } = useShop();
    const { isLoggedIn, user, logout } = useAuth();
    
    // Fallback brand name
    const brandName = brandInfo?.name || config.brand;

    // Animation states for badges
    const [cartAnimate, setCartAnimate] = useState(false);
    const [wishAnimate, setWishAnimate] = useState(false);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const wishlistCount = wishlist.length;

    useEffect(() => {
        if (cartCount > 0) {
            setCartAnimate(true);
            const timer = setTimeout(() => setCartAnimate(false), 500);
            return () => clearTimeout(timer);
        }
    }, [cartCount]);

    useEffect(() => {
        if (wishlistCount > 0) {
            setWishAnimate(true);
            const timer = setTimeout(() => setWishAnimate(false), 500);
            return () => clearTimeout(timer);
        }
    }, [wishlistCount]);

    useEffect(() => {
        // Load initial theme on mount
        const savedMode = localStorage.getItem("theme-mode");
        if (savedMode) {
            setMode(savedMode);
        } else {
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setMode(systemPrefersDark ? "dark" : "light");
        }
    }, []);

    useEffect(() => {
        const theme = config.theme[mode];
        if (theme) {
            document.documentElement.style.setProperty("--primary", theme.primary);
            document.documentElement.style.setProperty("--secondary", theme.secondary);
            document.documentElement.style.setProperty("--bg", theme.bg);
            document.documentElement.style.setProperty("--text", theme.text);
            
            // Synchronize Tailwind dark variant and document theme
            if (mode === "dark") {
                document.documentElement.classList.add("dark");
                document.documentElement.setAttribute("data-theme", "dark");
            } else {
                document.documentElement.classList.remove("dark");
                document.documentElement.setAttribute("data-theme", "light");
            }
        }
    }, [mode]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Fire once to set initial state
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Determine if the current page should have a transparent top nav
    const isTransparentPage = pathname === '/' || pathname === '/about' || pathname === '/lookbook' || pathname === '/contact' || pathname === '/news' || pathname === '/products';

    const navClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isScrolled || !isTransparentPage
            ? 'bg-[var(--bg)] shadow-sm text-[var(--text)] border-b border-[var(--primary)]/10'
            : 'bg-transparent text-white border-b-0'
        }`;

    return (
        <nav className={navClass}>
            <div className="flex items-center justify-between w-full px-6 md:px-10 lg:px-14 py-4 md:py-5">
                {/* Left Side: Logo */}
                <div className="flex items-center flex-1 min-w-0 pr-2">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl md:text-2xl font-black tracking-tighter hover:opacity-70 transition-opacity truncate uppercase">
                        {brandName} <span className="hidden sm:inline">STORE</span>
                    </Link>
                </div>

                {/* Center: Search Bar */}
                <div className="hidden md:flex items-center justify-center w-2/4 px-4">
                    <div className="relative w-full max-w-lg">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className={`w-full py-2.5 pl-10 pr-4 rounded-full text-sm border focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-colors ${isScrolled || !isTransparentPage
                                    ? 'bg-[var(--text)]/5 border-[var(--secondary)]/20 text-[var(--text)] placeholder-[var(--text)]/50'
                                    : 'bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20'
                                }`}
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 ${isScrolled || !isTransparentPage ? 'text-[var(--text)]/50' : 'text-white/70'}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                </div>

                {/* Right Side: Links & Icons */}
                <div className="flex items-center justify-end gap-3 sm:gap-5 md:gap-7 shrink-0">
                    {/* Icons */}
                    <div className="flex items-center gap-2.5 sm:gap-4 pl-2 sm:pl-4 border-gray-300/30">
                        <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="group hidden sm:flex items-center justify-center gap-2 hover:opacity-70 transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <span className="text-sm font-medium overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-[70px] transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
                                Products
                            </span>
                        </Link>
                        {isLoggedIn ? (
                            <div className="relative group py-2 flex items-center">
                                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 hover:opacity-70 transition-all duration-300">
                                    <img src={user?.avatar} alt={user?.name} className="w-6 h-6 rounded-full border border-[var(--primary)]/20 shadow-sm" />
                                    <span className="text-sm font-bold overflow-hidden whitespace-nowrap max-w-0 md:group-hover:max-w-[80px] transition-all duration-300 ease-in-out opacity-0 md:group-hover:opacity-100 hidden md:block">
                                        Dashboard
                                    </span>
                                </Link>
                                {/* Dropdown for Logged In User */}
                                <div className="absolute right-0 top-full w-48 bg-[var(--bg)] text-[var(--text)] border border-[var(--secondary)]/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50 flex flex-col py-2 mt-2">
                                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-2.5 hover:bg-[var(--secondary)]/5 text-sm font-bold opacity-80 hover:opacity-100 hover:text-[var(--primary)] transition-all border-b border-[var(--secondary)]/5">
                                        Account
                                    </Link>
                                    <Link href="/dashboard/orders" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-2.5 hover:bg-[var(--secondary)]/5 text-sm font-bold opacity-80 hover:opacity-100 hover:text-[var(--primary)] transition-all border-b border-[var(--secondary)]/5">
                                        Orders
                                    </Link>
                                    <button 
                                        onClick={() => {
                                            logout();
                                            setIsMobileMenuOpen(false);
                                        }} 
                                        className="w-full text-left px-5 py-2.5 hover:bg-red-50 text-sm font-bold text-red-500 opacity-80 hover:opacity-100 transition-all rounded-b-xl"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative group py-2 flex items-center">
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 hover:opacity-70 transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                    <span className="text-sm font-bold overflow-hidden whitespace-nowrap max-w-0 md:group-hover:max-w-[60px] transition-all duration-300 ease-in-out opacity-0 md:group-hover:opacity-100 hidden md:block">
                                        Login
                                    </span>
                                </Link>
                                {/* Dropdown for Guest User */}
                                <div className="absolute right-0 top-full w-48 bg-[var(--bg)] text-[var(--text)] border border-[var(--secondary)]/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50 flex flex-col py-2 mt-2">
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-2.5 hover:bg-[var(--secondary)]/5 text-sm font-bold opacity-80 hover:opacity-100 hover:text-[var(--primary)] transition-all border-b border-[var(--secondary)]/5">
                                        Sign In
                                    </Link>
                                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-2.5 hover:bg-[var(--secondary)]/5 text-sm font-bold opacity-80 hover:opacity-100 hover:text-[var(--primary)] transition-all">
                                        Sign Up
                                    </Link>
                                </div>
                            </div>
                        )}
                        
                        <button 
                            onClick={() => {
                                if (!isLoggedIn) {
                                    triggerAuthGuard("Login to view your saved wishlist");
                                } else {
                                    setIsMobileMenuOpen(false);
                                    navigate.push("/wishlist");
                                }
                            }} 
                            className="group flex items-center justify-center hover:opacity-70 transition-all duration-300 relative"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                            {wishlist.length > 0 && (
                                <span className={`absolute -top-2 -right-2 bg-[var(--primary)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg ${wishAnimate ? 'animate-cart-bounce' : ''}`}>
                                    {wishlist.length}
                                </span>
                            )}
                        </button>

                        <button 
                            onClick={() => {
                                if (!isLoggedIn) {
                                    triggerAuthGuard("Login to view your shopping cart");
                                } else {
                                    setIsMobileMenuOpen(false);
                                    navigate.push("/cart");
                                }
                            }} 
                            className="group flex items-center justify-center hover:opacity-70 transition-all duration-300 relative"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                            {cart.length > 0 && (
                                <span className={`absolute -top-2 -right-2 bg-[var(--primary)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg ${cartAnimate ? 'animate-cart-bounce' : ''}`}>
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Theme Toggle Button */}
                        <button 
                            onClick={() => {
                                const newMode = mode === "light" ? "dark" : "light";
                                setMode(newMode);
                                localStorage.setItem("theme-mode", newMode);
                            }}
                            className={`p-2 rounded-full transition-colors ml-2 shrink-0 flex items-center justify-center ${isScrolled || !isTransparentPage ? 'hover:bg-[var(--text)]/10 text-[var(--text)]' : 'hover:bg-white/10 text-white'}`}
                            aria-label="Toggle Theme"
                            title={mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                        >
                            {mode === "light" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>

                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Button  */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="hover:opacity-70 transition-opacity focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white text-black w-full border-t border-gray-100 shadow-xl absolute top-full left-0">
                    <div className="flex flex-col px-6 py-4 gap-4">
                        <div className="relative w-full mb-2">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full py-2.5 pl-10 pr-4 rounded-lg text-sm bg-gray-100 border-none focus:ring-2 focus:ring-black"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                        <Link
                            href="/products"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-sm font-medium tracking-wide py-2 border-b border-gray-50 flex justify-between"
                        >
                            Products
                        </Link>
                    </div>
                </div>
            )}
            {/* Premium Auth Components */}
            <AuthNotification />
            <AuthModal />
        </nav>
    );
};

export default Navbar;
