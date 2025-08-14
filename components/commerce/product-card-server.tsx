import Link from 'next/link'
import type { ShopifyProduct, ShopifyProductVariant, ShopifyImage } from '@/lib/shopify/types'
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
  
  // Safety check for product data
  if (!product || typeof product === 'string') {
    return null
  }
  
  const isOnSale = product.compareAtPriceRange && 
    parseFloat(product.compareAtPriceRange.maxVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount)

  // Extract sizes from variants using flattenConnection - with safety check
  const variants = product.variants ? extractNodes(product.variants) : []
  const sizes = (variants as ShopifyProductVariant[])
    ?.filter((variant: ShopifyProductVariant) => variant.availableForSale)
    ?.map((variant: ShopifyProductVariant) => ({
      id: variant.id,
      size: variant.title,
      available: variant.availableForSale
    })) || []

  // Get second image for subtle hover effect using flattenConnection - with safety check
  const productImages = product.images ? extractNodes(product.images) : []
  const secondImage = (productImages as ShopifyImage[]).length > 1 ? (productImages as ShopifyImage[])[1] : null

  return (
    <div className="group relative bg-white border border-gray-100 hover:border-gray-200 transition-all duration-200">
      {/* Product Image Container with Floating Actions */}
      <div className="relative">
        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-2 left-2 z-10 bg-black text-white px-2 py-1 text-xs font-bold font-mono">
            SALE
          </div>
        )}

        {/* Product Image with Hydrogen React */}
        <Link 
          href={`/products/${product.handle}`}
          className="block relative aspect-square overflow-hidden group"
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
                data={secondImage as ShopifyImage}
                alt={`${product.title} - view 2`}
              />
            </div>
          )}
        </Link>

      </div>

      {/* Product Information - Simplified */}
      <div className="p-3">
        {/* Action Buttons - Centered Above Title */}
        <div className="flex justify-center items-center gap-4 mb-2">
          <ProductCardActions 
            product={product}
            sizes={sizes}
            variant="wishlist-only"
            translations={{
              addToWishlist: t('addToWishlist'),
              removeFromWishlist: t('removeFromWishlist'),
              addToCart: t('addToCart'),
              addingToCart: t('addingToCart'),
              selectSize: t('selectSize'),
              viewProduct: t('viewProduct')
            }}
          />
          
          <ProductCardActions 
            product={product}
            sizes={sizes}
            variant="cart-only"
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
        
        <div className="space-y-2">
          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-medium text-gray-900 text-center">
            <Link 
              href={`/products/${product.handle}`} 
              className="hover:text-black transition-colors duration-200 block truncate"
            >
              {product.title}
            </Link>
          </h3>

          {/* Price - Centered */}
          <ProductCardActions 
            product={product}
            sizes={sizes}
            variant="price-only"
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