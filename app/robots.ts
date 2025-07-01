import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://indecisive-wear.vercel.app'
    : 'http://localhost:3000'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/products/',
          '/search/',
          '/community/',
        ],
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/cart/',
          '/checkout/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/products/',
          '/search/',
          '/community/',
        ],
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/cart/',
          '/checkout/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}