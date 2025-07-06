// Common types for all delivery providers

export interface DeliveryAddress {
  firstName: string
  lastName: string
  phone: string
  email?: string
  company?: string
  address1: string
  address2?: string
  city: string
  province?: string
  provinceCode?: string
  zip: string
  country: string
  countryCode: string
}

export interface DeliveryOffice {
  id: string
  name: string
  address: string
  city: string
  zip: string
  phone?: string
  workingHours?: string
  latitude?: number
  longitude?: number
  provider: 'econt' | 'speedy'
}

export interface DeliveryCalculationRequest {
  from: DeliveryAddress | string // Can be address or office ID
  to: DeliveryAddress | string   // Can be address or office ID
  weight: number // in kg
  dimensions?: {
    length: number // in cm
    width: number  // in cm
    height: number // in cm
  }
  declaredValue?: number
  cashOnDelivery?: number
  returnDocuments?: boolean
  returnShipment?: boolean
}

export interface DeliveryCalculationResponse {
  provider: 'econt' | 'speedy'
  service: string
  price: number
  currency: string
  deliveryDays: number
  errors?: string[]
}

export interface ShipmentRequest {
  provider: 'econt' | 'speedy'
  sender: DeliveryAddress
  recipient: DeliveryAddress | string // Can be address or office ID
  weight: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  declaredValue?: number
  cashOnDelivery?: number
  contents: string
  packCount?: number
  returnDocuments?: boolean
  returnShipment?: boolean
  notes?: string
}

export interface ShipmentResponse {
  provider: 'econt' | 'speedy'
  shipmentId: string
  trackingNumber: string
  labelUrl?: string
  estimatedDelivery?: string
  price: number
  currency: string
  errors?: string[]
}

export interface TrackingInfo {
  provider: 'econt' | 'speedy'
  trackingNumber: string
  status: 'pending' | 'in_transit' | 'delivered' | 'returned' | 'cancelled'
  statusText: string
  lastUpdate: Date
  events: TrackingEvent[]
  estimatedDelivery?: Date
  actualDelivery?: Date
}

export interface TrackingEvent {
  date: Date
  status: string
  description: string
  location?: string
}

export interface DeliveryProvider {
  name: string
  code: 'econt' | 'speedy'
  
  // Office management
  getOffices(city?: string): Promise<DeliveryOffice[]>
  searchOffices(query: string): Promise<DeliveryOffice[]>
  
  // Price calculation
  calculatePrice(request: DeliveryCalculationRequest): Promise<DeliveryCalculationResponse>
  
  // Shipment management
  createShipment(request: ShipmentRequest): Promise<ShipmentResponse>
  cancelShipment(shipmentId: string): Promise<boolean>
  
  // Tracking
  trackShipment(trackingNumber: string): Promise<TrackingInfo>
  
  // Labels
  getLabel(shipmentId: string): Promise<string> // Returns label URL or base64
}