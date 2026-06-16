// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "../lib/axios";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/seo/Breadcrumbs";

import AboutHero from "./AboutUI/AboutHero";
import WhoWeAre from "./AboutUI/WhoWeAre";
import OurStorySection from "./AboutUI/OurStorySection";
import FounderMessage from "./AboutUI/FounderMessage";
import CompanyTimeline from "./AboutUI/CompanyTimeline";
import MissionVision from "./AboutUI/MissionVision";
import StatsCounters from "./AboutUI/StatsCounters";
import WhatWeDo from "./AboutUI/WhatWeDo";
import WhyChooseUsAbout from "./AboutUI/WhyChooseUsAbout";
import QualityStandards from "./AboutUI/QualityStandards";
import TechnologyShowcase from "./AboutUI/TechnologyShowcase";
import ProcessTimeline from "./AboutUI/ProcessTimeline";
import IndustriesGrid from "./AboutUI/IndustriesGrid";
import TestimonialsCarousel from "./AboutUI/TestimonialsCarousel";
import TrustedByWall from "./AboutUI/TrustedByWall";
import ValuesCards from "./AboutUI/ValuesCards";
import TeamGrid from "./AboutUI/TeamGrid";
import Sustainability from "./AboutUI/Sustainability";
import DeliveryNetworkMap from "./AboutUI/DeliveryNetworkMap";
import FaqAccordion from "./AboutUI/FaqAccordion";
import FinalCta from "./AboutUI/FinalCta";

export default function About({ initialData = null }) {
    const [data, setData] = useState(initialData);

    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Client-side fallback when the server prefetch was unavailable
    useEffect(() => {
        if (initialData) {
            setData(initialData);
            return;
        }
        const fetchData = async () => {
            try {
                const res = await api.get("/about-page");
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch about page content:", err);
            }
        };
        fetchData();
    }, [initialData]);

    const show = (key) => data?.[key]?.status === "published";

    // Minimal branded fallback while loading / if the API is unreachable
    if (!data) {
        return (
            <div className="bg-[var(--bg)] min-h-screen flex flex-col">
                <section className="flex-1 flex items-center justify-center text-center px-4 pt-24 pb-16">
                    <div className="max-w-3xl mx-auto">
                        <span className="inline-block text-xs font-black tracking-[0.25em] uppercase text-[var(--primary)] mb-4">
                            About PrintVoz
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--text)] mb-6">
                            Printing Ideas Into Reality
                        </h1>
                        <p className="text-lg text-[var(--text)]/70 mb-10">
                            Premium printing and branding solutions for businesses and individuals across India.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link href="/products" className="bg-[var(--primary)] text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all hover:scale-105 shadow-xl">
                                Explore Products
                            </Link>
                            <Link href="/contact" className="border-2 border-[var(--text)]/20 text-[var(--text)] px-8 py-4 rounded-full font-bold hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    return (
        <div className={`bg-[var(--bg)] min-h-screen flex flex-col ${show("hero") ? "" : "pt-24"}`}>
            {/* ── Brand Story & Trust ── */}
            {show("hero") && <AboutHero data={data.hero} />}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6">
                <Breadcrumbs items={[{ name: "About", href: "/about" }]} className="text-[var(--text)]/60" />
            </div>

            {show("whoWeAre") && <WhoWeAre data={data.whoWeAre} />}
            {show("ourStory") && <OurStorySection data={data.ourStory} />}
            {show("founderMessage") && <FounderMessage data={data.founderMessage} />}
            {show("companyTimeline") && data.companyTimeline?.milestones?.length > 0 && (
                <CompanyTimeline data={data.companyTimeline} />
            )}

            {/* ── Authority & Credibility ── */}
            {(show("mission") || show("vision")) && (
                <MissionVision
                    mission={show("mission") ? data.mission : null}
                    vision={show("vision") ? data.vision : null}
                />
            )}
            {show("statistics") && data.statistics?.stats?.length > 0 && <StatsCounters data={data.statistics} />}
            {show("whatWeDo") && data.whatWeDo?.services?.length > 0 && <WhatWeDo data={data.whatWeDo} />}
            {show("whyChooseUs") && data.whyChooseUs?.features?.length > 0 && (
                <WhyChooseUsAbout data={data.whyChooseUs} />
            )}
            {show("qualityStandards") && data.qualityStandards?.checklist?.length > 0 && (
                <QualityStandards data={data.qualityStandards} />
            )}
            {show("technology") && data.technology?.equipment?.length > 0 && (
                <TechnologyShowcase data={data.technology} />
            )}

            {/* ── Operations & Production ── */}
            {show("ourProcess") && data.ourProcess?.steps?.length > 0 && <ProcessTimeline data={data.ourProcess} />}
            {show("industries") && data.industries?.items?.length > 0 && <IndustriesGrid data={data.industries} />}

            {/* ── Social Proof ── */}
            {show("testimonials") && data.testimonials?.items?.length > 0 && (
                <TestimonialsCarousel data={data.testimonials} />
            )}
            {show("trustedBy") && data.trustedBy?.logos?.length > 0 && <TrustedByWall data={data.trustedBy} />}

            {/* ── Company Culture ── */}
            {show("ourValues") && data.ourValues?.values?.length > 0 && <ValuesCards data={data.ourValues} />}
            {show("meetTheTeam") && data.meetTheTeam?.members?.length > 0 && <TeamGrid data={data.meetTheTeam} />}
            {show("sustainability") && data.sustainability?.initiatives?.length > 0 && (
                <Sustainability data={data.sustainability} />
            )}

            {/* ── Customer Support ── */}
            {show("deliveryNetwork") && <DeliveryNetworkMap data={data.deliveryNetwork} />}
            {show("faq") && data.faq?.items?.length > 0 && <FaqAccordion data={data.faq} />}

            {/* ── Conversion ── */}
            {show("finalCta") && <FinalCta data={data.finalCta} />}

            <Footer />
        </div>
    );
}
