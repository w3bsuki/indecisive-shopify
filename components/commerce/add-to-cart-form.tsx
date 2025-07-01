'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { VariantSelector } from './variant-selector'
import { ProductInfo } from './product-info'
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'

interface AddToCartFormProps {
  product: ShopifyProduct
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant | undefined>()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, cartReady } = useCart()

  // Initialize selected variant for single variant products
  useEffect(() => {
    if (product.variants.edges.length === 1) {
      setSelectedVariant(product.variants.edges[0].node)
    }
  }, [product])

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + delta)))
  }

  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariant.availableForSale || !cartReady || isAdding) return

    setIsAdding(true)
    try {
      // addItem is synchronous but triggers async cart update
      addItem(selectedVariant.id, quantity)
      
      // Reset after successful add
      setTimeout(() => {
        setQuantity(1)
        setIsAdding(false)
      }, 1000)
    } catch (_error) {
      setIsAdding(false)
    }
  }

  const isDisabled = !selectedVariant || !selectedVariant.availableForSale || !cartReady || isAdding

  return (
    <div className="space-y-6">
      {/* Product Info */}
      <ProductInfo product={product} selectedVariant={selectedVariant} />
      
      {/* Variant Selector */}
      {product.options.length > 0 && (
        <VariantSelector
          options={product.options}
          variants={product.variants.edges.map(e => e.node)}
          onVariantChange={setSelectedVariant}
        />
      )}

      {/* Quantity Selector */}
      <div className="space-y-2">
        <Label htmlFor="quantity" className="text-sm font-medium">
          Quantity
        </Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="h-10 w-10"
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
            className="h-10 w-10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={isDisabled}
          size="lg"
          className="flex-1"
        >
          {isAdding ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Adding to cart...
            </>
          ) : !selectedVariant ? (
            'Select options'
          ) : !selectedVariant.availableForSale ? (
            'Out of stock'
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to cart
            </>
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="px-4"
          title="Add to wishlist"
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
              In stock and ready to ship
            </p>
          ) : (
            <p className="text-red-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full" />
              Currently out of stock
            </p>
          )}
        </div>
      )}
    </div>
  )
}