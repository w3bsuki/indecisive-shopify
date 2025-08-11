'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { useCart } from '@/hooks/use-cart'
import { useWishlist } from '@/hooks/use-wishlist'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Money } from '@/components/commerce/money'
import { QuickViewDialog } from './quick-view-dialog'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useFlyToCart } from '@/contexts/fly-to-cart-context'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ProductCardProps {
  product: ShopifyProduct
  priority?: boolean
  showRating?: boolean
}

export function ProductCardRefined({ 
  product, 
  priority = false,
  showRating = true 
}: ProductCardProps) {
  const { addItem, cartReady } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(false)
  const [showSizeSelector, setShowSizeSelector] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const isWishlisted = isInWishlist(product.id)
  const t = useTranslations('products')
  const { flyToCart } = useFlyToCart()
  const productImageRef = useRef<HTMLDivElement>(null)

  const price = product.priceRange.minVariantPrice
  const compareAtPrice = product.compareAtPriceRange?.maxVariantPrice || null
  
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount)
  const discountPercent = isOnSale 
    ? Math.round(((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) / parseFloat(compareAtPrice.amount)) * 100)
    : 0

  // Mock rating data (in real app, this would come from reviews)
  const rating = 4.3
  const reviewCount = 127

  // Extract sizes from variants
  const sizes = product.variants?.edges
    ?.map(edge => edge.node)
    ?.filter(variant => variant.availableForSale)
    ?.map(variant => ({
      id: variant.id,
      size: variant.title,
      available: variant.availableForSale
    })) || []

  const handleAddToCart = useCallback(async (variantId?: string) => {
    if (!cartReady || isLoading) return

    if (!variantId && sizes.length > 1) {
      setShowSizeSelector(true)
      return
    }

    const variant = variantId || product.variants?.edges?.[0]?.node.id
    if (!variant) return

    setIsLoading(true)
    
    if (product.featuredImage?.url && productImageRef.current && !isMobile) {
      flyToCart({
        imageUrl: product.featuredImage.url,
        elementRef: productImageRef.current
      })
    }
    
    await addItem(variant, 1)
    
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }
    
    setTimeout(() => {
      setIsLoading(false)
      setShowSizeSelector(false)
      setSelectedSize(null)
    }, 300)
  }, [cartReady, isLoading, sizes.length, product.variants?.edges, addItem, flyToCart, product.featuredImage?.url, isMobile])

  const handleWishlist = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    toggleItem({
      id: product.id,
      handle: product.handle,
      title: product.title,
      image: product.featuredImage?.url,
      price: product.priceRange.minVariantPrice.amount
    })

    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(30)
    }
  }, [toggleItem, product, isMobile])

  const imageContent = (
    <>
      {product.featuredImage && !imageError ? (
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          priority={priority}
          className={cn(
            "object-cover transition-transform duration-700 group-hover:scale-105",
            imageLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
        </div>
      )}
      {imageLoading && !imageError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </>
  )

  return (
    <>
      <div className="group relative">
        {/* Sale Badge - Clean style */}
        {isOnSale && discountPercent >= 15 && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 text-xs font-semibold">
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 rounded-full",
            "flex items-center justify-center transition-all duration-200",
            "hover:bg-white hover:shadow-md",
            !isMobile && !isWishlisted && "opacity-0 group-hover:opacity-100"
          )}
          aria-label={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
        >
          <Heart 
            className={cn(
              "w-4 h-4 transition-colors",
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
            )} 
          />
        </button>

        {/* Product Image */}
        {isMobile ? (
          <Link 
            href={`/products/${product.handle}`}
            className="block relative aspect-[3/4] overflow-hidden bg-gray-50"
          >
            <div ref={productImageRef}>
              {imageContent}
            </div>
          </Link>
        ) : (
          <QuickViewDialog product={product}>
            <div ref={productImageRef} className="relative aspect-[3/4] overflow-hidden cursor-pointer bg-gray-50">
              {imageContent}
              
              {/* Subtle hover overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors duration-300" />
            </div>
          </QuickViewDialog>
        )}

        {/* Product Information */}
        <div className="pt-3 space-y-2">
          {/* Title */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-black transition-colors">
            <Link href={`/products/${product.handle}`}>
              {product.title}
            </Link>
          </h3>

          {/* Rating */}
          {showRating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3.5 h-3.5",
                      i < Math.floor(rating) 
                        ? "fill-gray-900 text-gray-900" 
                        : i < rating
                        ? "fill-gray-400 text-gray-900"
                        : "fill-gray-200 text-gray-200"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <Money 
              data={price} 
              className="text-base font-semibold text-gray-900"
            />
            {isOnSale && compareAtPrice && (
              <Money 
                data={compareAtPrice} 
                className="text-sm text-gray-500 line-through"
              />
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => handleAddToCart()}
            disabled={isLoading || !product.variants?.edges?.[0]?.node.availableForSale || !cartReady}
            className={cn(
              "w-full h-10 flex items-center justify-center gap-2",
              "text-sm font-medium transition-all duration-200",
              "border border-gray-900 hover:bg-gray-900 hover:text-white",
              isLoading || !product.variants?.edges?.[0]?.node.availableForSale || !cartReady
                ? "opacity-50 cursor-not-allowed"
                : ""
            )}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
            ) : !product.variants?.edges?.[0]?.node.availableForSale ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Size Selector Modal */}
      <Dialog open={showSizeSelector} onOpenChange={setShowSizeSelector}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('selectSize')}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {sizes.map((size) => (
              <button
                key={size.id}
                className={cn(
                  "min-h-[48px] px-3 py-2 border transition-all duration-200",
                  "text-sm font-medium",
                  selectedSize === size.id 
                    ? "bg-gray-900 text-white border-gray-900" 
                    : "bg-white text-gray-900 border-gray-300 hover:border-gray-900",
                  !size.available && "opacity-50 cursor-not-allowed"
                )}
                disabled={!size.available}
                onClick={() => {
                  setSelectedSize(size.id)
                  handleAddToCart(size.id)
                }}
              >
                {size.size}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}