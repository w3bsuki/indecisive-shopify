'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useWishlist } from '@/hooks/use-wishlist'
import { cn } from '@/lib/utils'
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'
import { useTranslations } from 'next-intl'
import { getColorFromName } from '@/lib/utils/product'
import { BackInStockForm } from './back-in-stock-form'

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
  const { toggleItem, isInWishlist } = useWishlist()
  const t = useTranslations('products')
  const tc = useTranslations('common')

  // Get all variants for easier processing
  const variants = useMemo(() => product.variants.edges.map(edge => edge.node), [product.variants])
  
  // Get size and color options
  const sizeOption = product.options?.find(opt => opt.name.toLowerCase() === 'size')
  // Support common synonyms/locales for color option
  const colorOption = product.options?.find(opt => {
    const n = opt.name.toLowerCase().trim()
    return n === 'color' || n === 'colour' || n === 'цвят'
  })
  const [selectedColor, setSelectedColor] = useState<string>()
  const [selectedSize, setSelectedSize] = useState<string>()

  // Initialize with first available variant or selections
  useEffect(() => {
    if (variants.length === 1) {
      const variant = variants[0]
      setSelectedVariant(variant)
      // Set initial selections based on variant
      variant.selectedOptions?.forEach(opt => {
        const n = opt.name.toLowerCase().trim()
        if (n === 'size') setSelectedSize(opt.value)
        if (n === 'color' || n === 'colour' || n === 'цвят') setSelectedColor(opt.value)
      })
    } else if (variants.length > 0) {
      // For products with only size options (no color), select the first available size
      const firstAvailable = variants.find(v => v.availableForSale) || variants[0]
      
      // If no color option exists, just select the first available variant
      if (!colorOption && firstAvailable) {
        const sizeOpt = firstAvailable.selectedOptions?.find(opt => opt.name.toLowerCase() === 'size')
        if (sizeOpt) {
          setSelectedSize(sizeOpt.value)
          setSelectedVariant(firstAvailable)
        }
      } else if (colorOption) {
        // Auto-select first available color
        const colorOpt = firstAvailable.selectedOptions?.find(opt => {
          const n = opt.name.toLowerCase().trim()
          return n === 'color' || n === 'colour' || n === 'цвят'
        })
        if (colorOpt) setSelectedColor(colorOpt.value)
      }
    }
  }, [variants, colorOption])

  // Find selected variant based on color and size
  const selectedVariantFromOptions = useMemo(() => {
    // For single variant products, return the only variant
    if (variants.length === 1) {
      return variants[0]
    }
    
    // For multi-variant products, need at least one selection
    if (!selectedColor && !selectedSize) return undefined
    
    return variants.find(variant => {
      const variantOptions = variant.selectedOptions || []
      const matchesColor = !selectedColor || variantOptions.some(opt => {
        const n = opt.name.toLowerCase().trim()
        return (n === 'color' || n === 'colour' || n === 'цвят') && opt.value === selectedColor
      })
      const matchesSize = !selectedSize || variantOptions.some(opt => 
        opt.name.toLowerCase() === 'size' && opt.value === selectedSize
      )
      return matchesColor && matchesSize
    })
  }, [variants, selectedColor, selectedSize])

  // Update selected variant when options change
  useEffect(() => {
    setSelectedVariant(selectedVariantFromOptions)
    
    // Emit variant change event for mobile footer AND image gallery
    if (typeof window !== 'undefined') {
      console.log('🎯 Form dispatching variant:', {
        variantId: selectedVariantFromOptions?.id,
        selectedColor,
        selectedSize,
        variantImage: selectedVariantFromOptions?.image?.url,
        variantOptions: selectedVariantFromOptions?.selectedOptions
      })
      window.dispatchEvent(new CustomEvent('variant-changed', {
        detail: { 
          variant: selectedVariantFromOptions,
          image: selectedVariantFromOptions?.image
        }
      }))
    }
  }, [selectedVariantFromOptions])

  // Get available sizes for selected color
  const availableSizes = useMemo(() => {
    if (!sizeOption?.values) return []
    
    return sizeOption.values.map(size => {
      const variant = variants.find(v => {
        const options = v.selectedOptions || []
        const hasColor = !selectedColor || options.some(opt => {
          const n = opt.name.toLowerCase().trim()
          return (n === 'color' || n === 'colour' || n === 'цвят') && opt.value === selectedColor
        })
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
        const hasColor = options.some(opt => {
          const n = opt.name.toLowerCase().trim()
          return (n === 'color' || n === 'colour' || n === 'цвят') && opt.value === color
        })
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
    if (!selectedVariant || !selectedVariant.availableForSale || !cartReady || isAdding) {
      return
    }

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

  // Use shared util to map color names to hex values (supports more locales/keywords)
  const getColorHex = (colorName: string): string => getColorFromName(colorName)

  return (
    <div className="space-y-4">
      {/* Color Selector */}
      {colorOption && availableColors.length > 0 && (
        <div className="space-y-2" role="radiogroup" aria-label={tc('color')}>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {tc('color')}{selectedColor && <span className="ml-2 text-gray-500 font-normal text-xs">{selectedColor}</span>}
            </Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableColors.map(({ value, available }) => {
              const isSelected = selectedColor === value
              return (
                <button
                  key={value}
                  onClick={() => available && handleColorSelect(value)}
                  disabled={!available}
                  role="radio"
                  aria-checked={isSelected}
                  className={cn(
                    "relative w-8 h-8 border transition-all touch-manipulation rounded-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
                    isSelected ? "border-black border-2 ring-2 ring-black ring-offset-2" : "border-gray-300 hover:border-gray-500",
                    !available && "opacity-40 cursor-not-allowed"
                  )}
                  title={value}
                  aria-label={`${tc('select')} ${value} ${tc('color')}`}
                >
                  <span
                    className="absolute inset-0.5 block rounded-full"
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
        <div className="space-y-2" role="radiogroup" aria-label={tc('size')}>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {tc('size')}{selectedSize && <span className="ml-2 text-gray-500 font-normal text-xs">{selectedSize}</span>}
            </Label>
            <button
              onClick={() => setShowSizeGuide(true)}
              className="text-sm text-gray-600 hover:text-black underline underline-offset-2"
            >
              {tc('sizeGuide')}
            </button>
          </div>
          
          {/* Size Grid */}
          <div className="flex flex-wrap gap-2">
            {availableSizes.map(({ value, available }) => {
              const isSelected = selectedSize === value
              return (
                <button
                  key={value}
                  onClick={() => available && handleSizeSelect(value)}
                  disabled={!available}
                  role="radio"
                  aria-checked={isSelected}
                  className={cn(
                    "relative h-10 px-4 min-w-[60px] border text-sm font-medium transition-all touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
                    "flex items-center justify-center rounded-md",
                    isSelected 
                      ? "border-black bg-black text-white" 
                      : "border-gray-300 hover:border-black hover:bg-gray-50",
                    !available && "opacity-40 cursor-not-allowed line-through bg-gray-50 text-gray-400"
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

      {/* Quantity Selector - Desktop Only */}
      <div className="hidden md:block space-y-3">
        <div className="flex items-center justify-start">
          <Label className="text-sm font-medium">{tc('quantity')}</Label>
        </div>
        <div className="flex items-center bg-gray-50 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-l-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="w-16 text-center">
            <span className="text-base font-medium">{quantity}</span>
          </div>
          <button
            type="button"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= 10}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-r-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons - Desktop Only */}
      <div className="hidden md:flex gap-3">
        {selectedVariant && !selectedVariant.availableForSale ? (
          <BackInStockForm
            productTitle={product.title}
            variantTitle={selectedVariant.title !== 'Default Title' ? selectedVariant.title : undefined}
            productId={product.id}
            variantId={selectedVariant.id}
          />
        ) : (
          <Button
            onClick={handleAddToCart}
            disabled={isDisabled}
            size="lg"
            className="flex-1 h-14 touch-manipulation bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-colors"
          >
            {isAdding ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                <span>{t('addingToCart')}</span>
              </>
            ) : !selectedVariant ? (
              <span>{sizeOption && !selectedSize ? t('selectSize') : tc('selectOptions')}</span>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                <span className="font-medium">{t('addToCart')}</span>
              </>
            )}
          </Button>
        )}
        
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn(
            "px-6 h-14 touch-manipulation transition-colors rounded-xl border-gray-200 hover:bg-gray-50",
            isInWishlist(product.id)
              ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
              : "text-gray-600 hover:text-red-500 hover:border-red-200"
          )}
          title={isInWishlist(product.id) ? t('removeFromWishlist') : t('addToWishlist')}
          onClick={() => {
            toggleItem({
              id: product.id,
              handle: product.handle,
              title: product.title,
              image: product.featuredImage?.url,
              price: selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount
            })
          }}
        >
          <Heart className={cn("h-5 w-5", isInWishlist(product.id) && "fill-current")} />
        </Button>
      </div>

      {/* Stock Status - Hidden on mobile (shown in bottom sheet) */}
      <div aria-live="polite" className="hidden md:block text-sm">
        {selectedVariant && (
          selectedVariant.availableForSale ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium w-fit">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>{t('available')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-medium w-fit">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span>{tc('outOfStock')}</span>
            </div>
          )
        )}
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowSizeGuide(false)}>
          <div className="bg-white max-w-md w-full p-6 max-h-[80vh] overflow-y-auto rounded-2xl shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">{tc('sizeGuide')}</h3>
              <button 
                onClick={() => setShowSizeGuide(false)} 
                className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
