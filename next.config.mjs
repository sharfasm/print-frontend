const backendPatterns = [];
if (process.env.NEXT_PUBLIC_BACKEND_URL) {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_BACKEND_URL);
    backendPatterns.push({
      protocol: url.protocol.replace(':', ''),
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: '/**',
    });
  } catch (e) {
    // Ignore invalid URL
  }
}

// Build a Content-Security-Policy from the configured backend origin. Shipped in
// REPORT-ONLY mode: violations are reported to the console but nothing is
// blocked, so there is zero risk of breaking images/sockets/inline styles.
// Promote to the enforcing `Content-Security-Policy` header once reports are clean.
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
let backendOrigin = '';
let wsOrigin = '';
try {
  const u = new URL(backendUrl);
  backendOrigin = u.origin;
  wsOrigin = `${u.protocol === 'https:' ? 'wss' : 'ws'}://${u.host}`;
} catch (e) {
  // Ignore invalid URL
}

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  `img-src 'self' data: blob: https: ${backendOrigin}`.trim(),
  "font-src 'self' data: https://fonts.gstatic.com",
  `connect-src 'self' ${backendOrigin} ${wsOrigin}`.trim(),
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      ...backendPatterns,
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Content-Security-Policy-Report-Only', value: contentSecurityPolicy },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ]
  },

  async redirects() {
    return [
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/terms-and-conditions',
        permanent: true,
      },
      {
        source: '/returns',
        destination: '/refund-policy',
        permanent: true,
      },
      {
        source: '/legal',
        destination: '/terms-and-conditions',
        permanent: true,
      },
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ]
  },
}

export default nextConfig

