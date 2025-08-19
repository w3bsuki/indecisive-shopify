import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface ProductRatingProps {
  product: ShopifyProduct
  showCount?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ProductRating({ 
  product, 
  showCount = true, 
  size = 'md',
  className 
}: ProductRatingProps) {
  // Extract rating from metafields with null safety
  const ratingValue = product.metafields?.find(
    (mf) => mf && mf.namespace === 'reviews' && mf.key === 'rating'
  )?.value
  
  const ratingCount = product.metafields?.find(
    (mf) => mf && mf.namespace === 'reviews' && mf.key === 'rating_count'
  )?.value

  const rating = ratingValue ? parseFloat(ratingValue) : 0
  const count = ratingCount ? parseInt(ratingCount) : 0

  if (rating === 0 || count === 0) {
    return null
  }

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(rating)
          const halfFilled = star === Math.ceil(rating) && rating % 1 !== 0
          
          return (
            <div key={star} className="relative">
              <Star
                className={cn(
                  sizeClasses[size],
                  'text-gray-300 fill-gray-300'
                )}
              />
              {(filled || halfFilled) && (
                <Star
                  className={cn(
                    sizeClasses[size],
                    'absolute top-0 left-0 text-yellow-500 fill-yellow-500',
                    halfFilled && 'clip-path-half'
                  )}
                  style={halfFilled ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
                />
              )}
            </div>
          )
        })}
      </div>
      
      {showCount && (
        <span className={cn(textSizeClasses[size], 'text-gray-600')}>
          {rating.toFixed(1)} ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  )
}