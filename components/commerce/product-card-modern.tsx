'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { useCart } from '@/hooks/use-cart'
import { useWishlist } from '@/hooks/use-wishlist'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Money } from '@/components/commerce/money'
import { QuickViewDialog } from './quick-view-dialog'
import { Heart, Plus, Check, Star } from 'lucide-react'
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
  variant?: 'default' | 'minimal' | 'detailed'
}

export function ProductCardModern({ 
  product, 
  priority = false,
  variant = 'default' 
}: ProductCardProps) {
  const { addItem, cartReady } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(false)
  const [showSizeSelector, setShowSizeSelector] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const isWishlisted = isInWishlist(product.id)
  const t = useTranslations('products')
  const { flyToCart } = useFlyToCart()
  const productImageRef = useRef<HTMLDivElement>(null)
  const imageIntervalRef = useRef<NodeJS.Timeout | null>(null)

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

  // Auto-cycle images on hover (desktop only)
  useEffect(() => {
    if (isHovered && displayImages.length > 1 && !isMobile) {
      imageIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)
      }, 1000)
    } else {
      if (imageIntervalRef.current) {
        clearInterval(imageIntervalRef.current)
      }
      setCurrentImageIndex(0)
    }

    return () => {
      if (imageIntervalRef.current) {
        clearInterval(imageIntervalRef.current)
      }
    }
  }, [isHovered, displayImages.length, isMobile])

  const handleAddToCart = useCallback(async (variantId?: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!cartReady || isLoading) return

    // On mobile or if multiple sizes, show size selector
    if (!variantId && sizes.length > 1) {
      setShowSizeSelector(true)
      return
    }

    const variant = variantId || product.variants?.edges?.[0]?.node.id
    if (!variant) return

    setIsLoading(true)
    
    // Trigger fly animation
    if (product.featuredImage?.url && productImageRef.current && !isMobile) {
      flyToCart({
        imageUrl: product.featuredImage.url,
        elementRef: productImageRef.current
      })
    }
    
    await addItem(variant, 1)
    
    // Success feedback
    setAddedToCart(true)
    
    // Haptic feedback on mobile
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate([50, 50, 50])
    }
    
    setTimeout(() => {
      setIsLoading(false)
      setShowSizeSelector(false)
      setSelectedSize(null)
      setAddedToCart(false)
      setShowQuickAdd(false)
    }, 2000)
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

  // Generate mock rating (would come from reviews in real app)
  const rating = 4.5
  const reviewCount = Math.floor(Math.random() * 200) + 50

  const imageContent = (
    <div className="relative w-full h-full">
      {displayImages.length > 0 ? (
        <>
          <Image
            src={displayImages[currentImageIndex]?.url || displayImages[0].url}
            alt={displayImages[currentImageIndex]?.altText || product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={priority}
            className={cn(
              "object-cover transition-all duration-700",
              imageLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setImageLoading(false)}
          />
          
          {/* Subtle image transition indicator */}
          {displayImages.length > 1 && isHovered && !isMobile && (
            <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
              {currentImageIndex + 1}/{displayImages.length}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center p-8">
            <div className="text-4xl mb-2">👕</div>
            <div className="text-xs text-gray-400">{t('noImage')}</div>
          </div>
        </div>
      )}
      
      {/* Skeleton loader */}
      {imageLoading && displayImages.length > 0 && (
        <div className="absolute inset-0 bg-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" />
        </div>
      )}
    </div>
  )

  if (variant === 'minimal') {
    return (
      <Link href={`/products/${product.handle}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-lg">
          {imageContent}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="text-sm text-gray-700 group-hover:text-black transition-colors line-clamp-1">
            {product.title}
          </h3>
          <Money data={price} className="text-sm font-medium" />
        </div>
      </Link>
    )
  }

  return (
    <>
      <div 
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Discount Badge - Nike style */}
        {isOnSale && discountPercent >= 20 && (
          <div className="absolute top-0 left-0 z-20 bg-red-600 text-white px-2 py-1 text-xs font-bold">
            {discountPercent}% OFF
          </div>
        )}

        {/* New Badge (for demo) */}
        {Math.random() > 0.7 && (
          <div className="absolute top-0 left-0 z-20 bg-black text-white px-2 py-1 text-xs font-bold uppercase">
            New
          </div>
        )}

        {/* Product Image Container */}
        <div className="relative">
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
              <div 
                ref={productImageRef} 
                className="relative aspect-[3/4] overflow-hidden bg-gray-50 cursor-pointer"
              >
                {imageContent}
                
                {/* Gymshark-style hover effect */}
                <div className={cn(
                  "absolute inset-0 bg-black/0 transition-all duration-500",
                  isHovered && "bg-black/10"
                )} />

                {/* Quick Add Button - Vinted style */}
                {!isMobile && product.variants?.edges?.[0]?.node.availableForSale && (
                  <div className={cn(
                    "absolute bottom-4 left-4 right-4 transition-all duration-300",
                    isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}>
                    {sizes.length > 1 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowQuickAdd(true)
                        }}
                        className="w-full py-3 bg-white/95 backdrop-blur-sm text-black font-medium text-sm hover:bg-white transition-all duration-200 shadow-lg"
                      >
                        Quick Add +
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleAddToCart(undefined, e)}
                        disabled={isLoading || !cartReady}
                        className={cn(
                          "w-full py-3 font-medium text-sm transition-all duration-200 shadow-lg",
                          addedToCart 
                            ? "bg-green-500 text-white"
                            : "bg-white/95 backdrop-blur-sm text-black hover:bg-white",
                          (isLoading || !cartReady) && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin mx-auto" />
                        ) : addedToCart ? (
                          <span className="flex items-center justify-center gap-2">
                            <Check className="w-4 h-4" />
                            Added
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add to Cart
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </QuickViewDialog>
          )}

          {/* Wishlist Button - Clean circular style */}
          <button
            onClick={handleWishlist}
            className={cn(
              "absolute top-3 right-3 z-10 w-9 h-9 rounded-full",
              "flex items-center justify-center transition-all duration-300",
              "bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110",
              isMobile || isWishlisted ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          >
            <Heart 
              className={cn(
                "w-4 h-4 transition-colors",
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"
              )} 
            />
          </button>
        </div>

        {/* Product Information */}
        <div className="pt-4 space-y-2">
          {/* Title and Price Row */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight mb-1">
              <Link 
                href={`/products/${product.handle}`}
                className="hover:underline"
              >
                {product.title}
              </Link>
            </h3>
            
            {/* Category/Type */}
            {product.tags && product.tags.length > 0 && (
              <p className="text-xs text-gray-500 mb-2">
                {product.tags[0]}
              </p>
            )}
          </div>

          {/* Rating (if detailed variant) */}
          {variant === 'detailed' && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3 h-3",
                      i < Math.floor(rating) 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "fill-gray-200 text-gray-200"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({reviewCount})</span>
            </div>
          )}

          {/* Price Section */}
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

          {/* Mobile Actions */}
          {isMobile && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleAddToCart()}
                disabled={isLoading || !product.variants?.edges?.[0]?.node.availableForSale || !cartReady}
                className={cn(
                  "flex-1 h-10 flex items-center justify-center gap-2 text-sm font-medium transition-all",
                  "bg-black text-white active:scale-95",
                  (isLoading || !product.variants?.edges?.[0]?.node.availableForSale || !cartReady)
                    ? "opacity-50"
                    : "active:bg-gray-900"
                )}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                ) : !product.variants?.edges?.[0]?.node.availableForSale ? (
                  'Sold Out'
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add
                  </>
                )}
              </button>
            </div>
          )}

          {/* Stock Status */}
          {!product.variants?.edges?.[0]?.node.availableForSale && (
            <p className="text-xs text-gray-500 font-medium">
              Out of Stock
            </p>
          )}
        </div>

        {/* Quick Add Size Selector (Desktop) */}
        {showQuickAdd && !isMobile && (
          <div 
            className="absolute inset-x-0 bottom-[120px] bg-white border border-gray-200 shadow-xl p-4 z-30"
            onMouseLeave={() => setShowQuickAdd(false)}
          >
            <p className="text-sm font-medium mb-3">Select Size:</p>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={(e) => handleAddToCart(size.id, e)}
                  className={cn(
                    "py-2 text-sm border transition-all",
                    "hover:bg-black hover:text-white hover:border-black",
                    !size.available && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={!size.available}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Selector Modal (Mobile) */}
      <Dialog open={showSizeSelector} onOpenChange={setShowSizeSelector}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Size</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {sizes.map((size) => (
              <button
                key={size.id}
                className={cn(
                  "min-h-[56px] px-4 py-3 border-2 transition-all text-sm font-medium",
                  selectedSize === size.id 
                    ? "bg-black text-white border-black" 
                    : "bg-white text-black border-gray-200 hover:border-black",
                  !size.available && "opacity-50 cursor-not-allowed line-through"
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