import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Get current user details
export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const customerToken = cookieStore.get('customer-token')

    if (!customerToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get customer details from Shopify
    const customer = await getCustomerDetails(customerToken.value)
    
    if (!customer) {
      // Token might be expired, clear it
      const cookieStoreForDelete = await cookies()
      cookieStoreForDelete.delete('customer-token')
      return NextResponse.json(
        { message: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      customer
    })

  } catch (error) {
    console.error('Get customer error:', error)
    return NextResponse.json(
      { message: 'An error occurred while fetching customer data' },
      { status: 500 }
    )
  }
}

// Get customer details from Shopify using access token
async function getCustomerDetails(accessToken: string) {
  const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

  if (!shopDomain || !storefrontToken) {
    throw new Error('Missing Shopify configuration')
  }

  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing
        createdAt
        defaultAddress {
          id
          firstName
          lastName
          company
          address1
          address2
          city
          province
          country
          zip
          phone
        }
        addresses(first: 10) {
          edges {
            node {
              id
              firstName
              lastName
              company
              address1
              address2
              city
              province
              country
              zip
              phone
            }
          }
        }
        orders(first: 10) {
          edges {
            node {
              id
              orderNumber
              processedAt
              totalPrice {
                amount
                currencyCode
              }
              fulfillmentStatus
              financialStatus
            }
          }
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
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({ query, variables }),
    })

    const data = await response.json()
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors)
      return null
    }
    
    return data.data?.customer || null

  } catch (error) {
    console.error('Error fetching customer details:', error)
    return null
  }
}