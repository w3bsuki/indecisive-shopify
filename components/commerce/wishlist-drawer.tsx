'use client'

import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { DrawerEmptyState } from '@/components/ui/drawer-empty-state'
import { useWishlist } from '@/hooks/use-wishlist'
import { getProduct } from '@/lib/shopify/api'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { Heart, X } from 'lucide-react'
import { ProductCardMinimal } from '@/components/commerce/product-card-minimal'

interface WishlistDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WishlistDrawer({ open, onOpenChange }: WishlistDrawerProps) {
  const { items, clearWishlist, isLoading: wishlistLoading } = useWishlist()
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
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
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">
              Wishlist {items.length > 0 && `(${items.length})`}
            </SheetTitle>
            <SheetClose className="h-10 w-10 flex items-center justify-center -mr-2">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
        </SheetHeader>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
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
            <div className="grid grid-cols-2 gap-3 py-4">
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
          <div className="border-t bg-gray-50 px-6 py-4 space-y-3">
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
      </SheetContent>
    </Sheet>
  )
}