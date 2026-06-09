/**
 * Printvoz Internal Linking Architecture Helper
 * Establishes consistent URL structures for SEO crawl mapping.
 */

export const getHomepageUrl = () => '/';

export const getCategoryUrl = (slug: string) => `/category/${slug}`;

export const getSubcategoryUrl = (categorySlug: string, subcategorySlug: string) =>
  `/category/${categorySlug}/${subcategorySlug}`;

export const getProductUrl = (slug: string) => `/product/${slug}`;

export const getBlogUrl = (slug: string) => `/blog/${slug}`;

export const getBlogCategoryUrl = (category: string) => `/blog?category=${category}`;

export const getLocationPageUrl = (citySlug: string) => `/printing-service-${citySlug}`;

/**
 * Generates hierarchical breadcrumbs for internal linking path navigation
 */
export function getBreadcrumbsForProduct(product: {
  name: string;
  slug: string;
  category?: { name: string; slug: string };
  subcategory?: { name: string; slug: string };
}) {
  const breadcrumbs = [{ name: 'Home', url: getHomepageUrl() }];

  if (product.category) {
    breadcrumbs.push({
      name: product.category.name,
      url: getCategoryUrl(product.category.slug),
    });

    if (product.subcategory) {
      breadcrumbs.push({
        name: product.subcategory.name,
        url: getSubcategoryUrl(product.category.slug, product.subcategory.slug),
      });
    }
  }

  breadcrumbs.push({
    name: product.name,
    url: getProductUrl(product.slug),
  });

  return breadcrumbs;
}

export function getBreadcrumbsForCategory(category: {
  name: string;
  slug: string;
  parentCategory?: { name: string; slug: string };
}) {
  const breadcrumbs = [{ name: 'Home', url: getHomepageUrl() }];

  if (category.parentCategory) {
    breadcrumbs.push({
      name: category.parentCategory.name,
      url: getCategoryUrl(category.parentCategory.slug),
    });
  }

  breadcrumbs.push({
    name: category.name,
    url: getCategoryUrl(category.slug),
  });

  return breadcrumbs;
}
