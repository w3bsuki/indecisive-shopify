"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Plus, Minus, X, CreditCard, Loader2, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { useMarket } from "@/hooks/use-market"
import { useTranslations } from "next-intl"
import { useFlyToCart } from "@/contexts/fly-to-cart-context"
import { FreeShippingProgress } from "@/components/commerce/free-shipping-progress"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function MobileCartDropdown({ isBottomNav = false }: { isBottomNav?: boolean }) {
  const { lines, cost, totalQuantity, status, updateItem, removeItem } = useCart()
  const { formatPrice } = useMarket()
  const t = useTranslations('cart')
  const tc = useTranslations('common')
  const { setCartIconRef } = useFlyToCart()
  const cartIconRef = useRef<HTMLButtonElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  
  const totalItems = totalQuantity || 0
  const prevTotalItems = useRef(totalItems)

  useEffect(() => {
    if (cartIconRef.current) {
      setCartIconRef(cartIconRef.current)
    }
  }, [setCartIconRef])
  
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
  const isLoading = status === 'updating' || status === 'creating' || status === 'fetching'

  const handleCheckout = () => {
    setIsOpen(false)
    window.location.href = '/checkout'
  }

  const trigger = isBottomNav ? (
    <Button
      ref={cartIconRef}
      variant="ghost"
      size="sm"
      className={cn(
        "flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-[64px] min-h-[52px] transition-all duration-150 rounded-lg text-gray-600 hover:text-black hover:bg-gray-50 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
        isAnimating && "cart-icon-bounce"
      )}
    >
      <div className="relative">
        <ShoppingBag className="h-5 w-5 stroke-[2.5]" />
        {totalItems > 0 && (
          <Badge
            variant="secondary"
            className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[9px] font-bold bg-red-500 text-white border border-white"
          >
            {totalItems}
          </Badge>
        )}
      </div>
      <span className="text-[10px] font-medium">{t('title')}</span>
    </Button>
  ) : (
    <button
      ref={cartIconRef}
      className={cn(
        "relative h-12 w-12 md:h-10 md:w-10 -ml-2 flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none focus-visible:outline-none",
        isAnimating && "cart-icon-bounce"
      )}
    >
      <ShoppingBag className="h-6 w-6 stroke-[1.5]" />
      <span className="sr-only">Shopping Cart</span>
      {totalItems > 0 && (
        <Badge
          variant="secondary"
          className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white border-2 border-white shadow-lg"
        >
          {totalItems}
        </Badge>
      )}
    </button>
  )

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isBottomNav ? "center" : "end"}
        side={isBottomNav ? "top" : "bottom"}
        className={cn(
          "p-0 mt-1 border border-gray-200 shadow-xl bg-white rounded-xl overflow-hidden animate-none",
          isBottomNav 
            ? "w-[calc(100vw-24px)] mx-3"
            : "w-[calc(100vw-24px)] mx-3 sm:w-[380px] sm:mx-0"
        )}
        sideOffset={isBottomNav ? 12 : 8}
      >
        {/* Cart Header */}
        <div className="px-4 py-3 border-b bg-gray-50/50 relative">
          <div className="flex items-center justify-between pr-8">
            <h3 className="font-semibold text-sm">
              {t('title')} {totalItems > 0 && `(${totalItems})`}
            </h3>
            {totalItems > 0 && (
              <span className="text-xs text-gray-600">
                {subtotal?.amount && subtotal?.currencyCode ? formatPrice(subtotal.amount, subtotal.currencyCode) : '$0.00'}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="max-h-[50vh] overflow-y-auto">
          {!lines || lines.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium mb-1">{t('empty.title')}</p>
              <p className="text-xs text-gray-500 mb-4">{t('empty.subtitle')}</p>
              <Link href="/products" onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="sm" className="w-full rounded-xl">
                  {t('continueShopping')}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {lines.map((item) => 
                item ? (
                  <div key={item.id} className="flex gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                    <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      {(() => {
                        const product = item.merchandise?.product
                        // Try multiple image sources including variant image
                        const image = 
                          item.merchandise?.image?.url ||           // Try variant image first (most likely to exist)
                          product?.featuredImage?.url || 
                          product?.images?.edges?.[0]?.node?.url
                        
                        return image ? (
                          <Image
                            src={image}
                            alt={item.merchandise?.image?.altText || product?.featuredImage?.altText || product?.title || 'Product'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )
                      })()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="text-xs font-medium line-clamp-1">
                            {item.merchandise?.product?.title || 'Product'}
                          </h4>
                          {item.merchandise?.title && item.merchandise.title !== 'Default Title' && (
                            <p className="text-xs text-gray-500">{item.merchandise.title}</p>
                          )}
                        </div>
                        <button
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          onClick={() => item.id && removeItem(item.id)}
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-gray-50 rounded-lg">
                          <button
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => item.id && updateItem(item.id, (item.quantity || 1) - 1)}
                            disabled={isLoading || (item.quantity || 1) === 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-12 text-center text-sm font-medium h-8 flex items-center justify-center">{item.quantity || 1}</span>
                          <button
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-r-lg transition-colors disabled:opacity-50"
                            onClick={() => item.id && updateItem(item.id, (item.quantity || 1) + 1)}
                            disabled={isLoading}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-xs font-semibold">
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
          <div className="border-t bg-gray-50/50 p-3 space-y-3">
            {/* Free Shipping Progress */}
            <FreeShippingProgress 
              currentAmount={parseFloat(subtotal?.amount || '0')} 
              currency={subtotal?.currencyCode || 'USD'} 
              compact
            />
            
            {/* Checkout Actions */}
            <div className="space-y-3">
              <Button
                className="w-full bg-black text-white hover:bg-gray-800 h-11 text-sm font-medium rounded-xl"
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
                    {t('checkout')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full h-10 text-sm border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl"
                >
                  {t('viewCart')}
                </Button>
              </Link>
            </div>

            {/* Trust Badge */}
            <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
              <CreditCard className="h-3 w-3" />
              Secure checkout • Free returns
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
