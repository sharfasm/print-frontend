// @ts-nocheck
"use client";
import React, { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext';

const AuthNotification = () => {
    const { notification, setNotification } = useShop();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (notification.show) {
            setShouldRender(true);
            const timer = setTimeout(() => {
                setNotification({ ...notification, show: false });
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [notification.show]);

    if (!shouldRender && !notification.show) return null;

    return (
        <div 
            className={`fixed top-24 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl glass shadow-2xl transition-all duration-500 ${
                notification.show ? 'animate-slide-in-right opacity-100' : 'animate-slide-out-right opacity-0 pointer-events-none'
            }`}
            onAnimationEnd={() => {
                if (!notification.show) setShouldRender(false);
            }}
        >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--primary)] text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            </div>
            <div>
                <p className="font-bold text-[var(--text)] text-sm tracking-tight">Login Required</p>
                <p className="text-[var(--text)]/70 text-xs font-medium">{notification.message || "Please login to continue"}</p>
            </div>
        </div>
    );
};

export default AuthNotification;
