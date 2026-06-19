import React from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/seo/constants';
import { generateLocalBusinessSchema, generateFAQSchema } from '@/lib/seo/schemas';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import LocationProductGrid from './LocationProductGrid';
import Footer from '@/components/Footer';
import { logPrefetchFailure } from '@/lib/prefetch';

interface LocationPageProps {
  city: string;
  slug: string;
  pincode: string;
  landmark: string;
  localIntro: string;
  deliveryTimeline: string;
}

export default async function LocationPage({
  city,
  slug,
  pincode,
  landmark,
  localIntro,
  deliveryTimeline,
}: LocationPageProps) {
  // Fetch products and categories on the server side
  const API_URL = process.env.NEXT_PUBLIC_API_URL 
  
  let products = [];
  let categories = [];
  let blogs = [];
  
  try {
    const [pRes, cRes, bRes] = await Promise.all([
      fetch(`${API_URL}/products`, { next: { revalidate: 1800 } }),
      fetch(`${API_URL}/category`, { next: { revalidate: 1800 } }),
      fetch(`${API_URL}/blogs`, { next: { revalidate: 1800 } })
    ]);
    
    if (pRes.ok) products = await pRes.json();
    if (cRes.ok) categories = await cRes.ok ? await cRes.json() : [];
    if (bRes.ok) blogs = await bRes.json();
  } catch (err) {
    logPrefetchFailure("location page data", err);
  }

  // Filter out non-active products and limit to 8
  const activeProducts = products.filter((p: any) => p.isActive !== false).slice(0, 8);

  const localBusinessSchema = generateLocalBusinessSchema(city);
  // Enhance schema coordinates/locality details
  localBusinessSchema.address.postalCode = pincode;
  localBusinessSchema.address.addressLocality = city;

  const faqs = [
    {
      question: `How can I order custom printing in ${city}?`,
      answer: `Ordering custom prints in ${city} is simple with Printvoz. Navigate to our catalog, pick your item (like customized T-Shirts, Visiting Cards, or Flex Banners), upload your artwork or custom requirements, checkout online, and get it delivered directly to your location near ${landmark}.`
    },
    {
      question: `What is the estimated delivery time for orders in ${city}?`,
      answer: `Standard delivery across ${city} districts takes ${deliveryTimeline}. We also offer expedited print production and shipping options at checkout for urgent branding needs.`
    },
    {
      question: `Does Printvoz offer bulk printing discounts in ${city}?`,
      answer: `Yes! We provide tiered corporate pricing and bulk discounts for businesses, startups, colleges, and event planners in ${city}. You can easily request custom pricing directly from your customer dashboard.`
    },
    {
      question: `Can I get design assistance for my prints?`,
      answer: `Absolutely. If you don't have a print-ready vector file or template, our in-house design specialists can help format, align, and refine your designs before they go to press.`
    }
  ];

  return (
    <>
      <JsonLd schema={[localBusinessSchema, generateFAQSchema(faqs)]} />
      
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        <main className="max-w-6xl mx-auto px-4 pt-28 pb-16 space-y-12">
          
          {/* Breadcrumb Navigation */}
          <Breadcrumbs 
            items={[{ name: `Printing Services in ${city}`, href: `/printing-service-${slug}` }]} 
            className="text-xs tracking-wider" 
          />

          {/* Hero Header Section */}
          <section className="text-center py-6 space-y-4 max-w-3xl mx-auto">
            <span className="inline-block bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold px-3 py-1.5 rounded-full tracking-wide">
              Local Printing Partner &bull; {city}, Kerala
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif leading-tight">
              Premium Online Printing Services in {city}
            </h1>
            <p className="text-sm sm:text-base text-[var(--text)]/80 leading-relaxed">
              Order customized business cards, flex banners, corporate gifts, and custom apparel online. 
              Get premium quality prints delivered fast near {landmark} (Pincode: {pincode}) and surrounding regions in {city}.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <Link href="/products" className="bg-[var(--primary)] text-white text-xs font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-all shadow-md">
                Browse Print Products
              </Link>
              <Link href="/contact" className="border border-[var(--primary)] text-[var(--text)] text-xs font-bold px-6 py-3 rounded-lg hover:bg-[var(--primary)]/5 transition-all">
                Get Local Quote
              </Link>
            </div>
          </section>

          {/* Featured Products Grid */}
          <section className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-[var(--secondary)]/10 pb-3">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--text)]">
                Best Selling Print Products in {city}
              </h2>
              <Link href="/products" className="text-xs font-bold text-[var(--primary)] hover:underline">
                View All &rarr;
              </Link>
            </div>
            <LocationProductGrid products={activeProducts} />
          </section>

          {/* Dynamic Localization Copy (SEO Keywords Block) */}
          <section className="grid md:grid-cols-3 gap-8 bg-white dark:bg-[#1a2526] rounded-2xl border border-[var(--secondary)]/10 p-6 sm:p-8 shadow-sm">
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif font-bold">
                Your Trusted Custom Printing Press in {city}
              </h2>
              <div className="text-xs sm:text-sm text-[var(--text)]/80 space-y-3 leading-relaxed">
                <p>
                  {localIntro} Printvoz is proud to be a premier choice for commercial and corporate printing needs throughout {city}. We combine cutting-edge technology with high-grade materials to deliver products that represent your brand with clarity and impact.
                </p>
                <p>
                  From high-traffic business corridors to quiet suburbs, we cater to a diverse array of clients. If you need customized uniforms for your service staff, flex banners to announce an upcoming launch, or custom labels for gourmet items, our printing facility provides reliable, cost-efficient, and rapid services tailored specifically for you.
                </p>
                <p>
                  We understand the unique demands of local businesses in Kerala. That is why we offer digital print checks, standard CMYK/Pantone color matching, and highly responsive support. No matter if you are ordering from major business centers or remote suburbs, our delivery fleet covers every corner of the {city} district.
                </p>
              </div>
            </div>
            
            {/* Local Delivery Info Sidebar */}
            <div className="space-y-4 border-t md:border-t-0 md:border-l border-[var(--secondary)]/10 pt-6 md:pt-0 md:pl-8">
              <h3 className="text-base font-bold font-serif">
                Delivery Timeline & Coverage
              </h3>
              <ul className="text-xs space-y-3 text-[var(--text)]/80">
                <li className="flex gap-2">
                  <span className="text-[var(--primary)] font-bold">&bull;</span>
                  <span><strong>Timeline:</strong> {deliveryTimeline} for standard orders.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--primary)] font-bold">&bull;</span>
                  <span><strong>Local Coverage:</strong> Serving {city} center, surrounding neighborhoods, and near {landmark}.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--primary)] font-bold">&bull;</span>
                  <span><strong>Express Print:</strong> 24-48 hour printing and delivery available on select custom apparel and stationery.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--primary)] font-bold">&bull;</span>
                  <span><strong>Bulk Transport:</strong> Large order direct dispatch with secure packaging.</span>
                </li>
              </ul>
              
              <div className="bg-[var(--bg)] p-3 rounded-lg border border-[var(--secondary)]/15 text-center">
                <p className="text-[10px] uppercase font-bold text-gray-500">Need Bulk Pricing?</p>
                <Link href="/bulk-order" className="text-xs font-bold text-[var(--primary)] hover:underline mt-1 inline-block">
                  Submit Bulk Query &rarr;
                </Link>
              </div>
            </div>
          </section>

          {/* Quick Categories Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-[var(--text)] border-b border-[var(--secondary)]/10 pb-2">
              Explore Our Printing Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {categories.map((cat: any) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug}`}
                  className="bg-white dark:bg-[#1a2526] hover:bg-[var(--primary)]/5 border border-[var(--secondary)]/10 rounded-xl p-3 text-center transition-all cursor-pointer"
                >
                  <span className="text-xs font-semibold text-[var(--text)] block truncate">{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ Accordions Section */}
          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--text)] border-b border-[var(--secondary)]/10 pb-3">
              Frequently Asked Questions for {city} Customers
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <details 
                  key={idx} 
                  className="group border border-[var(--secondary)]/15 rounded-xl bg-white dark:bg-[#1a2526] overflow-hidden transition-all duration-300 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-4 select-none focus:outline-none bg-gray-50/50 dark:bg-black/5">
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--text)] pr-4">
                      {faq.question}
                    </h3>
                    <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform duration-200">
                      &#9660;
                    </span>
                  </summary>
                  <div className="p-4 border-t border-[var(--secondary)]/10 text-xs sm:text-sm text-[var(--text)]/80 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Localized Related Blogs Section */}
          {blogs.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-serif font-bold text-[var(--text)] border-b border-[var(--secondary)]/10 pb-2">
                Latest Printing Tips & Business Advice
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {blogs.slice(0, 3).map((blog: any) => (
                  <Link
                    key={blog._id}
                    href={`/blog/${blog.slug}`}
                    className="bg-white dark:bg-[#1a2526] border border-[var(--secondary)]/10 rounded-xl p-4 hover:shadow-md transition-all flex flex-col h-full"
                  >
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--text)] line-clamp-2 mb-2 group-hover:text-[var(--primary)]">
                      {blog.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-[var(--text)]/70 line-clamp-3 mb-4 flex-grow">
                      {blog.excerpt}
                    </p>
                    <span className="text-[10px] font-bold text-[var(--primary)] mt-auto inline-block">Read Article &rarr;</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </main>
        
        <Footer />
      </div>
    </>
  );
}
