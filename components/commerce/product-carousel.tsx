'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { ProductCardMinimal } from './product-card-minimal'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductCarouselProps {
  products: ShopifyProduct[]
  title?: string
  className?: string
}

export function ProductCarousel({ products, title, className }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    
    // Calculate scroll amount based on container width for 2 cards
    const containerWidth = scrollRef.current.offsetWidth
    const scrollAmount = containerWidth // Scroll by full container width
    const currentScroll = scrollRef.current.scrollLeft
    const targetScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount
    
    // Use instant scrolling on touch devices for better performance
    const isTouchDevice = 'ontouchstart' in window
    
    scrollRef.current.scrollTo({
      left: targetScroll,
      behavior: isTouchDevice ? 'instant' : 'smooth'
    })
  }

  if (!products || products.length === 0) return null

  return (
    <div className={cn("relative", className)}>
      {title && (
        <h3 className="text-lg font-bold mb-4 px-4 md:px-0">{title}</h3>
      )}
      
      {/* Desktop Navigation Buttons */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white border-2 border-black hover:bg-black hover:text-white transition-colors"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white border-2 border-black hover:bg-black hover:text-white transition-colors"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      
      {/* Scrollable Container */}
      <div className="overflow-hidden">
        <div 
          ref={scrollRef}
          className={cn(
            "flex gap-2 overflow-x-auto scrollbar-hide",
            "snap-x snap-mandatory",
            "md:gap-4",
            "will-change-scroll",
            "touch-pan-x"
          )}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollPaddingLeft: '16px',
            paddingLeft: '16px',
            paddingRight: '16px',
            contain: 'layout style paint',
            overscrollBehaviorX: 'contain'
          }}
        >
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="flex-none snap-start w-[calc(50%-4px)] md:w-auto"
            >
              <ProductCardMinimal
                product={product}
                priority={index < 4}
                size="mobile"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile Scroll Indicator */}
      <div className="flex justify-center gap-1 mt-4 md:hidden">
        {Array.from({ length: Math.ceil(products.length / 2) }).map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-300"
          />
        ))}
      </div>
    </div>
  )
}