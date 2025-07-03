'use server'

import { getCustomerToken } from '@/lib/auth/token'
import { getCustomerOrder } from '@/lib/shopify/customer-auth'

/**
 * Server Action to get reorder data for a previous order
 * Returns the merchandise IDs and quantities to add to cart
 */
export async function getReorderDataAction(orderId: string) {
  // Get customer token
  const token = await getCustomerToken()
  if (!token) {
    throw new Error('You must be logged in to reorder')
  }

  try {
    // Fetch the order details
    const order = await getCustomerOrder(token, orderId)
    
    if (!order) {
      throw new Error('Order not found')
    }

    // Extract line items with merchandise IDs and quantities
    const items = order.lineItems.edges
      .filter(({ node }) => node.variant?.id) // Ensure variant exists
      .map(({ node }) => ({
        merchandiseId: node.variant!.id,
        quantity: node.quantity,
        title: node.title
      }))

    if (items.length === 0) {
      throw new Error('No valid items found in this order')
    }

    return {
      success: true,
      items
    }
  } catch (error) {
    console.error('[REORDER] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to prepare reorder'
    }
  }
}