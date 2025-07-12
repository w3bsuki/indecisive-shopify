'use client'

import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Money } from '@/components/commerce/money'
import { useEffect, useRef } from 'react'

interface CartSlideoutProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSlideout({ isOpen, onClose }: CartSlideoutProps) {
  const { lines, cost, totalItems, updateItem, removeItem, isEmpty, isLoading, checkoutUrl } = useCart()
  const slideoutRef = useRef<HTMLDivElement>(null)

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
      const shopifyUrl = checkoutUrl.replace('https://www.indecisivewear.com', 'https://indecisive-wear.myshopify.com')
      window.location.href = shopifyUrl
    }
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
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">Shopping Cart ({totalItems})</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
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
              {/* Cart items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {lines?.map((line) => line && line.merchandise && line.merchandise.product ? (
                  <div key={line.id} className="border border-gray-200 p-3 rounded-lg bg-gray-50">
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-md relative flex-shrink-0">
                        {line.merchandise.product.featuredImage?.url ? (
                          <Image
                            src={line.merchandise.product.featuredImage.url}
                            alt={line.merchandise.product.title || 'Product image'}
                            fill
                            className="object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm leading-tight">
                            {line.merchandise.product.title}
                          </h4>
                          <button
                            onClick={() => line.id && removeItem(line.id)}
                            className="p-1 hover:bg-gray-200 rounded-md transition-colors flex-shrink-0 ml-2"
                            aria-label={`Remove ${line.merchandise.product.title}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {line.merchandise.title !== 'Default Title' && (
                          <p className="text-xs text-gray-600 mb-2">{line.merchandise.title}</p>
                        )}

                        <div className="flex items-center justify-between">
                          {/* Quantity */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => line.id && line.quantity && updateItem(line.id, Math.max(1, line.quantity - 1))}
                              disabled={!line.quantity || line.quantity <= 1 || isLoading}
                              className="w-7 h-7 border border-gray-300 hover:border-gray-400 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-md"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-mono text-sm">{line.quantity || 0}</span>
                            <button
                              onClick={() => line.id && line.quantity && updateItem(line.id, line.quantity + 1)}
                              disabled={isLoading}
                              className="w-7 h-7 border border-gray-300 hover:border-gray-400 flex items-center justify-center hover:bg-gray-100 transition-colors rounded-md"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="font-mono font-medium text-sm">
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

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 space-y-4">
                {/* Total */}
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

                {/* Buttons */}
                <div className="space-y-2">
                  <Button 
                    className="w-full font-mono" 
                    onClick={handleCheckout}
                    disabled={isLoading}
                  >
                    {isLoading ? 'LOADING...' : 'CHECKOUT'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <Link href="/cart" onClick={onClose} className="block">
                    <Button variant="outline" className="w-full font-mono">
                      VIEW CART
                    </Button>
                  </Link>
                </div>

                {/* Security notice */}
                <div className="text-xs text-gray-600 text-center">
                  <p className="flex items-center justify-center gap-1">
                    <span>🔒</span>
                    <span>Secure checkout powered by Shopify</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}