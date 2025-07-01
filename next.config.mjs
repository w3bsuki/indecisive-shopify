/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration for Vercel free tier
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
}

export default nextConfig
