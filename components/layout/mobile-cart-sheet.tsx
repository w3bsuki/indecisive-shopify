"use client"

import type React from "react"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Plus, Minus, X, CreditCard, Loader2 } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/hooks/use-cart"
import { useMarket } from "@/hooks/use-market"
import { useTranslations } from "next-intl"

export function MobileCartSheet({ children, isBottomNav = false }: { children?: React.ReactNode; isBottomNav?: boolean }) {
  // OFFICIAL HYDROGEN REACT CART PATTERN
  const { lines, cost, totalQuantity, status, updateItem, removeItem } = useCart()
  const { formatPrice } = useMarket()
  const t = useTranslations('cart')
  const tc = useTranslations('common')
  const tp = useTranslations('products')

  const subtotal = cost?.subtotalAmount
  const total = cost?.totalAmount
  const totalItems = totalQuantity || 0
  const isLoading = status === 'updating' || status === 'creating' || status === 'fetching'

  const handleCheckout = () => {
    // Navigate to our enhanced checkout page for smooth experience
    window.location.href = '/checkout'
  }

  const defaultTrigger = isBottomNav ? (
    <Button
      variant="ghost"
      size="sm"
      className="flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-[64px] min-h-[48px] relative text-gray-600"
    >
      <ShoppingBag className="h-5 w-5" />
      <span className="text-xs font-mono">{t('title')}</span>
      {totalItems > 0 && (
        <Badge
          variant="secondary"
          className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold bg-black text-white border border-white"
        >
          {totalItems}
        </Badge>
      )}
    </Button>
  ) : (
    <button className="relative h-12 w-12 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 rounded-lg">
      <ShoppingBag className="h-6 w-6 stroke-[1.5] text-black" />
      {totalItems > 0 && (
        <Badge
          variant="secondary"
          className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold bg-black text-white border border-white"
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
            <SheetTitle className="text-lg font-bold font-mono">
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
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium mb-2">{t('empty.title')}</p>
              <p className="text-sm text-gray-600 mb-6">{t('empty.subtitle')}</p>
              <Button variant="outline" className="w-full max-w-xs">
                {t('continueShopping')}
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
                        {tp('noImage')}
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
                placeholder={t('discountCode')}
                className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Button variant="outline" size="sm">
                {t('apply')}
              </Button>
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span>{subtotal?.amount && subtotal?.currencyCode ? formatPrice(subtotal.amount, subtotal.currencyCode) : '$0.00'}</span>
              </div>
              {cost?.totalTaxAmount?.amount && cost?.totalTaxAmount?.currencyCode && parseFloat(cost.totalTaxAmount.amount) > 0 && (
                <div className="flex justify-between">
                  <span>{t('tax')}</span>
                  <span>{formatPrice(cost.totalTaxAmount.amount, cost.totalTaxAmount.currencyCode)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-base pt-2 border-t">
                <span>{t('total')}</span>
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
                  {tc('loading')}
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {t('checkout')}
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