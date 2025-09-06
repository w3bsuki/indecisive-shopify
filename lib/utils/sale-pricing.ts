import type { ShopifyProduct } from '@/lib/shopify/types'

export interface SaleInfo {
  isOnSale: boolean
  originalPrice?: number
  discountPercentage?: number
  currentPrice: number
  savings?: number
}

/**
 * Extract sale information from product using multiple methods
 * Priority: compare-at price > tags > manual overrides
 */
export function getSaleInfo(product: ShopifyProduct): SaleInfo {
  const currentPrice = parseFloat(product.priceRange.minVariantPrice.amount)
  
  // Method 1: Use Shopify compare-at price if available
  const compareAtPrice = product.compareAtPriceRange?.maxVariantPrice?.amount
  if (compareAtPrice && parseFloat(compareAtPrice) > currentPrice) {
    const originalPrice = parseFloat(compareAtPrice)
    const discountPercentage = Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    return {
      isOnSale: true,
      originalPrice,
      discountPercentage,
      currentPrice,
      savings: originalPrice - currentPrice
    }
  }

  // Method 2: Check for sale tags (sale-XX, discount-XX, was-XX)
  const tags = product.tags || []
  
  for (const tag of tags) {
    const tagLower = tag.toLowerCase()
    
    // Format: "sale-30" = 30% off
    const saleMatch = tagLower.match(/^sale-(\d+)$/)
    if (saleMatch) {
      const discountPercentage = parseInt(saleMatch[1])
      const originalPrice = currentPrice / (1 - discountPercentage / 100)
      return {
        isOnSale: true,
        originalPrice,
        discountPercentage,
        currentPrice,
        savings: originalPrice - currentPrice
      }
    }
    
    // Format: "discount-25" = 25% off  
    const discountMatch = tagLower.match(/^discount-(\d+)$/)
    if (discountMatch) {
      const discountPercentage = parseInt(discountMatch[1])
      const originalPrice = currentPrice / (1 - discountPercentage / 100)
      return {
        isOnSale: true,
        originalPrice,
        discountPercentage,
        currentPrice,
        savings: originalPrice - currentPrice
      }
    }
    
    // Format: "was-50" = original price was 50
    const wasMatch = tagLower.match(/^was-(\d+(?:\.\d{1,2})?)$/)
    if (wasMatch) {
      const originalPrice = parseFloat(wasMatch[1])
      if (originalPrice > currentPrice) {
        const discountPercentage = Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        return {
          isOnSale: true,
          originalPrice,
          discountPercentage,
          currentPrice,
          savings: originalPrice - currentPrice
        }
      }
    }
  }

  // Method 3: Check for manual sale products
  const hasSaleTag = tags.some(tag => 
    tag.toLowerCase() === 'sale' || 
    tag.toLowerCase() === 'discount' ||
    tag.toLowerCase() === 'clearance'
  )
  
  if (hasSaleTag) {
    // Default to 20% discount if no specific percentage found
    const discountPercentage = 20
    const originalPrice = currentPrice / (1 - discountPercentage / 100)
    return {
      isOnSale: true,
      originalPrice,
      discountPercentage,
      currentPrice,
      savings: originalPrice - currentPrice
    }
  }

  // No sale detected
  return {
    isOnSale: false,
    currentPrice
  }
}

/**
 * Check if a product is on sale using any method
 */
export function isProductOnSale(product: ShopifyProduct): boolean {
  return getSaleInfo(product).isOnSale
}

/**
 * Get formatted sale badge text
 */
export function getSaleBadgeText(product: ShopifyProduct): string | null {
  const saleInfo = getSaleInfo(product)
  if (!saleInfo.isOnSale || !saleInfo.discountPercentage) return null
  
  return `-${saleInfo.discountPercentage}%`
}