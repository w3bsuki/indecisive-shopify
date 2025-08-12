'use client'

import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Minus, Plus, X, ShoppingBag, ArrowRight, Truck, Shield, Gift } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Money } from '@/components/commerce/money'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ProgressIndicator } from '@/components/ui/visual-feedback'

interface CartSlideoutProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSlideout({ isOpen, onClose }: CartSlideoutProps) {
  const { lines, cost, totalItems, updateItem, removeItem, isEmpty, isLoading, checkoutUrl } = useCart()
  const slideoutRef = useRef<HTMLDivElement>(null)
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())
  const [showFreeShippingProgress, setShowFreeShippingProgress] = useState(true)
  
  // Free shipping calculation
  const freeShippingThreshold = 75
  const currentTotal = parseFloat(cost?.totalAmount?.amount || '0')
  const freeShippingProgress = Math.min((currentTotal / freeShippingThreshold) * 100, 100)
  const amountToFreeShipping = Math.max(freeShippingThreshold - currentTotal, 0)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (slideoutRef.current && !slideoutRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleCheckout = () => {
    if (checkoutUrl) {
      // Use checkoutUrl directly - it should point to Shopify's domain
      window.location.href = checkoutUrl
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItems(prev => new Set(prev).add(itemId))
    
    // Add animation delay
    setTimeout(() => {
      removeItem(itemId)
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }, 300)
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      
      {/* Slideout */}
      <div 
        ref={slideoutRef}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Enhanced Header */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Shopping Cart ({totalItems})</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors interactive-element"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Free Shipping Progress */}
          {!isEmpty && showFreeShippingProgress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>
                    {freeShippingProgress >= 100 
                      ? "🎉 You get free shipping!" 
                      : `$${amountToFreeShipping.toFixed(2)} away from free shipping`
                    }
                  </span>
                </div>
                <button
                  onClick={() => setShowFreeShippingProgress(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <ProgressIndicator 
                progress={freeShippingProgress} 
                className="h-1"
              />
            </div>
          )}
        </div>

        {/* Cart content */}
        <div className="flex flex-col h-[calc(100%-64px)]">
          {isEmpty ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add some products to get started</p>
              <Button onClick={onClose} className="font-mono">
                CONTINUE SHOPPING
              </Button>
            </div>
          ) : (
            <>
              {/* Enhanced Cart items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {lines?.map((line) => line && line.merchandise && line.merchandise.product ? (
                  <div 
                    key={line.id} 
                    className={cn(
                      "border border-gray-200 p-3 rounded-lg bg-white shadow-sm transition-all duration-300 cart-item-enter",
                      removingItems.has(line.id || '') && "cart-item-exit opacity-0 scale-95"
                    )}
                  >
                    <div className="flex gap-3">
                      {/* Enhanced Product Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-md relative flex-shrink-0 overflow-hidden group">
                        {line.merchandise.product.featuredImage?.url ? (
                          <Image
                            src={line.merchandise.product.featuredImage.url}
                            alt={line.merchandise.product.title || 'Product image'}
                            fill
                            className="object-cover rounded-md transition-transform duration-200 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Enhanced Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm leading-tight hover:text-blue-600 transition-colors cursor-pointer">
                            {line.merchandise.product.title}
                          </h4>
                          <button
                            onClick={() => line.id && handleRemoveItem(line.id)}
                            className="p-1 hover:bg-red-50 hover:text-red-600 rounded-md transition-all duration-200 flex-shrink-0 ml-2 interactive-element"
                            aria-label={`Remove ${line.merchandise.product.title}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {line.merchandise.title !== 'Default Title' && (
                          <p className="text-xs text-gray-600 mb-2 bg-gray-50 px-2 py-1 rounded text-center">
                            {line.merchandise.title}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          {/* Enhanced Quantity Controls */}
                          <div className="flex items-center gap-1 bg-gray-50 rounded-md p-1">
                            <button
                              onClick={() => line.id && line.quantity && updateItem(line.id, Math.max(1, line.quantity - 1))}
                              disabled={!line.quantity || line.quantity <= 1 || isLoading}
                              className="w-6 h-6 border border-gray-300 hover:border-gray-400 flex items-center justify-center hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded interactive-element"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-mono text-sm font-medium px-2">
                              {line.quantity || 0}
                            </span>
                            <button
                              onClick={() => line.id && line.quantity && updateItem(line.id, line.quantity + 1)}
                              disabled={isLoading}
                              className="w-6 h-6 border border-gray-300 hover:border-gray-400 flex items-center justify-center hover:bg-white transition-all duration-200 rounded interactive-element"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Enhanced Price Display */}
                          <div className="font-mono font-bold text-sm text-right">
                            {line.cost?.totalAmount?.amount && line.cost?.totalAmount?.currencyCode ? (
                              <Money data={line.cost.totalAmount as any} />
                            ) : (
                              '$0.00'
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null)}
              </div>

              {/* Enhanced Footer */}
              <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
                {/* Subtotal and Shipping Info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-mono font-medium">
                      {cost?.subtotalAmount?.amount && cost?.subtotalAmount?.currencyCode ? (
                        <Money data={cost.subtotalAmount as any} />
                      ) : (
                        '$0.00'
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className={cn(
                      "font-medium",
                      freeShippingProgress >= 100 ? "text-green-600" : "text-gray-600"
                    )}>
                      {freeShippingProgress >= 100 ? "FREE" : "Calculated at checkout"}
                    </span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg font-mono">
                      {cost?.totalAmount?.amount && cost?.totalAmount?.currencyCode ? (
                        <Money data={cost.totalAmount as any} />
                      ) : (
                        '$0.00'
                      )}
                    </span>
                  </div>
                </div>

                {/* Enhanced Buttons */}
                <div className="space-y-3">
                  <Button 
                    className="w-full font-mono btn-modern hover:shadow-lg" 
                    onClick={handleCheckout}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        PROCESSING...
                      </div>
                    ) : (
                      <>
                        SECURE CHECKOUT
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  
                  <Link href="/cart" onClick={onClose} className="block">
                    <Button variant="outline" className="w-full font-mono interactive-element">
                      VIEW FULL CART
                    </Button>
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      <span>SSL Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      <span>Fast Shipping</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      <span>Easy Returns</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600 text-center">
                    <p className="flex items-center justify-center gap-1">
                      <span>🔒</span>
                      <span>Secure checkout powered by Shopify</span>
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}