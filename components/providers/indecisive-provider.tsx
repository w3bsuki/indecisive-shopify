'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { IndecisiveActions } from '@/components/commerce/indecisive-actions'
import { StyleQuiz } from '@/components/commerce/style-quiz'
import { getProducts } from '@/lib/shopify/api'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface IndecisiveContextType {
  openRandomizer: () => void
  closeRandomizer: () => void
  openStyleQuiz: () => void
  closeStyleQuiz: () => void
}

const IndecisiveContext = createContext<IndecisiveContextType | undefined>(undefined)

export function IndecisiveProvider({ children }: { children: React.ReactNode }) {
  const [isRandomizerOpen, setIsRandomizerOpen] = useState(false)
  const [isQuizOpen, setIsQuizOpen] = useState(false)
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch products for the randomizer
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts(50) // Get more products for better randomization
        setProducts(productsData.edges.map(edge => edge.node))
      } catch (error) {
        console.error('Failed to fetch products for randomizer:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const openRandomizer = () => setIsRandomizerOpen(true)
  const closeRandomizer = () => setIsRandomizerOpen(false)
  const openStyleQuiz = () => setIsQuizOpen(true)
  const closeStyleQuiz = () => setIsQuizOpen(false)

  return (
    <IndecisiveContext.Provider value={{ 
      openRandomizer, 
      closeRandomizer,
      openStyleQuiz,
      closeStyleQuiz
    }}>
      {children}
      {!isLoading && (
        <>
          <IndecisiveActions 
            products={products} 
            isOpen={isRandomizerOpen} 
            onOpenChange={setIsRandomizerOpen} 
          />
          <StyleQuiz
            products={products}
            isOpen={isQuizOpen}
            onOpenChange={setIsQuizOpen}
          />
        </>
      )}
    </IndecisiveContext.Provider>
  )
}

export function useIndecisive() {
  const context = useContext(IndecisiveContext)
  if (!context) {
    throw new Error('useIndecisive must be used within IndecisiveProvider')
  }
  return context
}