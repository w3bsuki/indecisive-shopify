'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, X, ArrowRight, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useWishlist } from '@/hooks/use-wishlist'
import { useMarket } from '@/hooks/use-market'
import { getProduct } from '@/lib/shopify/api'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'
import { Money } from '@/components/commerce/money'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function WishlistDropdown({ isBottomNav = false }: { isBottomNav?: boolean }) {
  const { items, toggleItem, clearWishlist } = useWishlist()
  const { market } = useMarket()
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  
  useEffect(() => {
    async function loadProducts() {
      if (!isOpen || items.length === 0) return
      
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
  }, [isOpen, items])

  const handleRemoveItem = (productId: string) => {
    const item = items.find(item => item.id === productId)
    if (item) {
      toggleItem(item)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={isBottomNav ? "sm" : "icon"}
          className={cn(
            "relative transition-colors",
            isBottomNav 
              ? "flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-[64px] min-h-[52px] transition-all duration-150 rounded-lg text-gray-600 hover:text-black hover:bg-gray-50" 
              : "h-10 w-10 hover:bg-gray-100 active:bg-gray-200"
          )}
        >
          {isBottomNav ? (
            <>
              <div className="relative">
                <Heart className={cn("h-5 w-5 stroke-[2.5]", items.length > 0 && "fill-current")} />
                {items.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[9px] font-bold bg-red-500 text-white border border-white"
                  >
                    {items.length}
                  </Badge>
                )}
              </div>
              <span className="text-[10px] font-medium">ЛЮБИМИ</span>
            </>
          ) : (
            <>
              <Heart className="h-5 w-5 stroke-[1.5]" />
              {items.length > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-semibold bg-black text-white border-2 border-white"
                >
                  {items.length}
                </Badge>
              )}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align={isBottomNav ? "center" : "end"}
        side={isBottomNav ? "top" : "bottom"}
        className={cn(
          "max-w-md p-0 mt-1 border border-gray-200 shadow-xl bg-white rounded-xl overflow-hidden animate-none",
          isBottomNav ? "w-[calc(100vw-32px)] mx-4" : "w-[calc(100vw-24px)] sm:w-[380px]"
        )}
        sideOffset={isBottomNav ? 12 : 8}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b bg-gray-50/50 relative">
          <div className="flex items-center justify-between pr-8">
            <h3 className="font-semibold text-sm">
              Wishlist {items.length > 0 && `(${items.length})`}
            </h3>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearWishlist}
                className="h-7 text-xs text-gray-600 hover:text-gray-700"
              >
                Clear all
              </Button>
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

        {/* Content */}
        <div className="max-h-[50vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center">
              <Heart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium mb-1">Wishlist Empty</p>
              <p className="text-xs text-gray-500 mb-4">Save your favorite items for later</p>
              <Link href="/products" onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="sm" className="w-full rounded-xl">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {products.map((product) => (
                <div key={product.id} className="flex gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow group">
                  {/* Product Image */}
                  <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                    {product.featuredImage ? (
                      <Image
                        src={product.featuredImage.url}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/products/${product.handle}`}
                      onClick={() => setIsOpen(false)}
                      className="block"
                    >
                      <h4 className="text-sm font-medium text-gray-900 truncate hover:text-black transition-colors mb-1">
                        {product.title}
                      </h4>
                      <div className="text-sm text-gray-600">
                        <Money 
                          data={product.priceRange.minVariantPrice} 
                          showDualCurrency={market.countryCode === 'BG'}
                        />
                      </div>
                    </Link>
                  </div>
                  
                  {/* Remove Button */}
                  <div className="flex items-start">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(product.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t bg-gray-50/50">
            <Link href="/wishlist" onClick={() => setIsOpen(false)}>
              <Button className="w-full h-10 text-sm bg-black hover:bg-gray-800 rounded-xl flex items-center justify-center gap-2 transition-colors">
                View All Wishlist
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}