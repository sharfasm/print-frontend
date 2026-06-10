// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from "next/navigation";
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const navigate = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // Determine current section for breadcrumb
    const pathParts = pathname?.split('/').filter(Boolean) || [];
    const currentPage = pathParts.length > 1 ? pathParts[pathParts.length - 1] : 'Overview';
    const formattedPageName = currentPage.charAt(0).toUpperCase() + currentPage.slice(1).replace('-', ' ');
    const isRequestsPage = pathname?.includes('/dashboard/requests');

    const handleLogout = () => {
        logout();
        navigate.push('/'); // Redirect to home after logout
    };

    if (!user) return null; // Prevent flicker if hitting raw

    // ═══════════════════════════════════════════════════════════════
    // REQUESTS PAGE: Fullscreen messenger shell — NO ecommerce wrappers
    // This completely bypasses max-w-7xl, mx-auto, padding, cards, gaps
    // ═══════════════════════════════════════════════════════════════
    if (isRequestsPage) {
        return (
            <div className="requests-app-shell">
                <div className="requests-navbar-spacer" />
                <div className="requests-app-body">
                    {children}
                </div>
                <style>{`
                    .requests-app-shell {
                        width: 100%;
                        height: 100dvh;
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
                        background: var(--bg);
                        position: relative;
                    }
                    .requests-navbar-spacer {
                        flex-shrink: 0;
                        height: 62px;
                    }
                    @media (min-width: 768px) {
                        .requests-navbar-spacer {
                            height: 73px;
                        }
                    }
                    .requests-app-body {
                        flex: 1;
                        display: flex;
                        min-height: 0;
                        overflow: hidden;
                    }
                `}</style>
            </div>
        );
    }

    const SidebarLink = ({ to, icon, text, end, onClick }: any) => {
        const isActive = end ? pathname === to : pathname?.startsWith(to);
        return (
            <Link 
                href={to} 
                onClick={onClick}
                className={`group relative flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold shrink-0 whitespace-nowrap overflow-hidden
                ${isActive 
                    ? 'text-[var(--bg)] shadow-lg shadow-[var(--primary)]/20' 
                    : 'text-[var(--text)] opacity-70 hover:opacity-100'
                }`}
            >
                <div className={`absolute inset-0 transition-all duration-300 ease-out z-0 
                    ${isActive 
                        ? 'bg-[var(--primary)] opacity-100 scale-100' 
                        : 'bg-[var(--secondary)]/10 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                    }`} 
                />
                <span className="relative z-10 flex items-center gap-3">
                    <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {icon}
                    </span>
                    <span>{text}</span>
                </span>
            </Link>
        );
    }

    const menuItems = [
        { to: "/dashboard", end: true, text: "Dashboard", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg> },
        { to: "/dashboard/requests", text: "Requests", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg> },
        { to: "/dashboard/orders", text: "My Orders", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.25v10.5A2.25 2.25 0 0118 21H6a2.25 2.25 0 01-2.25-2.25V8.25M12 13.5l-3 3m0 0l-3-3m3 3V8.25m3 5.25l3 3m0 0l3-3m-3 3V8.25" /></svg> },
        { to: "/dashboard/wishlist", text: "Wishlist", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg> },
        { to: "/dashboard/cart", text: "Cart", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg> },
        { to: "/dashboard/delivery-tracking", text: "Tracking", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg> },
        { to: "/dashboard/addresses", text: "Addresses", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg> },
        { to: "/dashboard/settings", text: "Settings", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.78.929l-.15.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    ];

    const activeItem = menuItems.find(item => item.end ? pathname === item.to : pathname?.startsWith(item.to)) || menuItems[0];
    const getButtonText = () => {
        const item = menuItems.find(i => i.to === pathname);
        return item ? item.text : formattedPageName;
    };

    return (
        <section className={`bg-[var(--bg)] relative overflow-hidden transition-colors duration-500 flex flex-col ${isRequestsPage ? 'h-[100dvh] pt-24 md:pt-28 pb-0 md:pb-6 px-0 md:px-4 sm:px-6 lg:px-8' : 'min-h-screen pt-24 md:pt-32 pb-12 px-4 sm:px-6 lg:px-8'}`}>
            {/* Premium Background Decorative Blur */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[var(--secondary)]/10 to-transparent pointer-events-none" />
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto relative z-10 w-full flex-1 flex flex-col min-h-0">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-10 items-start flex-1 min-h-0">
                    
                    {/* User Sidebar Menu */}
                    <div className={`w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-6 sticky top-20 z-20 ${isRequestsPage ? 'hidden' : ''}`}>
                        
                        {/* Profile Summary Card - Premium Glassmorphism */}
                        <div className="bg-[var(--bg)]/70 backdrop-blur-2xl rounded-3xl p-5 lg:p-6 xl:p-8 border border-[var(--secondary)]/20 shadow-xl shadow-[var(--secondary)]/5 flex items-center gap-5 transition-transform hover:-translate-y-1 duration-300 group">
                            <div className="relative">
                                <img src={user.avatar} alt={user.name} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover bg-[var(--secondary)]/20 border-2 border-[var(--primary)]/30 shadow-md z-10 relative group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-[var(--primary)] blur-xl opacity-20 rounded-full scale-110 group-hover:opacity-40 transition-opacity duration-300"></div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-extrabold text-xl md:text-2xl text-[var(--text)] tracking-tight line-clamp-1">{user.name}</h3>
                                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold uppercase tracking-widest shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_8px_var(--primary)]"></span>
                                    {user.role}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Links Card */}
                        <div className="hidden lg:block bg-[var(--bg)]/70 backdrop-blur-2xl rounded-3xl p-4 xl:p-6 border border-[var(--secondary)]/20 shadow-xl shadow-[var(--secondary)]/5">
                            {/* Desktop/Tablet Horizontal/Vertical Nav */}
                            <nav className="flex flex-col gap-1.5">
                                {menuItems.map((item, idx) => (
                                    <SidebarLink key={idx} {...item} />
                                ))}
                                <div className="px-2">
                                    <hr className="border-[var(--secondary)]/10 my-3" />
                                </div>
                                <button onClick={handleLogout} className="group relative flex items-center gap-3 px-5 py-3.5 rounded-2xl text-red-500 font-bold hover:text-white shrink-0 whitespace-nowrap overflow-hidden transition-all duration-300">
                                    <div className="absolute inset-0 bg-red-500 transition-all duration-300 ease-out z-0 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100" />
                                    <span className="relative z-10 flex items-center gap-3">
                                        <span className="transition-transform duration-300 group-hover:scale-110">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                                        </span>
                                        <span>Log Out</span>
                                    </span>
                                </button>
                            </nav>
                        </div>

                        {/* Mobile Accordion Dropdown Nav */}
                        <div className="block lg:hidden relative w-full">
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="w-full flex items-center justify-between px-5 py-3.5 bg-[var(--primary)] text-[var(--bg)] rounded-2xl font-bold shadow-lg shadow-[var(--primary)]/20 transition-all duration-300 active:scale-[0.98] cursor-pointer"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="scale-110">
                                        {activeItem.icon}
                                    </span>
                                    <span>{getButtonText()}</span>
                                </span>
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    strokeWidth={2.5} 
                                    stroke="currentColor" 
                                    className={`w-5 h-5 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>

                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: "easeInOut" }}
                                        className="overflow-hidden mt-3 flex flex-col gap-1.5 bg-[var(--bg)]/70 backdrop-blur-2xl rounded-3xl p-4 border border-[var(--secondary)]/20 shadow-xl shadow-[var(--secondary)]/5"
                                    >
                                        {menuItems.map((item, idx) => (
                                            <SidebarLink 
                                                key={idx}
                                                to={item.to} 
                                                end={item.end}
                                                text={item.text} 
                                                icon={item.icon}
                                                onClick={() => setIsMenuOpen(false)}
                                            />
                                        ))}
                                        <div className="px-2">
                                            <hr className="border-[var(--secondary)]/10 my-3" />
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                handleLogout();
                                            }}
                                            className="group relative flex items-center gap-3 px-5 py-3.5 rounded-2xl text-red-500 font-bold hover:text-white shrink-0 whitespace-nowrap overflow-hidden transition-all duration-300 w-full text-left"
                                        >
                                            <div className="absolute inset-0 bg-red-500 transition-all duration-300 ease-out z-0 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100" />
                                            <span className="relative z-10 flex items-center gap-3">
                                                <span className="transition-transform duration-300 group-hover:scale-110">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                                                </span>
                                                <span>Log Out</span>
                                            </span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Main Content Area (Outlet renders the sub-pages) */}
                    <div className="flex-1 w-full text-[var(--text)] min-w-0 flex flex-col gap-6">
                        
                        {/* Breadcrumbs Top Bar */}
                        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg)]/70 backdrop-blur-2xl p-4 md:p-5 rounded-3xl border border-[var(--secondary)]/20 shadow-xl shadow-[var(--secondary)]/5 shrink-0 ${isRequestsPage ? 'hidden' : ''}`}>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm font-bold w-full">
                                <button onClick={() => navigate.back()} className="hover:text-[var(--primary)] transition-all flex items-center gap-1.5 group bg-[var(--secondary)]/10 hover:bg-[var(--secondary)]/20 px-3 md:px-4 py-2 rounded-xl shadow-sm shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                    Back
                                </button>
                                <span className="opacity-30 mx-1 shrink-0">|</span>
                                <div className="flex items-center gap-2 text-xs md:text-sm flex-1 min-w-0">
                                    <span className="hover:text-[var(--primary)] cursor-pointer tracking-widest opacity-70 transition-colors shrink-0" onClick={() => navigate.push('/dashboard')}>DASHBOARD</span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 shrink-0"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    <span className="text-[var(--primary)] tracking-wide bg-[var(--primary)]/10 px-3 py-1.5 rounded-lg truncate shadow-[inset_0_0_8px_rgba(0,0,0,0.05)] border border-[var(--primary)]/10">
                                        {formattedPageName}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Outlet Wrapper */}
                        <div className={`bg-[var(--bg)]/90 border border-[var(--secondary)]/20 shadow-2xl shadow-[var(--secondary)]/5 relative flex-1 min-h-0 flex flex-col ${isRequestsPage ? 'max-lg:rounded-none max-lg:p-0 max-lg:border-0 rounded-[2rem] p-3 sm:p-5 md:p-6 lg:p-8' : 'rounded-[2rem] p-3 sm:p-5 md:p-6 lg:p-8'}`}>
                            {/* Inner Decorative Effects */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[var(--primary)]/5 to-transparent rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
                            
                            <div className="relative w-full flex-1 min-h-0">
                                {children}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
