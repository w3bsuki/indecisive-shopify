'use client'

import { useState, useCallback } from 'react'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { useCart } from '@/hooks/use-cart'
import { useWishlist } from '@/hooks/use-wishlist'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { parsePriceString } from '@/lib/utils/price'
import { Heart, X, Eye } from 'lucide-react'
import { QuickViewDialog } from './quick-view-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ProductCardActionsProps {
  product: ShopifyProduct
  rawPrice: string
  sizes: Array<{ id: string; size: string; available: boolean }>
  translations: {
    addToWishlist: string
    removeFromWishlist: string
    addToCart: string
    addingToCart: string
    selectSize: string
    viewProduct: string
  }
}

export function ProductCardActions({ product, rawPrice, sizes, translations }: ProductCardActionsProps) {
  const { addItem, cartReady } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(false)
  const [showSizeSelector, setShowSizeSelector] = useState(false)
  const [_selectedSize, setSelectedSize] = useState<string | null>(null)
  const isWishlisted = isInWishlist(product.id)

  // Split price and currency for display
  const { number: priceNumber, currency } = parsePriceString(rawPrice)

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

  return (
    <>
      {/* Triple Split Button: Wishlist + Price + Add to Cart */}
      <div className="relative w-full">
        <div className="flex items-stretch min-h-[44px] bg-white border-2 border-black overflow-hidden">
          {/* Left - Wishlist */}
          <button
            onClick={handleWishlist}
            className={cn(
              "relative min-w-[44px] flex items-center justify-center transition-all duration-200",
              "border-r-2 border-black",
              isWishlisted 
                ? "bg-black text-white" 
                : "bg-white text-black hover:bg-black hover:text-white"
            )}
            aria-label={isWishlisted ? translations.removeFromWishlist : translations.addToWishlist}
          >
            <Heart 
              className={cn(
                "absolute w-[18px] h-[18px] transition-all duration-200",
                isWishlisted && "fill-current"
              )} 
            />
          </button>
          
          {/* Middle - Price */}
          <div className="flex-1 flex items-center justify-center px-2 bg-gray-50" style={{ fontFamily: 'var(--font-mono)' }}>
            {currency === 'лв' ? (
              <span className="text-[11px] font-normal tracking-tight text-black">
                {priceNumber} <span className="text-[8px]">{currency}</span>
              </span>
            ) : (
              <span className="text-[11px] font-normal tracking-tight text-black">
                {rawPrice}
              </span>
            )}
          </div>
          
          {/* Right - Add to Cart / Quick View */}
          {isMobile ? (
            <button
              onClick={() => handleAddToCart()}
              disabled={isLoading || !isAvailable || !cartReady}
              className={cn(
                "relative min-w-[44px] flex items-center justify-center transition-all duration-200",
                "border-l-2 border-black",
                isLoading || !isAvailable || !cartReady
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-900"
              )}
              aria-label={isLoading ? translations.addingToCart : translations.addToCart}
            >
              {isLoading ? (
                <div className="absolute w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : !isAvailable ? (
                <X className="absolute w-[18px] h-[18px]" />
              ) : (
                <svg 
                  className="absolute w-[18px] h-[18px]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          ) : (
            <QuickViewDialog product={product}>
              <button
                className={cn(
                  "relative min-w-[44px] flex items-center justify-center transition-all duration-200",
                  "border-l-2 border-black",
                  "bg-black text-white hover:bg-gray-900"
                )}
                aria-label={translations.viewProduct}
              >
                <Eye className="absolute w-[18px] h-[18px]" />
              </button>
            </QuickViewDialog>
          )}
        </div>
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
                  "p-3 border-2 border-black text-sm font-medium transition-all",
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