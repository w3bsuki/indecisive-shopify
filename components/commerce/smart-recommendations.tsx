'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ShoppingCart, TrendingUp, Users, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HydrogenImageWrapper } from './hydrogen-image'
import { Money } from './money'
import { ProductCardSkeleton } from '@/components/ui/skeleton'
import { InteractiveButton, WishlistHeart, RatingStars } from '@/components/ui/visual-feedback'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface SmartRecommendationsProps {
  currentProduct?: ShopifyProduct
  cartItems?: any[]
  context?: 'product' | 'cart' | 'checkout' | 'homepage'
  title?: string
  limit?: number
  className?: string
}

interface RecommendationProduct {
  id: string
  title: string
  handle: string
  featuredImage?: {
    url: string
    altText?: string
  }
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  availableForSale: boolean
  tags: string[]
  productType: string
  vendor: string
  rating?: number
  reviewCount?: number
  isOnSale?: boolean
  isTrending?: boolean
  isBestSeller?: boolean
}

const mockRecommendations: RecommendationProduct[] = [
  {
    id: '1',
    title: 'Essential Cotton T-Shirt',
    handle: 'essential-cotton-tshirt',
    featuredImage: {
      url: '/placeholder.jpg',
      altText: 'Essential Cotton T-Shirt'
    },
    priceRange: {
      minVariantPrice: {
        amount: '29.99',
        currencyCode: 'USD'
      }
    },
    compareAtPriceRange: {
      minVariantPrice: {
        amount: '39.99',
        currencyCode: 'USD'
      }
    },
    availableForSale: true,
    tags: ['essentials', 'cotton', 'basic'],
    productType: 'T-Shirt',
    vendor: 'Indecisive Wear',
    rating: 4.5,
    reviewCount: 127,
    isOnSale: true,
    isBestSeller: true
  },
  {
    id: '2',
    title: 'Premium Hoodie',
    handle: 'premium-hoodie',
    featuredImage: {
      url: '/placeholder.jpg',
      altText: 'Premium Hoodie'
    },
    priceRange: {
      minVariantPrice: {
        amount: '79.99',
        currencyCode: 'USD'
      }
    },
    availableForSale: true,
    tags: ['premium', 'hoodie', 'comfort'],
    productType: 'Hoodie',
    vendor: 'Indecisive Wear',
    rating: 4.8,
    reviewCount: 89,
    isTrending: true
  },
  {
    id: '3',
    title: 'Classic Denim Jacket',
    handle: 'classic-denim-jacket',
    featuredImage: {
      url: '/placeholder.jpg',
      altText: 'Classic Denim Jacket'
    },
    priceRange: {
      minVariantPrice: {
        amount: '89.99',
        currencyCode: 'USD'
      }
    },
    availableForSale: true,
    tags: ['denim', 'jacket', 'classic'],
    productType: 'Jacket',
    vendor: 'Indecisive Wear',
    rating: 4.3,
    reviewCount: 156
  }
]

