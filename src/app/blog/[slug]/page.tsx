import { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/seo/metadata';
import { generateArticleSchema, generateFAQSchema } from '@/lib/seo/schemas';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import LocationProductGrid from '@/components/seo/LocationProductGrid';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { resolveImage } from '@/lib/imageUtils';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { notFound } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/seo/constants';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${API_URL}/seo/blog/${slug}`, { next: { revalidate: 1800 } });
    if (!res.ok) return {};
    const blog = await res.json();
    return generateBlogMetadata(blog);
  } catch {
    return {};
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  let blog = null;
  try {
    const res = await fetch(`${API_URL}/seo/blog/${slug}`, { next: { revalidate: 1800 } });
    if (res.ok) {
      blog = await res.json();
    }
  } catch (err) {
    console.error("Failed to load blog details:", err);
  }

  if (!blog) {
    notFound();
  }

  const coverUrl = resolveImage(blog.coverImage) || '/images/og-default.jpg';
  const publishDate = blog.publishedAt 
    ? new Date(blog.publishedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'Draft';

  const articleSchema = generateArticleSchema({
    title: blog.title,
    description: blog.excerpt,
    slug: blog.slug,
    coverImage: coverUrl,
    publishedAt: blog.publishedAt,
    updatedAt: blog.updatedAt,
    tags: blog.tags
  });

  return (
    <>
      <JsonLd schema={[articleSchema, generateFAQSchema(blog.faqs)]} />
      
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        <main className="max-w-4xl mx-auto px-4 pt-28 pb-16 space-y-8">
          
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { name: 'Blog', href: '/blog' },
              { name: blog.title, href: `/blog/${blog.slug}` }
            ]} 
            className="text-xs tracking-wider" 
          />

          {/* Article Header */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className="font-extrabold uppercase tracking-wide text-[var(--primary)] bg-[var(--primary)]/10 px-2.5 py-1 rounded-md">
                {blog.tags?.[0] || 'Guides'}
              </span>
              <span>&bull;</span>
              <span>Published on {publishDate}</span>
              <span>&bull;</span>
              <span>By Printvoz Press</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold leading-tight">
              {blog.title}
            </h1>
            
            <p className="text-sm sm:text-base italic text-[var(--text)]/80 leading-relaxed border-l-4 border-[var(--primary)] pl-4">
              {blog.excerpt}
            </p>
          </header>

          {/* Cover Banner */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[var(--secondary)]/10 shadow-sm bg-gray-50">
            <img 
              src={coverUrl} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Contents */}
          <article 
            className="prose prose-sm sm:prose max-w-none text-xs sm:text-sm leading-relaxed text-[var(--text)]/90 space-y-4 pt-4 border-b border-[var(--secondary)]/10 pb-8
              [&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:font-bold [&_h2]:font-serif [&_h2]:mt-6 [&_h2]:mb-3
              [&_h3]:text-sm [&_h3]:sm:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1
              [&_p_strong]:font-semibold [&_a]:text-[var(--primary)] [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content) }}
          />

          {/* FAQ Schema Accordions */}
          {blog.faqs && blog.faqs.length > 0 && (
            <section className="space-y-4 pt-4">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--text)]">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {blog.faqs.map((faq: any, idx: number) => (
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
          )}

          {/* Sibling Categories Section */}
          {blog.relatedCategories && blog.relatedCategories.length > 0 && (
            <section className="space-y-4 pt-4">
              <h2 className="text-lg font-serif font-bold text-[var(--text)] border-b border-[var(--secondary)]/10 pb-2">
                Explore Printing Services
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {blog.relatedCategories.map((cat: any) => (
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
          )}

          {/* Related Products Grid (Task 10) */}
          {blog.relatedProducts && blog.relatedProducts.length > 0 && (
            <section className="space-y-6 pt-4">
              <h2 className="text-lg font-serif font-bold text-[var(--text)] border-b border-[var(--secondary)]/10 pb-2">
                Featured Custom Products
              </h2>
              <LocationProductGrid products={blog.relatedProducts.slice(0, 4)} />
            </section>
          )}

          {/* Kerala Location Links (Local SEO Coverage) */}
          <section className="border border-[var(--secondary)]/10 rounded-2xl bg-white dark:bg-[#1a2526] p-5 space-y-3">
            <h3 className="text-xs sm:text-sm font-bold font-serif uppercase tracking-wide text-gray-500">
              Local Delivery in Kerala
            </h3>
            <p className="text-[11px] sm:text-xs text-[var(--text)]/70 leading-relaxed">
              Printvoz operates a high-speed dispatch network across all major districts. 
              Get your custom prints and event handouts shipped securely to:
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs">
              {SITE_CONFIG.locations.map(loc => (
                <Link
                  key={loc.slug}
                  href={`/printing-service-${loc.slug}`}
                  className="bg-[var(--primary)]/5 text-[var(--text)] border border-[var(--secondary)]/15 px-3 py-1.5 rounded-md hover:bg-[var(--primary)]/10 transition-colors"
                >
                  {loc.city}
                </Link>
              ))}
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </>
  );
}
