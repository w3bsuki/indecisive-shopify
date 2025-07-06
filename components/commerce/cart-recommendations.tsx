'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getProducts } from '@/lib/shopify/api'
import { useCart } from '@/hooks/use-cart'
import { useMarket } from '@/hooks/use-market'
import { formatPrice } from '@/lib/utils/price'
import { ShoppingBag, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface CartRecommendationsProps {
  className?: string
  maxItems?: number
  title?: string
}

export function CartRecommendations({ 
  className, 
  maxItems = 4, 
  title = "You might also like" 
}: CartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<ShopifyProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { lines, addItem } = useCart()
  const { formatPrice: formatMarketPrice } = useMarket()

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        // Get products for recommendations
        const productsData = await getProducts(20)
        const allProducts = productsData.edges.map(edge => edge.node)
        
        // Filter out products already in cart
        const cartProductIds = lines?.map(line => line?.merchandise?.product?.id).filter(Boolean) || []
        const filteredProducts = allProducts.filter(product => !cartProductIds.includes(product.id))
        
        // Smart recommendation logic
        let recommendedProducts: ShopifyProduct[] = []
        
        if (lines && lines.length > 0) {
          // Get categories/tags from cart items for better recommendations
          const cartTags = lines
            .flatMap(line => line?.merchandise?.product?.tags || [])
            .filter(Boolean)
          
          // Prioritize products with similar tags
          const relatedProducts = filteredProducts.filter(product => 
            product.tags?.some(tag => cartTags.includes(tag))
          )
          
          // Mix related and popular products
          recommendedProducts = [
            ...relatedProducts.slice(0, Math.floor(maxItems * 0.7)),
            ...filteredProducts.filter(p => !relatedProducts.includes(p)).slice(0, Math.ceil(maxItems * 0.3))
          ].slice(0, maxItems)
        } else {
          // No cart items, show popular/featured products
          recommendedProducts = filteredProducts.slice(0, maxItems)
        }
        
        setRecommendations(recommendedProducts)
      } catch (error) {
        console.error('Failed to load recommendations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecommendations()
  }, [lines, maxItems])

  const handleAddToCart = async (productId: string) => {
    // Find the default variant for the product
    const product = recommendations.find(p => p.id === productId)
    if (product?.variants?.edges?.[0]?.node?.id) {
      await addItem(product.variants.edges[0].node.id, 1)
    }
  }

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-gray-700">
          {title}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: maxItems }).map((_, i) => (
            <Card key={i} className="border border-gray-200">
              <CardContent className="p-3">
                <Skeleton className="aspect-square w-full mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-gray-700">
        {title}
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {recommendations.map((product) => {
          const variant = product.variants?.edges?.[0]?.node
          const price = variant?.price
          const compareAtPrice = variant?.compareAtPrice
          const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price?.amount || '0')
          
          return (
            <Card key={product.id} className="group border border-gray-200 hover:border-black transition-colors">
              <CardContent className="p-3">
                {/* Product Image */}
                <div className="relative aspect-square mb-3 overflow-hidden bg-gray-100">
                  <Link href={`/products/${product.handle}`}>
                    {product.featuredImage ? (
                      <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText || product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                  </Link>
                  
                  {/* Sale Badge */}
                  {isOnSale && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 font-mono">
                        SALE
                      </span>
                    </div>
                  )}
                  
                  {/* Quick Add Button */}
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-black hover:text-white"
                    onClick={(e) => {
                      e.preventDefault()
                      handleAddToCart(product.id)
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Product Info */}
                <div className="space-y-1">
                  <Link href={`/products/${product.handle}`}>
                    <h4 className="font-medium text-sm line-clamp-2 hover:text-gray-600 transition-colors">
                      {product.title}
                    </h4>
                  </Link>
                  
                  <div className="flex items-center gap-2">
                    {price && (
                      <span className="font-bold text-sm font-mono">
                        {formatMarketPrice ? 
                          formatMarketPrice(price.amount, price.currencyCode) : 
                          formatPrice(parseFloat(price.amount), price.currencyCode)
                        }
                      </span>
                    )}
                    {isOnSale && compareAtPrice && (
                      <span className="text-xs text-gray-500 line-through font-mono">
                        {formatMarketPrice ? 
                          formatMarketPrice(compareAtPrice.amount, compareAtPrice.currencyCode) : 
                          formatPrice(parseFloat(compareAtPrice.amount), compareAtPrice.currencyCode)
                        }
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {/* View All Products Link */}
      <div className="text-center">
        <Link href="/products">
          <Button variant="outline" size="sm" className="font-mono text-xs border-black hover:bg-black hover:text-white">
            View All Products
          </Button>
        </Link>
      </div>
    </div>
  )
}