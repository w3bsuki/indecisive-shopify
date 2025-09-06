'use client'

import { Money } from '@/components/commerce/money'
import { cn } from '@/lib/utils'
import { getSaleInfo } from '@/lib/utils/sale-pricing'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface EnhancedProductPriceProps {
  product: ShopifyProduct
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showSavings?: boolean
  showBadge?: boolean
}

export function EnhancedProductPrice({
  product,
  className,
  size = 'md',
  showSavings = true,
  showBadge = true
}: EnhancedProductPriceProps) {
  const saleInfo = getSaleInfo(product)
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {/* Main Price Display */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* Current Price */}
        <Money 
          data={{
            amount: saleInfo.currentPrice.toString(),
            currencyCode: product.priceRange.minVariantPrice.currencyCode
          }}
          className={cn('font-mono font-semibold', sizeClasses[size])}
          withoutTrailingZeros 
        />
        
        {/* Original Price (crossed out) */}
        {saleInfo.isOnSale && saleInfo.originalPrice && (
          <Money 
            data={{
              amount: saleInfo.originalPrice.toString(),
              currencyCode: product.priceRange.minVariantPrice.currencyCode
            }}
            className={cn(
              'font-mono text-gray-400 line-through decoration-2 decoration-gray-400',
              size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
            )}
            withoutTrailingZeros
          />
        )}
        
        {/* Sale Badge */}
        {showBadge && saleInfo.isOnSale && saleInfo.discountPercentage && (
          <span className={cn(
            'px-2.5 py-1 bg-red-600 text-white font-semibold rounded-full shadow-sm',
            size === 'sm' ? 'text-xs' : 'text-xs'
          )}>
            -{saleInfo.discountPercentage}%
          </span>
        )}
      </div>
      
      {/* Savings Amount */}
      {showSavings && saleInfo.isOnSale && saleInfo.savings && saleInfo.savings > 0 && (
        <div className={cn(
          'text-emerald-600 font-mono font-semibold bg-emerald-50 px-2 py-1 rounded-sm border border-emerald-200 text-center',
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>
          Save <Money 
            data={{
              amount: saleInfo.savings.toString(),
              currencyCode: product.priceRange.minVariantPrice.currencyCode
            }}
            withoutTrailingZeros 
          />
        </div>
      )}
    </div>
  )
}

// Server-compatible version
export function EnhancedProductPriceServer({
  product,
  className,
  size = 'md',
  showSavings = true,
  showBadge = true
}: EnhancedProductPriceProps) {
  const saleInfo = getSaleInfo(product)
  
  const formatPrice = (amount: number, _currencyCode: string) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'BGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  }
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-lg'
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* Current Price */}
        <span className={cn('font-mono font-semibold', sizeClasses[size])}>
          {formatPrice(saleInfo.currentPrice, product.priceRange.minVariantPrice.currencyCode)}
        </span>
        
        {/* Original Price (crossed out) */}
        {saleInfo.isOnSale && saleInfo.originalPrice && (
          <span className={cn(
            'font-mono text-gray-400 line-through decoration-2 decoration-gray-400',
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
          )}>
            {formatPrice(saleInfo.originalPrice, product.priceRange.minVariantPrice.currencyCode)}
          </span>
        )}
        
        {/* Sale Badge */}
        {showBadge && saleInfo.isOnSale && saleInfo.discountPercentage && (
          <span className={cn(
            'px-2.5 py-1 bg-red-600 text-white font-semibold rounded-full shadow-sm',
            size === 'sm' ? 'text-xs' : 'text-xs'
          )}>
            -{saleInfo.discountPercentage}%
          </span>
        )}
      </div>
      
      {/* Savings Amount */}
      {showSavings && saleInfo.isOnSale && saleInfo.savings && saleInfo.savings > 0 && (
        <div className={cn(
          'text-emerald-600 font-mono font-semibold bg-emerald-50 px-2 py-1 rounded-sm border border-emerald-200 text-center',
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>
          Save {formatPrice(saleInfo.savings, product.priceRange.minVariantPrice.currencyCode)}
        </div>
      )}
    </div>
  )
}