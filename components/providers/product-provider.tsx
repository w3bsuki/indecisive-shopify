'use client'

import { 
  ProductProvider as HydrogenProductProvider,
  useProduct
} from '@shopify/hydrogen-react'
import { createContext, useContext, ReactNode } from 'react'
import type { Product } from '@shopify/hydrogen-react/storefront-api-types'

// Extended product context for our specific needs
interface ExtendedProductContextType {
  product: Product
  selectedVariant: any
  selectedOptions: Record<string, string | undefined>
  setSelectedOption: (name: string, value: string) => void
  isVariantAvailable: (variantId: string) => boolean
  getVariantBySelectedOptions: () => any
}

const ExtendedProductContext = createContext<ExtendedProductContextType | null>(null)

interface ProductProviderWrapperProps {
  children: ReactNode
  product: Product
  initialVariantId?: string
}

function ProductContextProvider({ 
  children, 
  product,
  initialVariantId 
}: ProductProviderWrapperProps) {
  // Use Hydrogen's ProductProvider first
  return (
    <HydrogenProductProvider 
      data={product}
      initialVariantId={initialVariantId}
    >
      <ExtendedProductProviderInner product={product}>
        {children}
      </ExtendedProductProviderInner>
    </HydrogenProductProvider>
  )
}

function ExtendedProductProviderInner({
  children,
  product
}: {
  children: ReactNode
  product: Product
}) {
  const hydrogenProduct = useProduct()
  
  const selectedVariant = hydrogenProduct?.selectedVariant || null
  const selectedOptions = hydrogenProduct?.selectedOptions || {}
  const setSelectedOption = hydrogenProduct?.setSelectedOption || (() => {})
  
  const isVariantAvailable = (variantId: string): boolean => {
    const variant = product.variants.edges.find(
      edge => edge.node.id === variantId
    )?.node
    return variant?.availableForSale || false
  }
  
  const getVariantBySelectedOptions = () => {
    if (!product.variants?.edges) return null
    
    return product.variants.edges.find(edge => {
      const variant = edge.node
      return variant.selectedOptions?.every(option =>
        selectedOptions[option.name] === option.value
      )
    })?.node || null
  }
  
  const contextValue: ExtendedProductContextType = {
    product,
    selectedVariant,
    selectedOptions,
    setSelectedOption,
    isVariantAvailable,
    getVariantBySelectedOptions
  }
  
  return (
    <ExtendedProductContext.Provider value={contextValue}>
      {children}
    </ExtendedProductContext.Provider>
  )
}

// Main export
export const ProductProvider = ProductContextProvider

// Hook to use the extended product context
export function useExtendedProduct() {
  const context = useContext(ExtendedProductContext)
  if (!context) {
    throw new Error('useExtendedProduct must be used within a ProductProvider')
  }
  return context
}

// Hook to use Hydrogen's product context (re-exported for convenience)
export { useProduct } from '@shopify/hydrogen-react'

// Utility hooks for common product operations
export function useProductVariants() {
  const { product } = useExtendedProduct()
  
  const variants = product.variants?.edges?.map(edge => edge.node) || []
  const availableVariants = variants.filter(variant => variant.availableForSale)
  
  return {
    variants,
    availableVariants,
    hasVariants: variants.length > 1,
    hasAvailableVariants: availableVariants.length > 0
  }
}

export function useProductOptions() {
  const { product, selectedOptions, setSelectedOption } = useExtendedProduct()
  
  const options = product.options || []
  
  const getAvailableOptionValues = (optionName: string) => {
    const option = options.find(opt => opt.name === optionName)
    if (!option) return []
    
    // Filter values that have available variants
    return option.values.filter(value => {
      const hasAvailableVariant = product.variants?.edges?.some(edge => {
        const variant = edge.node
        return variant.availableForSale && 
               variant.selectedOptions?.some(selectedOption => 
                 selectedOption.name === optionName && 
                 selectedOption.value === value
               )
      })
      return hasAvailableVariant
    })
  }
  
  return {
    options,
    selectedOptions,
    setSelectedOption,
    getAvailableOptionValues
  }
}

export function useProductPricing() {
  const { product, selectedVariant } = useExtendedProduct()
  
  const currentPrice = selectedVariant?.price || product.priceRange.minVariantPrice
  const compareAtPrice = selectedVariant?.compareAtPrice || 
                        product.compareAtPriceRange?.minVariantPrice
  
  const isOnSale = compareAtPrice && 
                  parseFloat(compareAtPrice.amount) > parseFloat(currentPrice.amount)
  
  const savings = isOnSale ? 
                 parseFloat(compareAtPrice.amount) - parseFloat(currentPrice.amount) : 0
  
  return {
    currentPrice,
    compareAtPrice,
    isOnSale,
    savings,
    priceRange: product.priceRange,
    compareAtPriceRange: product.compareAtPriceRange
  }
}

export function useProductAvailability() {
  const { product, selectedVariant, isVariantAvailable } = useExtendedProduct()
  
  const isProductAvailable = product.availableForSale
  const isSelectedVariantAvailable = selectedVariant ? 
                                   isVariantAvailable(selectedVariant.id) : false
  
  const availableVariantsCount = product.variants?.edges?.filter(
    edge => edge.node.availableForSale
  ).length || 0
  
  return {
    isProductAvailable,
    isSelectedVariantAvailable,
    availableVariantsCount,
    hasAvailableVariants: availableVariantsCount > 0
  }
}