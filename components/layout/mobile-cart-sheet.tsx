"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DrawerEmptyState } from "@/components/ui/drawer-empty-state"
import { ShoppingBag, Plus, Minus, X, CreditCard, Loader2 } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/hooks/use-cart"
import { useMarket } from "@/hooks/use-market"
import { useTranslations } from "next-intl"
import { useFlyToCart } from "@/contexts/fly-to-cart-context"
import { FreeShippingProgress } from "@/components/commerce/free-shipping-progress"
import { CartRecommendations } from "@/components/commerce/cart-recommendations"
import { CartTrustElements } from "@/components/commerce/cart-trust-elements"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export function MobileCartSheet({ children, isBottomNav = false }: { children?: React.ReactNode; isBottomNav?: boolean }) {
  // OFFICIAL HYDROGEN REACT CART PATTERN
  const { lines, cost, totalQuantity, status, updateItem, removeItem } = useCart()
  const { formatPrice } = useMarket()
  const t = useTranslations('cart')
  const tc = useTranslations('common')
  const tp = useTranslations('products')
  const { setCartIconRef } = useFlyToCart()
  const cartIconRef = useRef<HTMLButtonElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const _router = useRouter()
  
  const totalItems = totalQuantity || 0
  const prevTotalItems = useRef(totalItems)

  useEffect(() => {
    if (cartIconRef.current && !children) {
      setCartIconRef(cartIconRef.current)
    }
  }, [children, setCartIconRef])
  
  // Animate cart icon when items are added
  useEffect(() => {
    if (totalItems > prevTotalItems.current && totalItems > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 400)
      return () => clearTimeout(timer)
    }
    prevTotalItems.current = totalItems
  }, [totalItems])

  const subtotal = cost?.subtotalAmount
  const total = cost?.totalAmount
  const isLoading = status === 'updating' || status === 'creating' || status === 'fetching'

  const handleCheckout = () => {
    // Navigate to our enhanced checkout page for smooth experience
    window.location.href = '/checkout'
  }

  const defaultTrigger = isBottomNav ? (
    <Button
      ref={cartIconRef}
      variant="ghost"
      size="sm"
      className={cn(
        "flex flex-col items-center gap-1 h-auto py-2 px-2 min-w-[60px] min-h-[48px] relative text-gray-700 hover:text-black border border-transparent hover:border-black/30 transition-all duration-150",
        isAnimating && "cart-icon-bounce"
      )}
    >
      <ShoppingBag className="h-5 w-5 stroke-[2.5]" />
      <span className="text-[10px] font-medium">{t('title')}</span>
      {totalItems > 0 && (
        <Badge
          variant="secondary"
          className="absolute -top-0.5 -right-0.5 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white border-2 border-white shadow-lg scale-110"
        >
          {totalItems}
        </Badge>
      )}
    </Button>
  ) : (
    <button
      ref={cartIconRef}
      className={cn(
        "relative h-10 w-10 flex items-center justify-center transition-all duration-200 active:scale-95",
        isAnimating && "cart-icon-bounce"
      )}
    >
      <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
      <span className="sr-only">Shopping Cart</span>
      {totalItems > 0 && (
        <Badge
          variant="secondary"
          className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white border-2 border-white shadow-lg scale-110"
        >
          {totalItems}
        </Badge>
      )}
    </button>
  )

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || defaultTrigger}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">
              {t('title')} {totalItems > 0 && `(${totalItems})`}
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 -mr-2">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!lines || lines.length === 0 ? (
            <div className="space-y-8">
              <DrawerEmptyState
                icon={ShoppingBag}
                title={t('empty.title')}
                subtitle={t('empty.subtitle')}
                actionLabel={t('continueShopping')}
                onAction={() => window.location.href = '/products'}
              />
              
              {/* Trust elements when cart is empty */}
              <CartTrustElements variant="minimal" />
            </div>
          ) : (
            <div className="space-y-4">
              {lines.map((item) => 
                item ? (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="relative w-20 h-20 bg-gray-100 overflow-hidden flex-shrink-0">
                    {item.merchandise?.product?.featuredImage ? (
                      <Image
                        src={item.merchandise.product.featuredImage.url || ''}
                        alt={item.merchandise.product.featuredImage.altText || item.merchandise.product.title || 'Product'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        {tp('noImage')}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium line-clamp-1">
                          {item.merchandise?.product?.title || 'Product'}
                        </h4>
                        {item.merchandise?.title && item.merchandise.title !== 'Default Title' && (
                          <p className="text-xs text-muted-foreground">{item.merchandise.title}</p>
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
                      <span className="text-sm font-semibold">
                        {formatPrice(item.cost?.totalAmount?.amount || '0', item.cost?.totalAmount?.currencyCode || 'USD')}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null
              )}
              
              {/* Smart Product Recommendations - Only with items in cart */}
              {lines.length > 0 && (
                <div className="pt-6 border-t">
                  <CartRecommendations maxItems={4} title="Complete your look" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {lines && lines.length > 0 && (
          <div className="border-t bg-gray-50">
            {/* Free Shipping Progress */}
            <div className="px-6 py-3 border-b bg-white">
              <FreeShippingProgress 
                currentAmount={parseFloat(subtotal?.amount || '0')} 
                currency={subtotal?.currencyCode || 'USD'} 
              />
            </div>
            
            <div className="px-6 py-4 space-y-4">
            {/* Promo Code */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('discountCode')}
                className="flex-1 px-3 py-2 text-sm border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
              />
              <Button variant="outline" className="h-auto py-2 px-4 border-2">
                {t('apply')}
              </Button>
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{t('subtotal')}</span>
                <span className="text-sm font-semibold">{subtotal?.amount && subtotal?.currencyCode ? formatPrice(subtotal.amount, subtotal.currencyCode) : '$0.00'}</span>
              </div>
              {cost?.totalTaxAmount?.amount && cost?.totalTaxAmount?.currencyCode && parseFloat(cost.totalTaxAmount.amount) > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm">{t('tax')}</span>
                  <span className="text-sm font-semibold">{formatPrice(cost.totalTaxAmount.amount, cost.totalTaxAmount.currencyCode)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">{t('total')}</span>
                <span className="font-bold">{total?.amount && total?.currencyCode ? formatPrice(total.amount, total.currencyCode) : '$0.00'}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              className="w-full bg-black text-white hover:bg-gray-800"
              size="lg"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tc('loading')}
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {t('checkout')} • {total?.amount && total?.currencyCode ? formatPrice(total.amount, total.currencyCode) : '$0.00'}
                </>
              )}
            </Button>
            
            {/* Continue Shopping */}
            <SheetClose asChild>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
              >
                {t('continueShopping')}
              </Button>
            </SheetClose>

            {/* Enhanced Trust Elements */}
            <div className="pt-2">
              <CartTrustElements variant="minimal" />
            </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}