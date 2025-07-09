import Link from 'next/link'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { getTranslations } from 'next-intl/server'
import { ProductCardActions } from './product-card-actions'
import { HydrogenImageServer } from './hydrogen-image'
import { extractNodes } from '@/lib/shopify/flatten-connection'

interface ProductCardServerProps {
  product: ShopifyProduct
  priority?: boolean
}

export async function ProductCardServer({ product, priority: _priority = false }: ProductCardServerProps) {
  const t = await getTranslations('products')
  
  const isOnSale = product.compareAtPriceRange && 
    parseFloat(product.compareAtPriceRange.maxVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount)

  // Extract sizes from variants using flattenConnection
  const variants = extractNodes(product.variants)
  const sizes = variants
    ?.filter(variant => variant.availableForSale)
    ?.map(variant => ({
      id: variant.id,
      size: variant.title,
      available: variant.availableForSale
    })) || []

  // Get second image for subtle hover effect using flattenConnection
  const productImages = extractNodes(product.images)
  const secondImage = productImages.length > 1 ? productImages[1] : null

  return (
    <div className="group relative bg-white border border-gray-100 hover:border-gray-200 transition-all duration-200">
      {/* Sale Badge Only */}
      {isOnSale && (
        <div className="absolute top-2 left-2 z-10 bg-black text-white px-2 py-1 text-xs font-bold font-mono">
          SALE
        </div>
      )}

      {/* Product Image with Hydrogen React */}
      <Link 
        href={`/products/${product.handle}`}
        className="block relative aspect-square overflow-hidden bg-gray-50 group"
      >
        <HydrogenImageServer
          data={product.featuredImage}
          alt={product.title}
          className="transition-transform duration-300 group-hover:scale-105"
        />

        {/* Second Image on Hover (Desktop Only) */}
        {secondImage && (
          <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <HydrogenImageServer
              data={secondImage}
              alt={`${product.title} - view 2`}
            />
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-medium line-clamp-2 leading-tight sm:leading-snug text-gray-900 text-center">
            <Link 
              href={`/products/${product.handle}`} 
              className="hover:text-black transition-colors duration-200"
            >
              {product.title}
            </Link>
          </h3>

          {/* Actions Component */}
          <ProductCardActions 
            product={product}
            sizes={sizes}
            translations={{
              addToWishlist: t('addToWishlist'),
              removeFromWishlist: t('removeFromWishlist'),
              addToCart: t('addToCart'),
              addingToCart: t('addingToCart'),
              selectSize: t('selectSize'),
              viewProduct: t('viewProduct')
            }}
          />
        </div>
      </div>
    </div>
  )
}