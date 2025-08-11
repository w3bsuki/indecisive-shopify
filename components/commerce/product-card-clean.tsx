'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
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
  const [imageLoading, setImageLoading] = useState(true)
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
      await addItem(firstVariant.id, 1)
      toast.success(`${product.title} added to cart`)
    } catch (error) {
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
  const hoverImage = images[1] || productImage

  return (
    <article className={cn("group relative", className)}>
      <Link 
        href={`/products/${product.handle}`}
        className="block space-y-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden rounded-lg">
          {/* Sale Badge */}
          {isOnSale && discountPercentage > 0 && (
            <div className="absolute top-3 left-3 z-20">
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded">
                -{discountPercentage}%
              </span>
            </div>
          )}
          
          {/* Out of Stock Overlay */}
          {!product.availableForSale && (
            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-900">SOLD OUT</span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className={cn(
            "absolute top-3 right-3 z-20 flex flex-col gap-2 transition-all duration-300",
            isHovered ? "opacity-100" : "opacity-0 md:opacity-0"
          )}>
            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={cn(
                "p-2 bg-white rounded-full shadow-sm transition-all duration-200",
                "hover:shadow-md hover:scale-110",
                isWishlisted ? "text-red-500" : "text-gray-600 hover:text-gray-900"
              )}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart 
                className="h-4 w-4" 
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </button>
            
            {/* Quick View Button - Desktop */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // Quick view functionality
              }}
              className={cn(
                "p-2 bg-white rounded-full shadow-sm transition-all duration-200",
                "hover:shadow-md hover:scale-110 text-gray-600 hover:text-gray-900",
                "hidden md:block"
              )}
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
          
          {/* Product Images */}
          {productImage?.url ? (
            <>
              {/* Main Image */}
              <div className={cn(
                "absolute inset-0 transition-opacity duration-300",
                isHovered && hoverImage ? "opacity-0" : "opacity-100"
              )}>
                <Image
                  src={productImage.url}
                  alt={productImage.altText || product.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={cn(
                    "object-cover",
                    imageLoading && "blur-sm"
                  )}
                  priority={priority}
                  onLoad={() => setImageLoading(false)}
                />
              </div>
              
              {/* Hover Image */}
              {hoverImage && hoverImage !== productImage && (
                <div className={cn(
                  "absolute inset-0 transition-opacity duration-300",
                  isHovered ? "opacity-100" : "opacity-0"
                )}>
                  <Image
                    src={hoverImage.url}
                    alt={hoverImage.altText || product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <ShoppingBag className="h-12 w-12 text-gray-300" />
            </div>
          )}
          
          {/* Quick Add Button - Desktop Hover */}
          <div className={cn(
            "absolute inset-x-4 bottom-4 transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
            "hidden md:block"
          )}>
            <button
              onClick={handleQuickAdd}
              className={cn(
                "w-full bg-white text-gray-900 py-3 px-4 rounded-lg",
                "font-medium text-sm shadow-lg",
                "transition-all duration-200",
                "hover:bg-gray-50",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              disabled={!product.availableForSale || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  Adding...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  {product.availableForSale ? 'Add to Cart' : 'Out of Stock'}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="space-y-1">
          {/* Title */}
          <h3 className="font-medium text-gray-900 line-clamp-1 text-sm">
            {product.title}
          </h3>
          
          {/* Vendor/Category - if available */}
          {product.vendor && product.vendor !== 'Default Vendor' && (
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {product.vendor}
            </p>
          )}
          
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
                <span className="text-xs text-red-500 font-medium">
                  Save {discountPercentage}%
                </span>
              </>
            )}
          </div>
          
          {/* Stock Status - Mobile Only */}
          {!product.availableForSale && (
            <p className="text-xs text-red-500 font-medium md:hidden">
              Out of Stock
            </p>
          )}
        </div>
      </Link>
      
      {/* Mobile Quick Add Button */}
      <button
        onClick={handleQuickAdd}
        className={cn(
          "mt-3 w-full bg-gray-900 text-white py-3 px-4 rounded-lg",
          "flex items-center justify-center gap-2 font-medium text-sm",
          "transition-all duration-200",
          "hover:bg-gray-800 active:scale-95",
          "md:hidden",
          "disabled:bg-gray-300 disabled:cursor-not-allowed"
        )}
        disabled={!product.availableForSale || isLoading}
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" />
            {product.availableForSale ? 'Add to Cart' : 'Out of Stock'}
          </>
        )}
      </button>
    </article>
  )
}