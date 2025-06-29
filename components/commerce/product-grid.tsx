'use client'

import { useState } from 'react'
import { ShopifyProduct } from '@/lib/shopify/types'
import { formatPrice, getProductImageUrl, getProductImageAlt, isProductOnSale, calculateDiscountPercentage } from '@/lib/shopify'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductGridProps {
  products: ShopifyProduct[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addItem, isLoading } = useCart()
  const [loadingVariant, setLoadingVariant] = useState<string | null>(null)

  const handleAddToCart = async (product: ShopifyProduct) => {
    const firstVariant = product.variants.edges[0]?.node
    if (!firstVariant) return

    setLoadingVariant(firstVariant.id)
    try {
      await addItem(firstVariant.id)
    } finally {
      setLoadingVariant(null)
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => {
        const imageUrl = getProductImageUrl(product)
        const imageAlt = getProductImageAlt(product)
        const price = formatPrice(
          product.priceRange.minVariantPrice.amount,
          product.priceRange.minVariantPrice.currencyCode
        )
        const isOnSale = isProductOnSale(product)
        const discountPercentage = calculateDiscountPercentage(product)
        const firstVariant = product.variants.edges[0]?.node
        const isCurrentLoading = loadingVariant === firstVariant?.id

        return (
          <div key={product.id} className="group">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg mb-3">
              <a href={`/products/${product.handle}`}>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No image
                  </div>
                )}
              </a>
              
              {/* Sale Badge */}
              {isOnSale && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold">
                  -{discountPercentage}%
                </div>
              )}
              
              {/* Quick Actions */}
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              
              {/* Quick Add */}
              {product.availableForSale && firstVariant && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    className="w-full bg-white text-black hover:bg-gray-100"
                    onClick={() => handleAddToCart(product)}
                    disabled={isLoading || isCurrentLoading || !firstVariant.availableForSale}
                  >
                    {isCurrentLoading ? (
                      'Adding...'
                    ) : !firstVariant.availableForSale ? (
                      'Out of Stock'
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Quick Add
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-sm mb-1 line-clamp-2">
                <a href={`/products/${product.handle}`} className="hover:underline">
                  {product.title}
                </a>
              </h3>
              <div className="flex items-center gap-2">
                <span className="font-bold">{price}</span>
                {isOnSale && product.compareAtPriceRange && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(
                      product.compareAtPriceRange.minVariantPrice.amount,
                      product.compareAtPriceRange.minVariantPrice.currencyCode
                    )}
                  </span>
                )}
              </div>
              {!product.availableForSale && (
                <p className="text-sm text-red-500 mt-1">Out of Stock</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}