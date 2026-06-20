// @ts-nocheck
import type { Metadata, Viewport } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import Providers from '../components/Providers'
import JsonLd from '@/components/seo/JsonLd'
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateLocalBusinessSchema,
} from '@/lib/seo/schemas'
import { SITE_CONFIG } from '@/lib/seo/constants'

// Font optimization — prevents layout shift
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: 'Printvoz — Premium Printing Services in Kerala',
    template: '%s | Printvoz',
  },
  description: SITE_CONFIG.description,
  keywords: 'printing services Kerala, online printing Kerala, business cards Kerala, flex banner printing, Printvoz',
  authors: [{ name: 'Printvoz', url: SITE_CONFIG.url }],
  creator: 'Printvoz',
  publisher: 'Printvoz',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  applicationName: 'Printvoz',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Printvoz',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: [{ url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: 'Printvoz — Premium Printing Services in Kerala',
    description: SITE_CONFIG.description,
    images: [
      {
        url: `${SITE_CONFIG.url}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: 'Printvoz Printing Services Kerala',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE_CONFIG.twitter,
    creator: SITE_CONFIG.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'YOUR_GOOGLE_VERIFICATION_CODE',  // ← add after GSC setup
    // yandex: 'YOUR_YANDEX_CODE',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#505039' },
    { media: '(prefers-color-scheme: dark)', color: '#505039' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <JsonLd
          schema={[
            generateWebsiteSchema(),
            generateOrganizationSchema(),
            generateLocalBusinessSchema(),
          ]}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
