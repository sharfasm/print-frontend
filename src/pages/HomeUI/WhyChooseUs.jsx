import React from 'react';

const features = [
    {
        id: 1,
        title: "Free Shipping",
        description: "Enjoy free standard shipping on all orders over ₹999 within India.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
        )
    },
    {
        id: 2,
        title: "Secure Payments",
        description: "Your transactions are protected with industry-leading 256-bit encryption.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        )
    },
    {
        id: 3,
        title: "Premium Quality",
        description: "We source only the finest materials to ensure unmatched durability and feel.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
        )
    },
    {
        id: 4,
        title: "24/7 Support",
        description: "Our dedicated team is always here to assist you with any questions.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.84 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-0.965M22.5 10.608c0-1.136-.84-2.1-1.98-2.193a49.255 49.255 0 00-11.04 0c-1.14.093-1.98 1.057-1.98 2.193v4.286c0 1.136.84 2.1 1.98 2.193 1.32.108 2.666.163 4.02.163 1.354 0 2.694-.055 4.02-.163a2.115 2.115 0 00.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.965" />
            </svg>
        )
    }
];

export default function WhyChooseUs() {
    return (
        <section className="py-24 bg-[var(--bg)] text-[var(--text)] border-t border-b border-[var(--secondary)]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">
                        Why Choose Us
                    </h2>
                    <p className="mt-4 text-base sm:text-lg opacity-70 max-w-2xl mx-auto font-medium">
                        We don't just sell products; we deliver an experience. Here is why thousands of customers trust us.
                    </p>
                    <hr className="w-16 h-1.5 mx-auto my-6 bg-[var(--primary)] border-0 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {features.map((feature) => (
                        <div key={feature.id} className="group text-center flex flex-col items-center">
                            <div className="w-20 h-20 mb-6 rounded-2xl bg-[var(--secondary)]/5 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-2 shadow-sm group-hover:shadow-xl group-hover:shadow-[var(--primary)]/20">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--primary)] transition-colors">{feature.title}</h3>
                            <p className="opacity-70 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
