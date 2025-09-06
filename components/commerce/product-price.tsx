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
  showDualCurrency?: boolean
}

export function ProductPrice({
  priceRange,
  compareAtPriceRange,
  className,
  showCompareAt = true,
  showRange = true,
  size = 'md',
  showDualCurrency = false
}: ProductPriceProps) {
  const minPrice = priceRange.minVariantPrice
  const maxPrice = priceRange.maxVariantPrice
  const minCompareAtPrice = compareAtPriceRange?.minVariantPrice
  
  // Check if there's a price range
  const hasRange = showRange && minPrice.amount !== maxPrice.amount
  
  // Check if there's a sale (compare at price exists and is higher)
  const isOnSale = showCompareAt && minCompareAtPrice && 
    parseFloat(minCompareAtPrice.amount) > parseFloat(minPrice.amount)
  
  // Calculate savings and discount percentage if on sale
  const savings = isOnSale && minCompareAtPrice ? 
    parseFloat(minCompareAtPrice.amount) - parseFloat(minPrice.amount) : 0
  const discountPercentage = isOnSale && minCompareAtPrice ? 
    Math.round(((parseFloat(minCompareAtPrice.amount) - parseFloat(minPrice.amount)) / parseFloat(minCompareAtPrice.amount)) * 100) : 0
  
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
            <Money data={minPrice} withoutTrailingZeros showDualCurrency={showDualCurrency} />
            <span className="text-gray-500 mx-1">-</span>
            <Money data={maxPrice} withoutTrailingZeros showDualCurrency={showDualCurrency} />
          </div>
        ) : (
          // Single Price Display
          <Money 
            data={minPrice} 
            className={cn('font-mono font-semibold', sizeClasses[size])}
            withoutTrailingZeros 
            showDualCurrency={showDualCurrency}
          />
        )}
        
        {/* Compare At Price (crossed out with better styling) */}
        {isOnSale && minCompareAtPrice && (
          <Money 
            data={minCompareAtPrice}
            className={cn(
              'font-mono text-gray-400 line-through decoration-2 decoration-gray-400',
              size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
            )}
            withoutTrailingZeros
            showDualCurrency={showDualCurrency}
          />
        )}
        
        {/* Sale Badge with Percentage */}
        {isOnSale && discountPercentage > 0 && (
          <span className={cn(
            'px-2 py-0.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-mono font-bold rounded-sm shadow-sm border border-red-800',
            size === 'sm' ? 'text-xs' : 'text-xs'
          )}>
            -{discountPercentage}%
          </span>
        )}
      </div>
      
      {/* Savings Amount with Better Styling */}
      {isOnSale && savings > 0 && (
        <div className={cn(
          'text-emerald-600 font-mono font-semibold bg-emerald-50 px-2 py-1 rounded-sm border border-emerald-200',
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>
          Save <Money data={{ amount: savings.toString(), currencyCode: minPrice.currencyCode }} withoutTrailingZeros showDualCurrency={showDualCurrency} />
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
  size = 'md',
  showDualCurrency = false
}: ProductPriceProps) {
  // For server components, we'll use a simpler implementation
  // that doesn't rely on client-side Money component
  const minPrice = priceRange.minVariantPrice
  const maxPrice = priceRange.maxVariantPrice
  const minCompareAtPrice = compareAtPriceRange?.minVariantPrice
  
  const hasRange = showRange && minPrice.amount !== maxPrice.amount
  const isOnSale = showCompareAt && minCompareAtPrice && 
    parseFloat(minCompareAtPrice.amount) > parseFloat(minPrice.amount)
  const discountPercentageServer = isOnSale && minCompareAtPrice ? 
    Math.round(((parseFloat(minCompareAtPrice.amount) - parseFloat(minPrice.amount)) / parseFloat(minCompareAtPrice.amount)) * 100) : 0
  
  const formatPrice = (money: MoneyV2, withEur = false) => {
    // Convert to BGN first if needed
    const bgnAmount = money.currencyCode === 'BGN' 
      ? parseFloat(money.amount)
      : parseFloat(money.amount) * (
          money.currencyCode === 'USD' ? (1 / 0.64) : 
          money.currencyCode === 'GBP' ? (1 / 0.42) : 
          money.currencyCode === 'EUR' ? (1 / 0.51) : 1
        )

    const bgnFormatter = new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'BGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
    const bgnPrice = bgnFormatter.format(bgnAmount)

    if (withEur && showDualCurrency) {
      const eurAmount = bgnAmount * 0.51
      const eurFormatter = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
      const eurPrice = eurFormatter.format(eurAmount)
      return `${bgnPrice} (${eurPrice})`
    }

    return bgnPrice
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
            'font-mono text-gray-400 line-through decoration-2 decoration-gray-400',
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
          )}>
            {formatPrice(minCompareAtPrice)}
          </span>
        )}
        
        {isOnSale && discountPercentageServer > 0 && (
          <span className={cn(
            'px-2 py-0.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-mono font-bold rounded-sm shadow-sm border border-red-800',
            size === 'sm' ? 'text-xs' : 'text-xs'
          )}>
            -{discountPercentageServer}%
          </span>
        )}
      </div>
    </div>
  )
}