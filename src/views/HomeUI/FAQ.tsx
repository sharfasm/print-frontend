// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import config from '../../brand/config';

export default function FAQ({ faqs: initialFaqs }) {
    const [faqsList, setFaqsList] = useState(initialFaqs || []);
    const [openIndex, setOpenIndex] = useState(0);

    useEffect(() => {
        if (initialFaqs !== undefined) {
            setFaqsList(initialFaqs || []);
            return;
        }

        const fetchFaqs = async () => {
            try {
                const res = await fetch(`${config.api}/home-settings`);
                if (res.ok) {
                    const data = await res.json();
                    setFaqsList(data.faqs || []);
                }
            } catch (err) {
                console.error("Failed to fetch home FAQs client-side:", err);
            }
        };
        fetchFaqs();
    }, [initialFaqs]);

    if (!faqsList || faqsList.length === 0) return null;

    return (
        <section className="py-24 bg-[var(--secondary)]/5 text-[var(--text)]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg opacity-70 font-medium">
                        Everything you need to know about our products and services.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqsList.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div 
                                key={index} 
                                className={`border border-[var(--secondary)]/20 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-[var(--bg)] shadow-md' : 'bg-transparent hover:bg-[var(--secondary)]/10'}`}
                            >
                                <button
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                >
                                    <span className={`text-lg font-bold pr-8 transition-colors ${isOpen ? 'text-[var(--primary)]' : 'text-[var(--text)]'}`}>
                                        {faq.question}
                                    </span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'bg-[var(--primary)] text-white rotate-180' : 'bg-[var(--secondary)]/10 text-[var(--text)]'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </div>
                                </button>
                                
                                <div 
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div 
                                        className="p-6 pt-0 text-base opacity-70 leading-relaxed border-t border-[var(--secondary)]/10 mt-2"
                                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-base opacity-70 mb-4">Still have questions?</p>
                    <a href={`mailto:support@${config.brand}.com`} className="inline-flex font-bold text-[var(--primary)] hover:opacity-80 transition-opacity underline underline-offset-4">
                        Contact our support team
                    </a>
                </div>

            </div>
        </section>
    );
}
