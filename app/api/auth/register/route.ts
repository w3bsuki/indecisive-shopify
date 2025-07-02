import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Shopify Customer Account API - Registration
export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Call Shopify Customer Account API for registration
    const registerResponse = await registerWithShopify({
      firstName,
      lastName,
      email,
      password
    })
    
    if (!registerResponse.success) {
      return NextResponse.json(
        { message: registerResponse.error || 'Registration failed' },
        { status: 400 }
      )
    }

    // Automatically log in after successful registration
    const loginResponse = await authenticateWithShopify(email, password)
    
    if (loginResponse.success) {
      // Set session cookie
      const cookieStore = await cookies()
      cookieStore.set('customer-token', loginResponse.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      })
    }

    return NextResponse.json({
      success: true,
      customer: registerResponse.customer,
      autoLogin: loginResponse.success
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}

// Shopify Customer Registration Helper
async function registerWithShopify(customerData: {
  firstName: string
  lastName: string
  email: string
  password: string
}) {
  const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
  
  if (!shopDomain || !storefrontToken) {
    throw new Error('Missing Shopify configuration')
  }

  // Use Shopify's Customer Account API
  const mutation = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
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
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      email: customerData.email,
      password: customerData.password,
      acceptsMarketing: false // Default to false, can be made configurable
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

    if (data.data?.customerCreate?.customerUserErrors?.length > 0) {
      return {
        success: false,
        error: data.data.customerCreate.customerUserErrors[0].message
      }
    }

    if (data.data?.customerCreate?.customer) {
      return {
        success: true,
        customer: data.data.customerCreate.customer
      }
    }

    return {
      success: false,
      error: 'Registration failed'
    }

  } catch (error) {
    console.error('Shopify registration error:', error)
    return {
      success: false,
      error: 'Unable to register with Shopify'
    }
  }
}

// Authentication helper (reused from login)
async function authenticateWithShopify(email: string, password: string) {
  const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
  
  if (!shopDomain || !storefrontToken) {
    throw new Error('Missing Shopify configuration')
  }

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

    if (data.data?.customerAccessTokenCreate?.customerAccessToken) {
      return {
        success: true,
        accessToken: data.data.customerAccessTokenCreate.customerAccessToken.accessToken
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