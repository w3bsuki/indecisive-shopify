'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Minus, Plus } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useMarket } from '@/hooks/use-market'
import { cn } from '@/lib/utils'
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'
import { useTranslations } from 'next-intl'
import { getColorFromName } from '@/lib/utils/product'
import { Money } from './money'

interface MobileBottomSheetProps {
  product: ShopifyProduct
}

export function MobileBottomSheet({ product }: MobileBottomSheetProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant | undefined>()
  const [selectedColor, setSelectedColor] = useState<string>()
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, cartReady } = useCart()
  const { market } = useMarket()
  const t = useTranslations('products')
  const _tc = useTranslations('common')

  // Get all variants and options
  const variants = product.variants.edges.map(edge => edge.node)
  const colorOption = product.options?.find(opt => {
    const n = opt.name.toLowerCase().trim()
    return n === 'color' || n === 'colour' || n === 'цвят'
  })
  
  // Get available colors
  const availableColors = useMemo(() => {
    if (colorOption?.values) {
      return colorOption.values
    }
    return []
  }, [colorOption])
  
  // Initialize with first available variant
  useEffect(() => {
    const firstAvailable = variants.find(v => v.availableForSale) || variants[0]
    setSelectedVariant(firstAvailable)
    
    // Set initial color if available
    if (firstAvailable && colorOption) {
      const colorOpt = firstAvailable.selectedOptions?.find(opt => {
        const n = opt.name.toLowerCase().trim()
        return n === 'color' || n === 'colour' || n === 'цвят'
      })
      if (colorOpt) setSelectedColor(colorOpt.value)
    }
  }, [variants, colorOption])

  // Listen for variant changes from the main form
  useEffect(() => {
    const handleVariantChange = (event: CustomEvent) => {
      setSelectedVariant(event.detail.variant)
      // Update color if changed
      if (event.detail.variant && colorOption) {
        const colorOpt = event.detail.variant.selectedOptions?.find((opt: any) => {
          const n = (opt.name || '').toLowerCase().trim()
          return n === 'color' || n === 'colour' || n === 'цвят'
        })
        if (colorOpt) setSelectedColor(colorOpt.value)
      }
    }

    window.addEventListener('variant-changed', handleVariantChange as EventListener)
    return () => window.removeEventListener('variant-changed', handleVariantChange as EventListener)
  }, [colorOption])
  
  // Handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    // Find variant matching this color
    const newVariant = variants.find(v => {
      const variantColor = v.selectedOptions?.find(opt => {
        const n = opt.name.toLowerCase().trim()
        return n === 'color' || n === 'colour' || n === 'цвят'
      })
      return variantColor?.value === color
    })
    if (newVariant) {
      setSelectedVariant(newVariant)
      
      // Create fallback image if variant doesn't have proper image
      let imageToUse = newVariant.image
      
      if (!imageToUse?.url && product.images?.edges) {
        // Fallback color-to-image mapping
        const colorLower = color.toLowerCase()
        const availableImages = product.images.edges.map(edge => edge.node)
        let fallbackIndex = -1
        
        if (colorLower.includes('червен') || colorLower.includes('red')) {
          fallbackIndex = 0 // First image
        } else if (colorLower.includes('лилав') || colorLower.includes('purple') || colorLower.includes('violet')) {
          fallbackIndex = 1 // Second image
        } else if (colorLower.includes('син') || colorLower.includes('blue')) {
          fallbackIndex = 2 // Third image
        }
        
        if (fallbackIndex >= 0 && fallbackIndex < availableImages.length) {
          imageToUse = availableImages[fallbackIndex]
          console.log('🎨 Bottom sheet fallback mapping - using image index:', fallbackIndex, 'for color:', color)
        }
      }
      
      // Emit event for main form sync AND image gallery update
      const event = new CustomEvent('variant-changed', {
        detail: { variant: newVariant, image: imageToUse }
      })
      window.dispatchEvent(event)
    }
  }
  
  // Map color names to hex values
  const getColorHex = (colorName: string): string => getColorFromName(colorName)

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + delta)))
  }

  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariant.availableForSale || !cartReady || isAdding) {
      return
    }

    setIsAdding(true)
    try {
      await addItem(selectedVariant.id, quantity)
      setTimeout(() => {
        setQuantity(1)
        setIsAdding(false)
      }, 300)
    } catch (_error) {
      setIsAdding(false)
    }
  }

  const isDisabled = !selectedVariant || !selectedVariant.availableForSale || !cartReady || isAdding

  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white/90 backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,0,0,0.1)] border-t border-gray-200/50">
      <div className="px-4 pb-4 pb-safe pt-2">
        {/* Handle */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-white/60 rounded-full" />
        </div>
        
        {/* Content Container */}
        <div className="space-y-2.5">
          {/* Product Info Row */}
          <div className="flex items-center gap-3">
            {/* Product Image - Show variant image if available */}
            <div className="w-14 h-14 flex-shrink-0">
              <div className="w-full h-full bg-gray-100 rounded-xl overflow-hidden">
                {(() => {
                  const variantImage = selectedVariant?.image?.url
                  const fallbackImage = product.featuredImage?.url
                  const imageUrl = variantImage || fallbackImage
                  
                  return imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={selectedVariant?.image?.altText || product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : null
                })()}
              </div>
            </div>
            
            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 line-clamp-1">{product.title}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-base font-bold text-black">
                  {selectedVariant ? (
                    <Money data={selectedVariant.price} showDualCurrency={market.countryCode === 'BG'} />
                  ) : product.priceRange.minVariantPrice.amount === product.priceRange.maxVariantPrice.amount ? (
                    <Money data={product.priceRange.minVariantPrice} showDualCurrency={market.countryCode === 'BG'} />
                  ) : (
                    <>
                      <span className="text-xs text-gray-600 font-normal">{t('priceFrom')} </span>
                      <Money data={product.priceRange.minVariantPrice} showDualCurrency={market.countryCode === 'BG'} />
                    </>
                  )}
                </p>
                {selectedVariant && (
                  <span className={cn(
                    "text-xs",
                    selectedVariant.availableForSale ? "text-green-600" : "text-red-600"
                  )}>
                    {selectedVariant.availableForSale ? `• ${t('available')}` : `• ${t('soldOut')}`}
                  </span>
                )}
              </div>
            </div>
            
            {/* Color Picker - Right Side */}
            {availableColors.length > 0 && (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {availableColors.slice(0, 4).map((color) => {
                  const isSelected = selectedColor === color
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={cn(
                        "relative w-7 h-7 rounded-full overflow-hidden transition-all touch-manipulation",
                        isSelected 
                          ? "ring-2 ring-black ring-offset-1" 
                          : "ring-1 ring-gray-300"
                      )}
                      title={color}
                    >
                      <span
                        className="absolute inset-0 block"
                        style={{ backgroundColor: getColorHex(color) }}
                      />
                      {color.toLowerCase() === 'white' && (
                        <span className="absolute inset-0 border border-gray-200 rounded-full" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          
          {/* Add to Cart with Quantity */}
          <div className="flex items-center gap-2">
            {/* Quantity Selector */}
            <div className="flex items-center bg-gray-100 rounded-xl">
              <button 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-9 h-11 flex items-center justify-center hover:bg-gray-200 rounded-l-xl transition-colors disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="w-10 text-center">
                <span className="text-sm font-semibold">{quantity}</span>
              </div>
              <button 
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
                className="w-9 h-11 flex items-center justify-center hover:bg-gray-200 rounded-r-xl transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={isDisabled}
              aria-disabled={isDisabled}
              className="flex-1 bg-black text-white h-11 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  <span>{t('addingToCart')}</span>
                </>
              ) : selectedVariant && !selectedVariant.availableForSale ? (
                <span>{t('soldOut')}</span>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  <span>{t('addToCart')}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
