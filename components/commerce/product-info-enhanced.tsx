'use client'

import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'
import { Money, PriceRange } from './money'
import { ProductRating } from './product-rating'
import { InventoryBadge } from './inventory-badge'

interface ProductInfoEnhancedProps {
  product: ShopifyProduct
  selectedVariant?: ShopifyProductVariant
}

export function ProductInfoEnhanced({ product, selectedVariant }: ProductInfoEnhancedProps) {
  const t = useTranslations('products')
  
  const inStock = selectedVariant ? selectedVariant.availableForSale : true

  return (
    <div className="space-y-4">
      {/* Title and Price */}
      <div>
        <h1 className="text-xl md:text-3xl font-bold leading-tight">{product.title}</h1>
        
        {/* Rating */}
        <div className="mt-2">
          <ProductRating product={product} size="md" />
        </div>
        
        <div className="mt-3 flex items-center gap-3">
          <p className="text-xl md:text-2xl font-semibold">
            {selectedVariant ? (
              <Money data={selectedVariant.price} />
            ) : product.priceRange.minVariantPrice.amount === product.priceRange.maxVariantPrice.amount ? (
              <Money data={product.priceRange.minVariantPrice} />
            ) : (
              <PriceRange 
                minPrice={product.priceRange.minVariantPrice} 
                maxPrice={product.priceRange.maxVariantPrice}
              />
            )}
          </p>
          
          {/* Compare at price */}
          {selectedVariant?.compareAtPrice && (
            <p className="text-lg text-gray-500 line-through">
              <Money data={selectedVariant.compareAtPrice} />
            </p>
          )}
          
          {!inStock && (
            <Badge variant="destructive" className="text-xs">{t('soldOut')}</Badge>
          )}
        </div>
      </div>

      {/* Inventory Status */}
      <div className="flex items-center gap-3">
        <InventoryBadge product={product} variant={selectedVariant} />
      </div>

      {/* Tags */}
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