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
    id: 'us',
    name: 'United States',
    currencyCode: 'USD',
    countryCode: 'US',
    languageCode: 'EN',
    locale: 'en-US',
    flag: '🇺🇸'
  },
  {
    id: 'ca',
    name: 'Canada',
    currencyCode: 'CAD',
    countryCode: 'CA',
    languageCode: 'EN',
    locale: 'en-CA',
    flag: '🇨🇦'
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
    id: 'eu',
    name: 'Europe',
    currencyCode: 'EUR',
    countryCode: 'DE', // Default to Germany for EU
    languageCode: 'EN',
    locale: 'en-EU',
    flag: '🇪🇺'
  },
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
    id: 'au',
    name: 'Australia',
    currencyCode: 'AUD',
    countryCode: 'AU',
    languageCode: 'EN',
    locale: 'en-AU',
    flag: '🇦🇺'
  },
  {
    id: 'jp',
    name: 'Japan',
    currencyCode: 'JPY',
    countryCode: 'JP',
    languageCode: 'JA',
    locale: 'ja-JP',
    flag: '🇯🇵'
  }
]

export const DEFAULT_MARKET = SUPPORTED_MARKETS[0] // US

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
    minimumFractionDigits: market.currencyCode === 'JPY' ? 0 : 2,
    maximumFractionDigits: market.currencyCode === 'JPY' ? 0 : 2,
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
  } catch (e) {
    console.error('Error reading stored market:', e)
  }
  
  return null
}

export function storeMarket(market: Market): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(MARKET_STORAGE_KEY, JSON.stringify(market.id))
  } catch (e) {
    console.error('Error storing market:', e)
  }
}