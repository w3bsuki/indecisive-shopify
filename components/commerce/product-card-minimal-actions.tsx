'use client'

import { useWishlist } from '@/hooks/use-wishlist'
import { cn } from '@/lib/utils'
import { Heart, ShoppingCart } from 'lucide-react'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { useCart } from '@/hooks/use-cart'
import { useTranslations } from 'next-intl'

interface ProductCardMinimalActionsProps {
  product: ShopifyProduct
  size?: 'default' | 'large' | 'mobile'
}

export function ProductCardMinimalActions({ 
  product, 
  size = 'default' 
}: ProductCardMinimalActionsProps) {
  const { toggleItem, isInWishlist } = useWishlist()
  const { addItem } = useCart()
  const t = useTranslations('products')
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

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    // Get the first available variant
    const firstVariant = product.variants?.edges?.[0]?.node
    if (firstVariant) {
      addItem(firstVariant.id, 1)
    }
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

      {/* Desktop Actions */}
      {size !== 'mobile' && (
        <>
          {/* Wishlist Button - Top Left */}
          <button
            onClick={handleWishlist}
            className={cn(
              "absolute top-2 left-2 z-20 w-8 h-8 flex items-center justify-center transition-all duration-200",
              "bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white",
              isWishlisted ? "text-red-500" : "text-gray-600 hover:text-red-500"
            )}
            aria-label={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
          >
            <Heart 
              className={cn(
                "w-4 h-4 transition-all",
                isWishlisted && "fill-current"
              )} 
            />
          </button>

          {/* Cart Button - Top Right */}
          <button
            onClick={handleAddToCart}
            className={cn(
              "absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center transition-all duration-200",
              "bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white",
              "text-gray-600 hover:text-black"
            )}
            aria-label={t('addToCart')}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </>
      )}
    </>
  )
}