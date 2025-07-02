'use client'

import { useState, useEffect, useCallback } from 'react'

interface RecentlyViewedProduct {
  id: string
  handle: string
  title: string
  image?: string
  price: string
  timestamp: number
}

const STORAGE_KEY = 'indecisive-recently-viewed'
const MAX_ITEMS = 10

export function useRecentlyViewed() {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as RecentlyViewedProduct[]
        // Filter out old items (older than 30 days)
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
        const filtered = parsed.filter(item => item.timestamp > thirtyDaysAgo)
        setProducts(filtered)
      }
    } catch (error) {
      console.warn('Failed to load recently viewed products:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save to localStorage whenever products change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
      } catch (error) {
        console.warn('Failed to save recently viewed products:', error)
      }
    }
  }, [products, isLoaded])

  const addProduct = useCallback((product: Omit<RecentlyViewedProduct, 'timestamp'>) => {
    setProducts(prev => {
      // Remove existing entry if present
      const filtered = prev.filter(p => p.id !== product.id)
      
      // Add new entry at the beginning
      const updated = [
        { ...product, timestamp: Date.now() },
        ...filtered
      ]
      
      // Limit to MAX_ITEMS
      return updated.slice(0, MAX_ITEMS)
    })
  }, [])

  const removeProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
  }, [])

  const clearAll = useCallback(() => {
    setProducts([])
  }, [])

  const hasProduct = useCallback((productId: string) => {
    return products.some(p => p.id === productId)
  }, [products])

  return {
    products,
    isLoaded,
    addProduct,
    removeProduct,
    clearAll,
    hasProduct,
    count: products.length
  }
}