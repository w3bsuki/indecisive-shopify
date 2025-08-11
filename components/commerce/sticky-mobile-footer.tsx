'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, ChevronUp, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMarket } from '@/hooks/use-market'
import { useWishlist } from '@/hooks/use-wishlist'
import { useTranslations } from 'next-intl'
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'
import { BackInStockForm } from './back-in-stock-form'

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
  const { toggleItem, isInWishlist } = useWishlist()
  const t = useTranslations('products')
  
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
      <div className="flex items-center gap-2">
        {/* Wishlist Button */}
        <Button
          onClick={() => {
            toggleItem({
              id: product.id,
              handle: product.handle,
              title: product.title,
              image: product.featuredImage?.url,
              price: selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount
            })
          }}
          size="lg"
          variant="outline"
          className={cn(
            "h-14 px-4 touch-manipulation border-2 transition-all",
            isInWishlist(product.id)
              ? "bg-black text-white border-black"
              : "border-black hover:bg-black hover:text-white"
          )}
          aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-5 w-5", isInWishlist(product.id) && "fill-current")} />
        </Button>
        
        {/* Add to Cart Button - Takes remaining space */}
        <div className="flex-1">
          {needsSizeSelection ? (
            <Button
              onClick={onSizeSelect}
              size="lg"
              className="w-full h-14 touch-manipulation bg-black text-white font-medium tracking-wide border-2 border-black"
            >
              <span className="uppercase text-sm">{t('selectSize')}</span>
              <ChevronUp className="w-4 h-4 ml-2" />
            </Button>
          ) : isOutOfStock ? (
            <BackInStockForm
              productTitle={product.title}
              variantTitle={selectedVariant?.title !== 'Default Title' ? selectedVariant?.title : undefined}
              productId={product.id}
              variantId={selectedVariant?.id}
            />
          ) : (
            <Button
              onClick={onAddToCart}
              size="lg"
              className="w-full h-14 touch-manipulation font-medium tracking-wide transition-all bg-black text-white border-2 border-black active:scale-[0.98]"
            >
              <div className="flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                <span className="uppercase text-sm">{t('addToCart')}</span>
                <span className="ml-2 text-sm opacity-90">• {formattedPrice}</span>
              </div>
            </Button>
          )}
        </div>
      </div>
      
      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom" />
    </div>
  )
}