'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Heart, ShoppingBag } from 'lucide-react'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { useCart } from '@/hooks/use-cart'
import { extractNodes } from '@/lib/shopify/flatten-connection'
import { useMarket } from '@/hooks/use-market'
import { toast } from 'sonner'

interface ProductCardCleanProps {
  product: ShopifyProduct
  priority?: boolean
  className?: string
}

export function ProductCardClean({ product, priority = false, className }: ProductCardCleanProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem, isLoading } = useCart()
  const { formatPrice } = useMarket()
  
  // Extract first variant for quick add
  const variants = product.variants ? extractNodes(product.variants) : []
  const firstVariant = variants[0]
  
  // Price data
  const minPrice = product.priceRange.minVariantPrice
  const compareAtPrice = product.compareAtPriceRange?.maxVariantPrice
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(minPrice.amount)
  const discountPercentage = isOnSale && compareAtPrice
    ? Math.round(((parseFloat(compareAtPrice.amount) - parseFloat(minPrice.amount)) / parseFloat(compareAtPrice.amount)) * 100)
    : 0
  
  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!firstVariant) {
      toast.error('Product variant not available')
      return
    }
    
    if (!product.availableForSale) {
      toast.error('Product is out of stock')
      return
    }
    
    try {
      await addItem(firstVariant?.id, 1)
      toast.success(`${product.title} added to cart`)
    } catch {
      toast.error('Failed to add to cart')
    }
  }
  
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  // Get product images
  const productImage = product.featuredImage
  const images = product.images ? extractNodes(product.images) : []
  const hoverImage = images[1] // Only use second image if it exists

  return (
    <article className={cn("group relative", className)}>
      <div className="space-y-3">
        <Link 
          href={`/products/${product.handle}`}
          className="block relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-md">
            {/* Sale Badge */}
            {isOnSale && discountPercentage > 0 && (
              <div className="absolute top-2 left-2 z-20">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{discountPercentage}%
                </span>
              </div>
            )}
            
            {/* Out of Stock Overlay */}
            {!product.availableForSale && (
              <div className="absolute inset-0 bg-white/90 z-30 flex items-center justify-center backdrop-blur-sm">
                <span className="text-sm font-medium text-gray-900 uppercase tracking-wider">Sold Out</span>
              </div>
            )}
            
            {/* Action Buttons - Always visible on mobile, hover on desktop */}
            <div className={cn(
              "absolute top-2 right-2 z-20 flex flex-col gap-1.5 transition-all duration-200",
              "md:opacity-0 md:group-hover:opacity-100"
            )}>
              {/* Wishlist Button */}
              <button
                onClick={handleWishlist}
                className={cn(
                  "p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm transition-all duration-200",
                  "hover:bg-white hover:shadow-md hover:scale-110",
                  isWishlisted ? "text-red-500" : "text-gray-700 hover:text-gray-900"
                )}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart 
                  className="h-4 w-4" 
                  fill={isWishlisted ? "currentColor" : "none"}
                  strokeWidth={isWishlisted ? 0 : 2}
                />
              </button>
            </div>
            
            {/* Product Image */}
            {productImage?.url ? (
              <div className="relative w-full h-full">
                {/* Main Image - Always visible */}
                <Image
                  src={productImage.url}
                  alt={productImage.altText || product.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={cn(
                    "object-cover transition-transform duration-700 ease-out",
                    isHovered && hoverImage ? "scale-110" : "scale-100"
                  )}
                  priority={priority}
                />
                
                {/* Hover Image - Only if different from main image */}
                {hoverImage?.url && (
                  <Image
                    src={hoverImage.url}
                    alt={hoverImage.altText || product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className={cn(
                      "object-cover absolute inset-0 transition-opacity duration-500",
                      isHovered ? "opacity-100" : "opacity-0"
                    )}
                  />
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-gray-300" />
              </div>
            )}
            
            {/* Quick Add Button - Desktop Only */}
            <div className={cn(
              "absolute inset-x-3 bottom-3 transition-all duration-300 transform",
              "hidden md:block",
              isHovered && product.availableForSale ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            )}>
              <button
                onClick={handleQuickAdd}
                className={cn(
                  "w-full bg-white/95 backdrop-blur-sm text-gray-900 py-2.5 px-4 rounded-md",
                  "font-medium text-sm shadow-md",
                  "transition-all duration-200",
                  "hover:bg-white hover:shadow-lg",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "flex items-center justify-center gap-2"
                )}
                disabled={!product.availableForSale || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>Quick Add</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Link>
        
        {/* Product Info */}
        <div className="space-y-1 px-1">
          {/* Title */}
          <Link href={`/products/${product.handle}`} className="block">
            <h3 className="font-medium text-gray-900 text-sm hover:text-gray-700 transition-colors line-clamp-1 truncate">
              {product.title}
            </h3>
          </Link>
          
          {/* Price */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base font-semibold text-gray-900">
              {formatPrice(minPrice.amount, minPrice.currencyCode)}
            </span>
            {isOnSale && compareAtPrice && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
                </span>
                <span className="text-xs text-red-600 font-medium">
                  {discountPercentage}% off
                </span>
              </>
            )}
          </div>
          
          {/* Colors/Variants indicator */}
          {variants.length > 1 && (
            <p className="text-xs text-gray-500">
              {variants.length} colors available
            </p>
          )}
        </div>
        
        {/* Mobile Add to Cart Button */}
        <button
          onClick={handleQuickAdd}
          className={cn(
            "w-full bg-gray-900 text-white py-3 px-4 rounded-md",
            "flex items-center justify-center gap-2 font-medium text-sm",
            "transition-all duration-200",
            "hover:bg-gray-800 active:scale-[0.98]",
            "md:hidden",
            "disabled:bg-gray-300 disabled:cursor-not-allowed"
          )}
          disabled={!product.availableForSale || isLoading}
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              <span>{product.availableForSale ? 'Add to Cart' : 'Out of Stock'}</span>
            </>
          )}
        </button>
      </div>
    </article>
  )
}