'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { useCart } from '@/hooks/use-cart'
import { useWishlist } from '@/hooks/use-wishlist'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Money } from '@/components/commerce/money'
import { QuickViewDialog } from './quick-view-dialog'
import { Heart, Eye, X, Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useFlyToCart } from '@/contexts/fly-to-cart-context'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ProductCardProps {
  product: ShopifyProduct
  priority?: boolean
}

export function ProductCardSimple({ product, priority = false }: ProductCardProps) {
  const { addItem, cartReady } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(false)
  const [showSizeSelector, setShowSizeSelector] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)
  const isWishlisted = isInWishlist(product.id)
  const t = useTranslations('products')
  const { flyToCart } = useFlyToCart()
  const productImageRef = useRef<HTMLDivElement>(null)

  const price = product.priceRange.minVariantPrice
  const compareAtPrice = product.compareAtPriceRange?.maxVariantPrice || null
  
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount)

  // Mock rating (would come from reviews)
  const rating = 4.5
  const reviewCount = 89

  // Extract sizes from variants
  const sizes = product.variants?.edges
    ?.map(edge => edge.node)
    ?.filter(variant => variant.availableForSale)
    ?.map(variant => ({
      id: variant.id,
      size: variant.title,
      available: variant.availableForSale
    })) || []

  const handleAddToCart = useCallback(async (variantId?: string) => {
    if (!cartReady || isLoading) return

    if (isMobile && !variantId && sizes.length > 1) {
      setShowSizeSelector(true)
      return
    }

    const variant = variantId || product.variants?.edges?.[0]?.node.id
    if (!variant) return

    setIsLoading(true)
    
    if (product.featuredImage?.url && productImageRef.current && !isMobile) {
      flyToCart({
        imageUrl: product.featuredImage.url,
        elementRef: productImageRef.current
      })
    }
    
    await addItem(variant, 1)
    
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }
    
    setTimeout(() => {
      setIsLoading(false)
      setShowSizeSelector(false)
      setSelectedSize(null)
    }, 300)
  }, [cartReady, isLoading, isMobile, sizes.length, product.variants?.edges, addItem, flyToCart, product.featuredImage?.url])

  const handleWishlist = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    toggleItem({
      id: product.id,
      handle: product.handle,
      title: product.title,
      image: product.featuredImage?.url,
      price: product.priceRange.minVariantPrice.amount
    })

    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(30)
    }
  }, [toggleItem, product, isMobile])

  const imageContent = (
    <>
      {product.featuredImage && (
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          priority={priority}
          className={cn(
            "object-cover transition-opacity duration-300",
            imageLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setImageLoading(false)}
        />
      )}
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      {!product.featuredImage && (
        <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
          <div className="text-center">
            <div className="text-2xl mb-1">👕</div>
            <div className="text-xs">{t('noImage')}</div>
          </div>
        </div>
      )}
    </>
  )

  return (
    <>
      <div className="group relative bg-white border border-gray-100 hover:border-gray-200 transition-all duration-200">
        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-2 left-2 z-10 bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase">
            {t('sale')}
          </div>
        )}

        {/* Product Image */}
        {isMobile ? (
          <Link 
            href={`/products/${product.handle}`}
            className="block relative aspect-square overflow-hidden"
          >
            <div ref={productImageRef}>
              {imageContent}
            </div>
          </Link>
        ) : (
          <QuickViewDialog product={product}>
            <div ref={productImageRef} className="relative aspect-square md:aspect-[4/5] overflow-hidden cursor-pointer">
              {imageContent}
              {/* Desktop hover overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
          </QuickViewDialog>
        )}

        {/* Product Information */}
        <div className="p-4">
          <div className="space-y-3">
            {/* Product Title */}
            <h3 className="text-sm font-medium line-clamp-2 leading-snug text-gray-900">
              <Link 
                href={`/products/${product.handle}`} 
                className="hover:text-black transition-colors duration-200"
              >
                {product.title}
              </Link>
            </h3>

            {/* Rating - NEW */}
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3 h-3",
                      i < Math.floor(rating) 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-2">
              <Money 
                data={price} 
                className="text-sm font-semibold text-black"
              />
              {isOnSale && compareAtPrice && (
                <Money 
                  data={compareAtPrice} 
                  className="text-xs text-gray-500 line-through"
                />
              )}
            </div>

            {/* Action Buttons */}
            {product.variants?.edges?.[0]?.node ? (
              <div className="flex gap-2">
                {/* Wishlist Button */}
                <button
                  onClick={handleWishlist}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center border-2 transition-all duration-200",
                    isWishlisted 
                      ? "bg-red-50 border-red-200 text-red-500" 
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  )}
                  aria-label={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
                >
                  <Heart 
                    className={cn(
                      "w-4 h-4",
                      isWishlisted && "fill-current"
                    )} 
                  />
                </button>
                
                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart()}
                  disabled={isLoading || !product.variants?.edges?.[0]?.node.availableForSale || !cartReady}
                  className={cn(
                    "flex-1 h-10 flex items-center justify-center gap-2 transition-all duration-200",
                    "bg-black text-white font-medium text-sm",
                    isLoading || !product.variants?.edges?.[0]?.node.availableForSale || !cartReady
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-900"
                  )}
                  aria-label={isLoading ? t('addingToCart') : t('addToCart')}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : !product.variants?.edges?.[0]?.node.availableForSale ? (
                    <>Sold Out</>
                  ) : (
                    <>Add to Cart</>
                  )}
                </button>
              </div>
            ) : (
              <div className="opacity-50">
                <div className="flex gap-2">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 border-2 border-gray-200">
                    <Heart className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 h-10 flex items-center justify-center bg-gray-100 border-2 border-gray-200">
                    <X className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Unavailable</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Size Selector Modal for Mobile */}
      <Dialog open={showSizeSelector} onOpenChange={setShowSizeSelector}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono">{t('selectSize')}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {sizes.map((size) => (
              <button
                key={size.id}
                className={cn(
                  "min-h-[48px] px-3 py-2 border transition-all duration-200",
                  "font-mono text-sm",
                  selectedSize === size.id 
                    ? "bg-black text-white border-black" 
                    : "bg-white text-black border-gray-300 hover:border-black",
                  !size.available && "opacity-50 cursor-not-allowed"
                )}
                disabled={!size.available}
                onClick={() => {
                  setSelectedSize(size.id)
                  handleAddToCart(size.id)
                }}
              >
                {size.size}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}