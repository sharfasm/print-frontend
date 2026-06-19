import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { resolveImage } from '@/lib/imageUtils';
import { logPrefetchFailure } from '@/lib/prefetch';

export const metadata: Metadata = genMeta({
  title: 'Printvoz Blog — Custom Printing Tips & Advice',
  description: 'Learn about graphic designing templates, screen printing technology, bulk marketing banners, and branding ideas. Expert advice from the Printvoz Kerala team.',
  path: '/blog',
  keywords: ['printing tips', 'corporate branding advice', 'custom stickers guide', 'kerala prints'],
});

export default async function BlogIndexPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  let blogs = [];
  
  try {
    const res = await fetch(`${API_URL}/blogs`, { next: { revalidate: 1800 } });
    if (res.ok) {
      blogs = await res.json();
    }
  } catch (err) {
    logPrefetchFailure("blog posts", err);
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <main className="max-w-6xl mx-auto px-4 pt-28 pb-16 space-y-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ name: 'Blog', href: '/blog' }]} className="text-xs tracking-wider" />

        {/* Section Title */}
        <div className="space-y-3 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif leading-tight">
            Printvoz Insights & Guides
          </h1>
          <p className="text-sm sm:text-base text-[var(--text)]/80 leading-relaxed">
            Discover articles, tutorials, and business advice curated by our local printing specialists in Kerala. 
            Get tips on file formats, design setups, and cost-effective branding.
          </p>
        </div>

        {/* Blog Post Cards Grid */}
        {blogs.length === 0 ? (
          <div className="border border-[var(--secondary)]/10 rounded-2xl p-12 text-center bg-white dark:bg-[#1a2526]">
            <p className="text-sm text-gray-500">No blog posts found. Check back later!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
            {blogs.map((post: any) => {
              const coverUrl = resolveImage(post.coverImage) || '/images/og-default.jpg';
              const publishDate = post.publishedAt 
                ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })
                : 'Draft';

              return (
                <article
                  key={post._id}
                  className="group bg-white dark:bg-[#1a2526] rounded-2xl border border-[var(--secondary)]/10 hover:border-[var(--secondary)]/25 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden"
                >
                  {/* Cover Image */}
                  <Link href={`/blog/${post.slug}`} className="aspect-video relative overflow-hidden bg-gray-100 block">
                    <img
                      src={coverUrl}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </Link>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col flex-grow space-y-3">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span className="font-semibold uppercase tracking-wider text-[var(--primary)]">
                        {post.tags?.[0] || 'Guides'}
                      </span>
                      <span>&bull;</span>
                      <span>{publishDate}</span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold font-serif leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-[var(--text)]/70 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="pt-4 mt-auto border-t border-[var(--secondary)]/5 flex items-center justify-between">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-extrabold text-[var(--primary)] hover:underline flex items-center gap-1"
                      >
                        Read Full Post &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
