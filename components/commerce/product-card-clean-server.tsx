import type { ShopifyProduct } from '@/lib/shopify/types'
import { ProductCardClean } from './product-card-clean'

interface ProductCardCleanServerProps {
  product: ShopifyProduct
  priority?: boolean
  className?: string
}

export async function ProductCardCleanServer({ 
  product, 
  priority = false,
  className 
}: ProductCardCleanServerProps) {
  // Safety check for product data
  if (!product || typeof product === 'string') {
    return null
  }
  
  return (
    <ProductCardClean 
      product={product} 
      priority={priority}
      className={className}
    />
  )
}