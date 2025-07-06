import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { formatPriceServer } from '@/lib/shopify/server-market'
import { getTranslations } from 'next-intl/server'
import { ProductCardActions } from './product-card-actions'

interface ProductCardServerProps {
  product: ShopifyProduct
  priority?: boolean
}

export async function ProductCardServer({ product, priority = false }: ProductCardServerProps) {
  const t = await getTranslations('products')
  
  const rawPrice = await formatPriceServer(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode
  )
  
  const comparePrice = product.compareAtPriceRange?.maxVariantPrice
    ? await formatPriceServer(
        product.compareAtPriceRange.maxVariantPrice.amount,
        product.compareAtPriceRange.maxVariantPrice.currencyCode
      )
    : null

  const isOnSale = comparePrice && comparePrice !== rawPrice

  // Extract sizes from variants
  const sizes = product.variants?.edges
    ?.map(edge => edge.node)
    ?.filter(variant => variant.availableForSale)
    ?.map(variant => ({
      id: variant.id,
      size: variant.title,
      available: variant.availableForSale
    })) || []

  // Get second image for subtle hover effect
  const productImages = product.images?.edges?.map(edge => edge.node) || []
  const secondImage = productImages.length > 1 ? productImages[1] : null

  return (
    <div className="group relative bg-white border border-gray-100 hover:border-gray-200 transition-all duration-200">
      {/* Sale Badge Only */}
      {isOnSale && (
        <div className="absolute top-2 left-2 z-10 bg-black text-white px-2 py-1 text-xs font-bold font-mono">
          SALE
        </div>
      )}

      {/* Product Image with Subtle Hover Effect */}
      <Link 
        href={`/products/${product.handle}`}
        className="block relative aspect-square overflow-hidden bg-gray-50"
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
            <div className="text-center">
              <div className="text-2xl mb-1">👕</div>
              <div className="text-xs">{t('noImage')}</div>
            </div>
          </div>
        )}

        {/* Second Image on Hover (Desktop Only) */}
        {secondImage && (
          <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <Image
              src={secondImage.url}
              alt={secondImage.altText || `${product.title} - view 2`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-4">
        <div className="space-y-4">
          {/* Product Title */}
          <h3 className="text-sm font-medium line-clamp-2 leading-snug text-gray-900 text-center md:text-left">
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
            rawPrice={rawPrice}
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