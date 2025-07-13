import type { 
  DeliveryProvider, 
  DeliveryOffice, 
  DeliveryCalculationRequest,
  DeliveryCalculationResponse,
  ShipmentRequest,
  ShipmentResponse,
  TrackingInfo
} from './types'

export abstract class BaseDeliveryProvider implements DeliveryProvider {
  abstract name: string
  abstract code: 'econt' | 'speedy'
  
  protected apiUrl: string
  protected username: string
  protected password: string
  
  constructor(config: { apiUrl: string; username: string; password: string }) {
    this.apiUrl = config.apiUrl
    this.username = config.username
    this.password = config.password
  }
  
  // Abstract methods that must be implemented by each provider
  abstract getOffices(city?: string): Promise<DeliveryOffice[]>
  abstract searchOffices(query: string): Promise<DeliveryOffice[]>
  abstract calculatePrice(request: DeliveryCalculationRequest): Promise<DeliveryCalculationResponse>
  abstract createShipment(request: ShipmentRequest): Promise<ShipmentResponse>
  abstract cancelShipment(shipmentId: string): Promise<boolean>
  abstract trackShipment(trackingNumber: string): Promise<TrackingInfo>
  abstract getLabel(shipmentId: string): Promise<string>
  
  // Shared utility methods
  protected async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'DELETE' = 'POST',
    data?: any
  ): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`
    }
    
    const options: RequestInit = {
      method,
      headers,
      ...(data && method !== 'GET' ? { body: JSON.stringify(data) } : {})
    }
    
    try {
      const response = await fetch(url, options)
      
      if (!response.ok) {
        const responseText = await response.text()
        
        try {
          const errorData = JSON.parse(responseText)
          throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`)
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText} - ${responseText.substring(0, 200)}`)
        }
      }
      
      const responseText = await response.text()
      
      try {
        return JSON.parse(responseText)
      } catch (_parseError) {
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}`)
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`${this.name} API Error: ${error.message}`)
      }
      throw error
    }
  }
  
  // Shared validation methods
  protected validateAddress(address: any): boolean {
    return !!(
      address &&
      address.firstName &&
      address.lastName &&
      address.phone &&
      address.address1 &&
      address.city &&
      address.zip &&
      address.country
    )
  }
  
  protected validateWeight(weight: number): boolean {
    return weight > 0 && weight <= 100 // Max 100kg
  }
  
  protected formatPhone(phone: string): string {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '')
    
    // Add country code if missing
    if (cleaned.startsWith('0')) {
      return `359${cleaned.substring(1)}` // Bulgaria
    }
    
    return cleaned
  }
}