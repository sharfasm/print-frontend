import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Printvoz — Online Printing Services Kerala',
    short_name: 'Printvoz',
    description: 'Premium quality printing services in Kerala. Business cards, flex banners, brochures, packaging and more. Fast delivery across Kochi, Thrissur, Calicut.',
    start_url: '/',
    display: 'standalone',
    background_color: '#EAE6D2',
    theme_color: '#505039',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
