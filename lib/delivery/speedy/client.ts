import { BaseDeliveryProvider } from '../base-provider'
import type {
  DeliveryOffice,
  DeliveryCalculationRequest,
  DeliveryCalculationResponse,
  ShipmentRequest,
  ShipmentResponse,
  TrackingInfo,
  TrackingEvent,
  DeliveryAddress
} from '../types'

interface SpeedyOfficeResponse {
  offices: Array<{
    id: string
    name: string
    nameEn: string
    address: {
      siteId: number
      siteName: string
      streetName: string
      streetNo: string
      postCode: string
      countryId: number
    }
    workingTime: {
      openTime: string
      closeTime: string
    }
    coordinates: {
      latitude: number
      longitude: number
    }
    phone: string
  }>
}

interface SpeedyCalculationResponse {
  calculations: Array<{
    serviceId: number
    serviceName: string
    price: {
      amount: number
      currency: string
    }
    deliveryTime: {
      workingDays: number
    }
  }>
  error?: {
    message: string
  }
}

interface SpeedyShipmentResponse {
  parcels: Array<{
    id: string
    barcode: string
  }>
  price: {
    amount: number
    currency: string
  }
  printURL: string
  error?: {
    message: string
  }
}

export class SpeedyProvider extends BaseDeliveryProvider {
  name = 'Speedy'
  code = 'speedy' as const
  
  constructor() {
    super({
      apiUrl: process.env.SPEEDY_API_URL || 'https://api.speedy.bg/v1/',
      username: process.env.SPEEDY_USERNAME || '',
      password: process.env.SPEEDY_PASSWORD || ''
    })
  }

