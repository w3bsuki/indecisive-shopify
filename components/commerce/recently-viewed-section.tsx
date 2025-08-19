'use client'

import { useRecentlyViewed } from '@/hooks/use-recently-viewed'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function RecentlyViewedSection() {
  const { products: recentProducts, isLoaded, clearAll, count } = useRecentlyViewed()
  
  // Don't render if no products or still loading
  if (!isLoaded || count === 0) return null

  return (
    <div className="mt-2 md:mt-3 border-t">
      <div className="max-w-7xl mx-auto px-4 py-2 md:py-3">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-bold">Recently Viewed</h2>
          {count > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-gray-600 hover:text-black"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
        
        <>
          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden -mx-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 snap-x snap-mandatory">
              {recentProducts.slice(0, 8).map((product) => (
                <div 
                  key={product.id} 
                  className="flex-none snap-start" 
                  style={{ width: 'calc(50% - 4px)' }}
                >
                  <RecentlyViewedCard product={product} size="mobile" />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid grid-cols-4 gap-4">
            {recentProducts.slice(0, 4).map((product) => (
              <RecentlyViewedCard key={product.id} product={product} />
            ))}
          </div>
        </>
      </div>
    </div>
  )
}

// Simple card component for recently viewed products
interface RecentlyViewedCardProps {
  product: {
    id: string
    handle: string
    title: string
    image?: string
    price: string
  }
  size?: 'default' | 'mobile'
}

function RecentlyViewedCard({ product, size = 'default' }: RecentlyViewedCardProps) {
  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className={cn(
        "bg-white",
        size === 'mobile' && 'w-full'
      )}>
        {/* Product Image */}
        <div className={cn(
          "relative overflow-hidden bg-gray-50",
          size === 'mobile' ? 'aspect-square' : 'aspect-square md:aspect-[4/5]'
        )}>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes={
                size === 'mobile' 
                  ? "(max-width: 768px) 50vw, 25vw" 
                  : "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              }
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-2xl mb-1">👕</div>
                <div className="text-xs">No image</div>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={cn(
          size === 'mobile' ? "pt-2" : "pt-3"
        )}>
          <h3 className={cn(
            "font-medium line-clamp-1 text-gray-900 text-center group-hover:text-black transition-colors",
            size === 'mobile' ? "text-xs" : "text-sm"
          )}>
            {product.title}
          </h3>
          
          <div className={cn(
            "text-center font-mono",
            size === 'mobile' ? "mt-1 text-xs" : "mt-2 text-sm"
          )}>
            <span className="font-normal tracking-tight text-black">
              {product.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}