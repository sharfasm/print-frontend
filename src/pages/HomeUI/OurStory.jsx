import React from 'react';
import { Link } from 'react-router-dom';

export default function OurStory() {
    return (
        <section className="py-32 bg-[var(--bg)] text-[var(--text)] overflow-hidden relative">
            {/* Elegant Background Accents */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--secondary)]/5 -z-10 rounded-l-[100px] blur-3xl opacity-60"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* Left: Premium Asymmetrical Image Layout */}
                    <div className="w-full lg:w-1/2 relative min-h-[600px] flex items-center justify-center lg:justify-start">
                        {/* Main large image */}
                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-4/5 md:w-[70%] aspect-[3/4] mr-auto transition-transform duration-700 hover:scale-[1.02]">
                            <img 
                                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1000" 
                                alt="Craftsmanship" 
                                className="w-full h-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        
                        {/* Overlapping smaller image for depth */}
                        <div className="absolute bottom-10 right-0 md:right-10 w-3/5 md:w-1/2 aspect-square rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.2)] border-[10px] border-[var(--bg)] z-20 transition-transform duration-700 hover:-translate-y-4">
                            <img 
                                src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800" 
                                alt="Our Workshop" 
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                        
                        {/* Abstract brand mark or subtle graphic element */}
                        <div className="absolute -top-6 -left-6 z-0 hidden md:block">
                            <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--primary)] opacity-20">
                                <circle cx="50" cy="50" r="49" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6"/>
                            </svg>
                        </div>
                    </div>

                    {/* Right: Refined Text Content */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center relative z-10 pt-10 lg:pt-0">
                        <div className="animate-fade-in-up">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="h-[2px] w-12 bg-[var(--primary)]"></span>
                                <span className="text-[var(--primary)] font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
                                    Our Heritage
                                </span>
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-[1.1] tracking-tight">
                                Crafting excellence <br/><span className="text-[var(--primary)]">since 2010.</span>
                            </h2>
                            
                            <div className="space-y-6 text-lg text-[var(--text)] opacity-70 leading-relaxed mb-12 font-medium">
                                <p>
                                    What started in a small workshop as a passion project has grown into a global brand dedicated to uncompromising quality. We believe that the items you use every day should be beautiful, durable, and thoughtfully designed.
                                </p>
                                <p>
                                    We work directly with the finest material suppliers and skilled artisans to bring you products that stand the test of time, without the traditional retail markup. Our commitment is entirely to the craft and to our community.
                                </p>
                            </div>

                            {/* Refined Stats Grid */}
                            <div className="grid grid-cols-3 gap-8 mb-12 border-l-4 border-[var(--primary)]/20 pl-6">
                                <div>
                                    <h4 className="text-3xl lg:text-4xl font-black text-[var(--primary)] mb-2">500k<span className="text-[var(--text)] opacity-30">+</span></h4>
                                    <span className="text-xs font-bold opacity-60 uppercase tracking-[0.15em]">Customers</span>
                                </div>
                                <div>
                                    <h4 className="text-3xl lg:text-4xl font-black text-[var(--primary)] mb-2">98<span className="text-[var(--text)] opacity-30">%</span></h4>
                                    <span className="text-xs font-bold opacity-60 uppercase tracking-[0.15em]">Satisfaction</span>
                                </div>
                                <div>
                                    <h4 className="text-3xl lg:text-4xl font-black text-[var(--primary)] mb-2">50<span className="text-[var(--text)] opacity-30">+</span></h4>
                                    <span className="text-xs font-bold opacity-60 uppercase tracking-[0.15em]">Countries</span>
                                </div>
                            </div>

                            <Link to="/about" className="group inline-flex items-center justify-center gap-3 font-bold bg-transparent text-[var(--text)] px-8 py-4 border-2 border-[var(--text)] rounded-full w-full sm:w-max hover:bg-[var(--text)] hover:text-[var(--bg)] transition-all duration-300">
                                <span>Read Full Story</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
