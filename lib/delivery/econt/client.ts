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

interface EcontOfficeResponse {
  offices: Array<{
    id: number
    name: string
    name_en: string
    address: string
    address_en: string
    city: {
      name: string
      name_en: string
      post_code: string
    }
    phone: string
    work_begin: string
    work_end: string
    gps: {
      lat: number
      lng: number
    }
  }>
}

interface EcontCalculationResponse {
  label: {
    total_sum: number
    currency: string
    delivery_days: number
  }
  errors?: string[]
}

interface EcontShipmentResponse {
  label: {
    shipment_num: string
    pdf_url: string
    total_sum: number
    currency: string
  }
  errors?: string[]
}

export class EcontProvider extends BaseDeliveryProvider {
  name = 'Econt'
  code = 'econt' as const
  
  constructor() {
    super({
      apiUrl: process.env.ECONT_API_URL || 'https://ee.econt.com/services/',
      username: process.env.ECONT_USERNAME || '',
      password: process.env.ECONT_PASSWORD || ''
    })
  }

  // Econt API is currently broken/unavailable - using placeholder implementation
  private async makeEcontRequest<T>(_endpoint: string, _data: any): Promise<T> {
    // TODO: Fix Econt API integration
    // Current issues:
    // - Test API returns HTML instead of JSON
    // - Production API returns empty responses
    // - Need proper API documentation from support_integrations@econt.com
    
    throw new Error('Econt API integration is currently unavailable. Please contact Econt support for proper API documentation.')
  }
  
  async getOffices(city?: string): Promise<DeliveryOffice[]> {
    const data = {
      system: {
        request: 'offices',
        response_type: 'json'
      },
      ...(city ? { filter: { city_name: city } } : {})
    }
    
    // Try different endpoint names for Econt API
    const response = await this.makeEcontRequest<EcontOfficeResponse>('offices', data)
    
    return response.offices.map(office => ({
      id: office.id.toString(),
      name: office.name_en || office.name,
      address: office.address_en || office.address,
      city: office.city.name_en || office.city.name,
      zip: office.city.post_code,
      phone: office.phone,
      workingHours: `${office.work_begin} - ${office.work_end}`,
      latitude: office.gps.lat,
      longitude: office.gps.lng,
      provider: 'econt' as const
    }))
  }
  
  async searchOffices(query: string): Promise<DeliveryOffice[]> {
    // Search by city name
    return this.getOffices(query)
  }
  
  async calculatePrice(request: DeliveryCalculationRequest): Promise<DeliveryCalculationResponse> {
    const isFromOffice = typeof request.from === 'string'
    const isToOffice = typeof request.to === 'string'
    
    const data = {
      system: {
        request: 'calculate',
        response_type: 'json'
      },
      label: {
        sender: isFromOffice ? { office_code: request.from as string } : {
          name: `${(request.from as DeliveryAddress).firstName} ${(request.from as DeliveryAddress).lastName}`,
          phone_num: this.formatPhone((request.from as DeliveryAddress).phone),
          city: (request.from as DeliveryAddress).city,
          post_code: (request.from as DeliveryAddress).zip,
          address: (request.from as DeliveryAddress).address1
        },
        receiver: isToOffice ? { office_code: request.to as string } : {
          name: `${(request.to as DeliveryAddress).firstName} ${(request.to as DeliveryAddress).lastName}`,
          phone_num: this.formatPhone((request.to as DeliveryAddress).phone),
          city: (request.to as DeliveryAddress).city,
          post_code: (request.to as DeliveryAddress).zip,
          address: (request.to as DeliveryAddress).address1
        },
        pack_count: 1,
        weight: request.weight,
        ...(request.dimensions ? {
          size: {
            width: request.dimensions.width,
            height: request.dimensions.height,
            depth: request.dimensions.length
          }
        } : {}),
        ...(request.declaredValue ? { declared_value: request.declaredValue } : {}),
        ...(request.cashOnDelivery ? { cd: { amount: request.cashOnDelivery } } : {})
      }
    }
    
    const response = await this.makeEcontRequest<EcontCalculationResponse>('calculate', data)
    
    if (response.errors && response.errors.length > 0) {
      return {
        provider: 'econt',
        service: 'standard',
        price: 0,
        currency: 'BGN',
        deliveryDays: 0,
        errors: response.errors
      }
    }
    
    return {
      provider: 'econt',
      service: 'standard',
      price: response.label.total_sum,
      currency: response.label.currency,
      deliveryDays: response.label.delivery_days
    }
  }
  
