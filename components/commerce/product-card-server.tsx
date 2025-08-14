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
  
  if (!product || typeof product === 'string') return null
  
  const isOnSale = product.compareAtPriceRange && 
    parseFloat(product.compareAtPriceRange.maxVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount)

  // Extract data
  const variants = product.variants ? extractNodes(product.variants) : []
  const sizes = (variants as ShopifyProductVariant[])
    ?.filter((v: ShopifyProductVariant) => v.availableForSale)
    ?.map((v: ShopifyProductVariant) => ({
      id: v.id,
      size: v.title,
      available: v.availableForSale
    })) || []

  const productImages = product.images ? extractNodes(product.images) : []
  const secondImage = productImages.length > 1 ? productImages[1] as ShopifyImage : null

  // Common translations
  const actionTranslations = {
    addToWishlist: t('addToWishlist'),
    removeFromWishlist: t('removeFromWishlist'),
    addToCart: t('addToCart'),
    addingToCart: t('addingToCart'),
    selectSize: t('selectSize'),
    viewProduct: t('viewProduct')
  }

  return (
    <div className="group relative bg-white border border-gray-100 hover:border-gray-200 transition-all duration-200">
      {/* Image Section */}
      <div className="relative">
        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-2 left-2 z-10 bg-black text-white px-2 py-1 text-xs font-bold font-mono">
            SALE
          </div>
        )}

        {/* Product Image */}
        <Link 
          href={`/products/${product.handle}`}
          className="block relative aspect-square overflow-hidden pt-4"
        >
          <HydrogenImageServer
            data={product.featuredImage}
            alt={product.title}
            className="transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Hover Image */}
          {secondImage && (
            <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
              <HydrogenImageServer
                data={secondImage}
                alt={`${product.title} - view 2`}
                className="object-contain"
              />
            </div>
          )}
        </Link>

        {/* Wishlist Button - Top Left */}
        <div className="absolute top-2 left-2 z-10">
          <ProductCardActions 
            product={product}
            sizes={sizes}
            variant="wishlist-only"
            translations={actionTranslations}
          />
        </div>
        
        {/* Cart Button - Top Right */}
        <div className="absolute top-2 right-2 z-10">
          <ProductCardActions 
            product={product}
            sizes={sizes}
            variant="cart-icon-only"
            translations={actionTranslations}
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="px-2 pt-1 pb-2">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 text-center leading-tight mb-1">
          <Link 
            href={`/products/${product.handle}`} 
            className="hover:text-black transition-colors duration-200 block truncate"
          >
            {product.title}
          </Link>
        </h3>
        
        <ProductCardActions 
          product={product}
          sizes={sizes}
          variant="price-only"
          translations={actionTranslations}
        />
      </div>
    </div>
  )
}