/**
 * Currency Exchange Rate Service
 * 
 * Handles real-time currency conversion for BGN → GBP → EUR
 * Uses ExchangeRate-API for live rates with fallback static rates
 */

export interface ExchangeRates {
  BGN: number
  GBP: number  
  EUR: number
  lastUpdated: string
}

export interface CurrencyConversionResult {
  originalAmount: number
  originalCurrency: string
  convertedAmount: number
  convertedCurrency: string
  exchangeRate: number
  isApproximate: boolean
}

class CurrencyService {
  private static instance: CurrencyService
  private rates: ExchangeRates | null = null
  private lastFetch: number = 0
  private readonly CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

  // Fallback rates (updated periodically)
  private readonly FALLBACK_RATES: ExchangeRates = {
    BGN: 1,      // Base currency
    GBP: 0.42,   // 1 BGN = ~0.42 GBP
    EUR: 0.51,   // 1 BGN = ~0.51 EUR
    lastUpdated: '2025-01-02T00:00:00Z'
  }

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService()
    }
    return CurrencyService.instance
  }

  /**
   * Get current exchange rates with caching
   */
  async getExchangeRates(): Promise<ExchangeRates> {
    const now = Date.now()
    
    // Use cached rates if still valid
    if (this.rates && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.rates
    }

    try {
      // Try to fetch live rates from ExchangeRate-API (free tier)
      const response = await fetch(
        'https://api.exchangerate-api.com/v4/latest/BGN',
        { 
          next: { revalidate: 1800 } // Cache for 30 minutes
        }
      )

      if (response.ok) {
        const data = await response.json()
        
        this.rates = {
          BGN: 1,
          GBP: data.rates.GBP || this.FALLBACK_RATES.GBP,
          EUR: data.rates.EUR || this.FALLBACK_RATES.EUR,
          lastUpdated: data.date || new Date().toISOString()
        }
        
        this.lastFetch = now
        // Updated exchange rates
        return this.rates
      }
    } catch (_error) {
      // Failed to fetch live exchange rates, using fallback
    }

    // Fallback to static rates
    this.rates = this.FALLBACK_RATES
    this.lastFetch = now
    return this.rates
  }

  /**
   * Convert BGN amount to target currency
   */
  async convertCurrency(
    amount: number, 
    fromCurrency: string, 
    toCurrency: string
  ): Promise<CurrencyConversionResult> {
    
    // If same currency, no conversion needed
    if (fromCurrency === toCurrency) {
      return {
        originalAmount: amount,
        originalCurrency: fromCurrency,
        convertedAmount: amount,
        convertedCurrency: toCurrency,
        exchangeRate: 1,
        isApproximate: false
      }
    }

    const rates = await this.getExchangeRates()
    
    // Convert from BGN to target currency
    let exchangeRate = 1
    if (fromCurrency === 'BGN' && toCurrency === 'GBP') {
      exchangeRate = rates.GBP
    } else if (fromCurrency === 'BGN' && toCurrency === 'EUR') {
      exchangeRate = rates.EUR
    } else {
      // For other conversions, convert through BGN
      // Unsupported conversion
      exchangeRate = 1
    }

    const convertedAmount = amount * exchangeRate

    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      convertedAmount: Math.round(convertedAmount * 100) / 100, // Round to 2 decimals
      convertedCurrency: toCurrency,
      exchangeRate,
      isApproximate: true
    }
  }

  /**
   * Format currency amount with proper symbol and locale
   */
  formatCurrency(
    amount: number, 
    currency: string, 
    _locale: string = 'en-US'
  ): string {
    const formatters: Record<string, Intl.NumberFormat> = {
      'BGN': new Intl.NumberFormat('bg-BG', { 
        style: 'currency', 
        currency: 'BGN',
        minimumFractionDigits: 2
      }),
      'GBP': new Intl.NumberFormat('en-GB', { 
        style: 'currency', 
        currency: 'GBP',
        minimumFractionDigits: 2
      }),
      'EUR': new Intl.NumberFormat('de-DE', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 2
      })
    }

    const formatter = formatters[currency]
    if (formatter) {
      return formatter.format(amount)
    }

    // Fallback formatting
    return `${amount.toFixed(2)} ${currency}`
  }

  /**
   * Get conversion disclaimer text
   */
  getConversionDisclaimer(fromCurrency: string, toCurrency: string): string {
    if (fromCurrency === toCurrency) return ''
    
    return `* Approximate price converted from ${fromCurrency}. Final checkout will be in ${fromCurrency}.`
  }
}

// Export singleton instance
export const currencyService = CurrencyService.getInstance()

// Export types and utilities
export { CurrencyService }