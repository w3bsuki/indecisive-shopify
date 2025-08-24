import Link from 'next/link'
import type { ShopifyProduct, ShopifyProductVariant, ShopifyImage } from '@/lib/shopify/types'
import { getTranslations } from 'next-intl/server'
import { ProductCardActions } from './product-card-actions'
import { HydrogenImageServer } from './hydrogen-image'
import { extractNodes } from '@/lib/shopify/flatten-connection'
import { getProductColors, getColorFromName } from '@/lib/utils/product'

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
  
  // Extract color variants for display
  const availableColors = getProductColors(product)

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
    <div className="group relative bg-white rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-200 overflow-hidden">
      {/* Image Section */}
      <div className="relative aspect-square bg-gray-50">
        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-3 left-3 z-20 bg-red-500 text-white px-2.5 py-1 text-xs font-bold rounded-full">
            SALE
          </div>
        )}

        {/* Product Image */}
        <Link 
          href={`/products/${product.handle}`}
          className="block relative w-full h-full"
        >
          <HydrogenImageServer
            data={product.featuredImage}
            alt={product.title}
            className="w-full h-full object-contain"
          />
          
          {/* Hover Image */}
          {secondImage && (
            <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
              <HydrogenImageServer
                data={secondImage}
                alt={`${product.title} - view 2`}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </Link>

      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Action Buttons and Color Variants Row */}
        <div className="flex items-center justify-between mb-3 gap-2">
          {/* Wishlist Button - Left */}
          <ProductCardActions 
            product={product}
            sizes={sizes}
            variant="wishlist-only"
            translations={actionTranslations}
          />
          
          {/* Color Variants - Center */}
          <div className="flex-1 flex items-center justify-center gap-1.5">
            {availableColors.length > 0 ? (
              <>
                {availableColors.slice(0, 4).map((color, index) => {
                  const bgColor = getColorFromName(color)
                  return (
                    <div
                      key={`${color}-${index}`}
                      className="w-3 h-3 rounded-full ring-1 ring-gray-200"
                      style={{ 
                        backgroundColor: bgColor
                      }}
                      title={color}
                    />
                  )
                })}
                {availableColors.length > 4 && (
                  <span className="text-[10px] text-gray-500 font-medium">
                    +{availableColors.length - 4}
                  </span>
                )}
              </>
            ) : (
              <div className="h-3" />
            )}
          </div>
          
          {/* Cart Button - Right */}
          <ProductCardActions 
            product={product}
            sizes={sizes}
            variant="cart-icon-only"
            translations={actionTranslations}
          />
        </div>

        <h3 className="text-sm font-medium text-gray-800 text-center mb-2">
          <Link 
            href={`/products/${product.handle}`} 
            className="hover:text-black transition-colors duration-200 line-clamp-2"
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