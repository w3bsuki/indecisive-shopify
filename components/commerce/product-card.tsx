'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { useCart } from '@/hooks/use-cart'
import { useWishlist } from '@/hooks/use-wishlist'
import { useIsMobile } from '@/hooks/use-mobile'
import { useMarket } from '@/hooks/use-market'
import { cn } from '@/lib/utils'
import { parsePriceString, isProductOnSale } from '@/lib/utils/price'
import { QuickViewDialog } from './quick-view-dialog'
import { Heart, Eye, X } from 'lucide-react'
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

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem, cartReady } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const { formatPrice } = useMarket()
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(false)
  const [showSizeSelector, setShowSizeSelector] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)
  const isWishlisted = isInWishlist(product.id)
  const t = useTranslations('products')
  const { flyToCart } = useFlyToCart()
  const productImageRef = useRef<HTMLDivElement>(null)

  const rawPrice = formatPrice(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode
  )
  
  // Split price and currency for display
  const { number: priceNumber, currency } = parsePriceString(rawPrice)

  const comparePrice = product.compareAtPriceRange?.maxVariantPrice
    ? formatPrice(
        product.compareAtPriceRange.maxVariantPrice.amount,
        product.compareAtPriceRange.maxVariantPrice.currencyCode
      )
    : null

  const isOnSale = isProductOnSale(rawPrice, comparePrice)

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

    // On mobile, show size selector if not already selected
    if (isMobile && !variantId && sizes.length > 1) {
      setShowSizeSelector(true)
      return
    }

    const variant = variantId || product.variants?.edges?.[0]?.node.id
    if (!variant) return

    setIsLoading(true)
    
    // Trigger fly animation if product image is available
    if (product.featuredImage?.url && productImageRef.current && !isMobile) {
      flyToCart({
        imageUrl: product.featuredImage.url,
        elementRef: productImageRef.current
      })
    }
    
    // Add item with optimistic update (instant feedback)
    await addItem(variant, 1)
    
    // Haptic feedback on mobile (if supported)
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }
    
    setTimeout(() => {
      setIsLoading(false)
      setShowSizeSelector(false)
      setSelectedSize(null)
    }, 300) // Reduced timeout since feedback is instant
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

    // Haptic feedback on mobile
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
            className="block relative aspect-square overflow-hidden bg-gray-50"
          >
            <div ref={productImageRef}>
              {imageContent}
            </div>
          </Link>
        ) : (
          <QuickViewDialog product={product}>
            <div ref={productImageRef} className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-gray-50 cursor-pointer">
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
          <div className="space-y-4">
            {/* Product Title */}
            <h3 className="text-sm font-medium line-clamp-2 leading-snug text-gray-900 text-center md:text-left">
              <Link 
                href={`/products/${product.handle}`} 
                className="hover:text-black transition-colors duration-200"
              >
                {product.title}
              </Link>
            </h3>

            {/* Triple Split Button: Wishlist + Price + Add to Cart */}
            {product.variants?.edges?.[0]?.node ? (
              <div className="relative w-full">
                <div className="flex items-stretch h-11 bg-white border-2 border-black overflow-hidden">
                  {/* Left - Wishlist */}
                  <button
                    onClick={handleWishlist}
                    className={cn(
                      "relative w-11 flex items-center justify-center transition-all duration-200",
                      "border-r-2 border-black",
                      isWishlisted 
                        ? "bg-black text-white" 
                        : "bg-white text-black hover:bg-black hover:text-white"
                    )}
                    aria-label={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
                  >
                    <Heart 
                      className={cn(
                        "absolute w-[18px] h-[18px] transition-all duration-200",
                        isWishlisted && "fill-current"
                      )} 
                    />
                  </button>
                  
                  {/* Middle - Price */}
                  <div className="flex-1 flex items-center justify-center px-2 bg-gray-50" style={{ fontFamily: 'var(--font-mono)' }}>
                    {currency === 'лв' ? (
                      <span className="text-[11px] font-normal tracking-tight text-black">
                        {priceNumber} <span className="text-[8px]">{currency}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-normal tracking-tight text-black">
                        {rawPrice}
                      </span>
                    )}
                  </div>
                  
                  {/* Right - Add to Cart */}
                  <button
                    onClick={() => handleAddToCart()}
                    disabled={isLoading || !product.variants?.edges?.[0]?.node.availableForSale || !cartReady}
                    className={cn(
                      "relative w-11 flex items-center justify-center transition-all duration-200",
                      "border-l-2 border-black",
                      isLoading || !product.variants?.edges?.[0]?.node.availableForSale || !cartReady
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-900"
                    )}
                    aria-label={isLoading ? t('addingToCart') : t('addToCart')}
                  >
                    {isLoading ? (
                      <div className="absolute w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : !product.variants?.edges?.[0]?.node.availableForSale ? (
                      <X className="absolute w-[18px] h-[18px]" />
                    ) : (
                      <svg 
                        className="absolute w-[18px] h-[18px]" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative w-full opacity-50">
                <div className="flex items-stretch h-11 bg-white border-2 border-black overflow-hidden">
                  <div className="relative w-11 flex items-center justify-center bg-gray-100 border-r-2 border-black">
                    <Heart className="absolute w-[18px] h-[18px] text-gray-400" />
                  </div>
                  <div className="flex-1 flex items-center justify-center px-2 bg-gray-50" style={{ fontFamily: 'var(--font-mono)' }}>
                    {currency === 'лв' ? (
                      <span className="text-[11px] font-normal tracking-tight text-gray-500">
                        {priceNumber} <span className="text-[8px]">{currency}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-normal tracking-tight text-gray-500">
                        {rawPrice}
                      </span>
                    )}
                  </div>
                  <div className="relative w-11 flex items-center justify-center bg-gray-100 border-l-2 border-black">
                    <X className="absolute w-[18px] h-[18px] text-gray-400" />
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