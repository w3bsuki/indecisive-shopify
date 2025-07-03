/**
 * Shopify image optimization utilities
 * Transforms Shopify CDN URLs for optimal performance
 */

interface ImageTransformOptions {
  width?: number
  height?: number
  crop?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  scale?: 2 | 3
  format?: 'jpg' | 'webp' | 'avif'
}

/**
 * Transform Shopify image URL with optimization parameters
 */
export function optimizeShopifyImage(
  originalUrl: string,
  options: ImageTransformOptions = {}
): string {
  if (!originalUrl || !originalUrl.includes('cdn.shopify.com')) {
    return originalUrl
  }
  
  try {
    const params = new URLSearchParams()
    
    // Add width parameter
    if (options.width) {
      params.set('width', options.width.toString())
    }
    
    // Add height parameter
    if (options.height) {
      params.set('height', options.height.toString())
    }
    
    // Add crop parameter
    if (options.crop) {
      params.set('crop', options.crop)
    }
    
    // Add scale parameter for retina displays
    if (options.scale) {
      params.set('scale', options.scale.toString())
    }
    
    // Add format parameter
    if (options.format) {
      params.set('format', options.format)
    }
    
    // Shopify uses different URL structure for transformations
    const transformedUrl = originalUrl.replace(
      /\.(jpg|jpeg|png|webp|avif)$/i,
      `@${params.toString().replace(/&/g, '&')}.${options.format || 'webp'}`
    )
    
    return transformedUrl
  } catch {
    return originalUrl
  }
}

/**
 * Generate responsive image URLs for srcSet
 */
export function generateSrcSet(
  originalUrl: string,
  sizes: number[] = [640, 750, 828, 1080, 1200, 1920]
): string {
  return sizes
    .map(size => {
      const url = optimizeShopifyImage(originalUrl, { width: size, format: 'webp' })
      return `${url} ${size}w`
    })
    .join(', ')
}

/**
 * Get optimized image props for Next.js Image component
 */
export function getOptimizedImageProps(
  src: string,
  alt: string,
  aspectRatio?: { width: number; height: number }
) {
  const sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
  
  return {
    src: optimizeShopifyImage(src, { width: 1920, format: 'webp' }),
    alt,
    sizes,
    loading: 'lazy' as const,
    quality: 85,
    ...(aspectRatio && {
      width: aspectRatio.width,
      height: aspectRatio.height,
    }),
  }
}

/**
 * Preload critical images for LCP optimization
 */
export function preloadImage(url: string, options?: ImageTransformOptions): void {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = optimizeShopifyImage(url, { format: 'webp', ...options })
  link.type = 'image/webp'
  
  document.head.appendChild(link)
}