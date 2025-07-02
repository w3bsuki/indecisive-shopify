'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  Market, 
  DEFAULT_MARKET, 
  detectMarketFromBrowser, 
  getStoredMarket, 
  storeMarket,
  formatPriceForMarket 
} from '@/lib/shopify/markets'

interface MarketContextType {
  market: Market
  setMarket: (market: Market) => void
  formatPrice: (amount: string, currencyCode?: string) => string
  isLoading: boolean
}

const MarketContext = createContext<MarketContextType | undefined>(undefined)

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [market, setMarketState] = useState<Market>(DEFAULT_MARKET)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize market on mount
  useEffect(() => {
    const initializeMarket = async () => {
      try {
        // First check localStorage
        const storedMarket = getStoredMarket()
        if (storedMarket) {
          setMarketState(storedMarket)
        } else {
          // Detect from browser if no stored preference
          const detectedMarket = detectMarketFromBrowser()
          setMarketState(detectedMarket)
          storeMarket(detectedMarket)
        }
      } catch (error) {
        console.error('Error initializing market:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeMarket()
  }, [])

  const setMarket = (newMarket: Market) => {
    setMarketState(newMarket)
    storeMarket(newMarket)
  }

  const formatPrice = (amount: string, currencyCode?: string) => {
    // If currencyCode is provided and different from market currency,
    // it means we're showing a product not available in this market
    if (currencyCode && currencyCode !== market.currencyCode) {
      const value = parseFloat(amount)
      
      // Compact currency symbols
      const currencySymbols: Record<string, string> = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'BGN': 'лв',
        'CAD': 'C$',
        'AUD': 'A$'
      }
      
      const symbol = currencySymbols[currencyCode] || currencyCode
      
      // Format number without currency symbol
      const formattedNumber = new Intl.NumberFormat(market.locale, {
        minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
        maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
      }).format(value)
      
      // Place symbol based on currency convention
      if (currencyCode === 'BGN') {
        return `${formattedNumber} ${symbol}`
      } else {
        return `${symbol}${formattedNumber}`
      }
    }
    
    return formatPriceForMarket(amount, market)
  }

  return (
    <MarketContext.Provider value={{ market, setMarket, formatPrice, isLoading }}>
      {children}
    </MarketContext.Provider>
  )
}

export function useMarket() {
  const context = useContext(MarketContext)
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider')
  }
  return context
}