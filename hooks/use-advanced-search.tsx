"use client"

import { useState, useCallback } from 'react'
import { getProducts } from '@/lib/shopify/api'
import type { Product } from '@/lib/shopify/storefront-client'

export interface SearchFilters {
  query: string
  minPrice?: number
  maxPrice?: number
  category?: string
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'
  inStock?: boolean
}

export interface SearchResults {
  products: Product[]
  totalCount: number
  hasMore: boolean
  isLoading: boolean
  error: string | null
}

export function useAdvancedSearch() {
  const [results, setResults] = useState<SearchResults>({
    products: [],
    totalCount: 0,
    hasMore: false,
    isLoading: false,
    error: null
  })

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    sortBy: 'relevance'
  })

  const buildSearchQuery = useCallback((filters: SearchFilters): string => {
    const parts: string[] = []
    
    // Base query
    if (filters.query) {
      parts.push(filters.query)
    }
    
    // Category filter
    if (filters.category) {
      parts.push(`product_type:${filters.category}`)
    }
    
    // Price range filter
    if (filters.minPrice !== undefined) {
      parts.push(`variants.price:>=${filters.minPrice}`)
    }
    if (filters.maxPrice !== undefined) {
      parts.push(`variants.price:<=${filters.maxPrice}`)
    }
    
    // Stock filter
    if (filters.inStock) {
      parts.push('available_for_sale:true')
    }
    
    return parts.join(' AND ')
  }, [])

  const performSearch = useCallback(async (searchFilters: SearchFilters) => {
    setResults(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const searchQuery = buildSearchQuery(searchFilters)
      const productsData = await getProducts(50, searchQuery || undefined)
      let products = productsData.edges.map(edge => edge.node)

      // Client-side sorting since Shopify Storefront API has limited sorting options
      if (searchFilters.sortBy) {
        products = [...products].sort((a, b) => {
          switch (searchFilters.sortBy) {
            case 'price-asc':
              return parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount)
            case 'price-desc':
              return parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount)
            case 'name-asc':
              return a.title.localeCompare(b.title)
            case 'name-desc':
              return b.title.localeCompare(a.title)
            default:
              return 0
          }
        })
      }

      // Client-side filtering for in-stock items if needed
      if (searchFilters.inStock) {
        products = products.filter(product => 
          product.variants?.edges?.some(edge => edge.node.availableForSale)
        )
      }

      setResults({
        products,
        totalCount: products.length,
        hasMore: productsData.pageInfo.hasNextPage,
        isLoading: false,
        error: null
      })
    } catch (_error) {
      setResults(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to search products. Please try again.'
      }))
    }
  }, [buildSearchQuery])

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    performSearch(updatedFilters)
  }, [filters, performSearch])

  const clearFilters = useCallback(() => {
    const clearedFilters: SearchFilters = {
      query: '',
      sortBy: 'relevance'
    }
    setFilters(clearedFilters)
    setResults({
      products: [],
      totalCount: 0,
      hasMore: false,
      isLoading: false,
      error: null
    })
  }, [])

  return {
    ...results,
    filters,
    updateFilters,
    clearFilters,
    performSearch: () => performSearch(filters)
  }
}