/**
 * Utility functions for price formatting and parsing
 */

interface ParsedPrice {
  number: string
  currency: string
}

/**
 * Parse a formatted price string to extract number and currency
 * Handles special cases like Bulgarian Lev (123.45 лв)
 */
export function parsePriceString(rawPrice: string): ParsedPrice {
  const priceMatch = rawPrice.match(/^([\d,\.]+)\s*(.*?)$/)
  
  return {
    number: priceMatch ? priceMatch[1] : rawPrice,
    currency: priceMatch ? priceMatch[2] : ''
  }
}

/**
 * Format a price with proper decimal places based on currency
 */
export function formatPriceNumber(amount: number | string, currencyCode?: string): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount
  
  // No decimals for Japanese Yen and Bulgarian Lev (whole numbers)
  if (currencyCode === 'JPY' || currencyCode === 'BGN') {
    return Math.round(value).toString()
  }
  
  // Check if it's a whole number for any currency - display without decimals
  if (value % 1 === 0) {
    return Math.round(value).toString()
  }
  
  // Two decimals for all other currencies with fractional parts
  return value.toFixed(2)
}

/**
 * Get the percentage discount between original and sale price
 */
export function calculateDiscountPercentage(originalPrice: number | string, salePrice: number | string): number {
  const original = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice
  const sale = typeof salePrice === 'string' ? parseFloat(salePrice) : salePrice
  
  if (original <= 0 || sale <= 0 || sale >= original) {
    return 0
  }
  
  return Math.round(((original - sale) / original) * 100)
}

/**
 * Check if a product is on sale based on price comparison
 */
export function isProductOnSale(price: string | null, comparePrice: string | null): boolean {
  return !!(comparePrice && comparePrice !== price)
}