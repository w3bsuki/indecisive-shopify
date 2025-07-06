import { EcontProvider } from './econt/client'
import { SpeedyProvider } from './speedy/client'
import type { DeliveryProvider, DeliveryOffice, DeliveryCalculationRequest, DeliveryCalculationResponse } from './types'

export class DeliveryManager {
  private providers: Map<string, DeliveryProvider>
  
  constructor() {
    this.providers = new Map()
    
    // Initialize providers
    this.providers.set('econt', new EcontProvider())
    this.providers.set('speedy', new SpeedyProvider())
  }
  
  getProvider(code: 'econt' | 'speedy'): DeliveryProvider | null {
    return this.providers.get(code) || null
  }
  
  getProviders(): DeliveryProvider[] {
    return Array.from(this.providers.values())
  }
  
  // Get offices from all providers
  async getAllOffices(city?: string): Promise<DeliveryOffice[]> {
    const promises = this.getProviders().map(provider => 
      provider.getOffices(city).catch(() => [])
    )
    
    const results = await Promise.all(promises)
    return results.flat()
  }
  
  // Search offices across all providers
  async searchAllOffices(query: string): Promise<DeliveryOffice[]> {
    const promises = this.getProviders().map(provider => 
      provider.searchOffices(query).catch(() => [])
    )
    
    const results = await Promise.all(promises)
    return results.flat()
  }
  
  // Calculate prices from all providers
  async calculateAllPrices(request: DeliveryCalculationRequest): Promise<DeliveryCalculationResponse[]> {
    const promises = this.getProviders().map(provider => 
      provider.calculatePrice(request).catch(error => ({
        provider: provider.code,
        service: 'standard',
        price: 0,
        currency: 'BGN',
        deliveryDays: 0,
        errors: [error.message]
      }))
    )
    
    return Promise.all(promises)
  }
  
  // Get cheapest option
  async getCheapestOption(request: DeliveryCalculationRequest): Promise<DeliveryCalculationResponse | null> {
    const prices = await this.calculateAllPrices(request)
    const validPrices = prices.filter(p => !p.errors || p.errors.length === 0)
    
    if (validPrices.length === 0) return null
    
    return validPrices.reduce((cheapest, current) => 
      current.price < cheapest.price ? current : cheapest
    )
  }
  
  // Get fastest option
  async getFastestOption(request: DeliveryCalculationRequest): Promise<DeliveryCalculationResponse | null> {
    const prices = await this.calculateAllPrices(request)
    const validPrices = prices.filter(p => !p.errors || p.errors.length === 0)
    
    if (validPrices.length === 0) return null
    
    return validPrices.reduce((fastest, current) => 
      current.deliveryDays < fastest.deliveryDays ? current : fastest
    )
  }
}

// Singleton instance
let deliveryManager: DeliveryManager | null = null

export function getDeliveryManager(): DeliveryManager {
  if (!deliveryManager) {
    deliveryManager = new DeliveryManager()
  }
  return deliveryManager
}