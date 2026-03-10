import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const Footer = () => {
    const { brandInfo } = useShop();

    const brandName = brandInfo?.name || "Printing";
    const brandTagline = brandInfo?.tagline || "Quality Printing for Modern Lifestyles";
    const brandDesc = brandInfo?.description || "Your premium destination for high-quality custom printing.";
    const brandEmail = brandInfo?.email || "support@printing.com";
    const brandPhone = brandInfo?.phone || "+91 98765 43210";
    const brandAddress = brandInfo?.address || "123, Print Street, Koduvally, Kerala, India";
    const brandSocials = brandInfo?.socials || {};

    return (
        <footer className="bg-[var(--bg)] text-[var(--text)] border-t border-[var(--secondary)]/10 pt-20 pb-10 px-6 md:px-10 lg:px-14 mt-auto font-sans relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 relative z-10">
                
                {/* 1. Brand & About */}
                <div className="flex flex-col">
                    <h2 className="text-3xl font-black tracking-tight mb-6 text-[var(--primary)] uppercase">
                        {brandName}
                    </h2>
                    <p className="text-sm opacity-70 leading-relaxed mb-8 max-w-xs font-medium">
                        {brandDesc}
                    </p>
                    <div className="flex gap-4">
                        {/* Social Icons - Sleek & Minimal */}
                        {brandSocials.facebook && (
                            <a href={brandSocials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[var(--secondary)]/20 flex items-center justify-center hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </a>
                        )}
                        {brandSocials.instagram && (
                            <a href={brandSocials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[var(--secondary)]/20 flex items-center justify-center hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                        )}
                        {brandSocials.twitter && (
                            <a href={brandSocials.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[var(--secondary)]/20 flex items-center justify-center hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                            </a>
                        )}
                    </div>
                </div>

                {/* 2. Quick Links (Nav) */}
                <div className="flex flex-col">
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 opacity-60">
                        Explore
                    </h3>
                    <ul className="space-y-4 text-sm font-semibold">
                        <li><Link to="/" className="hover:text-[var(--primary)] transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[var(--primary)] hover:after:w-full after:transition-all after:duration-300">Home</Link></li>
                        <li><Link to="/products" className="hover:text-[var(--primary)] transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[var(--primary)] hover:after:w-full after:transition-all after:duration-300">All Products</Link></li>
                        <li><Link to="/about" className="hover:text-[var(--primary)] transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[var(--primary)] hover:after:w-full after:transition-all after:duration-300">Our Story</Link></li>
                        <li><Link to="/dashboard" className="hover:text-[var(--primary)] transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[var(--primary)] hover:after:w-full after:transition-all after:duration-300">Account</Link></li>
                    </ul>
                </div>

                {/* 3. Help & FAQ */}
                <div className="flex flex-col">
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 opacity-60">
                        Help & Support
                    </h3>
                    <ul className="space-y-4 text-sm font-semibold">
                        <li><Link to="/faq" className="hover:text-[var(--primary)] transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[var(--primary)] hover:after:w-full after:transition-all after:duration-300">FAQ & Guides</Link></li>
                        <li><Link to="/dashboard/orders" className="hover:text-[var(--primary)] transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[var(--primary)] hover:after:w-full after:transition-all after:duration-300">Track Order</Link></li>
                        <li><Link to="/returns" className="hover:text-[var(--primary)] transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[var(--primary)] hover:after:w-full after:transition-all after:duration-300">Returns & Refunds</Link></li>
                        <li><Link to="/legal" className="hover:text-[var(--primary)] transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[var(--primary)] hover:after:w-full after:transition-all after:duration-300">Terms & Privacy</Link></li>
                    </ul>
                </div>

                {/* 4. Contact us */}
                <div className="flex flex-col">
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 opacity-60">
                        Contact
                    </h3>
                    <div className="space-y-5 text-sm opacity-80 font-medium">
                        <div className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mt-0.5 text-[var(--primary)] shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                            <a href={`mailto:${brandEmail}`} className="hover:text-[var(--primary)] transition-colors">{brandEmail}</a>
                        </div>
                        <div className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mt-0.5 text-[var(--primary)] shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.54-4.24-7.136-7.136l1.292-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                            </svg>
                            <a href={`tel:${brandPhone.replace(/\s/g, '')}`} className="hover:text-[var(--primary)] transition-colors">{brandPhone}</a>
                        </div>
                        <div className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mt-0.5 text-[var(--primary)] shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <span className="leading-relaxed whitespace-pre-line">
                                {brandAddress}
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-[var(--secondary)]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold opacity-60 relative z-10">
                <p>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
                <div className="flex items-center gap-6">
                    <Link to="/privacy" className="hover:text-[var(--primary)] transition-colors">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-[var(--primary)] transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
