/**
 * Cache configuration for optimal performance
 * Following Next.js best practices for static and dynamic content
 */

// Cache durations in seconds
export const CACHE_TIMES = {
  // Static assets (1 year)
  STATIC: 31536000,
  
  // Product pages (1 hour)
  PRODUCT: 3600,
  
  // Collection pages (30 minutes)
  COLLECTION: 1800,
  
  // Cart and dynamic data (no cache)
  DYNAMIC: 0,
  
  // API responses (5 minutes)
  API: 300,
  
  // Search results (10 minutes)
  SEARCH: 600,
} as const

/**
 * Get cache headers for different content types
 */
export function getCacheHeaders(type: keyof typeof CACHE_TIMES): Record<string, string> {
  const maxAge = CACHE_TIMES[type]
  
  if (maxAge === 0) {
    return {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'CDN-Cache-Control': 'no-store',
    }
  }
  
  // Use stale-while-revalidate for better performance
  const swr = Math.min(maxAge, 86400) // Max 1 day SWR
  
  return {
    'Cache-Control': `public, max-age=${maxAge}, stale-while-revalidate=${swr}`,
    'CDN-Cache-Control': `public, max-age=${maxAge}`,
  }
}

/**
 * Next.js fetch cache configuration
 */
export const fetchCacheConfig = {
  product: {
    revalidate: CACHE_TIMES.PRODUCT,
    tags: ['products'],
  },
  collection: {
    revalidate: CACHE_TIMES.COLLECTION,
    tags: ['collections'],
  },
  search: {
    revalidate: CACHE_TIMES.SEARCH,
    tags: ['search'],
  },
  cart: {
    cache: 'no-store' as const,
  },
  customer: {
    cache: 'no-store' as const,
  },
} as const

/**
 * Image optimization config
 */
export const imageConfig = {
  // Shopify image transformation parameters
  sizes: {
    thumbnail: { width: 100, height: 100 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 },
    hero: { width: 1920, height: 1080 },
  },
  
  // Next.js image sizes for responsive images
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  
  // Formats to use
  formats: ['image/webp', 'image/avif'],
}