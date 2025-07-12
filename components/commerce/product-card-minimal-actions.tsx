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
          {/* Add to Cart Button - Inside Image */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-3">
            <button
              onClick={handleAddToCart}
              className={cn(
                "w-full bg-black text-white py-2.5 px-3 font-mono text-xs font-medium transition-all duration-300 hover:bg-gray-800",
                "opacity-0 translate-y-2",
                "group-hover:opacity-100 group-hover:translate-y-0"
              )}
              aria-label={t('addToCart')}
            >
              <div className="flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                {t('addToCart')}
              </div>
            </button>
          </div>

          {/* Wishlist Heart */}
          <button
            onClick={handleWishlist}
            className={cn(
              "absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center transition-all duration-300",
              "opacity-0",
              "group-hover:opacity-100",
              isWishlisted ? "text-red-500 bg-white rounded-full" : "text-white drop-shadow-md"
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
        </>
      )}
    </>
  )
}