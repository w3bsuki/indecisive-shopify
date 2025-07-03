'use client'

// Force dynamic rendering for cart page (can't prerender due to client context)
export const dynamic = 'force-dynamic'

import { useCart } from '@/hooks/use-cart'
import { useMarket } from '@/hooks/use-market'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, X, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { lines, cost, totalItems, updateItem, removeItem, clearCart, isEmpty, isLoading } = useCart()
  const { formatPrice } = useMarket()

  const handleCheckout = () => {
    // Navigate to our enhanced checkout page for smooth experience
    window.location.href = '/checkout'
  }

  if (isEmpty) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold font-mono mb-2">YOUR CART IS EMPTY</h1>
          <p className="text-gray-600 mb-8">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/products">
            <Button size="lg" className="font-mono">
              CONTINUE SHOPPING
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold font-mono mb-8">SHOPPING CART ({totalItems})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {lines?.map((line) => line && line.merchandise && line.merchandise.product ? (
            <div key={line.id} className="border-2 border-black p-4">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-100 relative">
                  {line.merchandise.product.featuredImage?.url ? (
                    <Image
                      src={line.merchandise.product.featuredImage.url}
                      alt={line.merchandise.product.title || 'Product image'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/products/${line.merchandise.product.handle}`}>
                        <h3 className="font-medium hover:underline">
                          {line.merchandise.product.title}
                        </h3>
                      </Link>
                      {line.merchandise.title !== 'Default Title' && (
                        <p className="text-sm text-gray-600 mt-1">{line.merchandise.title}</p>
                      )}
                    </div>
                    <button
                      onClick={() => line.id && removeItem(line.id)}
                      className="p-1 hover:bg-gray-100 transition-colors"
                      aria-label="Remove item"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => line.id && line.quantity && updateItem(line.id, Math.max(1, line.quantity - 1))}
                        disabled={!line.quantity || line.quantity <= 1 || isLoading}
                        className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-mono">{line.quantity || 0}</span>
                      <button
                        onClick={() => line.id && line.quantity && updateItem(line.id, line.quantity + 1)}
                        disabled={isLoading}
                        className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <p className="font-mono font-medium">
                      {line.cost?.totalAmount?.amount && line.cost?.totalAmount?.currencyCode 
                        ? formatPrice(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)
                        : '$0.00'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null)}

          {/* Clear Cart Button */}
          <div className="pt-4">
            <Button 
              variant="outline" 
              onClick={clearCart}
              disabled={isLoading}
              className="font-mono"
            >
              CLEAR CART
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border-2 border-black p-6 space-y-4">
            <h2 className="text-xl font-bold font-mono">ORDER SUMMARY</h2>
            
            <div className="space-y-2 py-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">
                  {cost?.subtotalAmount?.amount && cost?.subtotalAmount?.currencyCode
                    ? formatPrice(cost.subtotalAmount.amount, cost.subtotalAmount.currencyCode)
                    : '$0.00'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-gray-600">Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="text-gray-600">Calculated at checkout</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold font-mono">
                  {cost?.totalAmount?.amount && cost?.totalAmount?.currencyCode
                    ? formatPrice(cost.totalAmount.amount, cost.totalAmount.currencyCode)
                    : '$0.00'
                  }
                </span>
              </div>

              {/* Discount Code */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Discount code" 
                    className="font-mono"
                  />
                  <Button variant="outline" className="font-mono">
                    APPLY
                  </Button>
                </div>
              </div>

              {/* Checkout Button */}
              <Button 
                className="w-full font-mono" 
                size="lg"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? 'LOADING...' : 'PROCEED TO CHECKOUT'}
              </Button>
            </div>

            {/* Security Notice */}
            <div className="text-xs text-gray-600 pt-4">
              <p>🔒 Secure checkout powered by Shopify</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}