'use client'

import { Money } from '@/components/commerce/money'
import { cn } from '@/lib/utils'
import type { MoneyV2 } from '@shopify/hydrogen-react/storefront-api-types'

interface ProductPriceProps {
  priceRange: {
    minVariantPrice: MoneyV2
    maxVariantPrice: MoneyV2
  }
  compareAtPriceRange?: {
    minVariantPrice: MoneyV2
    maxVariantPrice: MoneyV2
  }
  className?: string
  showCompareAt?: boolean
  showRange?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ProductPrice({
  priceRange,
  compareAtPriceRange,
  className,
  showCompareAt = true,
  showRange = true,
  size = 'md'
}: ProductPriceProps) {
  const minPrice = priceRange.minVariantPrice
  const maxPrice = priceRange.maxVariantPrice
  const minCompareAtPrice = compareAtPriceRange?.minVariantPrice
  
  // Check if there's a price range
  const hasRange = showRange && minPrice.amount !== maxPrice.amount
  
  // Check if there's a sale (compare at price exists and is higher)
  const isOnSale = showCompareAt && minCompareAtPrice && 
    parseFloat(minCompareAtPrice.amount) > parseFloat(minPrice.amount)
  
  // Calculate savings if on sale
  const savings = isOnSale && minCompareAtPrice ? 
    parseFloat(minCompareAtPrice.amount) - parseFloat(minPrice.amount) : 0
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {/* Main Price */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {hasRange ? (
          // Price Range Display
          <div className={cn('font-mono font-semibold', sizeClasses[size])}>
            <Money data={minPrice} withoutTrailingZeros />
            <span className="text-gray-500 mx-1">-</span>
            <Money data={maxPrice} withoutTrailingZeros />
          </div>
        ) : (
          // Single Price Display
          <Money 
            data={minPrice} 
            className={cn('font-mono font-semibold', sizeClasses[size])}
            withoutTrailingZeros 
          />
        )}
        
        {/* Compare At Price (crossed out) */}
        {isOnSale && minCompareAtPrice && (
          <Money 
            data={minCompareAtPrice}
            className={cn(
              'font-mono text-gray-500 line-through',
              size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
            )}
            withoutTrailingZeros
          />
        )}
        
        {/* Sale Badge */}
        {isOnSale && (
          <span className={cn(
            'px-2 py-0.5 bg-red-600 text-white font-mono font-bold rounded-none',
            size === 'sm' ? 'text-xs' : 'text-xs'
          )}>
            SALE
          </span>
        )}
      </div>
      
      {/* Savings Amount */}
      {isOnSale && savings > 0 && (
        <div className={cn(
          'text-green-600 font-mono font-medium',
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>
          Save <Money data={{ amount: savings.toString(), currencyCode: minPrice.currencyCode }} withoutTrailingZeros />
        </div>
      )}
    </div>
  )
}

// Server-compatible version for SSR
export function ProductPriceServer({
  priceRange,
  compareAtPriceRange,
  className,
  showCompareAt = true,
  showRange = true,
  size = 'md'
}: ProductPriceProps) {
  // For server components, we'll use a simpler implementation
  // that doesn't rely on client-side Money component
  const minPrice = priceRange.minVariantPrice
  const maxPrice = priceRange.maxVariantPrice
  const minCompareAtPrice = compareAtPriceRange?.minVariantPrice
  
  const hasRange = showRange && minPrice.amount !== maxPrice.amount
  const isOnSale = showCompareAt && minCompareAtPrice && 
    parseFloat(minCompareAtPrice.amount) > parseFloat(minPrice.amount)
  
  const formatPrice = (money: MoneyV2) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: money.currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
    return formatter.format(parseFloat(money.amount))
  }
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-lg'
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2 flex-wrap">
        {hasRange ? (
          <div className={cn('font-mono font-semibold', sizeClasses[size])}>
            {formatPrice(minPrice)}
            <span className="text-gray-500 mx-1">-</span>
            {formatPrice(maxPrice)}
          </div>
        ) : (
          <span className={cn('font-mono font-semibold', sizeClasses[size])}>
            {formatPrice(minPrice)}
          </span>
        )}
        
        {isOnSale && minCompareAtPrice && (
          <span className={cn(
            'font-mono text-gray-500 line-through',
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
          )}>
            {formatPrice(minCompareAtPrice)}
          </span>
        )}
        
        {isOnSale && (
          <span className={cn(
            'px-2 py-0.5 bg-red-600 text-white font-mono font-bold rounded-none',
            size === 'sm' ? 'text-xs' : 'text-xs'
          )}>
            SALE
          </span>
        )}
      </div>
    </div>
  )
}