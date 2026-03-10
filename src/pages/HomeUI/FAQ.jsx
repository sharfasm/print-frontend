import React, { useState } from 'react';
import config from '../../brand/config';

const faqs = [
    {
        question: "How long does shipping take?",
        answer: "Standard shipping typically takes 4-6 business days within India. Express shipping options (2-3 business days) are available at checkout. International shipping times vary by location, usually ranging from 7-14 business days."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day no-questions-asked return policy. If you're not completely satisfied with your purchase, simply contact our support team to initiate a return. Products must be unused and in their original packaging."
    },
    {
        question: "Do you ship internationally?",
        answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times are calculated automatically at checkout based on your destination."
    },
    {
        question: "How can I track my order?",
        answer: "Once your order ships, you will receive an email containing a tracking link. You can also track your order directly on our website by logging into your account and visiting the 'Order History' section."
    },
    {
        question: "Are your products covered by a warranty?",
        answer: "Absolutely. All our premium products come with a 1-year limited warranty covering manufacturing defects. If you experience an issue, please reach out to our team."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

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
                    {faqs.map((faq, index) => {
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
                                    <div className="p-6 pt-0 text-base opacity-70 leading-relaxed border-t border-[var(--secondary)]/10 mt-2">
                                        {faq.answer}
                                    </div>
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
