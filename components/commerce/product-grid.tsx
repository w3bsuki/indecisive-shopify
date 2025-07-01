import { cn } from '@/lib/utils'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { ProductCardUnified } from './product-card-unified'

interface ProductGridProps {
  products: ShopifyProduct[]
  className?: string
}

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4", 
      className
    )}>
      {products.map((product, index) => (
        <ProductCardUnified 
          key={product.id} 
          product={product} 
          priority={index < 4} // Prioritize first 4 images for LCP
        />
      ))}
    </div>
  )
}