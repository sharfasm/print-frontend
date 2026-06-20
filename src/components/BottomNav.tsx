// @ts-nocheck
"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";

/* ─────────────────────────────────────────────
   ICONS (inline SVG — same stroke language as Navbar)
   `filled` renders the solid active variant.
   ───────────────────────────────────────────── */
const IconHome = ({ className = "w-6 h-6", filled = false }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 1.7} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);

const IconGrid = ({ className = "w-6 h-6", filled = false }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 1.7} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

const IconHeart = ({ className = "w-6 h-6", filled = false }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 1.7} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

const IconCart = ({ className = "w-6 h-6", filled = false }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 1.7} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

const IconUser = ({ className = "w-6 h-6", filled = false }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 1.7} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

/* Routes where the bottom nav is suppressed (full-screen flows). */
const HIDE_ON = ["/checkout", "/login", "/register", "/maintenance", "/order-confirmation"];

/* ═════════════════════════════════════════════
   BOTTOM NAVIGATION (mobile / tablet < lg)
   A floating glassmorphic bar. The active tab lifts into a raised,
   colour-filled pill so the current destination reads instantly.
   Products, Cart, Wishlist and Account live here on mobile after being
   removed from the header; Home keeps the storefront one tap away.
   ═════════════════════════════════════════════ */
const BottomNav = () => {
    const pathname = usePathname() || "/";
    const { cart, wishlist, triggerAuthGuard } = useShop();
    const { isLoggedIn, user } = useAuth();

    const cartCount = (cart || []).reduce((acc, item) => acc + (item.quantity || 0), 0);
    const wishlistCount = (wishlist || []).length;

    const hidden = HIDE_ON.some((p) => pathname === p || pathname.startsWith(p + "/"));

    // Reserve space at the bottom of the page (mobile only) so the floating bar
    // never covers the footer / last content. Driven by a body class so routes
    // that hide the bar don't get dead space. See globals.css.
    useEffect(() => {
        if (typeof document === "undefined") return;
        document.body.classList.toggle("has-bottom-nav", !hidden);
        return () => document.body.classList.remove("has-bottom-nav");
    }, [hidden]);

    if (hidden) return null;

    const tabs = [
        {
            key: "home",
            label: "Home",
            href: "/",
            Icon: IconHome,
            active: pathname === "/",
        },
        {
            key: "products",
            label: "Shop",
            href: "/products",
            Icon: IconGrid,
            active:
                pathname.startsWith("/products") ||
                pathname.startsWith("/product") ||
                pathname.startsWith("/category"),
        },
        {
            key: "wishlist",
            label: "Wishlist",
            href: "/wishlist",
            Icon: IconHeart,
            badge: wishlistCount,
            guard: "Login to view your saved wishlist",
            active: pathname.startsWith("/wishlist"),
        },
        {
            key: "cart",
            label: "Cart",
            href: "/cart",
            Icon: IconCart,
            badge: cartCount,
            guard: "Login to view your shopping cart",
            active: pathname.startsWith("/cart"),
        },
        {
            key: "account",
            label: "Account",
            href: isLoggedIn ? "/dashboard" : "/login",
            Icon: IconUser,
            avatar: isLoggedIn ? user?.avatar : null,
            active: pathname.startsWith("/dashboard"),
        },
    ];

    const handleClick = (tab) => (e) => {
        // Auth-gated tabs mirror the Navbar: intercept and show the auth guard
        // instead of navigating when logged out.
        if (tab.guard && !isLoggedIn) {
            e.preventDefault();
            triggerAuthGuard(tab.guard);
        }
    };

    return (
        <nav
            aria-label="Primary"
            className="lg:hidden fixed inset-x-0 bottom-0 z-40 px-3 pointer-events-none"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
        >
            <ul
                className="pointer-events-auto mx-auto flex max-w-md items-end justify-around rounded-[1.75rem] border border-white/15 bg-[var(--bg)]/60 px-1.5 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_10px_44px_-10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.28)]"
            >
                {tabs.map((tab) => {
                    const { Icon } = tab;
                    const active = tab.active;
                    return (
                        <li key={tab.key} className="flex-1">
                            <Link
                                href={tab.href}
                                onClick={handleClick(tab)}
                                aria-label={tab.label}
                                aria-current={active ? "page" : undefined}
                                className="group relative flex h-[4.25rem] flex-col items-center justify-end gap-1 pb-2 pt-2 touch-manipulation"
                            >
                                {/* Icon — lifts into an elevated filled pill when active */}
                                <span
                                    className={`relative flex items-center justify-center rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform ${
                                        active
                                            ? "h-12 w-12 -translate-y-4 bg-[var(--primary)] text-[var(--bg)] shadow-[0_12px_26px_-6px_color-mix(in_srgb,var(--primary)_70%,transparent)] ring-[3px] ring-[var(--bg)]/70"
                                            : "h-10 w-10 translate-y-0 bg-transparent text-[var(--text)]/55 group-hover:text-[var(--text)]/80 group-active:scale-90"
                                    }`}
                                >
                                    {/* subtle top sheen on the active pill */}
                                    {active && (
                                        <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/25 to-transparent" />
                                    )}
                                    {tab.avatar ? (
                                        <img
                                            src={tab.avatar}
                                            alt={tab.label}
                                            className={`rounded-full object-cover transition-all duration-300 ${
                                                active ? "h-8 w-8 ring-2 ring-[var(--bg)]" : "h-6 w-6 ring-1 ring-[var(--secondary)]/30"
                                            }`}
                                        />
                                    ) : (
                                        <Icon className={active ? "w-[22px] h-[22px]" : "w-[22px] h-[22px]"} filled={active} />
                                    )}

                                    {tab.badge > 0 && (
                                        <span
                                            className={`absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-[var(--bg)] bg-[var(--primary)] px-1 text-[9px] font-extrabold leading-none text-[var(--bg)] shadow-sm ${
                                                active ? "border-[var(--primary)] bg-[var(--bg)] text-[var(--primary)]" : ""
                                            }`}
                                        >
                                            {tab.badge > 99 ? "99+" : tab.badge}
                                        </span>
                                    )}
                                </span>

                                {/* Label */}
                                <span
                                    className={`text-[10px] tracking-wide transition-all duration-300 ${
                                        active
                                            ? "-mt-1.5 font-bold text-[var(--primary)] opacity-100"
                                            : "font-semibold text-[var(--text)]/55 opacity-90 group-hover:text-[var(--text)]/75"
                                    }`}
                                >
                                    {tab.label}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default BottomNav;
