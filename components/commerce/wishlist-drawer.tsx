'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { DrawerEmptyState } from '@/components/ui/drawer-empty-state'
import { useWishlist } from '@/hooks/use-wishlist'
import { getProduct } from '@/lib/shopify/api'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { Heart, X } from 'lucide-react'
import { ProductCardMinimal } from '@/components/commerce/product-card-minimal'
import { cn } from '@/lib/utils'

interface WishlistDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WishlistDrawer({ open, onOpenChange }: WishlistDrawerProps) {
  const { items, clearWishlist, isLoading: wishlistLoading } = useWishlist()
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const slideoutRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    async function loadProducts() {
      if (!open || items.length === 0) return
      
      setIsLoading(true)
      try {
        const loadedProducts = await Promise.all(
          items.map(async (item) => {
            try {
              const product = await getProduct(item.handle)
              return product
            } catch (error) {
              console.error(`Failed to load product ${item.handle}:`, error)
              return null
            }
          })
        )
        setProducts(loadedProducts.filter(Boolean) as ShopifyProduct[])
      } catch (error) {
        console.error('Failed to load wishlist products:', error)
      }
      setIsLoading(false)
    }

    loadProducts()
  }, [open, items])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (slideoutRef.current && !slideoutRef.current.contains(event.target as Node)) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [open, onOpenChange])

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onOpenChange])
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      />
      
      {/* Slideout */}
      <div 
        ref={slideoutRef}
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Wishlist {items.length > 0 && `(${items.length})`}
            </h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors interactive-element"
              aria-label="Close wishlist"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {items.length > 0 && (
            <div className="text-sm text-gray-500">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {wishlistLoading || isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : items.length === 0 ? (
            <DrawerEmptyState
              icon={Heart}
              title="Wishlist Empty"
              subtitle="Save your favorite items for later"
              actionLabel="Browse Products"
              onAction={() => {
                onOpenChange(false)
                window.location.href = '/products'
              }}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <ProductCardMinimal 
                  key={product.id} 
                  product={product} 
                  size="mobile"
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t bg-gray-50 p-4 space-y-3">
            <Button
              className="w-full bg-black text-white hover:bg-gray-800"
              size="lg"
              onClick={() => {
                onOpenChange(false)
                window.location.href = '/'
              }}
            >
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={clearWishlist}
            >
              Clear Wishlist
            </Button>
          </div>
        )}
      </div>
    </>
  )
}