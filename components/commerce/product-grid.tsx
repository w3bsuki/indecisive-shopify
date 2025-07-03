import { cn } from '@/lib/utils'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { ProductCardServer } from './product-card-server'

interface ProductGridProps {
  products: ShopifyProduct[]
  className?: string
}

export async function ProductGrid({ products, className }: ProductGridProps) {
  // Safety check for undefined or empty products
  if (!products || products.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-gray-500">No products available</p>
      </div>
    )
  }

  return (
    <div className={cn(
      "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4", 
      className
    )}>
      {products.map((product, index) => (
        <ProductCardServer 
          key={product.id} 
          product={product} 
          priority={index < 4} // Prioritize first 4 images for LCP
        />
      ))}
    </div>
  )
}