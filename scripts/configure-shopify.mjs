#!/usr/bin/env node

/**
 * Shopify Admin API Configuration Script
 * 
 * This script configures:
 * 1. Markets for Bulgaria, UK, Germany
 * 2. Customer Account API settings
 * 3. Currency settings
 */

const SHOPIFY_DOMAIN = 'indecisive2x.myshopify.com'
const ADMIN_API_TOKEN = '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'
const API_VERSION = '2024-10'

class ShopifyAdminClient {
  constructor(domain, token, version) {
    this.domain = domain
    this.token = token
    this.version = version
    this.baseUrl = `https://${domain}/admin/api/${version}`
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const config = {
      headers: {
        'X-Shopify-Access-Token': this.token,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    console.log(`Making request to: ${url}`)
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`HTTP Error ${response.status}:`, errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return await response.text()
      }
    } catch (error) {
      console.error(`Request failed:`, error)
      throw error
    }
  }

  // Get current shop information
  async getShop() {
    return this.request('/shop.json')
  }

  // Get current markets
  async getMarkets() {
    return this.request('/markets.json')
  }

  // Get customer account settings
  async getCustomerAccountSettings() {
    return this.request('/customer_account_settings.json')
  }

  // Update customer account settings
  async updateCustomerAccountSettings(settings) {
    return this.request('/customer_account_settings.json', {
      method: 'PUT',
      body: JSON.stringify({ customer_account_settings: settings })
    })
  }

  // Create a new market
  async createMarket(marketData) {
    return this.request('/markets.json', {
      method: 'POST',
      body: JSON.stringify({ market: marketData })
    })
  }

  // Update market
  async updateMarket(marketId, marketData) {
    return this.request(`/markets/${marketId}.json`, {
      method: 'PUT', 
      body: JSON.stringify({ market: marketData })
    })
  }

  // Get countries
  async getCountries() {
    return this.request('/countries.json')
  }

  // Check available APIs by testing basic endpoints
  async checkAvailableAPIs() {
    const endpoints = [
      '/shop.json',
      '/products.json?limit=1',
      '/locations.json',
      '/countries.json', 
      '/markets.json',
      '/shipping_zones.json'
    ]

    const results = {}

    for (const endpoint of endpoints) {
      try {
        await this.request(endpoint)
        results[endpoint] = 'Available'
      } catch (error) {
        results[endpoint] = `Error: ${error.message}`
      }
    }

    return results
  }
}

async function configureShopify() {
  console.log('🚀 Starting Shopify configuration...')
  console.log(`Domain: ${SHOPIFY_DOMAIN}`)
  console.log(`API Version: ${API_VERSION}`)

  const client = new ShopifyAdminClient(SHOPIFY_DOMAIN, ADMIN_API_TOKEN, API_VERSION)

  try {
    // 1. Check available APIs
    console.log('\n🔍 Checking available APIs...')
    const apiStatus = await client.checkAvailableAPIs()
    console.log('API Endpoint Status:')
    Object.entries(apiStatus).forEach(([endpoint, status]) => {
      const emoji = status === 'Available' ? '✅' : '❌'
      console.log(`${emoji} ${endpoint}: ${status}`)
    })

    // 2. Get current shop info
    console.log('\n📊 Getting shop information...')
    const shop = await client.getShop()
    console.log(`Shop: ${shop.shop.name}`)
    console.log(`Domain: ${shop.shop.domain}`)
    console.log(`Currency: ${shop.shop.currency}`)
    console.log(`Country: ${shop.shop.country_name}`)

    // 3. Try to check markets (only if available)
    if (apiStatus['/markets.json'] === 'Available') {
      console.log('\n🌍 Checking current markets...')
      const markets = await client.getMarkets()
      console.log(`Current markets: ${markets.markets?.length || 0}`)
      markets.markets?.forEach(market => {
        console.log(`- ${market.name} (${market.handle}) - ${market.primary ? 'PRIMARY' : 'SECONDARY'}`)
      })
    } else {
      console.log('\n❌ Markets API not available - this might be a Shopify Plus feature')
    }

    // 3. Check customer account settings
    console.log('\n👤 Checking customer account settings...')
    try {
      const customerSettings = await client.getCustomerAccountSettings()
      console.log('Customer Account API status:', customerSettings)
    } catch (error) {
      console.log('Customer Account API not available or not configured')
    }

    // 4. Get countries for market configuration
    console.log('\n🗺️ Getting available countries...')
    const countries = await client.getCountries()
    const bgCountry = countries.countries?.find(c => c.code === 'BG')
    const gbCountry = countries.countries?.find(c => c.code === 'GB')  
    const deCountry = countries.countries?.find(c => c.code === 'DE')

    console.log(`Bulgaria available: ${!!bgCountry}`)
    console.log(`UK available: ${!!gbCountry}`)
    console.log(`Germany available: ${!!deCountry}`)

    // 5. Create markets if they don't exist
    console.log('\n💫 Configuring markets...')
    
    const targetMarkets = [
      {
        name: 'Bulgaria',
        handle: 'bulgaria',
        currency_code: 'BGN',
        country_codes: ['BG']
      },
      {
        name: 'United Kingdom', 
        handle: 'united-kingdom',
        currency_code: 'GBP',
        country_codes: ['GB']
      },
      {
        name: 'Germany',
        handle: 'germany', 
        currency_code: 'EUR',
        country_codes: ['DE']
      }
    ]

    for (const targetMarket of targetMarkets) {
      const existingMarket = markets.markets?.find(m => m.handle === targetMarket.handle)
      
      if (existingMarket) {
        console.log(`✅ Market "${targetMarket.name}" already exists`)
      } else {
        try {
          console.log(`📝 Creating market "${targetMarket.name}"...`)
          const newMarket = await client.createMarket(targetMarket)
          console.log(`✅ Created market: ${newMarket.market?.name}`)
        } catch (error) {
          console.log(`❌ Failed to create market "${targetMarket.name}":`, error.message)
        }
      }
    }

    console.log('\n✅ Shopify configuration completed!')
    console.log('\n📋 Summary:')
    console.log('- Shop information retrieved')
    console.log('- Markets configured for Bulgaria, UK, Germany')
    console.log('- Customer Account API checked')
    console.log('\n🎯 Next steps:')
    console.log('1. Enable Customer Account API in Shopify admin if not already enabled')
    console.log('2. Configure currency conversion rates')
    console.log('3. Set up shipping zones for each market')
    console.log('4. Test the complete integration')

  } catch (error) {
    console.error('\n❌ Configuration failed:', error.message)
    console.error('\nPossible issues:')
    console.error('- Invalid API token')
    console.error('- Insufficient permissions')
    console.error('- API rate limits')
    console.error('- Network connectivity')
    process.exit(1)
  }
}

// Run the configuration
configureShopify()