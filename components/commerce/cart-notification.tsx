'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { useTranslations } from 'next-intl'
import { useCart } from '@/hooks/use-cart'
import { navigateToCheckout } from '@/lib/checkout'
import { toast } from 'sonner'

interface CartNotificationProps {
  isOpen: boolean
  onClose: () => void
  product?: {
    title: string
    image?: string
    price: string
    quantity: number
  }
}

export function CartNotification({ isOpen, onClose, product }: CartNotificationProps) {
  const isMobile = useIsMobile()
  const [isVisible, setIsVisible] = useState(false)
  const t = useTranslations('notifications')
  const { checkoutUrl, isLoading } = useCart()

  const handleCheckout = async () => {
    try {
      if (checkoutUrl) {
        await navigateToCheckout(checkoutUrl, {
          redirectToLogin: false,
        })
      } else {
        toast.error('Cart is not ready for checkout')
      }
    } catch (_error) {
      toast.error('Failed to proceed to checkout')
    }
  }

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        onClose()
      }, 4000) // Auto-close after 4 seconds
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isVisible || !product) return null

  // Desktop notification - top right corner
  if (!isMobile) {
    return (
      <div
        className={cn(
          "fixed top-6 right-6 z-50 bg-white border border-gray-200 shadow-lg rounded-2xl p-4 max-w-sm transition-all duration-300 ease-out",
          isOpen ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex gap-3">
          {product.image && (
            <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden relative flex-shrink-0">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm mb-1 text-gray-900">{t('addedToCart')}</p>
            <p className="text-sm text-gray-600 line-clamp-1 mb-1">{product.title}</p>
            <p className="text-sm font-medium text-gray-900">{product.price}</p>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg"
          >
            {t('continueShopping')}
          </Button>
          <Link href="/cart" className="flex-1">
            <Button size="sm" className="w-full bg-black hover:bg-gray-800 text-white rounded-lg">
              {t('viewCart')}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Mobile notification - bottom of screen
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl transition-all duration-300 ease-out",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      )}
    >
      <div className="p-4 pb-safe">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex gap-4 mb-4">
          {product.image && (
            <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden relative flex-shrink-0">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0 pr-8">
            <p className="font-medium text-sm mb-1 text-gray-900">{t('addedToCart')}</p>
            <p className="text-sm text-gray-600 line-clamp-2 mb-1">{product.title}</p>
            <p className="text-sm font-medium text-gray-900">
              {product.quantity} × {product.price}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="flex-1 h-11 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium"
          >
            {t('continueShopping')}
          </Button>
          <Button 
            size="sm" 
            className="flex-1 h-11 bg-black hover:bg-gray-800 text-white rounded-xl font-medium"
            onClick={handleCheckout}
            disabled={isLoading || !checkoutUrl}
          >
            {isLoading ? 'Loading...' : t('checkout')}
          </Button>
        </div>
      </div>
    </div>
  )
}