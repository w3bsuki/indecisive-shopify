'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/shopify/api'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { useCart } from '@/hooks/use-cart'
import { useWishlist } from '@/hooks/use-wishlist'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { QuickViewDialog } from './quick-view-dialog'
import { Heart, Eye, ShoppingBag, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ProductCardUnifiedProps {
  product: ShopifyProduct
  priority?: boolean
}

// Helper function to abbreviate product names
const abbreviateProductName = (title: string): string => {
  // Common abbreviations for product names
  const abbreviations: Record<string, string> = {
    'Caffeinated and Complicated': 'C&C',
    'Premium Quality': 'Premium',
    'Limited Edition': 'Ltd Edition',
    'Heavyweight': 'Heavy',
    'Lightweight': 'Light',
    'and': '&',
  }
  
  let abbreviated = title
  
  // Apply specific abbreviations first
  for (const [full, short] of Object.entries(abbreviations)) {
    abbreviated = abbreviated.replace(new RegExp(full, 'gi'), short)
  }
  
  return abbreviated
}

export function ProductCardUnified({ product, priority = false }: ProductCardUnifiedProps) {
  const { addItem, cartReady } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(false)
  const [showSizeSelector, setShowSizeSelector] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)
  const isWishlisted = isInWishlist(product.id)
  
  const displayTitle = abbreviateProductName(product.title)

  const price = formatPrice(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode
  )

  const comparePrice = product.compareAtPriceRange?.maxVariantPrice
    ? formatPrice(
        product.compareAtPriceRange.maxVariantPrice.amount,
        product.compareAtPriceRange.maxVariantPrice.currencyCode
      )
    : null

  const isOnSale = comparePrice && comparePrice !== price

  // Extract sizes from variants
  const sizes = product.variants.edges
    .map(edge => edge.node)
    .filter(variant => variant.availableForSale)
    .map(variant => ({
      id: variant.id,
      size: variant.title,
      available: variant.availableForSale
    }))

  const handleAddToCart = useCallback(async (variantId?: string) => {
    if (!cartReady || isLoading) return

    // On mobile, show size selector if not already selected
    if (isMobile && !variantId && sizes.length > 1) {
      setShowSizeSelector(true)
      return
    }

    const variant = variantId || product.variants.edges[0]?.node.id
    if (!variant) return

    setIsLoading(true)
    
    try {
      addItem(variant, 1)
      
      // Haptic feedback on mobile (if supported)
      if (isMobile && 'vibrate' in navigator) {
        navigator.vibrate(50)
      }
      
      setTimeout(() => {
        setIsLoading(false)
        setShowSizeSelector(false)
        setSelectedSize(null)
      }, 1000)
    } catch {
      setIsLoading(false)
    }
  }, [cartReady, isLoading, isMobile, sizes.length, product.variants.edges, addItem])

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


  return (
    <>
      <div className="group relative bg-white border border-gray-200 hover:border-gray-400 transition-all duration-300 hover:shadow-sm">
        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-2 left-2 z-10 bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase">
            Sale
          </div>
        )}

        {/* Product Image - Click for quick view on desktop, product page on mobile */}
        {isMobile ? (
          <Link 
            href={`/products/${product.handle}`}
            className="block relative aspect-square md:aspect-[4/5] overflow-hidden bg-gray-50"
          >
            {product.featuredImage && (
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                priority={priority}
                className={cn(
                  "object-cover transition-opacity duration-300",
                  imageLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={() => setImageLoading(false)}
              />
            )}
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
          </Link>
        ) : (
          <QuickViewDialog product={product}>
            <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-gray-50 cursor-pointer">
              {product.featuredImage && (
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  priority={priority}
                  className={cn(
                    "object-cover transition-opacity duration-300",
                    imageLoading ? "opacity-0" : "opacity-100"
                  )}
                  onLoad={() => setImageLoading(false)}
                />
              )}
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
              )}
              {/* Hover overlay with eye icon */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
          </QuickViewDialog>
        )}

        {/* Product Information */}
        <div className="p-4 space-y-4">
          {/* Product Title - Centered */}
          <h3 className="text-product-name text-center">
            <Link 
              href={`/products/${product.handle}`}
              className="hover:text-gray-600 transition-colors duration-200 block"
            >
              {displayTitle}
            </Link>
          </h3>

          {/* Price - Centered */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-price">{price}</span>
            {comparePrice && (
              <span className="text-sm line-through text-gray-500">{comparePrice}</span>
            )}
          </div>

          {/* Unified Button Bar */}
          <div className="w-full border border-gray-300 overflow-hidden bg-gray-50/50">
            <div className="flex items-center h-12">
              {/* Left - Wishlist */}
              <button
                onClick={handleWishlist}
                className={cn(
                  "w-12 h-full flex items-center justify-center transition-all duration-200 border-r border-gray-300",
                  isWishlisted 
                    ? "bg-red-50 text-red-500 hover:bg-red-100" 
                    : "bg-white text-gray-500 hover:bg-gray-50 hover:text-red-500"
                )}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart 
                  className={cn(
                    "w-4 h-4 transition-all duration-200",
                    isWishlisted && "fill-current"
                  )} 
                />
              </button>
              
              {/* Center - Quick View */}
              <QuickViewDialog product={product}>
                <button
                  className="flex-1 h-full flex items-center justify-center bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200 border-r border-gray-300"
                  aria-label="Quick view"
                >
                  <Eye className="w-4 h-4 transition-all duration-200" />
                </button>
              </QuickViewDialog>
              
              {/* Right - Add to Cart */}
              {!product.availableForSale ? (
                <div className="w-12 h-full flex items-center justify-center bg-gray-100">
                  <X className="w-4 h-4 text-gray-400" />
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart()}
                  disabled={isLoading || !cartReady}
                  className={cn(
                    "w-12 h-full flex items-center justify-center transition-all duration-200",
                    isLoading
                      ? "bg-gray-400"
                      : "bg-gray-900 text-white hover:bg-black"
                  )}
                  aria-label={isLoading ? "Adding to cart" : "Add to cart"}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ShoppingBag className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Size Selector Modal for Mobile */}
      <Dialog open={showSizeSelector} onOpenChange={setShowSizeSelector}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Size</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {sizes.map((size) => (
              <Button
                key={size.id}
                variant={selectedSize === size.id ? "default" : "outline"}
                className={cn(
                  "min-h-[48px]",
                  !size.available && "opacity-50 cursor-not-allowed"
                )}
                disabled={!size.available}
                onClick={() => {
                  setSelectedSize(size.id)
                  handleAddToCart(size.id)
                }}
              >
                {size.size}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}