'use client'

import { Money as HydrogenMoney } from '@shopify/hydrogen-react'
import type { MoneyV2 } from '@shopify/hydrogen-react/storefront-api-types'

interface MoneyProps {
  data: MoneyV2
  className?: string
  as?: React.ElementType
  withoutTrailingZeros?: boolean
  withoutCurrency?: boolean
}

/**
 * Wrapper around hydrogen-react's Money component
 * Provides automatic locale-aware currency formatting with Shopify's best practices
 */
export function Money({ 
  data, 
  className,
  as = 'span',
  withoutTrailingZeros = true,
  withoutCurrency = false
}: MoneyProps) {
  if (!data || !data.amount) {
    return null
  }

  return (
    <HydrogenMoney
      data={data}
      as={as}
      className={className}
      withoutTrailingZeros={withoutTrailingZeros}
      withoutCurrency={withoutCurrency}
    />
  )
}

/**
 * Display a price range for products with multiple variants
 */
export function PriceRange({
  minPrice,
  maxPrice,
  className
}: {
  minPrice: MoneyV2
  maxPrice: MoneyV2
  className?: string
}) {
  const isSamePrice = minPrice.amount === maxPrice.amount && 
    minPrice.currencyCode === maxPrice.currencyCode

  if (isSamePrice) {
    return <Money data={minPrice} className={className} />
  }

  return (
    <span className={className}>
      <Money data={minPrice} /> - <Money data={maxPrice} />
    </span>
  )
}

/**
 * Display compare at price with sale price
 */
export function SalePrice({
  price,
  compareAtPrice,
  className,
  compareClassName
}: {
  price: MoneyV2
  compareAtPrice?: MoneyV2 | null
  className?: string
  compareClassName?: string
}) {
  const hasComparePrice = compareAtPrice && 
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount)

  if (!hasComparePrice) {
    return <Money data={price} className={className} />
  }

  return (
    <div className="flex items-center gap-2">
      <Money data={price} className={className} />
      <Money 
        data={compareAtPrice} 
        className={compareClassName || "line-through text-muted-foreground"} 
      />
    </div>
  )
}