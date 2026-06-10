export const SITE_CONFIG = {
  name: 'Printvoz',
  tagline: 'Premium Printing Services in Kerala',
  description:
    'Printvoz offers premium quality online printing services in Kerala — business cards, flex banners, brochures, packaging, custom gifts and more. Fast delivery across Kochi, Thrissur, Calicut, Trivandrum and Kannur.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://printvoz.com',
  logo: '/images/printvoz-logo.png',
  ogImage: '/images/og-default.jpg',
  twitter: '@printvoz',

  // LocalBusiness NAP — update with real details
  business: {
    name: 'Printvoz',
    legalName: 'Printvoz Printing Services',
    address: {
      streetAddress: '123, Print Street, Koduvally',
      addressLocality: 'Koduvally',
      addressRegion: 'Kerala',
      postalCode: '673572',
      addressCountry: 'IN',
    },
    phone: '+91 98765 43210',
    email: 'support@printvoz.com',
    gst: 'XXXXXXXXXXXX',
    priceRange: '₹₹',
    openingHours: ['Mo-Sa 09:00-18:00'],
    geo: {
      latitude: 11.3594,
      longitude: 75.9111,
    },
  },

  // Social profiles
  social: {
    instagram: 'https://instagram.com/printvoz',
    facebook: 'https://facebook.com/printvoz',
    youtube: '',
    linkedin: '',
  },

  // Kerala locations
  locations: [
    { city: 'Kochi', slug: 'kochi', pincode: '682001' },
    { city: 'Thrissur', slug: 'thrissur', pincode: '680001' },
    { city: 'Calicut', slug: 'calicut', pincode: '673001' },
    { city: 'Trivandrum', slug: 'trivandrum', pincode: '695001' },
    { city: 'Kannur', slug: 'kannur', pincode: '670001' },
  ],
}

export const DEFAULT_KEYWORDS = [
  'printing services Kerala',
  'online printing Kerala',
  'business cards printing Kerala',
  'flex banner printing Kerala',
  'brochure printing Kerala',
  'packaging printing Kerala',
  'custom printing Kochi',
  'printing company Kerala',
  'bulk printing Kerala',
  'Printvoz',
]
