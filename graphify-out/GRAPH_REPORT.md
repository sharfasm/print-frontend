# Graph Report - frontend  (2026-06-10)

## Corpus Check
- 121 files · ~176,786 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 566 nodes · 918 edges · 53 communities (44 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c2e312df`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]

## God Nodes (most connected - your core abstractions)
1. `useShop()` - 40 edges
2. `resolveImage()` - 31 edges
3. `useAuth()` - 22 edges
4. `generateFAQSchema()` - 19 edges
5. `compilerOptions` - 19 edges
6. `App` - 16 edges
7. `generateMetadata()` - 16 edges
8. `Geometry` - 15 edges
9. `InfiniteGridMenu` - 14 edges
10. `UI/UX Pro Max - Design Intelligence` - 13 edges

## Surprising Connections (you probably didn't know these)
- `ChatHeader()` --calls--> `resolveImage()`  [INFERRED]
  src/components/workspace/ChatHeader.tsx → src/lib/imageUtils.ts
- `BlogDetailPage()` --calls--> `resolveImage()`  [INFERRED]
  src/app/blog/[slug]/page.tsx → src/lib/imageUtils.ts
- `BlogDetailPage()` --calls--> `generateFAQSchema()`  [INFERRED]
  src/app/blog/[slug]/page.tsx → src/lib/seo/schemas.ts
- `ProductPage()` --calls--> `generateBreadcrumbSchema()`  [INFERRED]
  src/app/product/[slug]/page.tsx → src/lib/seo/schemas.ts
- `ProductPage()` --calls--> `generateFAQSchema()`  [INFERRED]
  src/app/product/[slug]/page.tsx → src/lib/seo/schemas.ts

## Import Cycles
- None detected.

## Communities (53 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (12): Navbar(), Navbar, AuthContext, AuthProvider(), useAuth(), ShopProvider(), DashboardLayout(), DashboardLayout() (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (13): ArcballControl, createAndSetupTexture(), createProgram(), defaultItems, DiscGeometry, Face, Geometry, IcosahedronGeometry (+5 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (41): dependencies, axios, framer-motion, gl-matrix, lenis, lucide-react, next, ogl (+33 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (7): App, autoBind(), createTextTexture(), debounce(), lerp(), Media, Title

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (12): AuthModal(), AuthNotification(), ShopContext, useShop(), Addresses(), DashboardCart(), DashboardWishlist(), BestSellers() (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (11): metadata, metadata, metadata, BreadcrumbItem, Breadcrumbs(), BreadcrumbsProps, JsonLdProps, generateMetadata() (+3 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (22): compilerOptions, allowJs, baseUrl, esModuleInterop, ignoreDeprecations, incremental, isolatedModules, jsx (+14 more)

### Community 7 - "Community 7"
Cohesion: 0.16
Nodes (9): RelatedCategories(), RelatedCategoriesProps, HeroSection(), HeroSectionProps, DeliveryTracking(), FeaturedCollection(), optimizeCloudinaryUrl(), resolveImage() (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.16
Nodes (8): generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), LocationPage(), LocationPageProps, generateLocationMetadata()

### Community 9 - "Community 9"
Cohesion: 0.19
Nodes (12): AboutPage(), metadata, inter, metadata, outfit, RootLayout(), viewport, ContactPage() (+4 more)

### Community 10 - "Community 10"
Cohesion: 0.14
Nodes (12): HomePage(), homepageFaqs, metadata, CategoryFAQ(), CategoryFAQProps, FAQItem, FAQPage(), metadata (+4 more)

### Community 11 - "Community 11"
Cohesion: 0.14
Nodes (3): DashboardRequests(), UpdateModalProps, api

### Community 12 - "Community 12"
Cohesion: 0.24
Nodes (10): fetchSitemapData(), sitemap(), DEFAULT_KEYWORDS, SITE_CONFIG, generateBlogMetadata(), GenerateMetadataOptions, generateArticleSchema(), BlogDetailPage() (+2 more)

### Community 13 - "Community 13"
Cohesion: 0.14
Nodes (6): CustomerReviews, FAQ, Footer, Newsletter, OurStory, WhyChooseUs

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (12): computedHash, skillPath, source, sourceType, skills, frontend-design, ui-ux-pro-max, computedHash (+4 more)

### Community 15 - "Community 15"
Cohesion: 0.17
Nodes (9): ProductCard, ProductCardProps, LocationProductGrid(), LocationProductGridProps, Products(), ScrollSentinel, SkeletonProductCard, SkeletonSubcategoryCard (+1 more)

### Community 16 - "Community 16"
Cohesion: 0.18
Nodes (3): ANIMATION_CONFIG, LogoLoop, techLogos

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (11): 10. Charts & Data (LOW), 1. Accessibility (CRITICAL), 2. Touch & Interaction (CRITICAL), 3. Performance (HIGH), 4. Style Selection (HIGH), 5. Layout & Responsive (HIGH), 6. Typography & Color (MEDIUM), 7. Animation (MEDIUM) (+3 more)

### Community 18 - "Community 18"
Cohesion: 0.33
Nodes (6): getBreadcrumbsForCategory(), getBreadcrumbsForProduct(), getCategoryUrl(), getHomepageUrl(), getProductUrl(), getSubcategoryUrl()

### Community 19 - "Community 19"
Cohesion: 0.28
Nodes (3): CustomizationModal(), Footer(), ProductDetails()

### Community 20 - "Community 20"
Cohesion: 0.33
Nodes (7): metadata, ProductsPage(), generateCollectionPageSchema(), generateMetadata(), getCategorySEO(), PageProps, SubcategoryPage()

### Community 21 - "Community 21"
Cohesion: 0.22
Nodes (8): Available Domains, Available Stacks, How to Use, Output Formats, Prerequisites, Rule Categories by Priority, Search Reference, UI/UX Pro Max - Design Intelligence

### Community 22 - "Community 22"
Cohesion: 0.60
Nodes (5): generateProductMetadata(), generateProductSchema(), getProduct(), ProductPage(), generateMetadata()

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (6): Accessibility, Interaction, Layout, Light/Dark Mode, Pre-Delivery Checklist, Visual Quality

### Community 24 - "Community 24"
Cohesion: 0.33
Nodes (6): How to Use This Skill, Step 1: Analyze User Requirements, Step 2: Generate Design System (REQUIRED), Step 2b: Persist Design System (Master + Overrides Pattern), Step 3: Supplement with Detailed Searches (as needed), Step 4: Stack Guidelines (React Native)

### Community 25 - "Community 25"
Cohesion: 0.33
Nodes (3): paymentColors, RequestListProps, statusColors

### Community 26 - "Community 26"
Cohesion: 0.70
Nodes (4): CategoryPage(), generateMetadata(), getCategorySEO(), generateCategoryMetadata()

### Community 27 - "Community 27"
Cohesion: 0.40
Nodes (5): Common Rules for Professional UI, Icons & Visual Elements, Interaction (App), Layout & Spacing, Light/Dark Mode Contrast

### Community 28 - "Community 28"
Cohesion: 0.40
Nodes (5): Example Workflow, Step 1: Analyze Requirements, Step 2: Generate Design System (REQUIRED), Step 3: Supplement with Detailed Searches (as needed), Step 4: Stack Guidelines

### Community 29 - "Community 29"
Cohesion: 0.40
Nodes (4): ChatHeader(), ChatHeaderProps, stepLabels, workflowSteps

### Community 30 - "Community 30"
Cohesion: 0.50
Nodes (3): DynamicField, DynamicFormRenderer(), DynamicFormRendererProps

### Community 33 - "Community 33"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 36 - "Community 36"
Cohesion: 0.50
Nodes (4): Common Sticking Points, Pre-Delivery Checklist, Query Strategy, Tips for Better Results

### Community 37 - "Community 37"
Cohesion: 0.50
Nodes (4): Must Use, Recommended, Skip, When to Apply

### Community 38 - "Community 38"
Cohesion: 0.67
Nodes (3): ChatBubble(), ChatBubbleProps, resolveImg()

## Knowledge Gaps
- **178 isolated node(s):** `backendPatterns`, `nextConfig`, `name`, `private`, `version` (+173 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `resolveImage()` connect `Community 7` to `Community 0`, `Community 34`, `Community 3`, `Community 4`, `Community 5`, `Community 35`, `Community 11`, `Community 12`, `Community 15`, `Community 19`, `Community 29`, `Community 31`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `useShop()` connect `Community 4` to `Community 0`, `Community 34`, `Community 35`, `Community 7`, `Community 11`, `Community 15`, `Community 19`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `resolveImage()` (e.g. with `BlogDetailPage()` and `ChatHeader()`) actually correct?**
  _`resolveImage()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `generateFAQSchema()` (e.g. with `BlogDetailPage()` and `ProductPage()`) actually correct?**
  _`generateFAQSchema()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `backendPatterns`, `nextConfig`, `name` to the rest of the system?**
  _178 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05254901960784314 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06547619047619048 - nodes in this community are weakly interconnected._