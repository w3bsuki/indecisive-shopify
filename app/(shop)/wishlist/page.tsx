'use client'

// Force dynamic rendering for wishlist page (can't prerender due to client context)
export const dynamic = 'force-dynamic'

import { useWishlist } from '@/hooks/use-wishlist'
import { ProductCard } from '@/components/commerce/product-card'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getProduct } from '@/lib/shopify/api'
import type { ShopifyProduct } from '@/lib/shopify/types'

export default function WishlistPage() {
  const { items, clearWishlist, isLoading: wishlistLoading } = useWishlist()
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true)
      const loadedProducts = await Promise.all(
        items.map(async (item) => {
          const product = await getProduct(item.handle)
          return product
        })
      )
      setProducts(loadedProducts.filter(Boolean) as ShopifyProduct[])
      setIsLoading(false)
    }

    if (items.length > 0) {
      loadProducts()
    } else {
      setIsLoading(false)
    }
  }, [items])

  if (wishlistLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold font-mono mb-2">YOUR WISHLIST IS EMPTY</h1>
          <p className="text-gray-600 mb-8">Save your favorite items for later.</p>
          <Link href="/products">
            <Button size="lg" className="font-mono">
              DISCOVER PRODUCTS
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-mono">MY WISHLIST ({items.length})</h1>
        <Button 
          variant="outline" 
          onClick={clearWishlist}
          className="font-mono"
        >
          CLEAR ALL
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Share Wishlist */}
      <div className="mt-12 p-6 border-2 border-black text-center">
        <h2 className="text-xl font-bold font-mono mb-2">SHARE YOUR WISHLIST</h2>
        <p className="text-gray-600 mb-4">Let friends and family know what you&apos;re loving</p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" className="font-mono">
            COPY LINK
          </Button>
          <Button variant="outline" className="font-mono">
            SHARE
          </Button>
        </div>
      </div>
    </div>
  )
}