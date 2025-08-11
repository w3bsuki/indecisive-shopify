import { cn } from '@/lib/utils'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { ProductCardPerfect } from './product-card-perfect'

interface ProductGridProps {
  products: ShopifyProduct[]
  className?: string
  columns?: {
    mobile?: 1 | 2
    tablet?: 2 | 3
    desktop?: 3 | 4
  }
}

export function ProductGridPerfect({ 
  products, 
  className,
  columns = {
    mobile: 2,
    tablet: 3,
    desktop: 3 // Default to 3 for better proportions
  }
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-gray-500">No products available</p>
      </div>
    )
  }

  const gridClasses = cn(
    "grid gap-4 sm:gap-6",
    columns.mobile === 1 ? "grid-cols-1" : "grid-cols-2",
    columns.tablet === 2 ? "md:grid-cols-2" : "md:grid-cols-3",
    columns.desktop === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
    className
  )

  return (
    <div className={gridClasses}>
      {products.map((product, index) => (
        <ProductCardPerfect 
          key={product.id} 
          product={product} 
          priority={index < 4}
        />
      ))}
    </div>
  )
}