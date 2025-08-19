import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  fill?: boolean
  sizes?: string
  quality?: number
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75
}: OptimizedImageProps) {
  if (!src) {
    return (
      <div className={cn('bg-gray-200 flex items-center justify-center', className)}>
        <span className="text-sm text-gray-500">No image</span>
      </div>
    )
  }

  const imageProps = fill
    ? { fill: true, sizes }
    : { width: width || 800, height: height || 800 }

  return (
    <Image
      src={src}
      alt={alt}
      {...imageProps}
      priority={priority}
      quality={quality}
      className={cn('object-cover', className)}
      loading={priority ? 'eager' : 'lazy'}
    />
  )
}