'use client'

// import { Money as HydrogenMoney } from '@shopify/hydrogen-react'
import type { MoneyV2 } from '@shopify/hydrogen-react/storefront-api-types'
import { formatPriceForMarket, DEFAULT_MARKET } from '@/lib/shopify/markets'
// import { currencyService } from '@/lib/currency/exchange-rates'

interface MoneyProps {
  data: MoneyV2
  className?: string
  as?: React.ElementType
  withoutTrailingZeros?: boolean
  withoutCurrency?: boolean
}

/**
 * Bulgarian market-aware Money component
 * Displays prices in BGN with Bulgarian formatting
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

  // Convert price to BGN if needed, then format
  const formattedPrice = (() => {
    if (data.currencyCode === 'BGN') {
      return formatPriceForMarket(data.amount, DEFAULT_MARKET)
    }
    
    // Convert from USD/GBP/EUR to BGN
    const approximateRates: Record<string, number> = {
      'USD': 1 / 0.64, // 1.5625 (16 USD = 25 BGN)
      'GBP': 1 / 0.42, // ~2.38
      'EUR': 1 / 0.51, // ~1.96
    }
    
    const rate = approximateRates[data.currencyCode] || 1
    const convertedAmount = parseFloat(data.amount) * rate
    
    return formatPriceForMarket(convertedAmount.toString(), DEFAULT_MARKET)
  })()
  
  const Component = as || 'span'
  
  return (
    <Component className={className}>
      {withoutCurrency ? 
        new Intl.NumberFormat(DEFAULT_MARKET.locale, {
          minimumFractionDigits: withoutTrailingZeros ? 0 : 2,
          maximumFractionDigits: 2,
        }).format(parseFloat(data.amount)) : 
        formattedPrice
      }
    </Component>
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