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
            "absolute top-3 right-3 z-20 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
            "bg-white shadow-lg hover:shadow-xl border border-gray-200",
            isWishlisted ? "text-red-500 bg-red-50 border-red-200" : "text-gray-600 hover:text-red-500"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            className={cn(
              "w-5 h-5 transition-all",
              isWishlisted && "fill-current scale-110"
            )} 
          />
        </button>
      )}

      {/* Desktop Actions - Modern Style */}
      {size !== 'mobile' && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={cn(
                "w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 transform scale-95 hover:scale-100",
                "bg-white shadow-lg hover:shadow-xl border border-gray-200",
                isWishlisted ? "text-red-500 bg-red-50 border-red-200" : "text-gray-600 hover:text-red-500"
              )}
              aria-label={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
            >
              <Heart 
                className={cn(
                  "w-5 h-5 transition-all",
                  isWishlisted && "fill-current scale-110"
                )} 
              />
            </button>

            {/* Cart Button */}
            <button
              onClick={handleAddToCart}
              className={cn(
                "w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 transform scale-95 hover:scale-100",
                "bg-black text-white shadow-lg hover:shadow-xl hover:bg-gray-800"
              )}
              aria-label={t('addToCart')}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}