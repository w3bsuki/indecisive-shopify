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
import { Heart, Plus, Star, Check } from 'lucide-react'
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
}

export function ProductCardPerfect({ product, priority = false }: ProductCardProps) {
  const { addItem, cartReady } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(false)
  const [showSizeSelector, setShowSizeSelector] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)
  const [justAdded, setJustAdded] = useState(false)
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

  // Mock rating
  const rating = 4.6
  const reviewCount = 234

  // Extract sizes
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

    // Always show size selector on mobile if multiple sizes
    if (isMobile && !variantId && sizes.length > 1) {
      setShowSizeSelector(true)
      return
    }

    const variant = variantId || product.variants?.edges?.[0]?.node.id
    if (!variant) return

    setIsLoading(true)
    
    // Desktop fly animation
    if (product.featuredImage?.url && productImageRef.current && !isMobile) {
      flyToCart({
        imageUrl: product.featuredImage.url,
        elementRef: productImageRef.current
      })
    }
    
    await addItem(variant, 1)
    
    // Success feedback
    setJustAdded(true)
    
    // Haptic feedback
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate([50, 30, 50])
    }
    
    setTimeout(() => {
      setIsLoading(false)
      setShowSizeSelector(false)
      setSelectedSize(null)
    }, 300)

    setTimeout(() => {
      setJustAdded(false)
    }, 2000)
  }, [cartReady, isLoading, isMobile, sizes.length, product.variants?.edges, addItem, flyToCart, product.featuredImage?.url])

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
      {product.featuredImage ? (
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          priority={priority}
          className={cn(
            "object-cover",
            imageLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300"
          )}
          onLoad={() => setImageLoading(false)}
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-4xl opacity-20">👕</div>
        </div>
      )}
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </>
  )

  // Mobile-first card design
  if (isMobile) {
    return (
      <>
        <div className="relative bg-white overflow-hidden rounded-lg shadow-sm">
          {/* Sale Badge - Clean and visible */}
          {isOnSale && discountPercent >= 20 && (
            <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
              -{discountPercent}%
            </div>
          )}

          {/* Wishlist - Always visible on mobile */}
          <button
            onClick={handleWishlist}
            className={cn(
              "absolute top-2 right-2 z-10 w-8 h-8 rounded-full",
              "flex items-center justify-center",
              "bg-white/90 backdrop-blur-sm shadow-sm",
              "active:scale-95 transition-transform"
            )}
            aria-label={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
          >
            <Heart 
              className={cn(
                "w-4 h-4",
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"
              )} 
            />
          </button>

          {/* Product Image - Tappable area */}
          <Link 
            href={`/products/${product.handle}`}
            className="block relative aspect-[3/4] bg-gray-50"
          >
            <div ref={productImageRef}>
              {imageContent}
            </div>
          </Link>

          {/* Product Info - Optimized for mobile readability */}
          <div className="p-3 space-y-2">
            {/* Title - Larger for mobile */}
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
              <Link href={`/products/${product.handle}`}>
                {product.title}
              </Link>
            </h3>

            {/* Rating - Compact */}
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3 h-3",
                      i < Math.floor(rating) 
                        ? "fill-gray-800 text-gray-800" 
                        : "fill-gray-200 text-gray-200"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 font-medium">{rating}</span>
              <span className="text-xs text-gray-500">({reviewCount})</span>
            </div>

            {/* Price - Clear hierarchy */}
            <div className="flex items-baseline gap-2">
              <Money 
                data={price} 
                className="text-base font-bold text-gray-900"
              />
              {isOnSale && compareAtPrice && (
                <Money 
                  data={compareAtPrice} 
                  className="text-sm text-gray-500 line-through"
                />
              )}
            </div>

            {/* Add to Cart - Big touch target */}
            <button
              onClick={() => handleAddToCart()}
              disabled={isLoading || !product.variants?.edges?.[0]?.node.availableForSale || !cartReady}
              className={cn(
                "w-full h-12 flex items-center justify-center gap-2",
                "text-sm font-semibold rounded-lg transition-all",
                "active:scale-[0.98]",
                justAdded 
                  ? "bg-green-500 text-white"
                  : "bg-gray-900 text-white",
                isLoading || !product.variants?.edges?.[0]?.node.availableForSale || !cartReady
                  ? "opacity-50"
                  : ""
              )}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  Added!
                </>
              ) : !product.variants?.edges?.[0]?.node.availableForSale ? (
                'Out of Stock'
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </button>

            {/* Size indicator if multiple sizes */}
            {sizes.length > 1 && (
              <p className="text-xs text-gray-500 text-center">
                {sizes.length} sizes available
              </p>
            )}
          </div>
        </div>

        {/* Size Selector - Mobile optimized */}
        <Dialog open={showSizeSelector} onOpenChange={setShowSizeSelector}>
          <DialogContent className="max-w-sm mx-4">
            <DialogHeader>
              <DialogTitle className="text-lg">Select Size</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  className={cn(
                    "h-14 px-4 rounded-lg border-2 transition-all",
                    "text-sm font-semibold",
                    selectedSize === size.id 
                      ? "bg-gray-900 text-white border-gray-900" 
                      : "bg-white text-gray-900 border-gray-300",
                    !size.available && "opacity-50 line-through"
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

  // Desktop version - Based on refined with better hover states
  return (
    <>
      <div className="group relative bg-white border border-gray-100 hover:border-gray-300 transition-all duration-300">
        {/* Sale Badge */}
        {isOnSale && discountPercent >= 20 && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-3 py-1 text-xs font-bold">
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
            !isWishlisted && "opacity-0 group-hover:opacity-100"
          )}
        >
          <Heart 
            className={cn(
              "w-4 h-4 transition-colors",
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
            )} 
          />
        </button>

        {/* Product Image */}
        <QuickViewDialog product={product}>
          <div ref={productImageRef} className="relative aspect-[3/4] overflow-hidden cursor-pointer bg-gray-50">
            {imageContent}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors duration-300" />
          </div>
        </QuickViewDialog>

        {/* Product Information */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-black transition-colors">
            <Link href={`/products/${product.handle}`}>
              {product.title}
            </Link>
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3.5 h-3.5",
                    i < Math.floor(rating) 
                      ? "fill-gray-900 text-gray-900" 
                      : "fill-gray-200 text-gray-200"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 font-medium">{rating}</span>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <Money 
              data={price} 
              className="text-base font-bold text-gray-900"
            />
            {isOnSale && compareAtPrice && (
              <Money 
                data={compareAtPrice} 
                className="text-sm text-gray-500 line-through"
              />
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => handleAddToCart()}
            disabled={isLoading || !product.variants?.edges?.[0]?.node.availableForSale || !cartReady}
            className={cn(
              "w-full h-11 flex items-center justify-center gap-2",
              "text-sm font-semibold transition-all duration-200",
              "border-2 border-gray-900 hover:bg-gray-900 hover:text-white",
              justAdded && "bg-green-500 border-green-500 text-white",
              (isLoading || !product.variants?.edges?.[0]?.node.availableForSale || !cartReady)
                && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : justAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added to Cart
              </>
            ) : !product.variants?.edges?.[0]?.node.availableForSale ? (
              'Out of Stock'
            ) : (
              'Add to Cart'
            )}
          </button>
        </div>
      </div>
    </>
  )
}