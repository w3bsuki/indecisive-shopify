'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Heart, ShoppingBag } from 'lucide-react'
import type { ShopifyProduct, ShopifyProductVariant, ShopifyImage } from '@/lib/shopify/types'
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
  const variants = product.variants ? extractNodes<ShopifyProductVariant>(product.variants) : []
  const firstVariant = variants[0] || null
  
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
      await addItem(firstVariant!.id, 1)
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
  const images = product.images ? extractNodes<ShopifyImage>(product.images) : []
  const hoverImage = images[1] || null

  return (
    <article className={cn("group", className)}>
      <div className="space-y-3">
        <Link 
          href={`/products/${product.handle}`}
          className="block relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-50">
            {/* Sale Badge */}
            {isOnSale && discountPercentage > 0 && (
              <div className="absolute top-2 left-2 z-20">
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
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
            
            {/* Action Buttons */}
            <div className={cn(
              "absolute top-2 right-2 z-20 flex flex-col gap-1",
              "md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            )}>
              <button
                onClick={handleWishlist}
                className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all"
              >
                <Heart className={cn("w-4 h-4", isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700")} />
              </button>
              
              {product.availableForSale && firstVariant && (
                <button
                  onClick={handleQuickAdd}
                  disabled={isLoading}
                  className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Product Image */}
            {productImage?.url ? (
              <div className="relative w-full h-full">
                <Image
                  src={productImage.url}
                  alt={productImage.altText || product.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  priority={priority}
                />
                
                {hoverImage?.url && (
                  <Image
                    src={hoverImage.url}
                    alt={hoverImage.altText || product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className={cn(
                      "object-cover object-center absolute inset-0 transition-opacity duration-500",
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
          </div>
        </Link>
        
        {/* Product Info */}
        <div className="space-y-1">
          <Link href={`/products/${product.handle}`}>
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-gray-700 transition-colors">
              {product.title}
            </h3>
          </Link>
          
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-gray-900">
              {formatPrice(minPrice.amount, minPrice.currencyCode)}
            </span>
            {isOnSale && compareAtPrice && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}