  async createShipment(request: ShipmentRequest): Promise<ShipmentResponse> {
    const isToOffice = typeof request.recipient === 'string'
    
    const data = {
      system: {
        request: 'create_label',
        response_type: 'json'
      },
      label: {
        sender: {
          name: `${request.sender.firstName} ${request.sender.lastName}`,
          phone_num: this.formatPhone(request.sender.phone),
          email: request.sender.email,
          city: request.sender.city,
          post_code: request.sender.zip,
          address: request.sender.address1
        },
        receiver: isToOffice ? { 
          office_code: request.recipient as string,
          name: 'Office Delivery'
        } : {
          name: `${(request.recipient as DeliveryAddress).firstName} ${(request.recipient as DeliveryAddress).lastName}`,
          phone_num: this.formatPhone((request.recipient as DeliveryAddress).phone),
          email: (request.recipient as DeliveryAddress).email,
          city: (request.recipient as DeliveryAddress).city,
          post_code: (request.recipient as DeliveryAddress).zip,
          address: (request.recipient as DeliveryAddress).address1
        },
        pack_count: request.packCount || 1,
        weight: request.weight,
        ...(request.dimensions ? {
          size: {
            width: request.dimensions.width,
            height: request.dimensions.height,
            depth: request.dimensions.length
          }
        } : {}),
        description: request.contents,
        ...(request.declaredValue ? { declared_value: request.declaredValue } : {}),
        ...(request.cashOnDelivery ? { cd: { amount: request.cashOnDelivery } } : {}),
        ...(request.notes ? { info: request.notes } : {})
      }
    }
    
    const response = await this.makeRequest<EcontShipmentResponse>('CreateLabel', 'POST', data)
    
    if (response.errors && response.errors.length > 0) {
      return {
        provider: 'econt',
        shipmentId: '',
        trackingNumber: '',
        price: 0,
        currency: 'BGN',
        errors: response.errors
      }
    }
    
    return {
      provider: 'econt',
      shipmentId: response.label.shipment_num,
      trackingNumber: response.label.shipment_num,
      labelUrl: response.label.pdf_url,
      price: response.label.total_sum,
      currency: response.label.currency
    }
  }
  
  async cancelShipment(shipmentId: string): Promise<boolean> {
    const data = {
      system: {
        request: 'delete_label',
        response_type: 'json'
      },
      label_nums: [shipmentId]
    }
    
    try {
      await this.makeRequest('DeleteLabel', 'POST', data)
      return true
    } catch {
      return false
    }
  }
  
  async trackShipment(trackingNumber: string): Promise<TrackingInfo> {
    const data = {
      system: {
        request: 'track_shipment',
        response_type: 'json'
      },
      shipment_num: trackingNumber
    }
    
    interface TrackingResponse {
      shipment: {
        status: string
        status_text: string
        delivery_date?: string
        tracking: Array<{
          time: string
          event: string
          location: string
        }>
      }
    }
    
    const response = await this.makeRequest<TrackingResponse>('Track', 'POST', data)
    
    const statusMap: Record<string, TrackingInfo['status']> = {
      'pending': 'pending',
      'in_transit': 'in_transit',
      'delivered': 'delivered',
      'returned': 'returned',
      'cancelled': 'cancelled'
    }
    
    const events: TrackingEvent[] = response.shipment.tracking.map(event => ({
      date: new Date(event.time),
      status: event.event,
      description: event.event,
      location: event.location
    }))
    
    return {
      provider: 'econt',
      trackingNumber,
      status: statusMap[response.shipment.status] || 'in_transit',
      statusText: response.shipment.status_text,
      lastUpdate: events[0]?.date || new Date(),
      events,
      ...(response.shipment.delivery_date ? {
        estimatedDelivery: new Date(response.shipment.delivery_date)
      } : {})
    }
  }
  
  async getLabel(shipmentId: string): Promise<string> {
    const data = {
      system: {
        request: 'print_label',
        response_type: 'json'
      },
      label_nums: [shipmentId]
    }
    
    interface LabelResponse {
      pdf_url: string
    }
    
    const response = await this.makeRequest<LabelResponse>('PrintLabel', 'POST', data)
    return response.pdf_url
  }
}