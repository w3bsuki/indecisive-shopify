'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  aspectRatio?: '1:1' | '3:4' | '4:5' | '16:9'
  priority?: boolean
  className?: string
  sizes?: string
  onLoad?: () => void
}

// Shimmer effect for loading state
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

export function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 1000,
  aspectRatio = '4:5',
  priority = false,
  className,
  sizes,
  onLoad
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Calculate dimensions based on aspect ratio
  const aspectRatios = {
    '1:1': 'aspect-square',
    '3:4': 'aspect-[3/4]',
    '4:5': 'aspect-[4/5]',
    '16:9': 'aspect-video'
  }

  // Generate blur data URL
  const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`

  // Optimize Shopify image URL for different formats
  const getOptimizedUrl = (url: string, width: number) => {
    if (!url.includes('cdn.shopify.com')) return url
    
    // Add Shopify image transformations
    const baseUrl = url.split('?')[0]
    return `${baseUrl}?width=${width}&format=webp&quality=85`
  }

  // Generate srcSet for responsive images
  const _generateSrcSet = () => {
    const widths = [320, 640, 768, 1024, 1280, 1536]
    return widths
      .map(w => `${getOptimizedUrl(src, w)} ${w}w`)
      .join(', ')
  }

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div className={cn(
        aspectRatios[aspectRatio],
        "bg-gray-100 flex items-center justify-center",
        className
      )}>
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-2">🖼️</div>
          <div className="text-sm">Image not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(aspectRatios[aspectRatio], "relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        placeholder="blur"
        blurDataURL={blurDataURL}
        sizes={sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={handleLoad}
        onError={handleError}
        quality={85}
        // Use responsive loader for Shopify images
        loader={({ src, width }) => getOptimizedUrl(src, width)}
      />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </div>
  )
}

// Preload critical images
export function preloadImage(src: string) {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  link.type = 'image/webp'
  document.head.appendChild(link)
}