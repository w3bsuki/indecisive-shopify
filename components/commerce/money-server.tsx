import type { MoneyV2 } from '@shopify/hydrogen-react/storefront-api-types'
import type { Money as ShopifyMoney } from '@/lib/shopify/types'
import { Money, PriceRange, SalePrice } from './money'

/**
 * Server-side wrapper components for Money display
 * These can be used in Server Components and will render the client Money component
 */

export function MoneyServer({ data, className }: { data: ShopifyMoney | MoneyV2, className?: string }) {
  // Convert to MoneyV2 format if needed
  const moneyData = data as MoneyV2
  return <Money data={moneyData} className={className} />
}

export function PriceRangeServer({
  minPrice,
  maxPrice,
  className
}: {
  minPrice: ShopifyMoney | MoneyV2
  maxPrice: ShopifyMoney | MoneyV2
  className?: string
}) {
  return <PriceRange minPrice={minPrice as MoneyV2} maxPrice={maxPrice as MoneyV2} className={className} />
}

export function SalePriceServer({
  price,
  compareAtPrice,
  className,
  compareClassName
}: {
  price: ShopifyMoney | MoneyV2
  compareAtPrice?: ShopifyMoney | MoneyV2 | null
  className?: string
  compareClassName?: string
}) {
  return (
    <SalePrice 
      price={price as MoneyV2} 
      compareAtPrice={compareAtPrice as MoneyV2 | null} 
      className={className}
      compareClassName={compareClassName}
    />
  )
}