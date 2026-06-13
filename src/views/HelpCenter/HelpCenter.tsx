// @ts-nocheck
"use client";
import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, LayoutGrid, Headset } from "lucide-react";
import HeroSection from "./HeroSection";
import FaqContent from "./FaqContent";
import AskQuestion from "./AskQuestion";
import SupportCenter from "./SupportCenter";
import BulkOrderCTA from "./BulkOrderCTA";
import { CategoryIcon, useDebounce, faqMatchesQuery } from "./helpers";

const ALL = "all";

export default function HelpCenter({
  initialHero,
  initialCategories,
  initialFaqs,
  initialPopularSearches,
}: any) {
  const categories = initialCategories || [];
  const faqs = initialFaqs || [];

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);
  const [selectedCategory, setSelectedCategory] = useState(ALL);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const searchRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const searching = debouncedQuery.trim().length > 0;

  const filteredFaqs = useMemo(() => {
    if (searching) {
      return faqs.filter((f: any) => faqMatchesQuery(f, debouncedQuery));
    }
    if (selectedSub) {
      return faqs.filter((f: any) => String(f.subcategory?._id) === String(selectedSub));
    }
    if (selectedCategory !== ALL) {
      return faqs.filter((f: any) => String(f.category?._id) === String(selectedCategory));
    }
    return faqs;
  }, [faqs, searching, debouncedQuery, selectedCategory, selectedSub]);

  const activeCategory = categories.find((c: any) => String(c._id) === String(selectedCategory));
  const activeSub = activeCategory?.subcategories?.find(
    (s: any) => String(s._id) === String(selectedSub)
  );

  const contentTitle = searching
    ? `Results for "${debouncedQuery.trim()}"`
    : activeSub
    ? activeSub.name
    : activeCategory
    ? activeCategory.name
    : "All FAQs";

  const contentDescription = searching
    ? null
    : activeSub?.description || activeCategory?.description || "Browse every answer in one place.";

  const selectCategory = (id: string) => {
    setSelectedCategory(id);
    setSelectedSub(null);
    setQuery("");
    if (id !== ALL) setExpanded((e) => ({ ...e, [id]: true }));
    scrollToContent();
  };

  const selectSub = (catId: string, subId: string) => {
    setSelectedCategory(catId);
    setSelectedSub(subId);
    setQuery("");
    scrollToContent();
  };

  const scrollToContent = () => {
    // Smooth scroll the content into view on mobile after a chip tap
    setTimeout(() => {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);
  };

  return (
    <main className="bg-[var(--bg)] min-h-screen text-[var(--text)] overflow-x-hidden">
      <HeroSection
        hero={initialHero}
        query={query}
        setQuery={setQuery}
        popularSearches={initialPopularSearches}
        searchRef={searchRef}
      />

      {/* FAQ navigation layout */}
      <section className="px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-10">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-1.5">
              <SidebarButton
                active={!searching && selectedCategory === ALL}
                onClick={() => selectCategory(ALL)}
                icon={<LayoutGrid className="w-5 h-5" />}
                label="All FAQs"
              />
              {categories.map((cat: any) => {
                const isActive = !searching && String(selectedCategory) === String(cat._id);
                const hasSubs = cat.subcategories?.length > 0;
                const isExpanded = expanded[cat._id];
                return (
                  <div key={cat._id}>
                    <SidebarButton
                      active={isActive && !selectedSub}
                      onClick={() => {
                        selectCategory(cat._id);
                        if (hasSubs) setExpanded((e) => ({ ...e, [cat._id]: !e[cat._id] }));
                      }}
                      icon={<CategoryIcon name={cat.icon} />}
                      label={cat.name}
                      chevron={hasSubs}
                      chevronOpen={isExpanded}
                    />
                    <AnimatePresence initial={false}>
                      {hasSubs && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden ml-4 pl-3 border-l border-[var(--secondary)]/20"
                        >
                          {cat.subcategories.map((sub: any) => (
                            <button
                              key={sub._id}
                              onClick={() => selectSub(cat._id, sub._id)}
                              className={`block w-full text-left px-3 py-2 my-0.5 rounded-lg text-sm font-medium transition-colors ${
                                String(selectedSub) === String(sub._id)
                                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                  : "text-[var(--text)]/65 hover:text-[var(--primary)] hover:bg-[var(--secondary)]/10"
                              }`}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Mobile category chips */}
          <div className="lg:hidden -mx-4 px-4">
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              <Chip active={!searching && selectedCategory === ALL} onClick={() => selectCategory(ALL)}>
                All FAQs
              </Chip>
              {categories.map((cat: any) => (
                <Chip
                  key={cat._id}
                  active={!searching && String(selectedCategory) === String(cat._id) && !selectedSub}
                  onClick={() => selectCategory(cat._id)}
                >
                  {cat.name}
                </Chip>
              ))}
            </div>
            {/* Subcategory chips for the active category */}
            {!searching && activeCategory?.subcategories?.length > 0 && (
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 mt-2.5">
                {activeCategory.subcategories.map((sub: any) => (
                  <Chip
                    key={sub._id}
                    small
                    active={String(selectedSub) === String(sub._id)}
                    onClick={() => selectSub(activeCategory._id, sub._id)}
                  >
                    {sub.name}
                  </Chip>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div ref={contentRef} className="scroll-mt-24">
            <FaqContent
              title={contentTitle}
              description={contentDescription}
              faqs={filteredFaqs}
              query={debouncedQuery}
            />
          </div>
        </div>
      </section>

      <AskQuestion />
      <SupportCenter />
      <BulkOrderCTA />

      {/* Sticky mobile support CTA */}
      <a
        href="#support"
        className="lg:hidden fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--primary)] text-[var(--bg)] font-bold shadow-2xl shadow-[var(--primary)]/30 active:scale-95 transition-transform"
      >
        <Headset className="w-5 h-5" /> Support
      </a>
    </main>
  );
}

function SidebarButton({ active, onClick, icon, label, chevron, chevronOpen }: any) {
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
        active
          ? "bg-[var(--primary)] text-[var(--bg)] shadow-lg shadow-[var(--primary)]/20"
          : "text-[var(--text)]/75 hover:bg-[var(--secondary)]/10 hover:text-[var(--text)]"
      }`}
    >
      <span className={active ? "text-[var(--bg)]" : "text-[var(--primary)]"}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {chevron && (
        <ChevronRight
          className={`w-4 h-4 transition-transform ${chevronOpen ? "rotate-90" : ""} ${
            active ? "text-[var(--bg)]" : "text-[var(--text)]/40"
          }`}
        />
      )}
    </button>
  );
}

function Chip({ active, onClick, children, small }: any) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full font-semibold whitespace-nowrap transition-all min-h-[40px] ${
        small ? "px-3.5 py-1.5 text-xs" : "px-4 py-2 text-sm"
      } ${
        active
          ? "bg-[var(--primary)] text-[var(--bg)] shadow-md"
          : "bg-[var(--bg)] border border-[var(--secondary)]/30 text-[var(--text)]/75 hover:border-[var(--primary)] hover:text-[var(--primary)]"
      }`}
    >
      {children}
    </button>
  );
}
