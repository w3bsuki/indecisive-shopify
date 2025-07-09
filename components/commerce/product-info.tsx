import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'
import { Badge } from '@/components/ui/badge'
import { getTranslations } from 'next-intl/server'
import { MoneyServer, PriceRangeServer } from './money-server'

interface ProductInfoProps {
  product: ShopifyProduct
  selectedVariant?: ShopifyProductVariant
}

export async function ProductInfo({ product, selectedVariant }: ProductInfoProps) {
  const t = await getTranslations('products')
  
  const inStock = selectedVariant ? selectedVariant.availableForSale : true

  return (
    <div className="space-y-3">
      {/* Compact title and price section for mobile */}
      <div>
        <h1 className="text-xl md:text-3xl font-bold leading-tight">{product.title}</h1>
        <div className="mt-1 flex items-center gap-3">
          <p className="text-xl md:text-2xl font-semibold">
            {selectedVariant ? (
              <MoneyServer data={selectedVariant.price} />
            ) : product.priceRange.minVariantPrice.amount === product.priceRange.maxVariantPrice.amount ? (
              <MoneyServer data={product.priceRange.minVariantPrice} />
            ) : (
              <PriceRangeServer 
                minPrice={product.priceRange.minVariantPrice} 
                maxPrice={product.priceRange.maxVariantPrice}
              />
            )}
          </p>
          {!inStock && (
            <Badge variant="destructive" className="text-xs">{t('soldOut')}</Badge>
          )}
        </div>
      </div>

      {/* Tags - smaller on mobile */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {product.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}