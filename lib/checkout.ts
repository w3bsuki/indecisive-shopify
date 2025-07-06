import { getCurrentCustomer } from '@/app/actions/auth'
import { storefront } from './shopify/storefront-client'
import type { Customer } from './shopify/customer-auth'

// Enhanced checkout preparation service with authentication and customer data
export interface CheckoutOptions {
  redirectToLogin?: boolean
  returnUrl?: string
  note?: string
  discountCodes?: string[]
}

export interface CheckoutResult {
  success: boolean
  checkoutUrl?: string
  error?: string
  requiresAuth?: boolean
  customer?: Customer | null
}

// GraphQL mutation to update checkout with customer information
const UPDATE_CHECKOUT_BUYER_IDENTITY = `
  mutation checkoutBuyerIdentityUpdate($checkoutId: ID!, $buyerIdentity: CheckoutBuyerIdentityInput!) {
    checkoutBuyerIdentityUpdate(checkoutId: $checkoutId, buyerIdentity: $buyerIdentity) {
      checkout {
        id
        webUrl
        ready
        totalPrice {
          amount
          currencyCode
        }
      }
      checkoutUserErrors {
        field
        message
        code
      }
    }
  }
`

// Extract checkout ID from checkout URL
function extractCheckoutId(checkoutUrl: string): string | null {
  try {
    const url = new URL(checkoutUrl)
    const pathParts = url.pathname.split('/')
    const checkoutsIndex = pathParts.indexOf('checkouts')
    if (checkoutsIndex !== -1 && pathParts[checkoutsIndex + 1]) {
      return `gid://shopify/Checkout/${pathParts[checkoutsIndex + 1]}`
    }
    return null
  } catch {
    return null
  }
}

// Enhanced checkout preparation with customer data pre-population
export async function prepareCheckout(
  checkoutUrl: string,
  options: CheckoutOptions = {}
): Promise<CheckoutResult> {
  try {
    // Check authentication status
    const customer = await getCurrentCustomer()
    
    // If no customer and redirectToLogin is true, require authentication
    if (!customer && options.redirectToLogin) {
      return {
        success: false,
        requiresAuth: true,
        error: 'Authentication required for checkout'
      }
    }

    // If we have a customer, enhance the checkout with their information
    if (customer && checkoutUrl) {
      const checkoutId = extractCheckoutId(checkoutUrl)
      
      if (checkoutId) {
        try {
          // Prepare buyer identity data
          const buyerIdentity: {
            email?: string
            phone?: string
            countryCode?: string
          } = {}

          if (customer.email) {
            buyerIdentity.email = customer.email
          }

          if (customer.phone) {
            buyerIdentity.phone = customer.phone
          }

          // Use default address country if available
          if (customer.defaultAddress?.countryCodeV2) {
            buyerIdentity.countryCode = customer.defaultAddress.countryCodeV2
          }

          // Update checkout with customer information
          const result = await storefront<{
            checkoutBuyerIdentityUpdate: {
              checkout: {
                id: string
                webUrl: string
                ready: boolean
                totalPrice: {
                  amount: string
                  currencyCode: string
                }
              }
              checkoutUserErrors: Array<{
                field: string[]
                message: string
                code: string
              }>
            }
          }>(UPDATE_CHECKOUT_BUYER_IDENTITY, {
            checkoutId,
            buyerIdentity
          })

          if (result.checkoutBuyerIdentityUpdate.checkoutUserErrors.length > 0) {
            // Continue with original checkout URL even if update fails
          }

          // Use updated checkout URL if available
          const updatedCheckoutUrl = result.checkoutBuyerIdentityUpdate.checkout?.webUrl || checkoutUrl

          return {
            success: true,
            checkoutUrl: transformCheckoutUrl(updatedCheckoutUrl),
            customer
          }
        } catch (_updateError) {
          // Fall back to original checkout URL
          return {
            success: true,
            checkoutUrl: transformCheckoutUrl(checkoutUrl),
            customer
          }
        }
      }
    }

    // Return original checkout URL for guest checkout
    return {
      success: true,
      checkoutUrl: transformCheckoutUrl(checkoutUrl),
      customer: customer || null
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to prepare checkout',
      customer: null
    }
  }
}

