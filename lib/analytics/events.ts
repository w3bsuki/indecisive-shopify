/**
 * Analytics event tracking utilities
 * Sends events to Google Analytics when consent is given
 */

import { getCookieConsent } from '@/hooks/use-cookie-consent'

interface EventProps {
  action: string
  category: string
  label?: string
  value?: number
  [key: string]: string | number | undefined | Record<string, unknown>[]
}

/**
 * Track custom events in Google Analytics
 */
export function trackEvent({ action, category, label, value, ...otherProps }: EventProps) {
  if (typeof window === 'undefined' || !window.gtag) return
  
  // Check analytics consent
  const consent = getCookieConsent()
  if (!consent?.analytics) return
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...otherProps,
  })
}

/**
 * E-commerce event tracking
 */
export const analytics = {
  // Product events
  viewItem: (product: { id: string; name: string; price: number; category?: string }) => {
    trackEvent({
      action: 'view_item',
      category: 'ecommerce',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
      }]
    })
  },
  
  addToCart: (product: { id: string; name: string; price: number; quantity: number }) => {
    trackEvent({
      action: 'add_to_cart',
      category: 'ecommerce',
      value: product.price * product.quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      }]
    })
  },
  
  removeFromCart: (product: { id: string; name: string; price: number; quantity: number }) => {
    trackEvent({
      action: 'remove_from_cart',
      category: 'ecommerce',
      value: product.price * product.quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      }]
    })
  },
  
  beginCheckout: (value: number) => {
    trackEvent({
      action: 'begin_checkout',
      category: 'ecommerce',
      value,
    })
  },
  
  purchase: (transaction: { id: string; value: number; items: Array<Record<string, unknown>> }) => {
    trackEvent({
      action: 'purchase',
      category: 'ecommerce',
      transaction_id: transaction.id,
      value: transaction.value,
      items: transaction.items,
    })
  },
  
  // User events
  login: (method: string) => {
    trackEvent({
      action: 'login',
      category: 'engagement',
      method,
    })
  },
  
  signUp: (method: string) => {
    trackEvent({
      action: 'sign_up',
      category: 'engagement',
      method,
    })
  },
  
  // Search events
  search: (searchTerm: string) => {
    trackEvent({
      action: 'search',
      category: 'engagement',
      search_term: searchTerm,
    })
  },
  
  // Wishlist events
  addToWishlist: (productId: string, productName: string) => {
    trackEvent({
      action: 'add_to_wishlist',
      category: 'engagement',
      label: productName,
      item_id: productId,
    })
  },
  
  removeFromWishlist: (productId: string, productName: string) => {
    trackEvent({
      action: 'remove_from_wishlist',
      category: 'engagement',
      label: productName,
      item_id: productId,
    })
  },
}