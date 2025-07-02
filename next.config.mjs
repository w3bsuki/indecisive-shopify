import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Internationalization handled via market context (App Router pattern)
  // Enable experimental features for performance
  experimental: {
    optimizePackageImports: ['@shopify/hydrogen-react'],
  },
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/en/home',
        destination: '/en',
        permanent: true,
      },
      {
        source: '/de/home', 
        destination: '/de',
        permanent: true,
      },
      {
        source: '/bg/home',
        destination: '/bg',
        permanent: true,
      }
    ]
  }
}

export default withNextIntl(nextConfig)