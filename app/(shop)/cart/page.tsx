'use client'

// Force dynamic rendering for cart page (can't prerender due to client context)
export const dynamic = 'force-dynamic'

import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Minus, Plus, X, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Money } from '@/components/commerce/money'
import { DiscountCodeForm } from '@/components/cart/discount-code-form'

export default function CartPage() {
  const { lines, cost, totalItems, updateItem, removeItem, clearCart, isEmpty, isLoading, checkoutUrl } = useCart()

  const handleCheckout = () => {
    console.log('Checkout URL:', checkoutUrl)
    console.log('Cart lines:', lines)
    console.log('Total items:', totalItems)
    
    // Redirect directly to Shopify checkout
    if (checkoutUrl) {
      // The checkoutUrl from Shopify should be used directly - it points to Shopify's domain
      // Don't transform it since the lib/checkout.ts transformCheckoutUrl function may have already transformed it
      console.log('Redirecting to checkout URL:', checkoutUrl)
      window.location.href = checkoutUrl
    } else {
      // Fallback - navigate to checkout page if no direct URL
      console.error('No checkout URL available, using fallback')
      window.location.href = '/checkout'
    }
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
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Shopping Cart ({totalItems})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {lines?.map((line) => line && line.merchandise && line.merchandise.product ? (
            <div key={line.id} className="border border-gray-200 hover:border-gray-300 transition-colors p-4 bg-white">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="w-full sm:w-24 h-32 sm:h-24 bg-gray-100 relative">
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
                      className="p-2 hover:bg-gray-100 transition-colors rounded-md"
                      aria-label={`Remove ${line.merchandise.product.title} from cart`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => line.id && line.quantity && updateItem(line.id, Math.max(1, line.quantity - 1))}
                        disabled={!line.quantity || line.quantity <= 1 || isLoading}
                        className="w-10 h-10 sm:w-8 sm:h-8 border border-gray-300 hover:border-gray-400 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-md"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-14 text-center font-mono text-base sm:text-sm">{line.quantity || 0}</span>
                      <button
                        onClick={() => line.id && line.quantity && updateItem(line.id, line.quantity + 1)}
                        disabled={isLoading}
                        className="w-10 h-10 sm:w-8 sm:h-8 border border-gray-300 hover:border-gray-400 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 transition-colors rounded-md"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <p className="font-mono font-medium text-base sm:text-sm">
                      {line.cost?.totalAmount?.amount && line.cost?.totalAmount?.currencyCode ? (
                        <Money data={line.cost.totalAmount as any} />
                      ) : (
                        '$0.00'
                      )}
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
          <div className="border border-gray-200 shadow-lg p-4 sm:p-6 space-y-4 sticky top-4">
            <h2 className="text-base sm:text-lg font-bold">Order Summary</h2>
            
            <div className="space-y-2 py-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">
                  {cost?.subtotalAmount?.amount && cost?.subtotalAmount?.currencyCode ? (
                    <Money data={cost.subtotalAmount as any} />
                  ) : (
                    '$0.00'
                  )}
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
                  {cost?.totalAmount?.amount && cost?.totalAmount?.currencyCode ? (
                    <Money data={cost.totalAmount as any} />
                  ) : (
                    '$0.00'
                  )}
                </span>
              </div>

              {/* Discount Code */}
              <div className="mb-4">
                <DiscountCodeForm />
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
            <div className="text-xs text-gray-600 pt-4 text-center">
              <p className="flex items-center justify-center gap-1">
                <span aria-hidden="true">🔒</span>
                <span>Secure checkout powered by Shopify</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}