"use client"

import type React from "react"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Plus, Minus, X, CreditCard, Loader2 } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/shopify/api"

export function MobileCartSheet({ children }: { children?: React.ReactNode }) {
  // OFFICIAL HYDROGEN REACT CART PATTERN
  const { lines, cost, checkoutUrl, totalQuantity, status, updateItem, removeItem } = useCart()

  const subtotal = cost?.subtotalAmount
  const total = cost?.totalAmount
  const totalItems = totalQuantity || 0
  const isLoading = status === 'updating' || status === 'creating' || status === 'fetching'

  const handleCheckout = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-black text-white"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center justify-between">
            <span>SHOPPING CART</span>
            <Badge variant="secondary">{totalItems} items</Badge>
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!lines || lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-600 mb-6">Add some items to get started</p>
              <Button variant="outline" className="w-full max-w-xs">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {lines.map((item) => 
                item ? (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                    {item.merchandise?.product?.featuredImage ? (
                      <Image
                        src={item.merchandise.product.featuredImage.url || ''}
                        alt={item.merchandise.product.featuredImage.altText || item.merchandise.product.title || 'Product'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm line-clamp-1">
                          {item.merchandise?.product?.title || 'Product'}
                        </h4>
                        {item.merchandise?.title && item.merchandise.title !== 'Default Title' && (
                          <p className="text-xs text-gray-600">{item.merchandise.title}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mr-2"
                        onClick={() => item.id && removeItem(item.id)}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => item.id && updateItem(item.id, (item.quantity || 1) - 1)}
                          disabled={isLoading || (item.quantity || 1) === 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity || 1}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => item.id && updateItem(item.id, (item.quantity || 1) + 1)}
                          disabled={isLoading}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-medium text-sm">
                        {formatPrice(item.cost?.totalAmount?.amount || '0', item.cost?.totalAmount?.currencyCode || 'USD')}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null
              )}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {lines && lines.length > 0 && (
          <div className="border-t px-6 py-4 space-y-4">
            {/* Promo Code */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Button variant="outline" size="sm">
                Apply
              </Button>
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal?.amount && subtotal?.currencyCode ? formatPrice(subtotal.amount, subtotal.currencyCode) : '$0.00'}</span>
              </div>
              {cost?.totalTaxAmount?.amount && cost?.totalTaxAmount?.currencyCode && parseFloat(cost.totalTaxAmount.amount) > 0 && (
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(cost.totalTaxAmount.amount, cost.totalTaxAmount.currencyCode)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-base pt-2 border-t">
                <span>Total</span>
                <span>{total?.amount && total?.currencyCode ? formatPrice(total.amount, total.currencyCode) : '$0.00'}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Checkout
                </>
              )}
            </Button>

            {/* Security Notice */}
            <p className="text-xs text-center text-gray-600">
              Secure checkout powered by Shopify
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}