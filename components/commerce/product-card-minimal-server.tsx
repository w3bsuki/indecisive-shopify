import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { formatPriceServer } from '@/lib/shopify/server-market'
import { cn } from '@/lib/utils'
import { parsePriceString, isProductOnSale } from '@/lib/utils/price'
import { ProductCardMinimalActions } from './product-card-minimal-actions'

interface ProductCardMinimalServerProps {
  product: ShopifyProduct
  priority?: boolean
  size?: 'default' | 'large' | 'mobile'
}

export async function ProductCardMinimalServer({ 
  product, 
  priority = false, 
  size = 'default' 
}: ProductCardMinimalServerProps) {
  // Server-side price formatting
  const rawPrice = await formatPriceServer(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode
  )
  
  // Split price and currency for display
  const { number: priceNumber, currency } = parsePriceString(rawPrice)

  const comparePrice = product.compareAtPriceRange?.maxVariantPrice
    ? await formatPriceServer(
        product.compareAtPriceRange.maxVariantPrice.amount,
        product.compareAtPriceRange.maxVariantPrice.currencyCode
      )
    : null

  const isOnSale = isProductOnSale(rawPrice, comparePrice)

  return (
    <div 
      className={cn(
        "group relative bg-white",
        size === 'large' && 'min-w-[280px] md:min-w-[320px]',
        size === 'mobile' && 'w-full'
      )}
    >
      {/* Sale Badge */}
      {isOnSale && (
        <div className="absolute top-2 left-2 z-20 bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase">
          Sale
        </div>
      )}

      {/* Product Image */}
      <Link 
        href={`/products/${product.handle}`}
        className={cn(
          "block relative overflow-hidden bg-gray-50",
          size === 'large' ? 'aspect-square' : 'aspect-square md:aspect-[4/5]'
        )}
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes={
              size === 'mobile' 
                ? "(max-width: 768px) 50vw, 25vw" 
                : size === 'large' 
                ? "(max-width: 768px) 80vw, 40vw" 
                : "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            }
            priority={priority}
            className="object-cover transition-all duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
            <div className="text-center">
              <div className="text-2xl mb-1">👕</div>
              <div className="text-xs">No image</div>
            </div>
          </div>
        )}
      </Link>

      {/* Client-side Actions Overlay */}
      <ProductCardMinimalActions 
        product={product} 
        size={size}
      />

      {/* Product Information */}
      <div className={cn(
        size === 'mobile' ? "pt-2" : "pt-3",
        size === 'large' && 'px-2'
      )}>
        {/* Product Title */}
        <h3 className={cn(
          "font-medium line-clamp-1 text-gray-900 text-center",
          size === 'mobile' ? "text-xs" : "text-sm"
        )}>
          <Link 
            href={`/products/${product.handle}`} 
            className="hover:text-black transition-colors duration-200"
          >
            {product.title}
          </Link>
        </h3>
        
        {/* Price */}
        <div className={cn(
          "text-center",
          size === 'mobile' ? "mt-1" : "mt-2"
        )} style={{ fontFamily: 'var(--font-mono)' }}>
          {currency === 'лв' ? (
            <span className={cn(
              "font-normal tracking-tight text-black",
              size === 'mobile' ? "text-xs" : "text-sm"
            )}>
              {priceNumber} <span className={size === 'mobile' ? "text-[8px]" : "text-[10px]"}>{currency}</span>
            </span>
          ) : (
            <span className={cn(
              "font-normal tracking-tight text-black",
              size === 'mobile' ? "text-xs" : "text-sm"
            )}>
              {rawPrice}
            </span>
          )}
          {isOnSale && comparePrice && (
            <span className={cn(
              "ml-2 line-through text-gray-400",
              size === 'mobile' ? "text-[10px]" : "text-xs"
            )}>
              {comparePrice}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}