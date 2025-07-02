'use client'

import { useState, useEffect, useMemo } from 'react'
import { useMarket } from '@/hooks/use-market'
import { currencyService, type CurrencyConversionResult } from '@/lib/currency/exchange-rates'

interface UseCurrencyResult {
  convertPrice: (amount: string | number, fromCurrency?: string) => Promise<CurrencyConversionResult>
  formatPrice: (amount: string | number, currency?: string) => string
  getConvertedPrice: (amount: string | number, fromCurrency?: string) => string
  isLoading: boolean
  disclaimer: string
}

export function useCurrency(): UseCurrencyResult {
  const { market } = useMarket()
  const [isLoading, setIsLoading] = useState(false)
  const [lastConversion, setLastConversion] = useState<CurrencyConversionResult | null>(null)

  // Convert price from BGN to market currency
  const convertPrice = async (
    amount: string | number, 
    fromCurrency: string = 'BGN'
  ): Promise<CurrencyConversionResult> => {
    setIsLoading(true)
    try {
      const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
      const result = await currencyService.convertCurrency(
        numericAmount,
        fromCurrency,
        market.currencyCode
      )
      setLastConversion(result)
      return result
    } finally {
      setIsLoading(false)
    }
  }

  // Format price with proper currency symbol and locale
  const formatPrice = (
    amount: string | number, 
    currency?: string
  ): string => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    const targetCurrency = currency || market.currencyCode
    
    return currencyService.formatCurrency(numericAmount, targetCurrency, market.locale)
  }

  // Get converted price as formatted string (synchronous with caching)
  const getConvertedPrice = (
    amount: string | number,
    fromCurrency: string = 'BGN'
  ): string => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    
    // If same currency, no conversion needed
    if (fromCurrency === market.currencyCode) {
      return formatPrice(numericAmount, market.currencyCode)
    }

    // Use approximate conversion rates for immediate display
    const approximateRates: Record<string, Record<string, number>> = {
      'BGN': {
        'GBP': 0.42,
        'EUR': 0.51,
        'BGN': 1
      }
    }

    const rate = approximateRates[fromCurrency]?.[market.currencyCode] || 1
    const convertedAmount = numericAmount * rate
    
    return formatPrice(convertedAmount, market.currencyCode)
  }

  // Memoized disclaimer text
  const disclaimer = useMemo(() => {
    if (market.currencyCode === 'BGN') return ''
    return currencyService.getConversionDisclaimer('BGN', market.currencyCode)
  }, [market.currencyCode])

  return {
    convertPrice,
    formatPrice,
    getConvertedPrice,
    isLoading,
    disclaimer
  }
}