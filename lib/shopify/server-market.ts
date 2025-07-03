import { cookies } from 'next/headers'
import { DEFAULT_MARKET, SUPPORTED_MARKETS, formatPriceForMarket } from '@/lib/shopify/markets'
import type { Market } from '@/lib/shopify/markets'

/**
 * Get the current market from cookies (server-side)
 */
export async function getMarketFromCookies(): Promise<Market> {
  try {
    const cookieStore = await cookies()
    const marketCookie = cookieStore.get('indecisive-wear-market')
    
    if (marketCookie?.value) {
      const marketId = JSON.parse(marketCookie.value)
      const market = SUPPORTED_MARKETS.find(m => m.id === marketId)
      if (market) return market
    }
  } catch (_error) {
    // Silent error - fallback to default market
  }
  
  return DEFAULT_MARKET
}

/**
 * Format price for display (server-side)
 */
export async function formatPriceServer(amount: string, currencyCode?: string): Promise<string> {
  const market = await getMarketFromCookies()
  
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