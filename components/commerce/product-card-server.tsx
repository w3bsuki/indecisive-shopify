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
    <div className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Image Section */}
      <div className="relative">
        {/* Modern Sale Badge */}
        {isOnSale && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-3 py-1.5 text-xs font-bold uppercase rounded-full shadow-lg">
            Sale
          </div>
        )}

        {/* Product Image */}
        <Link 
          href={`/products/${product.handle}`}
          className="block relative overflow-hidden"
        >
          <HydrogenImageServer
            data={product.featuredImage}
            alt={product.title}
            className="w-full h-auto object-contain"
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

        {/* Client-side Actions Overlay */}
        <ProductCardActions 
          product={product}
          sizes={sizes}
          variant="overlay"
          translations={actionTranslations}
        />
      </div>

      {/* Modern Product Info */}
      <div className="px-4 pt-3 pb-4">
        {/* Modern Color Variants Display */}
        {availableColors.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {availableColors.slice(0, 4).map((color, index) => {
              const bgColor = getColorFromName(color)
              return (
                <div
                  key={`${color}-${index}`}
                  className="w-3.5 h-3.5 rounded-full ring-2 ring-offset-1 ring-transparent hover:ring-gray-300 transition-all cursor-pointer"
                  style={{ 
                    backgroundColor: bgColor,
                    border: bgColor === '#FFFFFF' ? '1px solid #e5e7eb' : 'none'
                  }}
                  title={color}
                />
              )
            })}
            {availableColors.length > 4 && (
              <span className="text-[11px] text-gray-600 font-medium bg-gray-100 px-1.5 py-0.5 rounded-full ml-0.5">
                +{availableColors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Modern Product Title */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 text-center leading-snug mb-3 transition-colors duration-300">
          <Link 
            href={`/products/${product.handle}`} 
            className="hover:text-black block truncate"
          >
            {product.title}
          </Link>
        </h3>
        
        {/* Modern Price Section */}
        <div className="text-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl py-2.5 px-3 mt-auto">
          <ProductCardActions 
            product={product}
            sizes={sizes}
            variant="price-only"
            translations={actionTranslations}
          />
        </div>
      </div>
    </div>
  )
}