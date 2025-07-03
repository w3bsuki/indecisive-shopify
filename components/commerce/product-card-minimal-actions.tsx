'use client'

import { useWishlist } from '@/hooks/use-wishlist'
import { cn } from '@/lib/utils'
import { QuickViewDialog } from './quick-view-dialog'
import { Heart, Eye } from 'lucide-react'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface ProductCardMinimalActionsProps {
  product: ShopifyProduct
  size?: 'default' | 'large' | 'mobile'
}

export function ProductCardMinimalActions({ 
  product, 
  size = 'default' 
}: ProductCardMinimalActionsProps) {
  const { toggleItem, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product.id)

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

  return (
    <>
      {/* Mobile Wishlist Heart */}
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

      {/* Desktop Hover Overlay - Using parent group hover */}
      {size !== 'mobile' && (
        <div className={cn(
          "absolute inset-0 bg-black/0 transition-all duration-300 hidden md:flex items-center justify-center gap-3 pointer-events-none z-10",
          "group-hover:bg-black/20"
        )}>
          {/* Quick View */}
          <QuickViewDialog product={product}>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className={cn(
                "w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-300 pointer-events-auto",
                "opacity-0 translate-y-2",
                "group-hover:opacity-100 group-hover:translate-y-0"
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
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 pointer-events-auto",
              "opacity-0 translate-y-2",
              "group-hover:opacity-100 group-hover:translate-y-0 group-hover:delay-75",
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
      )}
    </>
  )
}