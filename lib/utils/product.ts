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
 * Extract unique color options from product variants
 */
export function getProductColors(product: ShopifyProduct): string[] {
  const colors = new Set<string>()
  
  // Check all variants for color options
  if (product.variants?.edges?.length) {
    product.variants.edges.forEach(edge => {
      const colorOption = edge.node.selectedOptions?.find(option => {
        const n = option.name.toLowerCase().trim()
        return n === 'color' || n === 'colour' || n === 'цвят'
      })
      if (colorOption?.value) {
        colors.add(colorOption.value)
      }
    })
  }
  
  // If no color options found in variants, check product options
  if (colors.size === 0 && product.options?.length) {
    const colorOption = product.options.find(option => {
      const n = option.name.toLowerCase().trim()
      return n === 'color' || n === 'colour' || n === 'цвят'
    })
    if (colorOption?.values?.length) {
      colorOption.values.forEach(value => {
        if (value) {
          colors.add(value)
        }
      })
    }
  }
  
  // If no color options found, check if title contains colors
  if (colors.size === 0) {
    const titleLower = product.title.toLowerCase()
    const colorMatches = ['red', 'pink', 'black', 'blue', 'green', 'white', 'yellow', 'purple', 'orange', 'brown', 'grey', 'gray', 'navy', 'beige', 'tan', 'khaki', 'cream', 'ivory', 'maroon', 'burgundy', 'coral', 'peach', 'gold', 'silver', 'charcoal']
    colorMatches.forEach(color => {
      if (titleLower.includes(color)) {
        colors.add(color.charAt(0).toUpperCase() + color.slice(1))
      }
    })
  }
  
  // If still no colors found, check product tags
  if (colors.size === 0 && product.tags?.length) {
    const colorTags = product.tags.filter(tag => {
      const tagLower = tag.toLowerCase()
      return tagLower.includes('color:') || tagLower.includes('colour:')
    })
    colorTags.forEach(tag => {
      const colorValue = tag.split(':')[1]?.trim()
      if (colorValue) {
        colors.add(colorValue.charAt(0).toUpperCase() + colorValue.slice(1))
      }
    })
  }
  
  // ALWAYS return at least one color - use a default neutral color
  if (colors.size === 0) {
    colors.add('Default')
  }
  
  return Array.from(colors)
}

/**
 * Map color names to hex values for display
 */
export function getColorFromName(colorName: string): string {
  // Normalize the color name to lowercase for matching
  const normalizedColor = colorName.toLowerCase().trim()

  // If value is a valid HEX color code, use it directly
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(normalizedColor)) {
    return normalizedColor
  }
  
  // Try exact match first
  const exactColorMap: Record<string, string> = {
    // Black variations
    'black': '#000000',
    
    // White variations  
    'white': '#FFFFFF',
    'cream': '#F5F5DC',
    'ivory': '#FFFFF0',
    'off-white': '#FAF0E6',
    
    // Red variations
    'red': '#EF4444',
    'crimson': '#DC143C',
    'maroon': '#800000',
    'burgundy': '#800020',
    
    // Blue variations
    'blue': '#3B82F6',
    'navy': '#1E3A8A',
    'royal blue': '#4169E1',
    'sky blue': '#87CEEB',
    'light blue': '#ADD8E6',
    
    // Green variations
    'green': '#10B981',
    'forest green': '#228B22',
    'olive': '#808000',
    'lime': '#00FF00',
    
    // Yellow variations
    'yellow': '#F59E0B',
    'gold': '#FFD700',
    'mustard': '#FFDB58',
    
    // Purple variations
    'purple': '#8B5CF6',
    'violet': '#8A2BE2',
    'lavender': '#E6E6FA',
    
    // Pink variations
    'pink': '#EC4899',
    'hot pink': '#FF69B4',
    'light pink': '#FFB6C1',
    'rose': '#FF007F',
    'fuchsia': '#FF00FF',
    
    // Gray variations
    'gray': '#6B7280',
    'grey': '#6B7280',
    'charcoal': '#36454F',
    'silver': '#C0C0C0',
    
    // Brown variations
    'brown': '#92400E',
    'tan': '#D2B48C',
    'beige': '#F5E6D3',
    'khaki': '#F0E68C',
    
    // Orange variations
    'orange': '#F97316',
    'coral': '#FF7F50',
    'peach': '#FFCBA4',
    
    // Default for single-color products
    'default': '#E5E7EB',
  }
  
  // Check for exact match
  if (exactColorMap[normalizedColor]) {
    return exactColorMap[normalizedColor]
  }
  
  // If no exact match, try partial matching for common patterns
  const colorKeywords = [
    // English + French + Abbrev
    { keywords: ['black', 'noir', 'bk', 'blk', 'черен', 'черно'], color: '#000000' },
    { keywords: ['white', 'blanc', 'wht', 'wt', 'бял', 'бяло'], color: '#FFFFFF' },
    { keywords: ['red', 'rouge', 'rd', 'червен', 'червено'], color: '#EF4444' },
    { keywords: ['pink', 'rose', 'pk', 'pnk', 'розов', 'розово', 'фуксия'], color: '#EC4899' },
    { keywords: ['blue', 'bleu', 'bl', 'blu', 'син', 'синьо'], color: '#3B82F6' },
    { keywords: ['green', 'vert', 'grn', 'gr', 'зелен', 'зелено'], color: '#10B981' },
    { keywords: ['yellow', 'jaune', 'yl', 'ylw', 'жълт', 'жълто'], color: '#F59E0B' },
    { keywords: ['purple', 'violet', 'prp', 'pur', 'лилав', 'лилаво'], color: '#8B5CF6' },
    { keywords: ['brown', 'brun', 'brn', 'br', 'кафяв', 'кафяво'], color: '#92400E' },
    { keywords: ['orange', 'org', 'or', 'оранжев', 'оранжево'], color: '#F97316' },
    { keywords: ['gray', 'grey', 'gris', 'gy', 'gry', 'сив', 'сиво'], color: '#6B7280' },
    { keywords: ['navy', 'nvy', 'nv'], color: '#1E3A8A' },
    { keywords: ['beige', 'bg', 'bge'], color: '#F5E6D3' },
  ]
  
  // Try to find a color keyword within the variant name
  for (const { keywords, color } of colorKeywords) {
    if (keywords.some(keyword => normalizedColor.includes(keyword))) {
      return color
    }
  }
  
  return '#E5E7EB' // Light gray fallback for unknown colors
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
