import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const AuthModal = () => {
    const { modal, setModal } = useShop();
    const navigate = useNavigate();

    if (!modal.show) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
                onClick={() => setModal({ ...modal, show: false })}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-[var(--bg)] rounded-3xl p-8 shadow-2xl border border-[var(--primary)]/10 animate-scale-in">
                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-[var(--primary)]/5 flex items-center justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[var(--primary)]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-[var(--text)] mb-3 tracking-tight">Login Required</h2>
                    <p className="text-[var(--text)]/60 text-sm leading-relaxed mb-8 px-4">
                        Please login to access your cart and wishlist. We want to make sure your items are saved for you!
                    </p>

                    <div className="flex flex-col w-full gap-3">
                        <button 
                            onClick={() => {
                                setModal({ ...modal, show: false });
                                navigate('/login');
                            }}
                            className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[var(--primary)]/20"
                        >
                            Login Now
                        </button>
                        <button 
                            onClick={() => setModal({ ...modal, show: false })}
                            className="w-full py-4 bg-transparent text-[var(--text)]/70 hover:text-[var(--text)] rounded-2xl font-bold text-sm transition-colors"
                        >
                            Continue Browsing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
