"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { getProducts } from '@/lib/shopify/api'
import type { Product } from '@/lib/shopify/storefront-client'

interface SearchState {
  query: string
  results: Product[]
  isLoading: boolean
  error: string | null
}

export function useSearch() {
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    isLoading: false,
    error: null
  })
  
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length === 0) {
      setState(prev => ({ ...prev, results: [], isLoading: false }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const productsData = await getProducts(20, searchQuery)
      const products = productsData.edges.map(edge => edge.node)
      
      setState(prev => ({
        ...prev,
        results: products,
        isLoading: false
      }))

      // Generate suggestions from product titles
      const uniqueSuggestions = [...new Set(
        products
          .map(p => p.title.toLowerCase())
          .filter(title => title.includes(searchQuery.toLowerCase()))
          .slice(0, 5)
      )]
      setSuggestions(uniqueSuggestions)
    } catch (error) {
      console.error('Search error:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to search products. Please try again.'
      }))
    }
  }, [])

  // Update search query with debouncing
  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }))

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query)
    }, 300) // 300ms debounce
  }, [performSearch])

  // Add to recent searches
  const addToRecentSearches = useCallback((query: string) => {
    if (!query || query.length === 0) return

    const updated = [
      query,
      ...recentSearches.filter(s => s !== query)
    ].slice(0, 5) // Keep only 5 recent searches

    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }, [recentSearches])

  // Clear search
  const clearSearch = useCallback(() => {
    setState({
      query: '',
      results: [],
      isLoading: false,
      error: null
    })
    setSuggestions([])
  }, [])

  return {
    ...state,
    suggestions,
    recentSearches,
    setSearchQuery,
    addToRecentSearches,
    clearSearch
  }
}

// Trending searches (could be fetched from an API in the future)
export const getTrendingSearches = () => [
  "oversized hoodie",
  "minimal tee", 
  "street pants",
  "bomber jacket",
  "cargo pants"
]