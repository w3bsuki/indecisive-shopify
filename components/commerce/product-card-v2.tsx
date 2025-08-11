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
import { Heart, ShoppingBag, Eye } from 'lucide-react'
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

export function ProductCardV2({ product, priority = false }: ProductCardProps) {
  const { addItem, cartReady } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(false)
  const [showSizeSelector, setShowSizeSelector] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)
  const [hoveredImage, setHoveredImage] = useState(0)
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

  // Get all product images
  const productImages = product.images?.edges?.map(edge => edge.node) || []
  const displayImages = productImages.length > 0 ? productImages : (product.featuredImage ? [product.featuredImage] : [])

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

    // On mobile, show size selector if not already selected
    if (isMobile && !variantId && sizes.length > 1) {
      setShowSizeSelector(true)
      return
    }

    const variant = variantId || product.variants?.edges?.[0]?.node.id
    if (!variant) return

    setIsLoading(true)
    
    // Trigger fly animation if product image is available
    if (product.featuredImage?.url && productImageRef.current && !isMobile) {
      flyToCart({
        imageUrl: product.featuredImage.url,
        elementRef: productImageRef.current
      })
    }
    
    // Add item with optimistic update (instant feedback)
    await addItem(variant, 1)
    
    // Haptic feedback on mobile (if supported)
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }
    
    setTimeout(() => {
      setIsLoading(false)
      setShowSizeSelector(false)
      setSelectedSize(null)
    }, 300)
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

    // Haptic feedback on mobile
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(30)
    }
  }, [toggleItem, product, isMobile])

  const imageContent = (
    <>
      {displayImages.length > 0 ? (
        <>
          <Image
            src={displayImages[hoveredImage]?.url || displayImages[0].url}
            alt={displayImages[hoveredImage]?.altText || product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={priority}
            className={cn(
              "object-cover transition-all duration-500",
              imageLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
            )}
            onLoad={() => setImageLoading(false)}
          />
          {/* Image dots indicator for multiple images */}
          {displayImages.length > 1 && !isMobile && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {displayImages.slice(0, 4).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    hoveredImage === index ? "bg-white w-4" : "bg-white/60"
                  )}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center">
            <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <div className="text-xs text-gray-400">{t('noImage')}</div>
          </div>
        </div>
      )}
      {imageLoading && displayImages.length > 0 && (
        <div className="absolute inset-0 bg-gray-50 animate-pulse" />
      )}
    </>
  )

  return (
    <>
      <div 
        className="group relative bg-white overflow-hidden transition-all duration-300 hover:shadow-xl"
        onMouseEnter={() => {
          if (displayImages.length > 1 && !isMobile) {
            setHoveredImage(1)
          }
        }}
        onMouseLeave={() => {
          if (displayImages.length > 1 && !isMobile) {
            setHoveredImage(0)
          }
        }}
      >
        {/* Sale Badge - Modern pill style */}
        {isOnSale && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-3 py-1 text-xs font-semibold rounded-full">
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist Button - Always visible on mobile, hover on desktop */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-3 right-3 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full",
            "flex items-center justify-center transition-all duration-300",
            "hover:bg-white hover:shadow-lg",
            !isMobile && "opacity-0 group-hover:opacity-100",
            isWishlisted && "!opacity-100"
          )}
          aria-label={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
        >
          <Heart 
            className={cn(
              "w-5 h-5 transition-all duration-300",
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"
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
              
              {/* Desktop hover overlay - Clean gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              {/* Quick view button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">Quick View</span>
                </div>
              </div>

              {/* Add to Cart button on hover - Bottom position */}
              {!isMobile && product.variants?.edges?.[0]?.node.availableForSale && (
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCart()
                    }}
                    disabled={isLoading || !cartReady}
                    className={cn(
                      "w-full h-12 flex items-center justify-center gap-2 transition-all duration-300",
                      "bg-white/95 backdrop-blur-sm text-black font-medium text-sm rounded-full",
                      "hover:bg-white hover:shadow-lg transform hover:scale-[1.02]",
                      (isLoading || !cartReady) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </QuickViewDialog>
        )}

        {/* Product Information - Minimal and clean */}
        <div className="p-4 space-y-3">
          {/* Product Title */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-black transition-colors">
            <Link href={`/products/${product.handle}`}>
              {product.title}
            </Link>
          </h3>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Money 
                data={price} 
                className="text-base font-semibold text-gray-900"
              />
              {isOnSale && compareAtPrice && (
                <Money 
                  data={compareAtPrice} 
                  className="text-sm text-gray-400 line-through"
                />
              )}
            </div>

            {/* Mobile Add to Cart */}
            {isMobile && product.variants?.edges?.[0]?.node && (
              <button
                onClick={() => handleAddToCart()}
                disabled={isLoading || !product.variants?.edges?.[0]?.node.availableForSale || !cartReady}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300",
                  "bg-black text-white",
                  isLoading || !product.variants?.edges?.[0]?.node.availableForSale || !cartReady
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-900 active:scale-95"
                )}
                aria-label={isLoading ? t('addingToCart') : t('addToCart')}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Size indicator for desktop */}
          {!isMobile && sizes.length > 1 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              {sizes.length} sizes available
            </div>
          )}

          {/* Out of stock indicator */}
          {!product.variants?.edges?.[0]?.node.availableForSale && (
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Sold Out
            </div>
          )}
        </div>
      </div>

      {/* Size Selector Modal for Mobile */}
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
                  "min-h-[48px] px-3 py-2 rounded-lg border-2 transition-all duration-200",
                  "text-sm font-medium",
                  selectedSize === size.id 
                    ? "bg-black text-white border-black" 
                    : "bg-white text-black border-gray-200 hover:border-gray-400",
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