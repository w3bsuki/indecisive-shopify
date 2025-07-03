'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { cn } from '@/lib/utils'
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'
import { useTranslations } from 'next-intl'

interface AddToCartFormProps {
  product: ShopifyProduct
  showProductInfo?: boolean
}

export function AddToCartForm({ product, showProductInfo: _showProductInfo = true }: AddToCartFormProps) {
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant | undefined>()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const { addItem, cartReady } = useCart()
  const t = useTranslations('products')
  const tc = useTranslations('common')

  // Get all variants for easier processing
  const variants = useMemo(() => product.variants.edges.map(edge => edge.node), [product.variants])
  
  // Get size and color options
  const sizeOption = product.options?.find(opt => opt.name.toLowerCase() === 'size')
  const colorOption = product.options?.find(opt => opt.name.toLowerCase() === 'color')
  const [selectedColor, setSelectedColor] = useState<string>()
  const [selectedSize, setSelectedSize] = useState<string>()

  // Initialize with first available variant or selections
  useEffect(() => {
    if (variants.length === 1) {
      const variant = variants[0]
      setSelectedVariant(variant)
      // Set initial selections based on variant
      variant.selectedOptions?.forEach(opt => {
        if (opt.name.toLowerCase() === 'size') setSelectedSize(opt.value)
        if (opt.name.toLowerCase() === 'color') setSelectedColor(opt.value)
      })
    } else if (variants.length > 0) {
      // Auto-select first available color
      const firstAvailable = variants.find(v => v.availableForSale) || variants[0]
      const colorOpt = firstAvailable.selectedOptions?.find(opt => opt.name.toLowerCase() === 'color')
      if (colorOpt) setSelectedColor(colorOpt.value)
    }
  }, [variants])

  // Find selected variant based on color and size
  const selectedVariantFromOptions = useMemo(() => {
    if (!selectedColor && !selectedSize) return undefined
    
    return variants.find(variant => {
      const variantOptions = variant.selectedOptions || []
      const matchesColor = !selectedColor || variantOptions.some(opt => 
        opt.name.toLowerCase() === 'color' && opt.value === selectedColor
      )
      const matchesSize = !selectedSize || variantOptions.some(opt => 
        opt.name.toLowerCase() === 'size' && opt.value === selectedSize
      )
      return matchesColor && matchesSize
    })
  }, [variants, selectedColor, selectedSize])

  // Update selected variant when options change
  useEffect(() => {
    setSelectedVariant(selectedVariantFromOptions)
    
    // Emit variant change event for mobile footer
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('variant-changed', {
        detail: { variant: selectedVariantFromOptions }
      }))
    }
  }, [selectedVariantFromOptions])

  // Get available sizes for selected color
  const availableSizes = useMemo(() => {
    if (!sizeOption?.values) return []
    
    return sizeOption.values.map(size => {
      const variant = variants.find(v => {
        const options = v.selectedOptions || []
        const hasColor = !selectedColor || options.some(opt => 
          opt.name.toLowerCase() === 'color' && opt.value === selectedColor
        )
        const hasSize = options.some(opt => 
          opt.name.toLowerCase() === 'size' && opt.value === size
        )
        return hasColor && hasSize
      })
      
      return {
        value: size,
        available: variant?.availableForSale || false,
        variant
      }
    })
  }, [sizeOption, variants, selectedColor])

  // Get available colors
  const availableColors = useMemo(() => {
    if (!colorOption?.values) return []
    
    return colorOption.values.map(color => {
      const hasAvailableVariant = variants.some(v => {
        const options = v.selectedOptions || []
        const hasColor = options.some(opt => 
          opt.name.toLowerCase() === 'color' && opt.value === color
        )
        return hasColor && v.availableForSale
      })
      
      return {
        value: color,
        available: hasAvailableVariant
      }
    })
  }, [colorOption, variants])

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + delta)))
  }

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    // Clear size selection when color changes
    setSelectedSize(undefined)
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
  }

  const handleAddToCart = useCallback(async () => {
    if (!selectedVariant || !selectedVariant.availableForSale || !cartReady || isAdding) return

    setIsAdding(true)
    try {
      // addItem now uses optimistic updates for instant feedback
      await addItem(selectedVariant.id, quantity)
      
      // Reset after successful add (reduced timeout since feedback is instant)
      setTimeout(() => {
        setQuantity(1)
        setIsAdding(false)
      }, 300)
    } catch (_error) {
      setIsAdding(false)
    }
  }, [selectedVariant, cartReady, isAdding, addItem, quantity])

  // Listen for external add to cart trigger (from mobile footer)
  useEffect(() => {
    const handleTriggerAddToCart = () => {
      handleAddToCart()
    }

    window.addEventListener('trigger-add-to-cart', handleTriggerAddToCart)
    return () => window.removeEventListener('trigger-add-to-cart', handleTriggerAddToCart)
  }, [handleAddToCart])

  const isDisabled = !selectedVariant || !selectedVariant.availableForSale || !cartReady || isAdding

  // Map color names to hex values for swatches
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

  return (
    <div className="space-y-6">
      {/* Color Selector */}
      {colorOption && availableColors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {tc('color')}{selectedColor && <span className="ml-2 text-gray-600 font-normal">{selectedColor}</span>}
            </Label>
          </div>
          <div className="flex flex-wrap gap-3">
            {availableColors.map(({ value, available }) => {
              const isSelected = selectedColor === value
              return (
                <button
                  key={value}
                  onClick={() => available && handleColorSelect(value)}
                  disabled={!available}
                  className={cn(
                    "relative w-12 h-12 border-2 transition-all touch-manipulation",
                    isSelected ? "border-black scale-110 shadow-lg" : "border-gray-200 hover:border-gray-400",
                    !available && "opacity-40 cursor-not-allowed"
                  )}
                  title={value}
                  aria-label={`${tc('select')} ${value} ${tc('color')}`}
                >
                  <span
                    className="absolute inset-1 block"
                    style={{ backgroundColor: getColorHex(value) }}
                  />
                  {!available && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-8 h-[1px] bg-gray-500 rotate-45" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Size Selector - Nike Style Grid */}
      {sizeOption && availableSizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {tc('size')}{selectedSize && <span className="ml-2 text-gray-600 font-normal">{selectedSize}</span>}
            </Label>
            <button
              onClick={() => setShowSizeGuide(true)}
              className="text-sm text-gray-600 hover:text-black underline underline-offset-2"
            >
              {tc('sizeGuide')}
            </button>
          </div>
          
          {/* Size Grid */}
          <div className="grid grid-cols-3 gap-2">
            {availableSizes.map(({ value, available }) => {
              const isSelected = selectedSize === value
              return (
                <button
                  key={value}
                  onClick={() => available && handleSizeSelect(value)}
                  disabled={!available}
                  className={cn(
                    "relative h-12 border-2 text-sm font-medium transition-all touch-manipulation",
                    "flex items-center justify-center",
                    isSelected 
                      ? "border-black bg-black text-white" 
                      : "border-gray-200 hover:border-gray-400",
                    !available && "opacity-40 cursor-not-allowed line-through bg-gray-50"
                  )}
                  aria-label={`${tc('select')} ${tc('size')} ${value}`}
                >
                  {value}
                  {!available && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-6 h-[1px] bg-gray-400 rotate-45" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          
          {!selectedSize && sizeOption && (
            <p className="text-sm text-gray-600">{t('selectSize')}</p>
          )}
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{tc('quantity')}</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="h-10 w-10 touch-manipulation"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="w-16 text-center">
            <span className="text-lg font-medium">{quantity}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= 10}
            className="h-10 w-10 touch-manipulation"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Action Buttons - Hide on mobile as mobile footer handles it */}
      <div className="hidden md:flex gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={isDisabled}
          size="lg"
          className="flex-1 h-12 touch-manipulation"
        >
          {isAdding ? (
            <>
              <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin mr-2" />
              {t('addingToCart')}
            </>
          ) : !selectedVariant ? (
            sizeOption && !selectedSize ? t('selectSize') : tc('selectOptions')
          ) : !selectedVariant.availableForSale ? (
            t('soldOut')
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              {t('addToCart')}
            </>
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="px-4 h-12 touch-manipulation"
          title={t('addToWishlist')}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      {/* Stock Status */}
      {selectedVariant && (
        <div className="text-sm">
          {selectedVariant.availableForSale ? (
            <p className="text-green-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full" />
              {tc('inStock')}
            </p>
          ) : (
            <p className="text-red-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full" />
              {tc('outOfStock')}
            </p>
          )}
        </div>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowSizeGuide(false)}>
          <div className="bg-white max-w-md w-full p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{tc('sizeGuide')}</h3>
              <button onClick={() => setShowSizeGuide(false)} className="text-gray-500 hover:text-black">
                ×
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{tc('sizeGuideNote')}</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">{tc('size')}</th>
                    <th className="text-center py-2">{tc('measurements')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">S</td>
                    <td className="text-center py-2">Chest 36-38&quot;</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">M</td>
                    <td className="text-center py-2">Chest 40-42&quot;</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">L</td>
                    <td className="text-center py-2">Chest 44-46&quot;</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">XL</td>
                    <td className="text-center py-2">Chest 48-50&quot;</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}