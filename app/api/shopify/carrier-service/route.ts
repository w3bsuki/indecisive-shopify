import { NextRequest, NextResponse } from 'next/server'
import { getDeliveryManager } from '@/lib/delivery/manager'
import type { DeliveryAddress } from '@/lib/delivery/types'

// Shopify Carrier Service API
// This endpoint receives shipping rate requests from Shopify checkout
// https://shopify.dev/docs/apps/selling-strategies/shipping-and-fulfillment/setting-up-shipping

interface ShopifyCarrierServiceRequest {
  rate: {
    origin: {
      country: string
      postal_code: string
      province: string
      city: string
      name: string
      address1: string
      address2?: string
      address3?: string
      phone: string
      fax?: string
      email?: string
      address_type?: string
      company_name?: string
    }
    destination: {
      country: string
      postal_code: string
      province: string
      city: string
      name?: string
      address1: string
      address2?: string
      address3?: string
      phone?: string
      fax?: string
      email?: string
      address_type?: string
      company_name?: string
    }
    items: Array<{
      name: string
      sku: string
      quantity: number
      grams: number
      price: number
      vendor: string
      requires_shipping: boolean
      taxable: boolean
      fulfillment_service: string
      properties?: Record<string, any>
    }>
    currency: string
    locale: string
  }
}

interface ShopifyCarrierServiceResponse {
  rates: Array<{
    service_name: string
    service_code: string
    total_price: string
    description?: string
    currency: string
    min_delivery_date?: string
    max_delivery_date?: string
    phone_required?: boolean
  }>
}

// Convert Shopify address to our delivery address format
function convertShopifyAddress(shopifyAddr: any, name?: string): DeliveryAddress {
  const nameParts = (name || shopifyAddr.name || '').split(' ')
  return {
    firstName: nameParts[0] || 'Customer',
    lastName: nameParts.slice(1).join(' ') || '',
    phone: shopifyAddr.phone || '+359888000000',
    email: shopifyAddr.email || 'customer@example.com',
    address1: shopifyAddr.address1 || '',
    address2: shopifyAddr.address2 || '',
    city: shopifyAddr.city || '',
    province: shopifyAddr.province || '',
    zip: shopifyAddr.postal_code || '',
    country: shopifyAddr.country || 'Bulgaria',
    countryCode: shopifyAddr.country === 'Bulgaria' ? 'BG' : 'BG',
    company: shopifyAddr.company_name || ''
  }
}

// Calculate total weight from items
function calculateTotalWeight(items: any[]): number {
  const totalGrams = items.reduce((sum, item) => sum + (item.grams * item.quantity), 0)
  return totalGrams / 1000 // Convert to kg
}

// Calculate total value from items
function calculateTotalValue(items: any[]): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
}

// Add delivery days to current date
function addDays(date: Date, days: number): string {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result.toISOString().split('T')[0] // Return YYYY-MM-DD format
}

export async function POST(request: NextRequest) {
  try {
    const body: ShopifyCarrierServiceRequest = await request.json()
    
    console.log('[Carrier Service] Received rate request:', JSON.stringify(body, null, 2))
    
    const { rate } = body
    
    // Only process shipping to Bulgaria for now
    if (rate.destination.country !== 'Bulgaria') {
      console.log('[Carrier Service] Skipping non-Bulgaria destination:', rate.destination.country)
      return NextResponse.json({ rates: [] })
    }
    
    // Convert addresses to our format
    const origin = convertShopifyAddress(rate.origin)
    const destination = convertShopifyAddress(rate.destination)
    
    // Calculate package details
    const weight = calculateTotalWeight(rate.items)
    const declaredValue = calculateTotalValue(rate.items)
    
    console.log('[Carrier Service] Package details:', { weight, declaredValue })
    
    // Minimum weight for shipping calculation
    const effectiveWeight = Math.max(weight, 0.1) // Minimum 100g
    
    // Get delivery manager and calculate rates
    const manager = getDeliveryManager()
    const deliveryRates = await manager.calculateAllPrices({
      from: origin,
      to: destination,
      weight: effectiveWeight,
      declaredValue
    })
    
    console.log('[Carrier Service] Delivery rates:', deliveryRates)
    
    // Convert our rates to Shopify format
    const shopifyRates = []
    
    for (const rate of deliveryRates) {
      if (rate.errors && rate.errors.length > 0) {
        console.log(`[Carrier Service] Skipping ${rate.provider} due to errors:`, rate.errors)
        continue
      }
      
      const providerName = rate.provider === 'econt' ? 'Econt' : 'Speedy'
      const today = new Date()
      
      // Home delivery option
      shopifyRates.push({
        service_name: `${providerName} - Home Delivery`,
        service_code: `${rate.provider}_home`,
        total_price: (rate.price * 100).toFixed(0), // Shopify expects cents
        description: `Delivered to your address in ${rate.deliveryDays} business days`,
        currency: rate.currency,
        min_delivery_date: addDays(today, rate.deliveryDays),
        max_delivery_date: addDays(today, rate.deliveryDays + 1),
        phone_required: true
      })
      
      // Office pickup option (20% discount)
      const officePrice = rate.price * 0.8
      shopifyRates.push({
        service_name: `${providerName} - Office Pickup`,
        service_code: `${rate.provider}_office`,
        total_price: (officePrice * 100).toFixed(0), // Shopify expects cents
        description: `Pick up from ${providerName} office in ${rate.deliveryDays - 1} business days (20% off)`,
        currency: rate.currency,
        min_delivery_date: addDays(today, Math.max(1, rate.deliveryDays - 1)),
        max_delivery_date: addDays(today, rate.deliveryDays),
        phone_required: true
      })
    }
    
    console.log('[Carrier Service] Returning rates:', shopifyRates)
    
    const response: ShopifyCarrierServiceResponse = {
      rates: shopifyRates
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('[Carrier Service] Error processing rate request:', error)
    
    // Return empty rates on error to avoid breaking checkout
    return NextResponse.json({ rates: [] })
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    service: 'Shopify Carrier Service',
    providers: ['speedy'], // Econt temporarily disabled due to API issues
    status: 'active',
    endpoints: {
      rates: '/api/shopify/carrier-service'
    }
  })
}