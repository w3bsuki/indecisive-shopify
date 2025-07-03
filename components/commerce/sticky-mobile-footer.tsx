'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMarket } from '@/hooks/use-market'
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'

interface StickyMobileFooterProps {
  product: ShopifyProduct
  selectedVariant?: ShopifyProductVariant
  onSizeSelect?: () => void
  onAddToCart?: () => void
  showSizeSelector?: boolean
}

export function StickyMobileFooter({ 
  product, 
  selectedVariant, 
  onSizeSelect, 
  onAddToCart,
  showSizeSelector: _showSizeSelector = false 
}: StickyMobileFooterProps) {
  const [isVisible, setIsVisible] = useState(true)
  const { formatPrice } = useMarket()
  
  // Keep footer always visible for e-commerce conversion
  useEffect(() => {
    setIsVisible(true) // Always visible for maximum conversion
  }, [])

  // Get price from selected variant or product
  const price = selectedVariant?.price || product.priceRange.minVariantPrice
  const formattedPrice = formatPrice(price.amount, price.currencyCode)
  
  // Check if product has size options
  const hasSizeOptions = product.options?.some(opt => opt.name.toLowerCase() === 'size')
  const needsSizeSelection = hasSizeOptions && !selectedVariant
  
  const isOutOfStock = selectedVariant && !selectedVariant.availableForSale

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 md:hidden transition-transform duration-300 shadow-lg",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Single Add to Cart Button - Full Width */}
        <div className="flex-1">
          {needsSizeSelection ? (
            <Button
              onClick={onSizeSelect}
              size="lg"
              className="w-full h-14 touch-manipulation bg-black text-white font-medium tracking-wide border-2 border-black"
            >
              <span className="uppercase text-sm">Select Size</span>
              <ChevronUp className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={onAddToCart}
              disabled={isOutOfStock}
              size="lg"
              className={cn(
                "w-full h-14 touch-manipulation font-medium tracking-wide transition-all",
                isOutOfStock 
                  ? "bg-gray-100 text-gray-400 border-2 border-gray-200" 
                  : "bg-black text-white border-2 border-black active:scale-[0.98]"
              )}
            >
              {isOutOfStock ? (
                <span className="uppercase text-sm">Out of Stock</span>
              ) : (
                <div className="flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  <span className="uppercase text-sm">Add to Cart</span>
                  <span className="ml-2 text-sm opacity-90">• {formattedPrice}</span>
                </div>
              )}
            </Button>
          )}
        </div>
      </div>
      
      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom" />
    </div>
  )
}