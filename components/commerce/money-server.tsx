import type { MoneyV2 } from '@shopify/hydrogen-react/storefront-api-types'
import type { Money as ShopifyMoney } from '@/lib/shopify/types'
import { formatPriceForMarket, DEFAULT_MARKET } from '@/lib/shopify/markets'

/**
 * Server-side Money components that don't rely on client hooks
 * These can be used in Server Components for SSR
 */

interface MoneyServerProps {
  data: ShopifyMoney | MoneyV2 | { amount?: string; currencyCode?: string; __typename?: string }
  className?: string
  showDualCurrency?: boolean
  marketCountryCode?: string
  withoutTrailingZeros?: boolean
  withoutCurrency?: boolean
}

export function MoneyServer({ 
  data, 
  className, 
  showDualCurrency = false, 
  marketCountryCode = 'BG',
  withoutTrailingZeros = true,
  withoutCurrency = false
}: MoneyServerProps) {
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
    const eurFormatter = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    return eurFormatter.format(eurAmount)
  })()
  
  // Show dual currency for Bulgarian market only
  const shouldShowDualCurrency = showDualCurrency && marketCountryCode === 'BG'
  
  if (shouldShowDualCurrency) {
    return (
      <span className={className}>
        <span className="font-semibold">{bgnPrice}</span>
        <span className="text-muted-foreground text-sm ml-2">({eurPrice})</span>
      </span>
    )
  }

  return (
    <span className={className}>
      {withoutCurrency ? 
        new Intl.NumberFormat(DEFAULT_MARKET.locale, {
          minimumFractionDigits: withoutTrailingZeros ? 0 : 2,
          maximumFractionDigits: 2,
        }).format(parseFloat(data.amount || '0')) : 
        bgnPrice
      }
    </span>
  )
}

export function PriceRangeServer({
  minPrice,
  maxPrice,
  className,
  showDualCurrency = false,
  marketCountryCode = 'BG'
}: {
  minPrice: ShopifyMoney | MoneyV2
  maxPrice: ShopifyMoney | MoneyV2
  className?: string
  showDualCurrency?: boolean
  marketCountryCode?: string
}) {
  const isSamePrice = (minPrice.amount || '0') === (maxPrice.amount || '0') && 
    (minPrice.currencyCode || 'USD') === (maxPrice.currencyCode || 'USD')

  if (isSamePrice) {
    return <MoneyServer data={minPrice} className={className} showDualCurrency={showDualCurrency} marketCountryCode={marketCountryCode} />
  }

  return (
    <span className={className}>
      <MoneyServer data={minPrice} showDualCurrency={showDualCurrency} marketCountryCode={marketCountryCode} /> - <MoneyServer data={maxPrice} showDualCurrency={showDualCurrency} marketCountryCode={marketCountryCode} />
    </span>
  )
}

export function SalePriceServer({
  price,
  compareAtPrice,
  className,
  compareClassName,
  showDualCurrency = false,
  marketCountryCode = 'BG'
}: {
  price: ShopifyMoney | MoneyV2
  compareAtPrice?: ShopifyMoney | MoneyV2 | null
  className?: string
  compareClassName?: string
  showDualCurrency?: boolean
  marketCountryCode?: string
}) {
  const hasComparePrice = compareAtPrice && 
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount)

  if (!hasComparePrice) {
    return <MoneyServer data={price} className={className} showDualCurrency={showDualCurrency} marketCountryCode={marketCountryCode} />
  }

  return (
    <div className="flex items-center gap-2">
      <MoneyServer data={price} className={className} showDualCurrency={showDualCurrency} marketCountryCode={marketCountryCode} />
      <MoneyServer 
        data={compareAtPrice} 
        className={compareClassName || "line-through text-muted-foreground"} 
        showDualCurrency={showDualCurrency} 
        marketCountryCode={marketCountryCode}
      />
    </div>
  )
}