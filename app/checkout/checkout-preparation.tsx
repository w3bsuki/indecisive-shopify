'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/use-cart'
import { useMarket } from '@/hooks/use-market'
import { navigateToCheckout, getCheckoutUrlFromCart } from '@/lib/checkout'
import { GuestCheckoutOption } from './guest-checkout-option'
import { 
  Loader2, 
  ShoppingBag, 
  CreditCard, 
  Shield, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  User,
  MapPin
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'

interface CheckoutPreparationProps {
  returnUrl?: string
}

export function CheckoutPreparation({ returnUrl }: CheckoutPreparationProps) {
  const { cart, lines, cost, totalQuantity, isEmpty, isLoading } = useCart()
  const { formatPrice } = useMarket()
  const [isPreparingCheckout, setIsPreparingCheckout] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showGuestOption, setShowGuestOption] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const handleCheckout = useCallback(async () => {
    try {
      setIsPreparingCheckout(true)
      setError(null)

      const checkoutUrl = getCheckoutUrlFromCart(cart)
      
      if (!checkoutUrl) {
        throw new Error('No checkout URL available. Please try adding items to your cart again.')
      }

      // Prepare and navigate to checkout with customer data pre-population
      // Guest checkout is supported by default
      await navigateToCheckout(checkoutUrl, {
        redirectToLogin: false, // Allow guest checkout
        returnUrl: returnUrl || '/checkout'
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to prepare checkout')
      setIsPreparingCheckout(false)
      
      toast.error('Checkout preparation failed', {
        description: 'Please try again or contact support if the issue persists.'
      })
    }
  }, [cart, returnUrl])

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/status', { credentials: 'include' })
        const { authenticated } = await response.json()
        
        if (!authenticated) {
          setShowGuestOption(true)
        } else {
          // User is authenticated, proceed with auto-checkout
          if (!isEmpty && !isLoading) {
            const timer = setTimeout(() => {
              handleCheckout()
            }, 1000)
            return () => clearTimeout(timer)
          }
        }
      } catch (_error) {
        // Auth check failed, default to guest option
        setShowGuestOption(true)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuthStatus()
  }, [isEmpty, isLoading, handleCheckout])

  // Auto-start checkout preparation only for authenticated users
  useEffect(() => {
    if (!showGuestOption && !isEmpty && !isLoading && !isPreparingCheckout && !error && !isCheckingAuth) {
      const timer = setTimeout(() => {
        handleCheckout()
      }, 1000) // 1 second delay to show the UI
      
      return () => clearTimeout(timer)
    }
  }, [showGuestOption, isEmpty, isLoading, isPreparingCheckout, error, isCheckingAuth, handleCheckout])

  // If cart is empty, show empty state
  if (isEmpty && !isLoading && !isCheckingAuth) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto border border-gray-200">
          <CardContent className="py-12 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-bold font-mono mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">
              Add some items to your cart before checking out.
            </p>
            <Link href="/products">
              <Button className="font-mono">
                Continue Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show guest checkout option for non-authenticated users
  if (showGuestOption && !isCheckingAuth && !isEmpty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/cart">
              <Button variant="outline" size="sm" className="font-mono border border-gray-300 hover:border-gray-400">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold font-mono">Checkout Options</h1>
              <p className="text-sm text-gray-600">
                Choose how you&apos;d like to complete your purchase
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Options */}
            <div className="lg:col-span-1">
              <GuestCheckoutOption 
                onGuestCheckout={handleCheckout}
                isLoading={isPreparingCheckout}
              />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border border-gray-200 shadow-sm sticky top-8">
                <CardHeader>
                  <CardTitle className="font-mono flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order Summary
                    <Badge variant="secondary">{totalQuantity} items</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items Preview */}
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {lines?.slice(0, 3).map((item) => 
                      item ? (
                        <div key={item.id} className="flex gap-3 text-sm">
                          <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden">
                            {item.merchandise?.product?.featuredImage ? (
                              <Image
                                src={item.merchandise.product.featuredImage.url || ''}
                                alt={item.merchandise.product.title || 'Product'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium line-clamp-1">
                              {item.merchandise?.product?.title}
                            </p>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Qty: {item.quantity}</span>
                              <span className="font-medium">
                                {formatPrice(item.cost?.totalAmount?.amount || '0', item.cost?.totalAmount?.currencyCode || 'USD')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : null
                    )}
                    {lines && lines.length > 3 && (
                      <p className="text-sm text-gray-600 text-center">
                        +{lines.length - 3} more items
                      </p>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{cost?.subtotalAmount?.amount && cost?.subtotalAmount?.currencyCode ? formatPrice(cost.subtotalAmount.amount, cost.subtotalAmount.currencyCode) : '$0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>{cost?.totalAmount?.amount && cost?.totalAmount?.currencyCode ? formatPrice(cost.totalAmount.amount, cost.totalAmount.currencyCode) : '$0.00'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If there's an error, show error state with retry option
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto border border-red-200">
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              Checkout Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-600">{error}</p>
            <div className="flex gap-3">
              <Button 
                onClick={handleCheckout}
                disabled={isPreparingCheckout}
                className="font-mono"
              >
                {isPreparingCheckout ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  'Try Again'
                )}
              </Button>
              <Link href="/cart">
                <Button variant="outline" className="font-mono border border-gray-300 hover:border-gray-400">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Cart
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show checkout preparation UI
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/cart">
            <Button variant="outline" size="sm" className="font-mono border-2 border-black">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-mono">Secure Checkout</h1>
            <p className="text-sm text-gray-600">
              Preparing your order for secure payment
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="font-mono flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Order Summary
                <Badge variant="secondary">{totalQuantity} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {lines?.map((item) => 
                  item ? (
                    <div key={item.id} className="flex gap-3 p-3 border border-gray-100 rounded">
                      <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden">
                        {item.merchandise?.product?.featuredImage ? (
                          <Image
                            src={item.merchandise.product.featuredImage.url || ''}
                            alt={item.merchandise.product.featuredImage.altText || item.merchandise.product.title || 'Product'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">
                          {item.merchandise?.product?.title || 'Product'}
                        </h4>
                        {item.merchandise?.title && item.merchandise.title !== 'Default Title' && (
                          <p className="text-xs text-gray-600">{item.merchandise.title}</p>
                        )}
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          <span className="font-medium text-sm">
                            {formatPrice(item.cost?.totalAmount?.amount || '0', item.cost?.totalAmount?.currencyCode || 'USD')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{cost?.subtotalAmount?.amount && cost?.subtotalAmount?.currencyCode ? formatPrice(cost.subtotalAmount.amount, cost.subtotalAmount.currencyCode) : '$0.00'}</span>
                </div>
                {cost?.totalTaxAmount?.amount && parseFloat(cost.totalTaxAmount.amount) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{cost.totalTaxAmount?.amount && cost.totalTaxAmount?.currencyCode ? formatPrice(cost.totalTaxAmount.amount, cost.totalTaxAmount.currencyCode) : '$0.00'}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{cost?.totalAmount?.amount && cost?.totalAmount?.currencyCode ? formatPrice(cost.totalAmount.amount, cost.totalAmount.currencyCode) : '$0.00'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Status */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="font-mono flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Checkout Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preparation Steps */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {isPreparingCheckout ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  <div>
                    <p className="font-medium">Cart Validation</p>
                    <p className="text-sm text-gray-600">Verifying items and pricing</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isPreparingCheckout ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  ) : (
                    <User className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium">Customer Information</p>
                    <p className="text-sm text-gray-600">Preparing your account details</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isPreparingCheckout ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  ) : (
                    <MapPin className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium">Shipping Options</p>
                    <p className="text-sm text-gray-600">Loading delivery methods</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isPreparingCheckout ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  ) : (
                    <Shield className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium">Secure Payment</p>
                    <p className="text-sm text-gray-600">Redirecting to secure checkout</p>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 p-4 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Secure Checkout</span>
                </div>
                <p className="text-sm text-green-700">
                  Your payment information is processed securely by Shopify. 
                  We never store your payment details.
                </p>
              </div>

              {/* Manual Continue Button (if auto-redirect fails) */}
              {!isPreparingCheckout && (
                <Button 
                  onClick={handleCheckout}
                  className="w-full font-mono"
                  size="lg"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Continue to Secure Checkout
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Protected by 256-bit SSL encryption • 
            Powered by Shopify Payments • 
            <Link href="/privacy-policy" className="underline hover:text-black">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}