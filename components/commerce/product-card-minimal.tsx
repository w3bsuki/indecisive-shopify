'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PrefetchLink } from './prefetch-link'
import Image from 'next/image'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { useWishlist } from '@/hooks/use-wishlist'
import { cn } from '@/lib/utils'
import { QuickViewDialog } from './quick-view-dialog'
import { Money, SalePrice } from '@/components/commerce/money'
import { Heart, Eye } from 'lucide-react'
import { getProductColors, getColorFromName } from '@/lib/utils/product'

interface ProductCardMinimalProps {
  product: ShopifyProduct
  priority?: boolean
  size?: 'default' | 'large' | 'mobile'
}

export function ProductCardMinimal({ product, priority = false, size = 'default' }: ProductCardMinimalProps) {
  const { toggleItem, isInWishlist } = useWishlist()
  const [imageLoading, setImageLoading] = useState(true)
  const [showOverlay, setShowOverlay] = useState(false)
  const isWishlisted = isInWishlist(product.id)

  const price = product.priceRange.minVariantPrice
  const compareAtPrice = product.compareAtPriceRange?.maxVariantPrice || null
  
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount)

  // Extract color variants for display
  const availableColors = getProductColors(product)

  const handleWishlist = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    toggleItem({
      id: product.id,
      handle: product.handle,
      title: product.title,
      image: product.featuredImage?.url,
      price: product.priceRange.minVariantPrice.amount
    })
  }

  const imageContent = (
    <>
      {product.featuredImage && (
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
          className="object-cover mt-4 transition-all duration-500 group-hover:scale-105"
          onLoad={() => setImageLoading(false)}
        />
      )}
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      {!product.featuredImage && (
        <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
          <div className="text-center">
            <div className="text-2xl mb-1">👕</div>
            <div className="text-xs">No image</div>
          </div>
        </div>
      )}
    </>
  )

  return (
    <div 
      className={cn(
        "group relative bg-white",
        size === 'large' && 'min-w-[280px] md:min-w-[320px]',
        size === 'mobile' && 'w-full'
      )}
      onMouseEnter={() => size !== 'mobile' && setShowOverlay(true)}
      onMouseLeave={() => size !== 'mobile' && setShowOverlay(false)}
    >
      {/* Sale Badge */}
      {isOnSale && (
        <div className="absolute top-2 left-2 z-20 bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase">
          Sale
        </div>
      )}

      {/* Mobile Wishlist Heart - Optional */}
      {size === 'mobile' && (
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center rounded-full transition-colors",
            "bg-white/90 backdrop-blur-sm shadow-sm",
            isWishlisted ? "text-red-500" : "text-gray-600"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            className={cn(
              "w-4 h-4",
              isWishlisted && "fill-current"
            )} 
          />
        </button>
      )}

      {/* Product Image */}
      <PrefetchLink 
        href={`/products/${product.handle}`}
        className={cn(
          "block relative overflow-hidden flex items-end",
          size === 'large' ? 'aspect-square' : 'aspect-square md:aspect-[4/5]'
        )}
      >
        {imageContent}
        
        {/* Desktop Hover Overlay */}
        <div className={cn(
          "absolute inset-0 bg-black/0 transition-all duration-300 hidden md:flex items-center justify-center gap-3",
          showOverlay && "bg-black/20"
        )}>
          {/* Quick View */}
          <QuickViewDialog product={product}>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className={cn(
                "w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-300",
                "opacity-0 translate-y-2",
                showOverlay && "opacity-100 translate-y-0"
              )}
              aria-label="Quick view"
            >
              <Eye className="w-5 h-5 text-black" />
            </button>
          </QuickViewDialog>
          
          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
              "opacity-0 translate-y-2",
              showOverlay && "opacity-100 translate-y-0 delay-75",
              isWishlisted ? "bg-red-500 text-white" : "bg-white text-black"
            )}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={cn(
                "w-5 h-5",
                isWishlisted && "fill-current"
              )} 
            />
          </button>
        </div>
      </PrefetchLink>

      {/* Product Information */}
      <div className={cn(
        size === 'mobile' ? "pt-2" : "pt-3",
        size === 'large' && 'px-2'
      )}>
        {/* Color Variants Display - Above Title */}
        {availableColors.length > 0 && (
          <div className="flex items-center justify-center gap-1 mb-2">
            {availableColors.slice(0, 4).map((color, index) => {
              const bgColor = getColorFromName(color)
              return (
                <div
                  key={`${color}-${index}`}
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: bgColor,
                    border: bgColor === '#FFFFFF' ? '1px solid #ccc' : 'none'
                  }}
                  title={color}
                />
              )
            })}
            {availableColors.length > 4 && (
              <span className="text-[10px] text-gray-500 ml-1">
                +{availableColors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Product Title */}
        <h3 className={cn(
          "font-medium line-clamp-1 text-gray-900 text-center",
          size === 'mobile' ? "text-xs mb-1" : "text-sm mb-2"
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
          {isOnSale ? (
            <SalePrice 
              price={price as any}
              compareAtPrice={compareAtPrice as any}
              className={cn(
                "font-normal tracking-tight text-black",
                size === 'mobile' ? "text-xs" : "text-sm"
              )}
              compareClassName={cn(
                "line-through text-gray-400",
                size === 'mobile' ? "text-[10px]" : "text-xs"
              )}
            />
          ) : (
            <Money 
              data={price as any} 
              className={cn(
                "font-normal tracking-tight text-black",
                size === 'mobile' ? "text-xs" : "text-sm"
              )}
            />
          )}
        </div>
      </div>
    </div>
  )
}