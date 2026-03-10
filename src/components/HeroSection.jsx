import React from 'react';
import config from '../brand/config';
import { useShop } from '../context/ShopContext';

const HeroSection = () => {
    const { brandInfo } = useShop();
    const brandName = brandInfo?.name || config.brand;

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans">
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://plus.unsplash.com/premium_photo-1672883551901-caa4758abba7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Hero" 
                    className="w-full h-full object-cover opacity-80" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full pt-20 pb-10 px-8 md:px-14">
                <div className="flex-grow"></div>
                <div className="flex justify-between items-end w-full">
                    <h1 className="text-6xl md:text-[8rem] lg:text-[12rem] font-medium tracking-tighter leading-none mb-0 pb-0 mt-auto uppercase">
                        {brandName}
                    </h1>
                </div>
            </div>
        </div>
    );
};
export default HeroSection;