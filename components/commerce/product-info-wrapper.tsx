'use client'

import { ProductInfoEnhanced } from './product-info-enhanced'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface ProductInfoWrapperProps {
  product: ShopifyProduct
}

export function ProductInfoWrapper({ product }: ProductInfoWrapperProps) {
  return <ProductInfoEnhanced product={product} />
}