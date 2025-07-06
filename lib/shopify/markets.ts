export interface Market {
  id: string
  name: string
  currencyCode: string
  countryCode: string
  languageCode: string
  locale: string
  flag: string
}

export const SUPPORTED_MARKETS: Market[] = [
  {
    id: 'bg',
    name: 'Bulgaria',
    currencyCode: 'BGN',
    countryCode: 'BG',
    languageCode: 'BG',
    locale: 'bg-BG',
    flag: '🇧🇬'
  },
  {
    id: 'gb',
    name: 'United Kingdom',
    currencyCode: 'GBP',
    countryCode: 'GB',
    languageCode: 'EN',
    locale: 'en-GB',
    flag: '🇬🇧'
  },
  {
    id: 'de',
    name: 'Germany',
    currencyCode: 'EUR',
    countryCode: 'DE',
    languageCode: 'DE',
    locale: 'de-DE',
    flag: '🇩🇪'
  }
]

export const DEFAULT_MARKET = SUPPORTED_MARKETS[0] // Bulgaria

export function getMarketByCountryCode(countryCode: string): Market {
  const market = SUPPORTED_MARKETS.find(m => m.countryCode === countryCode)
  return market || DEFAULT_MARKET
}

export function getMarketById(id: string): Market {
  const market = SUPPORTED_MARKETS.find(m => m.id === id)
  return market || DEFAULT_MARKET
}

export function formatPriceForMarket(amount: string, market: Market): string {
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
  
  const symbol = currencySymbols[market.currencyCode] || market.currencyCode
  
  // Format number without currency symbol
  const formattedNumber = new Intl.NumberFormat(market.locale, {
    minimumFractionDigits: (market.currencyCode === 'JPY' || market.currencyCode === 'BGN') ? 0 : 2,
    maximumFractionDigits: (market.currencyCode === 'JPY' || market.currencyCode === 'BGN') ? 0 : 2,
  }).format(value)
  
  // Place symbol based on currency convention
  if (market.currencyCode === 'BGN') {
    return `${formattedNumber} ${symbol}` // Bulgarian Lev comes after with space
  } else {
    return `${symbol}${formattedNumber}` // Most currencies come before
  }
}

// Get market from browser's Accept-Language header or navigator.language
export function detectMarketFromBrowser(): Market {
  if (typeof window === 'undefined') return DEFAULT_MARKET
  
  const browserLang = navigator.language || 'en-US'
  const countryCode = browserLang.split('-')[1] || 'US'
  
  return getMarketByCountryCode(countryCode)
}

// Storage keys
const MARKET_STORAGE_KEY = 'indecisive-wear-market'

export function getStoredMarket(): Market | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(MARKET_STORAGE_KEY)
    if (stored) {
      const marketId = JSON.parse(stored)
      return getMarketById(marketId)
    }
  } catch (_e) {
    // Silent error - fallback to null
  }
  
  return null
}

export function storeMarket(market: Market): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(MARKET_STORAGE_KEY, JSON.stringify(market.id))
  } catch (_e) {
    // Silent error - localStorage unavailable
  }
}