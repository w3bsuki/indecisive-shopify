'use client'

export const dynamic = 'force-dynamic'

import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Money } from '@/components/commerce/money'
import { navigateToCheckout } from '@/lib/checkout'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export default function CartPage() {
  const { lines, cost, totalItems, updateItem, removeItem, clearCart, isEmpty, isLoading, checkoutUrl } = useCart()
  const t = useTranslations('cart')

  const handleCheckout = async () => {
    try {
      if (checkoutUrl) {
        await navigateToCheckout(checkoutUrl, {
          redirectToLogin: false,
        })
      } else {
        console.error('No checkout URL available, using fallback')
        window.location.href = '/checkout'
      }
    } catch (_error) {
      toast.error('Failed to proceed to checkout', {
        description: 'Please try again or contact support.'
      })
    }
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-white">
        {/* Clean Header */}
        <div className="border-b border-gray-200 bg-white p-4">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Link href="/products" className="p-2 hover:bg-gray-100 rounded-md transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-xl font-handwritten">{t('title')}</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-50 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-handwritten mb-4 text-gray-900">{t('empty.title')}</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">{t('empty.emptyMessage')}</p>
          <Link href="/products">
            <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-medium">
              {t('empty.cta')}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/products" className="p-2 hover:bg-gray-100 rounded-md transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-xl font-handwritten">{t('shoppingCart')}</h1>
          </div>
          <span className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {lines?.map((line) => {
            if (!line?.merchandise?.product) return null
            
            const product = line.merchandise.product
            // Try variant image first, then fallback to product images
            const image = line.merchandise?.image?.url || product.featuredImage?.url || product.images?.edges?.[0]?.node?.url
            
            return (
              <div key={line.id} className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                    {image ? (
                      <Image
                        src={image}
                        alt={product.title || 'Product'}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    {/* Title & Remove */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 pr-2 line-clamp-2">
                        {product.title}
                      </h3>
                      <button
                        onClick={() => line.id && removeItem(line.id)}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600"
                        aria-label={t('removeFromCart')}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Variant */}
                    {line.merchandise.title && line.merchandise.title !== 'Default Title' && (
                      <p className="text-sm text-gray-500 mb-3">
                        {line.merchandise.title}
                      </p>
                    )}
                    
                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-gray-50 rounded-lg">
                        <button
                          onClick={() => line.id && line.quantity && updateItem(line.id, Math.max(1, line.quantity - 1))}
                          disabled={!line.quantity || line.quantity <= 1 || isLoading}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={t('decreaseQuantity')}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-12 text-center text-sm font-medium h-8 flex items-center justify-center">
                          {line.quantity || 0}
                        </span>
                        <button
                          onClick={() => line.id && line.quantity && updateItem(line.id, line.quantity + 1)}
                          disabled={isLoading}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-r-lg transition-colors disabled:opacity-50"
                          aria-label={t('increaseQuantity')}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="font-medium text-gray-900">
                        {line.cost?.totalAmount?.amount && line.cost?.totalAmount?.currencyCode ? (
                          <Money data={line.cost.totalAmount} />
                        ) : (
                          '$0.00'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Clear Cart */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={clearCart}
            disabled={isLoading}
            className="border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl"
          >
            {t('clear')}
          </Button>
        </div>

        {/* Desktop Checkout Section */}
        <div className="hidden md:block bg-gray-50 rounded-2xl p-6">
          {/* Totals */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('subtotal')}</span>
              <span className="font-medium">
                {cost?.subtotalAmount?.amount && cost?.subtotalAmount?.currencyCode ? (
                  <Money data={cost.subtotalAmount} />
                ) : (
                  '$0.00'
                )}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">{t('shipping')}</span>
              <span className="text-gray-500">{t('calculatedAtCheckout')}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="font-medium text-lg">{t('total')}</span>
              <span className="font-medium text-lg">
                {cost?.totalAmount?.amount && cost?.totalAmount?.currencyCode ? (
                  <Money data={cost.totalAmount} />
                ) : (
                  '$0.00'
                )}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button 
            className="w-full bg-black hover:bg-gray-800 text-white h-12 text-base font-medium rounded-xl" 
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? t('loading') : t('proceedToCheckout')}
          </Button>
          
          {/* Security Notice */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <span>🔒</span>
              <span>{t('secureCheckout')}</span>
            </p>
          </div>
        </div>

        {/* Mobile: Add spacing for sticky checkout bar */}
        <div className="md:hidden h-20"></div>
      </div>

      {/* Mobile Sticky Checkout Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-safe z-50">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm">
            <span className="text-gray-600">{t('total')}</span>
            <div className="font-bold text-lg">
              {cost?.totalAmount?.amount && cost?.totalAmount?.currencyCode ? (
                <Money data={cost.totalAmount} />
              ) : (
                '$0.00'
              )}
            </div>
          </div>
          <div className="text-xs text-gray-500 text-right">
            <div>{totalItems} {totalItems === 1 ? 'item' : 'items'}</div>
            <div className="flex items-center gap-1">
              <span>🔒</span>
              <span>{t('secureCheckout')}</span>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-black hover:bg-gray-800 text-white h-12 text-base font-medium rounded-xl" 
          onClick={handleCheckout}
          disabled={isLoading}
        >
          {isLoading ? t('loading') : t('proceedToCheckout')}
        </Button>
      </div>
    </div>
  )
}