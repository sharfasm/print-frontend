// @ts-nocheck
"use client";
import HeroSection from "../components/HeroSection"
import CategoryUI from "./HomeUI/CategoryUI"
import BestSellers from "./HomeUI/BestSellers"
import NewArrivals from "./HomeUI/NewArrivals"
import SpecialOffers from "./HomeUI/SpecialOffers"
import FeaturedCollection from "./HomeUI/FeaturedCollection"
import WhyChooseUs from "./HomeUI/WhyChooseUs"
import OurStory from "./HomeUI/OurStory"
import CustomerReviews from "./HomeUI/CustomerReviews"
import FAQ from "./HomeUI/FAQ"
import Newsletter from "./HomeUI/Newsletter"
import Footer from "../components/Footer"
import AllProducts from "./HomeUI/AllProducts"
// import LogoLoopHome from "./HomeUI/LogoLoopHome"




export default function Home(){
    return(
        <div>
            <HeroSection />

            {/* <LogoLoopHome/> */}

            <CategoryUI/>

            <BestSellers />

            <NewArrivals />

            <SpecialOffers />

            <FeaturedCollection />

            <AllProducts />

        

            <WhyChooseUs />

            <OurStory />

            <CustomerReviews />

            <FAQ />

            <Newsletter />

            <Footer />

            

        </div>
    )
}











