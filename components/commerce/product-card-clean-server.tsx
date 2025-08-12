import type { ShopifyProduct } from '@/lib/shopify/types'
import { ProductCardServer } from './product-card-server'

interface ProductCardCleanServerProps {
  product: ShopifyProduct
  priority?: boolean
  className?: string
}

export async function ProductCardCleanServer({ 
  product, 
  priority = false,
  className: _className 
}: ProductCardCleanServerProps) {
  // Safety check for product data
  if (!product || typeof product === 'string') {
    return null
  }
  
  return (
    <ProductCardServer 
      product={product} 
      priority={priority}
    />
  )
}