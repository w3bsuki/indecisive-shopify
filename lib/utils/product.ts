/**
 * Shared utility functions for product operations
 */

import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'

/**
 * Extract unique size options from product variants
 */
export function getProductSizes(product: ShopifyProduct): string[] {
  if (!product.variants?.edges?.length) return []
  
  const sizes = new Set<string>()
  
  product.variants.edges.forEach(edge => {
    const sizeOption = edge.node.selectedOptions?.find(
      option => option.name.toLowerCase() === 'size'
    )
    if (sizeOption?.value) {
      sizes.add(sizeOption.value)
    }
  })
  
  return Array.from(sizes)
}

/**
 * Get variant by selected options
 */
export function getVariantByOptions(
  product: ShopifyProduct,
  selectedOptions: Record<string, string>
): ShopifyProductVariant | undefined {
  if (!product.variants?.edges?.length) return undefined
  
  return product.variants.edges.find(edge => {
    const variant = edge.node
    return variant.selectedOptions?.every(option => 
      selectedOptions[option.name] === option.value
    )
  })?.node
}

/**
 * Check if a variant is available for sale
 */
export function isVariantAvailable(variant?: ShopifyProductVariant): boolean {
  return variant?.availableForSale ?? false
}

/**
 * Get the default variant (first available or just first)
 */
export function getDefaultVariant(product: ShopifyProduct): ShopifyProductVariant | undefined {
  if (!product.variants?.edges?.length) return undefined
  
  // Try to find first available variant
  const availableVariant = product.variants.edges.find(
    edge => edge.node.availableForSale
  )?.node
  
  // Otherwise return first variant
  return availableVariant || product.variants.edges[0]?.node
}

/**
 * Format product handle for display (e.g., "mens-shirt" -> "Mens Shirt")
 */
export function formatProductHandle(handle: string): string {
  return handle
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get product availability status
 */
export function getProductAvailability(product: ShopifyProduct): {
  isAvailable: boolean
  availableCount: number
  totalCount: number
} {
  if (!product.variants?.edges?.length) {
    return { isAvailable: false, availableCount: 0, totalCount: 0 }
  }
  
  const availableCount = product.variants.edges.filter(
    edge => edge.node.availableForSale
  ).length
  
  return {
    isAvailable: availableCount > 0,
    availableCount,
    totalCount: product.variants.edges.length
  }
}