export function SmartRecommendations({
  currentProduct,
  cartItems = [],
  context = 'product',
  title,
  limit = 4,
  className
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Simulate API call with loading delay
    const fetchRecommendations = async () => {
      setIsLoading(true)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real implementation, this would be an API call based on:
      // - Current product category/tags
      // - User's cart contents  
      // - Purchase history
      // - Trending products
      // - Collaborative filtering
      
      const filteredRecommendations = mockRecommendations
        .filter(product => {
          // Don't recommend the current product
          if (currentProduct && product.id === currentProduct.id) return false
          
          // Don't recommend items already in cart
          if (cartItems.some(item => item.merchandise?.product?.id === product.id)) return false
          
          return true
        })
        .slice(0, limit)
      
      setRecommendations(filteredRecommendations)
      setIsLoading(false)
    }

    fetchRecommendations()
  }, [currentProduct, cartItems, limit])

  const getContextualTitle = () => {
    if (title) return title
    
    switch (context) {
      case 'product':
        return 'You might also like'
      case 'cart':
        return 'Complete your look'
      case 'checkout':
        return 'Don\'t forget these'
      case 'homepage':
        return 'Trending now'
      default:
        return 'Recommended for you'
    }
  }

  const getContextualSubtitle = () => {
    switch (context) {
      case 'product':
        return 'Based on this product'
      case 'cart':
        return 'Customers also bought'
      case 'checkout':
        return 'Last chance to add'
      case 'homepage':
        return 'Popular with our customers'
      default:
        return ''
    }
  }

  const handleWishlistToggle = (productId: string) => {
    setWishlisted(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="space-y-2">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!recommendations.length) {
    return null
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">{getContextualTitle()}</h2>
          {context === 'homepage' && <TrendingUp className="w-5 h-5 text-blue-500" />}
        </div>
        {getContextualSubtitle() && (
          <p className="text-sm text-gray-600">{getContextualSubtitle()}</p>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((product, index) => (
          <div
            key={product.id}
            className={cn(
              "group relative bg-white border border-gray-200 rounded-lg overflow-hidden",
              "product-card-enhanced stagger-item",
              `animation-delay-${index * 100}`
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Badges */}
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
              {product.isOnSale && (
                <Badge variant="destructive" className="text-xs">
                  Sale
                </Badge>
              )}
              {product.isBestSeller && (
                <Badge className="text-xs bg-yellow-500 text-white">
                  Best Seller
                </Badge>
              )}
              {product.isTrending && (
                <Badge className="text-xs bg-blue-500 text-white">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <WishlistHeart
                isLiked={wishlisted.has(product.id)}
                onClick={() => handleWishlistToggle(product.id)}
                className="bg-white/90 hover:bg-white rounded-full p-2 shadow-sm"
              />
            </div>

            {/* Product Image */}
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              {product.featuredImage?.url ? (
                <HydrogenImageWrapper
                  data={product.featuredImage}
                  alt={product.featuredImage.altText || product.title}
                  aspectRatio="1/1"
                  className="product-image"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-3 space-y-2">
              {/* Title and Rating */}
              <div className="space-y-1">
                <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                  {product.title}
                </h3>
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <RatingStars rating={product.rating} size="sm" />
                    <span className="text-xs text-gray-500">({product.reviewCount})</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <Money
                  data={product.priceRange.minVariantPrice as any}
                  className="font-bold text-sm"
                />
                {product.compareAtPriceRange && product.isOnSale && (
                  <Money
                    data={product.compareAtPriceRange.minVariantPrice as any}
                    className="text-xs text-gray-500 line-through"
                  />
                )}
              </div>

              {/* Add to Cart Button */}
              <InteractiveButton
                variant="modern"
                size="sm"
                className="w-full"
                disabled={!product.availableForSale}
              >
                {product.availableForSale ? (
                  <>
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Add to Cart
                  </>
                ) : (
                  'Sold Out'
                )}
              </InteractiveButton>
            </div>

            {/* Quick Stats Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3">
              <div className="flex items-center justify-between text-white text-xs">
                {product.isBestSeller && (
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>Popular</span>
                  </div>
                )}
                {product.isTrending && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Trending</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Context-specific CTA */}
      {context === 'cart' && (
        <div className="text-center">
          <Button variant="outline" className="interactive-element">
            View More Recommendations
          </Button>
        </div>
      )}
    </div>
  )
}

// Specific recommendation contexts
export function ProductPageRecommendations({ product, className }: { product: ShopifyProduct, className?: string }) {
  return (
    <SmartRecommendations
      currentProduct={product}
      context="product"
      limit={4}
      className={className}
    />
  )
}

export function CartRecommendations({ cartItems, className }: { cartItems: any[], className?: string }) {
  return (
    <SmartRecommendations
      cartItems={cartItems}
      context="cart"
      title="Complete your look"
      limit={3}
      className={className}
    />
  )
}

export function HomepageTrending({ className }: { className?: string }) {
  return (
    <SmartRecommendations
      context="homepage"
      title="Trending this week"
      limit={8}
      className={className}
    />
  )
}