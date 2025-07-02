'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { ProductCard } from './product-card'
import { cn } from '@/lib/utils'

interface VirtualProductGridProps {
  products: ShopifyProduct[]
  className?: string
}

export function VirtualProductGrid({ products, className }: VirtualProductGridProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState(2)
  const [parentWidth, setParentWidth] = useState(0)

  // Calculate columns based on screen size
  const calculateColumns = useCallback(() => {
    if (!parentRef.current) return
    
    const width = parentRef.current.offsetWidth
    setParentWidth(width)
    
    // Responsive columns: 2 on mobile, 3 on tablet, 4 on desktop
    if (width < 640) {
      setColumns(2)
    } else if (width < 1024) {
      setColumns(3)
    } else {
      setColumns(4)
    }
  }, [])

  // Handle resize
  useEffect(() => {
    calculateColumns()
    
    const resizeObserver = new ResizeObserver(calculateColumns)
    if (parentRef.current) {
      resizeObserver.observe(parentRef.current)
    }
    
    return () => resizeObserver.disconnect()
  }, [calculateColumns])

  // Calculate rows for virtualization
  const rows = Math.ceil(products.length / columns)
  const rowHeight = parentWidth / columns * 1.5 // Approximate height based on aspect ratio

  // Initialize virtualizer
  const virtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight || 300,
    overscan: 2, // Render 2 rows outside viewport
    gap: 16, // Gap between rows
  })

  const items = virtualizer.getVirtualItems()

  return (
    <div
      ref={parentRef}
      className={cn("h-screen overflow-auto scrollbar-hide", className)}
      style={{
        contain: 'strict' // Performance optimization
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {items.map((virtualRow) => {
          const startIndex = virtualRow.index * columns
          const endIndex = Math.min(startIndex + columns, products.length)
          const rowProducts = products.slice(startIndex, endIndex)

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className={cn(
                "grid gap-2 sm:gap-4",
                `grid-cols-${columns}`
              )}>
                {rowProducts.map((product, colIndex) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={virtualRow.index === 0 && colIndex < 2} // Priority for first 2 visible
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Hook for infinite scrolling with virtual list
export function useInfiniteVirtualProducts(
  initialProducts: ShopifyProduct[],
  loadMore: () => Promise<ShopifyProduct[]>
) {
  const [products, setProducts] = useState(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loadingRef = useRef(false)

  const handleLoadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return
    
    loadingRef.current = true
    setIsLoading(true)
    
    try {
      const newProducts = await loadMore()
      
      if (newProducts.length === 0) {
        setHasMore(false)
      } else {
        setProducts(prev => [...prev, ...newProducts])
      }
    } catch (error) {
      console.error('Failed to load more products:', error)
    } finally {
      loadingRef.current = false
      setIsLoading(false)
    }
  }, [loadMore, hasMore])

  return {
    products,
    isLoading,
    hasMore,
    loadMore: handleLoadMore
  }
}