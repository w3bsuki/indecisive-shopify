'use client'

import { ProductInfoCompact } from './product-info-compact'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface ProductInfoWrapperProps {
  product: ShopifyProduct
}

export function ProductInfoWrapper({ product }: ProductInfoWrapperProps) {
  return <ProductInfoCompact product={product} />
}