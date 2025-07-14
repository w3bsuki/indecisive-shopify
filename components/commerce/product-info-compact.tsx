'use client'

import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'
import { Money } from './money'
import { ProductRating } from './product-rating'
import { Check } from 'lucide-react'

interface ProductInfoCompactProps {
  product: ShopifyProduct
  selectedVariant?: ShopifyProductVariant
}

export function ProductInfoCompact({ product, selectedVariant }: ProductInfoCompactProps) {
  const t = useTranslations('products')
  const tc = useTranslations('common')
  
  const inStock = selectedVariant ? selectedVariant.availableForSale : true

  return (
    <div className="space-y-3">
      {/* Title and Price in same row */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-lg md:text-2xl font-bold leading-tight flex-1">{product.title}</h1>
        <div className="text-right">
          <p className="text-lg md:text-xl font-semibold">
            {selectedVariant ? (
              <Money data={selectedVariant.price as any} />
            ) : product.priceRange.minVariantPrice.amount === product.priceRange.maxVariantPrice.amount ? (
              <Money data={product.priceRange.minVariantPrice as any} />
            ) : (
              <span className="text-base">
                <Money data={product.priceRange.minVariantPrice as any} />
              </span>
            )}
          </p>
          {/* Compare at price */}
          {selectedVariant?.compareAtPrice && (
            <p className="text-sm text-gray-500 line-through">
              <Money data={selectedVariant.compareAtPrice as any} />
            </p>
          )}
        </div>
      </div>

      {/* Rating and Stock Status in same row */}
      <div className="flex items-center justify-between">
        <ProductRating product={product} size="sm" />
        {inStock ? (
          <div className="flex items-center gap-1 text-sm text-green-600">
            <Check className="w-4 h-4" />
            <span>{tc('inStock')}</span>
          </div>
        ) : (
          <Badge variant="destructive" className="text-xs">{t('soldOut')}</Badge>
        )}
      </div>
    </div>
  )
}