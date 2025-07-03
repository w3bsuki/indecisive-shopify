'use client'

import { useEffect, useState, useRef } from 'react'
import { useRecentlyViewed } from '@/hooks/use-recently-viewed'
import { useMarket } from '@/hooks/use-market'
import { StickyMobileFooter } from '@/components/commerce/sticky-mobile-footer'
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'

interface ProductPageClientProps {
  product: ShopifyProduct
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const { addProduct } = useRecentlyViewed()
  const { formatPrice } = useMarket()
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant>()
  const addToCartFormRef = useRef<HTMLDivElement>(null)
  const hasTracked = useRef(false)

  // Track recently viewed product on mount (only once)
  useEffect(() => {
    if (!hasTracked.current) {
      addProduct({
        id: product.id,
        handle: product.handle,
        title: product.title,
        image: product.featuredImage?.url,
        price: formatPrice(
          product.priceRange.minVariantPrice.amount,
          product.priceRange.minVariantPrice.currencyCode
        )
      })
      hasTracked.current = true
    }
  }, [product, addProduct, formatPrice])

  // Listen for variant changes from the AddToCartForm
  useEffect(() => {
    const handleVariantChange = (event: CustomEvent) => {
      setSelectedVariant(event.detail.variant)
    }

    window.addEventListener('variant-changed', handleVariantChange as EventListener)
    return () => window.removeEventListener('variant-changed', handleVariantChange as EventListener)
  }, [])

  const handleSizeSelect = () => {
    // Scroll to the add to cart form
    if (addToCartFormRef.current) {
      addToCartFormRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
    }
  }

  const handleAddToCart = () => {
    console.log('ProductPageClient handleAddToCart called')
    // Trigger add to cart from the form
    const addToCartEvent = new CustomEvent('trigger-add-to-cart')
    window.dispatchEvent(addToCartEvent)
  }

  return (
    <>
      {/* Hidden ref div to mark the add to cart form location */}
      <div ref={addToCartFormRef} className="absolute" style={{ top: '60vh' }} />
      
      {/* Sticky Mobile Footer */}
      <StickyMobileFooter
        product={product}
        selectedVariant={selectedVariant}
        onSizeSelect={handleSizeSelect}
        onAddToCart={handleAddToCart}
      />
      
      {/* Quick Actions - Mobile Only */}
      <div className="fixed top-20 right-4 z-30 md:hidden">
        <div className="flex flex-col gap-2">
          {/* Scroll to Top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 bg-black/80 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black transition-colors"
            aria-label="Scroll to top"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}