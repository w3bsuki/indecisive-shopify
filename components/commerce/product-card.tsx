'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/shopify/api'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { useCart } from '@/hooks/use-cart'
import { ProductCardImage } from './product-card-image'
import { cn } from '@/lib/utils'
import { QuickViewDialog } from './quick-view-dialog'

interface ProductCardProps {
  product: ShopifyProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, status, cartReady } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const isCartLoading = status === 'updating' || status === 'creating' || status === 'fetching'
  const isCurrentLoading = isLoading || isCartLoading

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    const firstVariant = product.variants.edges[0]?.node
    if (!firstVariant || !firstVariant.availableForSale || !cartReady) {
      return
    }

    setIsLoading(true)
    
    try {
      addItem(firstVariant.id, 1)
      setTimeout(() => setIsLoading(false), 2000)
    } catch (error) {
      console.error('Add to cart failed:', error)
      setIsLoading(false)
    }
  }

  const handleWishlist = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const price = formatPrice(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode
  )

  return (
    <div className="group relative bg-white border border-gray-100 hover:border-gray-200 transition-all duration-200">
      {/* Product Image - clickable for quick view */}
      <QuickViewDialog product={product}>
        <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-gray-50 cursor-pointer">
          <ProductCardImage
            href={`/products/${product.handle}`}
            imageUrl={product.featuredImage?.url}
            imageAlt={product.featuredImage?.altText || product.title}
            title={product.title}
          />
        </div>
      </QuickViewDialog>
      
      {/* Product Information - Clean Layout */}
      <div className="p-4">
        <div className="space-y-4">
          {/* Product Title */}
          <h3 className="text-sm font-medium line-clamp-2 leading-snug text-gray-900">
            <Link 
              href={`/products/${product.handle}`} 
              className="hover:text-black transition-colors duration-200"
            >
              {product.title}
            </Link>
          </h3>
          
          {/* Triple Split Button: Wishlist + Price + Add to Cart */}
          {product.variants.edges[0]?.node ? (
            <div className="w-full border-2 border-black hover:shadow-sm transition-all duration-200 group">
              <div className="flex items-center h-12 sm:h-10">
                {/* Left - Wishlist */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleWishlist(e)
                  }}
                  className={cn(
                    "w-12 sm:w-10 h-full flex items-center justify-center transition-all duration-200 border-r border-gray-300",
                    isWishlisted 
                      ? "bg-red-50 text-red-500 hover:bg-red-100" 
                      : "bg-white text-gray-600 hover:bg-gray-50 hover:text-black"
                  )}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg 
                    className={cn(
                      "w-4 h-4 transition-colors duration-200",
                      isWishlisted && "fill-current"
                    )}
                    fill={isWishlisted ? "currentColor" : "none"}
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                
                {/* Middle - Price with typewriter font */}
                <div className="flex-1 h-full flex items-center justify-center font-mono text-sm sm:text-xs font-medium bg-white text-black group-hover:bg-gray-50 transition-colors duration-200 border-r border-gray-300">
                  {price}
                </div>
                
                {/* Right - Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isCurrentLoading || !product.variants.edges[0]?.node.availableForSale || !cartReady}
                  className={cn(
                    "w-12 sm:w-10 h-full flex items-center justify-center transition-all duration-200",
                    isCurrentLoading
                      ? "bg-gray-400"
                      : !product.variants.edges[0]?.node.availableForSale || !cartReady
                      ? "bg-gray-400"
                      : "bg-black group-hover:bg-gray-800"
                  )}
                  aria-label={isCurrentLoading ? "Adding to cart" : "Add to cart"}
                >
                  {isCurrentLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : !product.variants.edges[0]?.node.availableForSale ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg 
                      className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full border-2 border-black">
              <div className="flex items-center h-12 sm:h-10">
                {/* Wishlist - disabled state */}
                <div className="w-12 sm:w-10 h-full flex items-center justify-center bg-gray-100 border-r border-gray-300">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                {/* Price */}
                <div className="flex-1 h-full flex items-center justify-center font-mono text-sm sm:text-xs font-medium bg-white text-black border-r border-gray-300">
                  {price}
                </div>
                {/* Cart - disabled */}
                <div className="w-12 sm:w-10 h-full flex items-center justify-center bg-gray-300">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}