import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import config from '../brand/config';
import { useShop } from '../context/ShopContext';
import api from '../lib/axios';
import { resolveImage } from '../lib/imageUtils';

interface HeroSectionProps {
    initialSettings?: any;
}

const HeroSection = ({ initialSettings }: HeroSectionProps) => {
    const { brandInfo } = useShop();
    const brandName = brandInfo?.name || config.brand;
    const [settings, setSettings] = useState(initialSettings || null);

    useEffect(() => {
        if (initialSettings) return;
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/home-settings');
                setSettings(data);
            } catch (error) {
                console.error("Error fetching home settings banner:", error);
            }
        };
        fetchSettings();
    }, [initialSettings]);

    const bannerMedia = settings?.bannerMedia;
    const bannerType = settings?.bannerType || 'image';
    const bannerHeading = settings?.bannerHeading || brandName;
    const bannerSubtitle = settings?.bannerSubtitle || '';

    return (
        <div data-hero-sentinel className="relative w-full h-screen overflow-hidden bg-black text-white font-sans">
            <div className="absolute inset-0 z-0">
                {bannerMedia && bannerType === 'video' ? (
                    <video 
                        src={resolveImage(bannerMedia)!} 
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-80" 
                    />
                ) : (
                    <Image 
                        src={bannerMedia ? resolveImage(bannerMedia) : "https://plus.unsplash.com/premium_photo-1672883551901-caa4758abba7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} 
                        alt="Hero Banner" 
                        fill
                        priority
                        unoptimized
                        sizes="100vw"
                        className="object-cover opacity-80" 
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full pt-20 pb-10 px-8 md:px-14">
                <div className="flex-grow"></div>
                <div className="flex flex-col justify-end items-start w-full">
                    <h1 className="text-6xl md:text-[8rem] lg:text-[12rem] font-medium tracking-tighter leading-none mb-0 pb-0 uppercase">
                        {bannerHeading}
                    </h1>
                    {bannerSubtitle && (
                        <p className="text-sm md:text-base lg:text-lg font-light opacity-90 max-w-2xl mt-4 tracking-wide text-gray-200">
                            {bannerSubtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
export default HeroSection;
