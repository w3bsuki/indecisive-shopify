import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Shopify Customer Account API - Login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Call Shopify Customer Account API for authentication
    const loginResponse = await authenticateWithShopify(email, password)
    
    if (!loginResponse.success) {
      return NextResponse.json(
        { message: loginResponse.error || 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('customer-token', loginResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return NextResponse.json({
      success: true,
      customer: loginResponse.customer
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    )
  }
}

// Shopify Customer Authentication Helper
async function authenticateWithShopify(email: string, password: string) {
  const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
  
  if (!shopDomain || !storefrontToken) {
    throw new Error('Missing Shopify configuration')
  }

  // Use Shopify's Customer Account API
  const mutation = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `

  const variables = {
    input: {
      email,
      password
    }
  }

  try {
    const response = await fetch(`https://${shopDomain}/api/2025-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({ query: mutation, variables }),
    })

    const data = await response.json()

    if (data.data?.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
      return {
        success: false,
        error: data.data.customerAccessTokenCreate.customerUserErrors[0].message
      }
    }

    if (data.data?.customerAccessTokenCreate?.customerAccessToken) {
      // Get customer details
      const customer = await getCustomerDetails(
        data.data.customerAccessTokenCreate.customerAccessToken.accessToken
      )

      return {
        success: true,
        accessToken: data.data.customerAccessTokenCreate.customerAccessToken.accessToken,
        customer
      }
    }

    return {
      success: false,
      error: 'Authentication failed'
    }

  } catch (error) {
    console.error('Shopify authentication error:', error)
    return {
      success: false,
      error: 'Unable to authenticate with Shopify'
    }
  }
}

// Get customer details from Shopify
async function getCustomerDetails(accessToken: string) {
  const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        defaultAddress {
          id
          firstName
          lastName
          address1
          city
          province
          country
          zip
        }
      }
    }
  `

  const variables = {
    customerAccessToken: accessToken
  }

  try {
    const response = await fetch(`https://${shopDomain}/api/2025-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken!,
      },
      body: JSON.stringify({ query, variables }),
    })

    const data = await response.json()
    return data.data?.customer || null

  } catch (error) {
    console.error('Error fetching customer details:', error)
    return null
  }
}