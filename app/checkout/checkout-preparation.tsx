'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/use-cart'
import { useMarket } from '@/hooks/use-market'
import { navigateToCheckout, getCheckoutUrlFromCart } from '@/lib/checkout'
import { 
  Loader2, 
  ShoppingBag, 
  CreditCard, 
  Shield, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Lock,
  Zap
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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const handleCheckout = useCallback(async () => {
    try {
      setIsPreparingCheckout(true)
      setError(null)

      const checkoutUrl = getCheckoutUrlFromCart(cart)
      
      if (!checkoutUrl) {
        throw new Error('No checkout URL available. Please try adding products to your cart again.')
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
        description: 'Please try again or contact support if the problem persists.'
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
          // Redirect to login if not authenticated
          window.location.href = '/login?redirectTo=/checkout'
          return
        } else {
          // User is authenticated, proceed with auto-checkout
          if (!isEmpty && !isLoading) {
            const timer = setTimeout(() => {
              handleCheckout()
            }, 2000)
            return () => clearTimeout(timer)
          }
        }
      } catch (_error) {
        // Auth check failed, redirect to login
        window.location.href = '/login?redirectTo=/checkout'
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuthStatus()
  }, [isEmpty, isLoading, handleCheckout])

  // Auto-start checkout preparation only for authenticated users
  useEffect(() => {
    if (!isEmpty && !isLoading && !isPreparingCheckout && !error && !isCheckingAuth) {
      const timer = setTimeout(() => {
        handleCheckout()
      }, 2000) // 2 second delay to show the UI
      
      return () => clearTimeout(timer)
    }
  }, [isEmpty, isLoading, isPreparingCheckout, error, isCheckingAuth, handleCheckout])

  // If cart is empty, show empty state
  if (isEmpty && !isLoading && !isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-lg mx-auto">
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold mb-3">YOUR CART IS EMPTY</h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Add products to your cart<br />before proceeding to checkout
                </p>
                <Link href="/products">
                  <Button size="lg" className="h-10 sm:h-11 px-6 sm:px-8 font-medium text-sm sm:text-base">
                    CONTINUE SHOPPING
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // If there's an error, show error state with retry option
  if (error) {
    return (
      <div className="min-h-screen bg-red-50 py-12">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-red-700 text-xl font-mono">
                  <AlertCircle className="h-5 w-5" />
                  CHECKOUT ERROR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleCheckout}
                    disabled={isPreparingCheckout}
                    className="flex-1 h-12 font-mono"
                  >
                    {isPreparingCheckout ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        TRYING AGAIN...
                      </>
                    ) : (
                      'TRY AGAIN'
                    )}
                  </Button>
                  <Link href="/cart" className="flex-1">
                    <Button variant="outline" className="w-full h-12 font-mono">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      BACK TO CART
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Show checkout preparation UI with enhanced design
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Progress indicator */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">CART</span>
            </div>
            <div className="w-12 h-0.5 bg-black"></div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">2</div>
              <span className="text-sm font-medium">CHECKOUT</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center font-bold">3</div>
              <span className="text-sm text-gray-600">COMPLETE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Header with back button */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/cart">
              <Button variant="outline" size="sm" className="border-gray-300 hover:border-gray-400">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Към кошницата</span>
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Secure Checkout</h1>
            <div className="hidden sm:block" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-mono">
                  <ShoppingBag className="h-5 w-5" />
                  РЕЗЮМЕ НА ПОРЪЧКАТА
                  <Badge variant="secondary" className="ml-auto">
                    {totalQuantity} {totalQuantity === 1 ? 'продукт' : 'продукта'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {lines?.map((item) => 
                    item ? (
                      <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-md">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.merchandise?.product?.featuredImage?.url ? (
                            <Image
                              src={item.merchandise.product.featuredImage.url}
                              alt={item.merchandise.product.featuredImage.altText || item.merchandise.product.title || 'Product'}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                              БЕЗ СНИМКА
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm mb-1">
                            {item.merchandise?.product?.title || 'Продукт'}
                          </h4>
                          {item.merchandise?.title && item.merchandise.title !== 'Default Title' && (
                            <p className="text-xs text-gray-600 mb-2">{item.merchandise.title}</p>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                            <span className="font-bold font-mono">
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
                  <div className="flex justify-between text-base">
                    <span>Междинна сума</span>
                    <span className="font-mono">{cost?.subtotalAmount?.amount && cost?.subtotalAmount?.currencyCode ? formatPrice(cost.subtotalAmount.amount, cost.subtotalAmount.currencyCode) : '0.00 лв'}</span>
                  </div>
                  {cost?.totalTaxAmount?.amount && parseFloat(cost.totalTaxAmount.amount) > 0 && (
                    <div className="flex justify-between text-base">
                      <span>Tax</span>
                      <span className="font-mono">{cost.totalTaxAmount?.amount && cost.totalTaxAmount?.currencyCode ? formatPrice(cost.totalTaxAmount.amount, cost.totalTaxAmount.currencyCode) : '0.00 лв'}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-3 border-t">
                    <span>ОБЩО</span>
                    <span className="font-mono">{cost?.totalAmount?.amount && cost?.totalAmount?.currencyCode ? formatPrice(cost.totalAmount.amount, cost.totalAmount.currencyCode) : '0.00 лв'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Status */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white lg:sticky lg:top-8">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-mono">
                  <CreditCard className="h-5 w-5" />
                  PREPARING CHECKOUT
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Loading animation */}
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-gray-900 rounded-full animate-spin border-t-transparent"></div>
                  </div>
                  <p className="text-center font-semibold mb-2">Preparing Secure Checkout</p>
                  <p className="text-sm text-gray-600 text-center">Redirecting you to our secure payment page...</p>
                </div>

                {/* Trust badges */}
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 text-sm">BANK-LEVEL SECURITY</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Your payment is protected with 256-bit SSL encryption
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-6 text-gray-400">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      <span className="text-xs">SSL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      <span className="text-xs">PCI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      <span className="text-xs">SHOPIFY</span>
                    </div>
                  </div>
                </div>

                {/* Manual Continue Button (if auto-redirect fails) */}
                {!isPreparingCheckout && (
                  <Button 
                    onClick={handleCheckout}
                    className="w-full h-12 font-mono font-bold"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    CONTINUE TO SECURE CHECKOUT
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                SSL Encryption
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                PCI Compliant
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Secure Payments
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Powered by Shopify • 
              <Link href="/privacy-policy" className="underline hover:text-black ml-1">
                Privacy Policy
              </Link> • 
              <Link href="/terms" className="underline hover:text-black ml-1">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}