// @ts-nocheck
"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import HeroSection from "../components/HeroSection";
import CategoryUI from "./HomeUI/CategoryUI";
import BestSellers from "./HomeUI/BestSellers";
import NewArrivals from "./HomeUI/NewArrivals";
import SpecialOffers from "./HomeUI/SpecialOffers";
import ExclusiveOffers from "./HomeUI/ExclusiveOffers";
import FeaturedCollection from "./HomeUI/FeaturedCollection";
import AllProducts from "./HomeUI/AllProducts";

const WhyChooseUs = dynamic(() => import("./HomeUI/WhyChooseUs"), { ssr: true });
const OurStory = dynamic(() => import("./HomeUI/OurStory"), { ssr: true });
const CustomerReviews = dynamic(() => import("./HomeUI/CustomerReviews"), { ssr: true });
const FAQ = dynamic(() => import("./HomeUI/FAQ"), { ssr: true });
const Newsletter = dynamic(() => import("./HomeUI/Newsletter"), { ssr: true });
const Footer = dynamic(() => import("../components/Footer"), { ssr: true });

export default function Home({ initialSettings }) {
    return(
        <div>
            <HeroSection initialSettings={initialSettings} />

            {/* <LogoLoopHome/> */}

            <CategoryUI/>

            <NewArrivals />

            <BestSellers />

            <SpecialOffers />

            <ExclusiveOffers />

            <FeaturedCollection />

            <AllProducts />

            <WhyChooseUs />

            <OurStory />

            <CustomerReviews />

            <FAQ faqs={initialSettings?.faqs} />

            <Newsletter />

            <Footer />
        </div>
    )
}











