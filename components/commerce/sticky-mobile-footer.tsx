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
  
  console.log('Mobile footer state:', {
    hasSizeOptions,
    selectedVariant: selectedVariant?.id,
    needsSizeSelection,
    isOutOfStock
  })

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-gray-100 px-4 py-3 md:hidden transition-transform duration-300",
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
              variant="outline"
              className="w-full h-12 touch-manipulation"
            >
              Select Size
              <ChevronUp className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                console.log('Mobile footer add to cart clicked')
                onAddToCart?.()
              }}
              disabled={isOutOfStock}
              size="lg"
              className="w-full h-12 touch-manipulation"
            >
              {isOutOfStock ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart - {formattedPrice}
                </>
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