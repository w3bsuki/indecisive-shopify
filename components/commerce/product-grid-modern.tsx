import { cn } from '@/lib/utils'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { ProductCardModern } from './product-card-modern'

interface ProductGridProps {
  products: ShopifyProduct[]
  className?: string
  variant?: 'default' | 'minimal' | 'detailed'
}

export async function ProductGridModern({ 
  products, 
  className,
  variant = 'default' 
}: ProductGridProps) {
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
      "grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4", 
      className
    )}>
      {products.map((product, index) => (
        <ProductCardModern 
          key={product.id} 
          product={product} 
          priority={index < 4} // Prioritize first 4 images for LCP
          variant={variant}
        />
      ))}
    </div>
  )
}