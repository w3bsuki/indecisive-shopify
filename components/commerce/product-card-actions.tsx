'use client'

import { lazy, Suspense } from 'react'
import { cn } from '@/lib/utils'
import type { ShopifyProduct } from '@/lib/shopify/types'

// Lazy load QuickViewDialog - only loads when user clicks quick view
const QuickViewDialog = lazy(() => import('./quick-view-dialog').then(mod => ({ default: mod.QuickViewDialog })))

interface ProductCardActionsProps {
  product: ShopifyProduct
  isLoading: boolean
  cartReady: boolean
  onAddToCart: (e: React.MouseEvent) => void
}

export function ProductCardActions({
  product,
  isLoading,
  cartReady,
  onAddToCart
}: ProductCardActionsProps) {
  const firstVariant = product.variants.edges[0]?.node
  
  return (
    <div className="flex items-center gap-1">
        {/* Quick View */}
        <Suspense fallback={
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 hover:border-black transition-all duration-200"
            aria-label="Quick view"
            disabled
          >
            <svg 
              className="w-3.5 h-3.5 text-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        }>
          <QuickViewDialog product={product}>
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 hover:border-black transition-all duration-200"
              aria-label="Quick view"
            >
              <svg 
                className="w-3.5 h-3.5 text-gray-600 hover:text-black transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </QuickViewDialog>
        </Suspense>

        {/* Add to Cart */}
        {firstVariant && (
          <button
            type="button"
            onClick={onAddToCart}
            disabled={isLoading || !firstVariant.availableForSale || !cartReady}
            className={cn(
              "w-7 h-7 flex items-center justify-center transition-all duration-200",
              "bg-black text-white hover:bg-gray-800 border border-black",
              "disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300"
            )}
            aria-label={isLoading ? "Adding to cart" : "Add to cart"}
          >
            {isLoading ? (
              <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
            ) : !firstVariant.availableForSale ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg 
                className="w-3.5 h-3.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z" />
              </svg>
            )}
          </button>
        )}
    </div>
  )
}