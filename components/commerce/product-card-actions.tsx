'use client'

import { useState, useCallback } from 'react'
import type { ShopifyProduct } from '@/lib/shopify/types'
import type { Money as ShopifyMoney } from '@/lib/shopify/types'
import { useCart } from '@/hooks/use-cart'
import { useWishlist } from '@/hooks/use-wishlist'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Heart, ShoppingBag } from 'lucide-react'
import { ProductPrice } from '@/components/commerce/product-price'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ProductCardActionsProps {
  product: ShopifyProduct
  price?: ShopifyMoney
  sizes: Array<{ id: string; size: string; available: boolean }>
  variant?: 'default' | 'overlay' | 'wishlist-only' | 'cart-only' | 'price-only'
  translations: {
    addToWishlist: string
    removeFromWishlist: string
    addToCart: string
    addingToCart: string
    selectSize: string
    viewProduct: string
  }
}

export function ProductCardActions({ product, price: _price, sizes, variant = 'default', translations }: ProductCardActionsProps) {
  const { addItem, cartReady } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(false)
  const [showSizeSelector, setShowSizeSelector] = useState(false)
  const [_selectedSize, setSelectedSize] = useState<string | null>(null)
  const isWishlisted = isInWishlist(product.id)

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
  }, [cartReady, isLoading, isMobile, sizes.length, product.variants?.edges, addItem])

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

  const isAvailable = product.variants?.edges?.[0]?.node.availableForSale

  // Wishlist button only
  if (variant === 'wishlist-only') {
    return (
      <button
        onClick={handleWishlist}
        className={cn(
          "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-200",
          "shadow-sm border",
          isWishlisted 
            ? "bg-black text-white border-black" 
            : "bg-white text-black border-gray-200 hover:border-black"
        )}
        aria-label={isWishlisted ? translations.removeFromWishlist : translations.addToWishlist}
      >
        <Heart 
          className={cn(
            "w-4 h-4 sm:w-5 sm:h-5",
            isWishlisted && "fill-current"
          )} 
        />
      </button>
    )
  }

  // Cart button only
  if (variant === 'cart-only') {
    return (
      <>
        <button
          onClick={() => handleAddToCart()}
          disabled={isLoading || !isAvailable || !cartReady}
          className={cn(
            "p-2 transition-all duration-200",
            isLoading || !isAvailable || !cartReady
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:text-black hover:scale-110"
          )}
          aria-label={translations.addToCart}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
          ) : (
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>

        {/* Size Selector Modal */}
        <Dialog open={showSizeSelector} onOpenChange={setShowSizeSelector}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{translations.selectSize}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-2 py-4">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => {
                    setSelectedSize(size.id)
                    handleAddToCart(size.id)
                  }}
                  disabled={!size.available}
                  className={cn(
                    "h-12 flex items-center justify-center rounded-lg border transition-all duration-200",
                    size.available
                      ? "border-gray-300 hover:border-black hover:bg-black hover:text-white"
                      : "border-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <span className="text-sm font-medium">{size.size}</span>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Price only
  if (variant === 'price-only') {
    return (
      <div className="flex justify-center items-center w-full">
        <ProductPrice 
          priceRange={product.priceRange as any}
          compareAtPriceRange={product.compareAtPriceRange as any}
          size="sm"
          showCompareAt={false}
          showRange={false}
          className="text-sm font-medium text-gray-900 text-center"
        />
      </div>
    )
  }

  if (variant === 'overlay') {
    return (
      <>
        {/* Clean Floating Buttons - Vertical Stack */}
        <div className="flex flex-col gap-2">
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={cn(
              "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-200",
              "backdrop-blur-md shadow-sm",
              isWishlisted 
                ? "bg-black text-white" 
                : "bg-white/90 text-black hover:bg-white"
            )}
            aria-label={isWishlisted ? translations.removeFromWishlist : translations.addToWishlist}
          >
            <Heart 
              className={cn(
                "w-4 h-4 sm:w-5 sm:h-5",
                isWishlisted && "fill-current"
              )} 
            />
          </button>
          
          {/* Add to Cart Button */}
          <button
            onClick={() => handleAddToCart()}
            disabled={isLoading || !isAvailable || !cartReady}
            className={cn(
              "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-200",
              "backdrop-blur-md shadow-sm",
              isLoading || !isAvailable || !cartReady
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900"
            )}
            aria-label={translations.addToCart}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>

        {/* Size Selector Modal for Mobile */}
        <Dialog open={showSizeSelector} onOpenChange={setShowSizeSelector}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{translations.selectSize}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-2 py-4">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => {
                    setSelectedSize(size.id)
                    handleAddToCart(size.id)
                  }}
                  disabled={!size.available}
                  className={cn(
                    "h-12 flex items-center justify-center rounded-lg border transition-all duration-200",
                    size.available
                      ? "border-gray-300 hover:border-black hover:bg-black hover:text-white"
                      : "border-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <span className="text-sm font-medium">{size.size}</span>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <>
      {/* Centered Price Only */}
      <div className="flex justify-center items-center w-full">
        <ProductPrice 
          priceRange={product.priceRange as any}
          compareAtPriceRange={product.compareAtPriceRange as any}
          size="sm"
          showCompareAt={false}
          showRange={false}
          className="text-sm font-medium text-gray-900 text-center"
        />
      </div>

      {/* Mobile Size Selector Dialog */}
      <Dialog open={showSizeSelector} onOpenChange={setShowSizeSelector}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{translations.selectSize}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => {
                  setSelectedSize(size.id)
                  handleAddToCart(size.id)
                }}
                disabled={!size.available}
                className={cn(
                  "p-3 border border-gray-300 text-sm font-medium transition-all",
                  size.available 
                    ? "bg-white hover:bg-black hover:text-white" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
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