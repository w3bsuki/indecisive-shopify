'use client'

// import { Money as HydrogenMoney } from '@shopify/hydrogen-react'
import type { MoneyV2 } from '@shopify/hydrogen-react/storefront-api-types'
import { formatPriceForMarket, DEFAULT_MARKET } from '@/lib/shopify/markets'
import type { Money as ShopifyMoney } from '@/lib/shopify/types'
import { currencyService } from '@/lib/currency/exchange-rates'
import { useMarket } from '@/hooks/use-market'

interface MoneyProps {
  data: MoneyV2 | ShopifyMoney | { amount?: string; currencyCode?: string; __typename?: string }
  className?: string
  as?: React.ElementType
  withoutTrailingZeros?: boolean
  withoutCurrency?: boolean
  showDualCurrency?: boolean
}

/**
 * Bulgarian market-aware Money component
 * Displays prices in BGN with EUR conversion for Bulgarian locale (new EU law requirement)
 */
export function Money({ 
  data, 
  className,
  as = 'span',
  withoutTrailingZeros = true,
  withoutCurrency = false,
  showDualCurrency = false
}: MoneyProps) {
  const { market } = useMarket()

  if (!data || !data.amount) {
    return null
  }

  // Convert price to BGN if needed, then format
  const bgnPrice = (() => {
    if ((data.currencyCode || 'USD') === 'BGN') {
      return formatPriceForMarket(data.amount || '0', DEFAULT_MARKET)
    }
    
    // Convert from USD/GBP/EUR to BGN
    const approximateRates: Record<string, number> = {
      'USD': 1 / 0.64, // 1.5625 (16 USD = 25 BGN)
      'GBP': 1 / 0.42, // ~2.38
      'EUR': 1 / 0.51, // ~1.96
    }
    
    const rate = approximateRates[data.currencyCode || 'USD'] || 1
    const convertedAmount = parseFloat(data.amount || '0') * rate
    
    return formatPriceForMarket(convertedAmount.toString(), DEFAULT_MARKET)
  })()

  // Calculate EUR equivalent for Bulgarian locale
  const eurPrice = (() => {
    const bgnAmount = (data.currencyCode || 'USD') === 'BGN' 
      ? parseFloat(data.amount || '0')
      : parseFloat(data.amount || '0') * (
          data.currencyCode === 'USD' ? (1 / 0.64) : 
          data.currencyCode === 'GBP' ? (1 / 0.42) : 
          data.currencyCode === 'EUR' ? (1 / 0.51) : 1
        )
    
    // BGN to EUR conversion rate (approximately 0.51)
    const eurAmount = bgnAmount * 0.51
    return currencyService.formatCurrency(eurAmount, 'EUR', 'de-DE')
  })()
  
  const Component = as || 'span'
  
  // Show dual currency for Bulgarian market only
  const shouldShowDualCurrency = showDualCurrency && market.countryCode === 'BG'
  
  if (shouldShowDualCurrency) {
    return (
      <Component className={className}>
        <span className="font-semibold">{bgnPrice}</span>
        <span className="text-muted-foreground text-sm ml-2">({eurPrice})</span>
      </Component>
    )
  }

  return (
    <Component className={className}>
      {withoutCurrency ? 
        new Intl.NumberFormat(DEFAULT_MARKET.locale, {
          minimumFractionDigits: withoutTrailingZeros ? 0 : 2,
          maximumFractionDigits: 2,
        }).format(parseFloat(data.amount || '0')) : 
        bgnPrice
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
  className,
  showDualCurrency = false
}: {
  minPrice: MoneyV2 | ShopifyMoney | { amount?: string; currencyCode?: string; __typename?: string }
  maxPrice: MoneyV2 | ShopifyMoney | { amount?: string; currencyCode?: string; __typename?: string }
  className?: string
  showDualCurrency?: boolean
}) {
  const isSamePrice = (minPrice.amount || '0') === (maxPrice.amount || '0') && 
    (minPrice.currencyCode || 'USD') === (maxPrice.currencyCode || 'USD')

  if (isSamePrice) {
    return <Money data={minPrice} className={className} showDualCurrency={showDualCurrency} />
  }

  return (
    <span className={className}>
      <Money data={minPrice} showDualCurrency={showDualCurrency} /> - <Money data={maxPrice} showDualCurrency={showDualCurrency} />
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
  compareClassName,
  showDualCurrency = false
}: {
  price: MoneyV2
  compareAtPrice?: MoneyV2 | null
  className?: string
  compareClassName?: string
  showDualCurrency?: boolean
}) {
  const hasComparePrice = compareAtPrice && 
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount)

  if (!hasComparePrice) {
    return <Money data={price} className={className} showDualCurrency={showDualCurrency} />
  }

  return (
    <div className="flex items-center gap-2">
      <Money data={price} className={className} showDualCurrency={showDualCurrency} />
      <Money 
        data={compareAtPrice} 
        className={compareClassName || "line-through text-muted-foreground"} 
        showDualCurrency={showDualCurrency}
      />
    </div>
  )
}