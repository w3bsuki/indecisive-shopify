'use client'

import { Image as HydrogenImage } from '@shopify/hydrogen-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { ShopifyImage } from '@/lib/shopify/types'

interface HydrogenImageWrapperProps {
  data: ShopifyImage | null | undefined
  aspectRatio?: string
  crop?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  sizes?: string
  loading?: 'lazy' | 'eager'
  className?: string
  alt?: string
  width?: number
  height?: number
  priority?: boolean
}

export function HydrogenImageWrapper({
  data,
  aspectRatio = '1/1',
  crop = 'center',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading = 'lazy',
  className,
  alt,
  width,
  height,
  priority = false
}: HydrogenImageWrapperProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (!data?.url) {
    return (
      <div 
        className={cn(
          'bg-gray-200 flex items-center justify-center text-gray-500',
          className
        )}
        style={{ aspectRatio }}
      >
        <span className="text-sm">No image</span>
      </div>
    )
  }

  return (
    <div 
      className={cn('relative overflow-hidden', className)}
      style={{ aspectRatio }}
    >
      {/* Loading skeleton */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Error state */}
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
          <span className="text-sm">Failed to load</span>
        </div>
      )}
      
      {/* Hydrogen React Image */}
      <HydrogenImage
        data={{
          ...data,
          altText: alt || data.altText || 'Product image'
        }}
        aspectRatio={aspectRatio}
        crop={crop}
        sizes={sizes}
        loading={priority ? 'eager' : loading}
        width={width}
        height={height}
        className={cn(
          'object-cover transition-opacity duration-300',
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
    </div>
  )
}

// Specialized versions for common use cases
export function ProductImage({
  image,
  alt,
  priority = false,
  className
}: {
  image: ShopifyImage | null | undefined
  alt?: string
  priority?: boolean
  className?: string
}) {
  return (
    <HydrogenImageWrapper
      data={image}
      aspectRatio="1/1"
      crop="center"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      alt={alt}
      priority={priority}
      className={className}
    />
  )
}

export function HeroImage({
  image,
  alt,
  className
}: {
  image: ShopifyImage | null | undefined
  alt?: string
  className?: string
}) {
  return (
    <HydrogenImageWrapper
      data={image}
      aspectRatio="16/9"
      crop="center"
      sizes="100vw"
      alt={alt}
      priority={true}
      loading="eager"
      className={className}
    />
  )
}

export function ThumbnailImage({
  image,
  alt,
  className
}: {
  image: ShopifyImage | null | undefined
  alt?: string
  className?: string
}) {
  return (
    <HydrogenImageWrapper
      data={image}
      aspectRatio="1/1"
      crop="center"
      sizes="(max-width: 768px) 25vw, 15vw"
      alt={alt}
      width={150}
      height={150}
      className={className}
    />
  )
}

// Server-compatible version for SSR
export function HydrogenImageServer({
  data,
  aspectRatio = '1/1',
  alt,
  className
}: {
  data: ShopifyImage | null | undefined
  aspectRatio?: string
  alt?: string
  className?: string
}) {
  if (!data?.url) {
    return (
      <div 
        className={cn(
          'bg-gray-200 flex items-center justify-center text-gray-500',
          className
        )}
        style={{ aspectRatio }}
      >
        <span className="text-sm">No image</span>
      </div>
    )
  }

  // For server rendering, use a simple img tag with optimized Shopify URL
  const optimizedUrl = data.url + '&width=800&height=800&crop=center'
  
  return (
    <div 
      className={cn('relative overflow-hidden', className)}
      style={{ aspectRatio }}
    >
      <img
        src={optimizedUrl}
        alt={alt || data.altText || 'Product image'}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  )
}