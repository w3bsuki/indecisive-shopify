'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Minus, Plus } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useMarket } from '@/hooks/use-market'
import { cn } from '@/lib/utils'
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'
import { useTranslations } from 'next-intl'
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
  const colorOption = product.options?.find(opt => opt.name.toLowerCase() === 'color' || opt.name === 'Color')
  
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
      const colorOpt = firstAvailable.selectedOptions?.find(opt => opt.name.toLowerCase() === 'color')
      if (colorOpt) setSelectedColor(colorOpt.value)
    }
  }, [variants, colorOption])

  // Listen for variant changes from the main form
  useEffect(() => {
    const handleVariantChange = (event: CustomEvent) => {
      setSelectedVariant(event.detail.variant)
      // Update color if changed
      if (event.detail.variant && colorOption) {
        const colorOpt = event.detail.variant.selectedOptions?.find((opt: any) => opt.name.toLowerCase() === 'color')
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
      const variantColor = v.selectedOptions?.find(opt => opt.name.toLowerCase() === 'color')
      return variantColor?.value === color
    })
    if (newVariant) {
      setSelectedVariant(newVariant)
      // Emit event for main form sync
      window.dispatchEvent(new CustomEvent('variant-changed', {
        detail: { variant: newVariant }
      }))
    }
  }
  
  // Map color names to hex values
  const getColorHex = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'black': '#000000',
      'white': '#ffffff', 
      'red': '#ef4444',
      'blue': '#3b82f6',
      'green': '#10b981',
      'yellow': '#f59e0b',
      'purple': '#8b5cf6',
      'pink': '#ec4899',
      'gray': '#6b7280',
      'grey': '#6b7280',
      'brown': '#92400e',
      'navy': '#1e3a8a',
      'beige': '#f5e6d3',
      'orange': '#f97316'
    }
    return colorMap[colorName.toLowerCase()] || '#e5e7eb'
  }

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
    <div className="md:hidden fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 shadow-2xl z-40">
      <div className="px-4 pb-4 pt-2">
        {/* Handle */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Content Container */}
        <div className="space-y-2.5">
          {/* Product Info Row */}
          <div className="flex items-center gap-3">
            {/* Product Image */}
            <div className="w-14 h-14 flex-shrink-0">
              <div className="w-full h-full bg-gray-100 rounded-xl overflow-hidden">
                {product.featuredImage && (
                  <img 
                    src={product.featuredImage.url} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                )}
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
                      <span className="text-xs text-gray-600 font-normal">from </span>
                      <Money data={product.priceRange.minVariantPrice} showDualCurrency={market.countryCode === 'BG'} />
                    </>
                  )}
                </p>
                {selectedVariant && (
                  <span className={cn(
                    "text-xs",
                    selectedVariant.availableForSale ? "text-green-600" : "text-red-600"
                  )}>
                    {selectedVariant.availableForSale ? '• In stock' : '• Out of stock'}
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
              className="flex-1 bg-black text-white h-11 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors"
            >
              {isAdding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  <span>{t('addingToCart')}</span>
                </>
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