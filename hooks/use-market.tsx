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
import { currencyService } from '@/lib/currency/exchange-rates'

interface MarketContextType {
  market: Market
  setMarket: (market: Market) => void
  formatPrice: (amount: string, currencyCode?: string) => string
  formatPriceWithConversion: (amount: string, fromCurrency?: string) => string
  getCurrencyDisclaimer: () => string
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

  const setMarket = async (newMarket: Market) => {
    // Switching market
    
    // Update local state immediately
    setMarketState(newMarket)
    storeMarket(newMarket)
    
    // Set cookie for next-intl in the correct format
    // The i18n system expects market ID to be set in cookies
    try {
      // Setting market cookie for i18n...
      
      // Set the market cookie that i18n/request.ts reads
      document.cookie = `indecisive-wear-market=${JSON.stringify(newMarket.id)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=strict`
      
      // Market cookie set successfully
      
      // Force a page reload to trigger next-intl locale change
      // This is necessary because next-intl reads locale from cookies on server
      setTimeout(() => {
        // Reloading page to apply i18n changes...
        window.location.reload()
      }, 100)
    } catch (error) {
      console.error('❌ [MARKET] Failed to set market cookie:', error)
      // Fallback: still reload to ensure consistency
      window.location.reload()
    }
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
        minimumFractionDigits: (currencyCode === 'JPY' || currencyCode === 'BGN') ? 0 : 2,
        maximumFractionDigits: (currencyCode === 'JPY' || currencyCode === 'BGN') ? 0 : 2,
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

  // Enhanced price formatting with live currency conversion
  const formatPriceWithConversion = (amount: string, fromCurrency: string = 'BGN') => {
    const numericAmount = parseFloat(amount)
    
    // If same currency, use standard formatting
    if (fromCurrency === market.currencyCode) {
      return currencyService.formatCurrency(numericAmount, market.currencyCode, market.locale)
    }

    // Use approximate conversion for immediate display
    const approximateRates: Record<string, Record<string, number>> = {
      'BGN': {
        'GBP': 0.42,
        'EUR': 0.51,
        'BGN': 1
      }
    }

    const rate = approximateRates[fromCurrency]?.[market.currencyCode] || 1
    const convertedAmount = numericAmount * rate
    
    return currencyService.formatCurrency(convertedAmount, market.currencyCode, market.locale)
  }

  // Get currency conversion disclaimer
  const getCurrencyDisclaimer = () => {
    if (market.currencyCode === 'BGN') return ''
    return currencyService.getConversionDisclaimer('BGN', market.currencyCode)
  }

  return (
    <MarketContext.Provider value={{ 
      market, 
      setMarket, 
      formatPrice, 
      formatPriceWithConversion,
      getCurrencyDisclaimer,
      isLoading 
    }}>
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