// Transform checkout URL to use custom subdomain
function transformCheckoutUrl(checkoutUrl: string): string {
  try {
    const customDomain = process.env.NEXT_PUBLIC_CHECKOUT_DOMAIN
    if (!customDomain) {
      return checkoutUrl
    }

    const url = new URL(checkoutUrl)
    // Replace the myshopify.com domain with our custom domain
    if (url.hostname.includes('myshopify.com')) {
      url.hostname = customDomain
      // Ensure HTTPS
      url.protocol = 'https:'
    }
    
    return url.toString()
  } catch {
    return checkoutUrl
  }
}

// Enhanced checkout navigation with loading states and error handling
export async function navigateToCheckout(
  checkoutUrl: string,
  options: CheckoutOptions = {}
): Promise<void> {
  try {
    // Prepare checkout with customer data
    const result = await prepareCheckout(checkoutUrl, options)

    if (!result.success) {
      if (result.requiresAuth && options.returnUrl) {
        // Redirect to login with return URL
        const loginUrl = `/login?redirectTo=${encodeURIComponent(options.returnUrl)}`
        window.location.href = loginUrl
        return
      }
      
      throw new Error(result.error || 'Failed to prepare checkout')
    }

    if (!result.checkoutUrl) {
      throw new Error('No checkout URL available')
    }

    // Transform to use custom subdomain and navigate to Shopify hosted checkout
    const finalCheckoutUrl = transformCheckoutUrl(result.checkoutUrl)
    window.location.href = finalCheckoutUrl
  } catch (error) {
    throw error
  }
}

// Enhanced checkout return handling with more comprehensive detection
export function handleCheckoutReturn(searchParams: URLSearchParams): {
  isReturn: boolean
  orderId?: string
  orderNumber?: string
  customerEmail?: string
  status?: 'success' | 'cancelled' | 'failed' | 'processing'
  redirectTo?: string
} {
  // Check for Shopify checkout return parameters
  const orderId = searchParams.get('order_id')
  const orderNumber = searchParams.get('order_number') 
  const checkoutId = searchParams.get('checkout_id')
  const customerEmail = searchParams.get('email')
  
  // Check for return status indicators
  const cancelled = searchParams.get('cancelled') === 'true'
  const failed = searchParams.get('failed') === 'true'
  const processing = searchParams.get('processing') === 'true'
  
  // Shopify-specific return parameters
  const shopifyReturn = searchParams.get('_s') // Shopify success tracking
  const thankYou = searchParams.get('thank_you') // Thank you page indicator
  
  if (orderId || orderNumber || checkoutId || shopifyReturn || thankYou) {
    const status = cancelled ? 'cancelled' : 
                  failed ? 'failed' : 
                  processing ? 'processing' : 'success'
    
    return {
      isReturn: true,
      orderId: orderId || undefined,
      orderNumber: orderNumber || undefined,
      customerEmail: customerEmail || undefined,
      status,
      redirectTo: status === 'success' ? '/order-confirmation' : 
                  status === 'cancelled' ? '/cart?cancelled=true' :
                  status === 'failed' ? '/cart?error=checkout_failed' : 
                  undefined
    }
  }

  return { isReturn: false }
}

// Server-side redirect handler for checkout returns
export function redirectCheckoutReturn(searchParams: URLSearchParams): string | null {
  const returnInfo = handleCheckoutReturn(searchParams)
  
  if (!returnInfo.isReturn) {
    return null
  }
  
  switch (returnInfo.status) {
    case 'success':
      const params = new URLSearchParams()
      if (returnInfo.orderId) params.set('order', returnInfo.orderId)
      if (returnInfo.orderNumber) params.set('order', returnInfo.orderNumber)
      if (returnInfo.customerEmail) params.set('email', returnInfo.customerEmail)
      return `/order-confirmation?${params.toString()}`
      
    case 'cancelled':
      return '/cart?cancelled=true'
      
    case 'failed':
      return '/cart?error=checkout_failed'
      
    case 'processing':
      return '/order-processing'
      
    default:
      return '/cart'
  }
}

// Get checkout URL from cart (for convenience)
export function getCheckoutUrlFromCart(cart: { checkoutUrl?: string }): string | null {
  return cart.checkoutUrl || null
}