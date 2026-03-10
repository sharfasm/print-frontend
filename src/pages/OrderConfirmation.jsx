import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function OrderConfirmation() {
    const navigate = useNavigate();
    const location = useLocation();

    // Trigger fireworks or confetti if desired based on order success scenario
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const orderNumber = location.state?.orderNumber || `#ORD-${Math.floor(Math.random() * 90000) + 10000}X`;
    const deliveryDateStart = new Date();
    deliveryDateStart.setDate(deliveryDateStart.getDate() + 3);
    const deliveryDateEnd = new Date();
    deliveryDateEnd.setDate(deliveryDateEnd.getDate() + 5);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center py-20 px-4">
            
            <div className="max-w-2xl w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 rounded-[3rem] p-8 md:p-14 text-center shadow-xl animate-in zoom-in-95 fade-in duration-500 relative overflow-hidden">
                
                {/* Background decorative flair */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Success Icon */}
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-green-500"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12 text-green-500 z-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Order Successful!</h1>
                <p className="text-lg opacity-70 font-medium mb-10 max-w-md mx-auto">
                    Thank you for your purchase. We have received your order and are currently processing it.
                </p>

                <div className="bg-[var(--bg)] border border-[var(--secondary)]/10 rounded-2xl p-6 mb-10 text-left">
                    <div className="grid grid-cols-2 gap-4 divide-x divide-[var(--secondary)]/10">
                        <div className="px-2">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-50 block mb-1">Order Number</span>
                            <span className="text-lg font-black text-[var(--primary)]">{orderNumber}</span>
                        </div>
                        <div className="px-4">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-50 block mb-1">Estimated Delivery</span>
                            <span className="text-lg font-black">{formatDate(deliveryDateStart)} - {formatDate(deliveryDateEnd)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={() => navigate('/dashboard/orders')}
                        className="w-full sm:w-auto px-8 py-4 bg-[var(--primary)] text-[var(--bg)] font-black rounded-xl shadow-lg hover:opacity-90 transition-all"
                    >
                        Track Order
                    </button>
                    <Link 
                        to="/products"
                        className="w-full sm:w-auto px-8 py-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[var(--secondary)]/20 font-black rounded-xl hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
                    >
                        Continue Shopping
                    </Link>
                </div>

            </div>

            <p className="mt-12 opacity-50 font-medium text-sm text-center max-w-md">
                We'll send an email confirmation with your order details and tracking information shortly.
            </p>
        </div>
    );
}
