'use client'

import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'
import { useTranslations } from 'next-intl'
import { Money } from './money'
import { ProductRating } from './product-rating'

interface ProductInfoCompactProps {
  product: ShopifyProduct
  selectedVariant?: ShopifyProductVariant
}

export function ProductInfoCompact({ product, selectedVariant }: ProductInfoCompactProps) {
  const t = useTranslations('products')
  const tc = useTranslations('common')
  
  const inStock = selectedVariant ? selectedVariant.availableForSale : true

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900">{product.title}</h1>
        <ProductRating product={product} size="sm" />
      </div>

      {/* Price and Stock in clean card */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              {selectedVariant ? (
                <Money data={selectedVariant.price} />
              ) : product.priceRange.minVariantPrice.amount === product.priceRange.maxVariantPrice.amount ? (
                <Money data={product.priceRange.minVariantPrice} />
              ) : (
                <>
                  <span className="text-sm text-gray-600 font-normal">from </span>
                  <Money data={product.priceRange.minVariantPrice} />
                </>
              )}
            </p>
            {/* Compare at price */}
            {selectedVariant?.compareAtPrice && (
              <p className="text-base text-gray-500 line-through mt-1">
                <Money data={selectedVariant.compareAtPrice} />
              </p>
            )}
          </div>
          
          {/* Stock status */}
          {inStock ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>{tc('inStock')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-medium">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span>{t('soldOut')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}