  // Custom GET request method for Speedy API
  private async makeSpeedyGetRequest<T>(endpoint: string): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`
    
    const headers: HeadersInit = {
      'Accept': 'application/json'
      // Don't send Content-Type for GET requests
    }
    
    const options: RequestInit = {
      method: 'GET',
      headers
    }
    
    try {
      const response = await fetch(url, options)
      
      if (!response.ok) {
        const _errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
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
  
  async getOffices(city?: string): Promise<DeliveryOffice[]> {
    const params = new URLSearchParams({
      userName: this.username,
      password: this.password,
      language: 'EN',
      ...(city ? { siteName: city } : {})
    })
    
    // Use custom GET request without JSON headers for Speedy
    const response = await this.makeSpeedyGetRequest<SpeedyOfficeResponse>(
      `location/office?${params.toString()}`
    )
    
    return response.offices.map(office => ({
      id: office.id,
      name: office.nameEn || office.name,
      address: `${office.address.streetName} ${office.address.streetNo}`,
      city: office.address.siteName,
      zip: office.address.postCode,
      phone: office.phone,
      workingHours: `${office.workingTime.openTime} - ${office.workingTime.closeTime}`,
      latitude: office.coordinates.latitude,
      longitude: office.coordinates.longitude,
      provider: 'speedy' as const
    }))
  }
  
  async searchOffices(query: string): Promise<DeliveryOffice[]> {
    return this.getOffices(query)
  }
  
  async calculatePrice(request: DeliveryCalculationRequest): Promise<DeliveryCalculationResponse> {
    const isFromOffice = typeof request.from === 'string'
    const isToOffice = typeof request.to === 'string'
    
    const data = {
      userName: this.username,
      password: this.password,
      language: 'EN',
      sender: isFromOffice ? {
        officeId: request.from as string
      } : {
        addressLocation: {
          siteId: await this.getSiteId((request.from as DeliveryAddress).city),
          streetName: (request.from as DeliveryAddress).address1,
          postCode: (request.from as DeliveryAddress).zip
        }
      },
      recipient: isToOffice ? {
        officeId: request.to as string
      } : {
        addressLocation: {
          siteId: await this.getSiteId((request.to as DeliveryAddress).city),
          streetName: (request.to as DeliveryAddress).address1,
          postCode: (request.to as DeliveryAddress).zip
        }
      },
      service: {
        serviceIds: [505] // Standard service
      },
      content: {
        parcelsCount: 1,
        totalWeight: request.weight,
        ...(request.declaredValue ? { declaredValue: { amount: request.declaredValue } } : {}),
        ...(request.cashOnDelivery ? { cashOnDelivery: { amount: request.cashOnDelivery } } : {})
      }
    }
    
    const response = await this.makeRequest<SpeedyCalculationResponse>('calculate', 'POST', data)
    
    if (response.error) {
      return {
        provider: 'speedy',
        service: 'standard',
        price: 0,
        currency: 'BGN',
        deliveryDays: 0,
        errors: [response.error.message]
      }
    }
    
    const calculation = response.calculations[0]
    
    return {
      provider: 'speedy',
      service: calculation.serviceName,
      price: calculation.price.amount,
      currency: calculation.price.currency,
      deliveryDays: calculation.deliveryTime.workingDays
    }
  }
  
  async createShipment(request: ShipmentRequest): Promise<ShipmentResponse> {
    const isToOffice = typeof request.recipient === 'string'
    
    const data = {
      userName: this.username,
      password: this.password,
      language: 'EN',
      sender: {
        phone: this.formatPhone(request.sender.phone),
        clientName: `${request.sender.firstName} ${request.sender.lastName}`,
        email: request.sender.email,
        address: {
          siteId: await this.getSiteId(request.sender.city),
          streetName: request.sender.address1,
          postCode: request.sender.zip
        }
      },
      recipient: isToOffice ? {
        officeId: request.recipient as string,
        clientName: 'Office Delivery',
        phone: '0888000000' // Required field
      } : {
        phone: this.formatPhone((request.recipient as DeliveryAddress).phone),
        clientName: `${(request.recipient as DeliveryAddress).firstName} ${(request.recipient as DeliveryAddress).lastName}`,
        email: (request.recipient as DeliveryAddress).email,
        address: {
          siteId: await this.getSiteId((request.recipient as DeliveryAddress).city),
          streetName: (request.recipient as DeliveryAddress).address1,
          postCode: (request.recipient as DeliveryAddress).zip
        }
      },
      service: {
        serviceId: 505, // Standard service
        ...(request.cashOnDelivery ? {
          additionalServices: {
            cod: { amount: request.cashOnDelivery }
          }
        } : {})
      },
      content: {
        parcelsCount: request.packCount || 1,
        totalWeight: request.weight,
        contents: request.contents,
        ...(request.declaredValue ? { declaredValue: { amount: request.declaredValue } } : {})
      },
      payment: {
        courierServicePayer: 'SENDER'
      }
    }
    
    const response = await this.makeRequest<SpeedyShipmentResponse>('shipment', 'POST', data)
    
    if (response.error) {
      return {
        provider: 'speedy',
        shipmentId: '',
        trackingNumber: '',
        price: 0,
        currency: 'BGN',
        errors: [response.error.message]
      }
    }
    
    return {
      provider: 'speedy',
      shipmentId: response.parcels[0].id,
      trackingNumber: response.parcels[0].barcode,
      labelUrl: response.printURL,
      price: response.price.amount,
      currency: response.price.currency
    }
  }
  
  async cancelShipment(shipmentId: string): Promise<boolean> {
    const params = new URLSearchParams({
      userName: this.username,
      password: this.password,
      shipmentId: shipmentId
    })
    
    try {
      await this.makeRequest(`shipment/cancel?${params.toString()}`, 'DELETE')
      return true
    } catch {
      return false
    }
  }
  
  async trackShipment(trackingNumber: string): Promise<TrackingInfo> {
    const params = new URLSearchParams({
      userName: this.username,
      password: this.password,
      language: 'EN',
      barcode: trackingNumber
    })
    
    interface TrackingResponse {
      trackingResult: {
        barcode: string
        deliveryDate?: string
        operations: Array<{
          dateTime: string
          operationCode: string
          operationDescription: string
          operationComment: string
          siteName: string
        }>
      }
    }
    
    const response = await this.makeRequest<TrackingResponse>(
      `track?${params.toString()}`,
      'GET'
    )
    
    const statusMap: Record<string, TrackingInfo['status']> = {
      '01': 'pending',      // Order created
      '02': 'in_transit',   // Picked up
      '03': 'in_transit',   // In transit
      '04': 'delivered',    // Delivered
      '05': 'returned',     // Returned
      '06': 'cancelled'     // Cancelled
    }
    
    const events: TrackingEvent[] = response.trackingResult.operations.map(op => ({
      date: new Date(op.dateTime),
      status: op.operationCode,
      description: op.operationDescription,
      location: op.siteName
    }))
    
    const latestOperation = response.trackingResult.operations[0]
    const status = statusMap[latestOperation?.operationCode] || 'in_transit'
    
    return {
      provider: 'speedy',
      trackingNumber,
      status,
      statusText: latestOperation?.operationDescription || 'Unknown',
      lastUpdate: new Date(latestOperation?.dateTime || Date.now()),
      events,
      ...(response.trackingResult.deliveryDate ? {
        estimatedDelivery: new Date(response.trackingResult.deliveryDate)
      } : {})
    }
  }
  
  async getLabel(shipmentId: string): Promise<string> {
    const params = new URLSearchParams({
      userName: this.username,
      password: this.password,
      parcels: shipmentId,
      format: 'PDF'
    })
    
    return `${this.apiUrl}print?${params.toString()}`
  }
  
  // Helper method to get site ID for a city
  private async getSiteId(cityName: string): Promise<number> {
    const params = new URLSearchParams({
      userName: this.username,
      password: this.password,
      name: cityName,
      countryId: '100' // Bulgaria
    })
    
    interface SiteResponse {
      sites: Array<{
        id: number
        name: string
      }>
    }
    
    const response = await this.makeSpeedyGetRequest<SiteResponse>(
      `location/site?${params.toString()}`
    )
    
    if (response.sites.length === 0) {
      throw new Error(`City "${cityName}" not found`)
    }
    
    return response.sites[0].id
  }
}