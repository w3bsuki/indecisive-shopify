'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

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
          "fixed top-24 right-4 z-50 bg-white border-2 border-black shadow-xl p-4 max-w-sm transition-all duration-300",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex gap-4">
          {product.image && (
            <div className="w-16 h-16 border border-gray-200 relative">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="flex-1">
            <p className="font-mono text-sm font-medium mb-1">Added to cart!</p>
            <p className="text-sm text-gray-600 line-clamp-1">{product.title}</p>
            <p className="text-sm font-mono font-bold">{product.price}</p>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="flex-1"
          >
            Continue Shopping
          </Button>
          <Link href="/cart" className="flex-1">
            <Button size="sm" className="w-full">
              View Cart
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
        "fixed bottom-20 left-4 right-4 z-50 bg-white border-2 border-black shadow-xl transition-all duration-300",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
        "animate-slide-up-fade"
      )}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="p-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex gap-3 mb-3">
          {product.image && (
            <div className="w-14 h-14 border border-gray-200 relative flex-shrink-0">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm font-bold mb-0.5">Added to cart!</p>
            <p className="text-xs text-gray-600 line-clamp-1">{product.title}</p>
            <p className="text-sm font-mono font-bold mt-0.5">
              {product.quantity} × {product.price}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="flex-1 h-10"
          >
            Continue
          </Button>
          <Link href="/cart" className="flex-1">
            <Button size="sm" className="w-full h-10 bg-black text-white hover:bg-gray-800">
              Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}