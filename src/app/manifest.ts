import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Printvoz — Online Printing Services Kerala',
    short_name: 'Printvoz',
    description: 'Premium quality printing services in Kerala. Business cards, flex banners, brochures, packaging and more. Fast delivery across Kochi, Thrissur, Calicut.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    orientation: 'portrait',
    background_color: '#EAE6D2',
    theme_color: '#505039',
    lang: 'en-IN',
    dir: 'ltr',
    categories: ['shopping', 'business'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Browse Products',
        short_name: 'Shop',
        description: 'Explore all printing products',
        url: '/products',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'My Cart',
        short_name: 'Cart',
        url: '/cart',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'My Wishlist',
        short_name: 'Wishlist',
        url: '/wishlist',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'My Account',
        short_name: 'Account',
        url: '/dashboard',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
      },
    ],
  }
}
