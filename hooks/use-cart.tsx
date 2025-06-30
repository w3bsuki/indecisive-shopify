'use client';

import { useCallback, useMemo } from 'react';
import { useCart as useHydrogenCart } from '@shopify/hydrogen-react';
import { toast } from 'sonner';

// Unified cart hook implementation using Hydrogen React
export function useCart() {
  const {
    // Cart state from Hydrogen React
    status,           // 'uninitialized' | 'creating' | 'fetching' | 'updating' | 'idle'
    lines,            // Array of cart line items  
    totalQuantity,    // Total number of items in cart
    cost,             // Cart cost information
    checkoutUrl,      // URL for checkout
    cartReady,        // Boolean indicating cart is ready
    
    // Cart actions from Hydrogen React
    linesAdd,         // Add items to cart (NOT async - updates optimistically)
    linesRemove,      // Remove items from cart
    linesUpdate,      // Update existing items
    buyerIdentityUpdate,    // Update buyer information
    cartAttributesUpdate,   // Update cart attributes
    discountCodesUpdate,    // Apply discount codes
    noteUpdate,       // Add cart note
    
    // Error state
    error
  } = useHydrogenCart();
  
  // Computed values
  const totalItems = totalQuantity || 0;
  const isLoading = status === 'updating' || status === 'creating' || status === 'fetching';
  const isEmpty = !lines || lines.length === 0;

  // Add item to cart - Hydrogen React pattern
  const addItem = useCallback((merchandiseId: string, quantity: number = 1) => {
    if (!merchandiseId) {
      console.error('[useCart] No merchandise ID provided');
      toast.error('Invalid product variant');
      return;
    }

    if (!linesAdd) {
      console.error('[useCart] linesAdd function not available');
      toast.error('Cart not properly initialized');
      return;
    }

    try {
      // IMPORTANT: linesAdd is NOT async in Hydrogen React
      // It updates the cart optimistically and returns immediately
      linesAdd([{ merchandiseId, quantity }]);
      
      // Toast is handled by CartProvider callbacks in use-hydrogen-cart.tsx
      console.log('[useCart] Added to cart:', { merchandiseId, quantity });
    } catch (error) {
      console.error('[useCart] Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  }, [linesAdd]);

  // Update cart item quantity
  const updateItem = useCallback((lineId: string, quantity: number) => {
    if (!lineId) {
      console.error('[useCart] No line ID provided for update');
      return;
    }

    try {
      if (quantity === 0) {
        // Remove item if quantity is 0
        linesRemove([lineId]);
      } else {
        // Update quantity
        linesUpdate([{ id: lineId, quantity }]);
      }
    } catch (error) {
      console.error('[useCart] Error updating cart:', error);
      toast.error('Failed to update cart');
    }
  }, [linesUpdate, linesRemove]);

  // Remove item from cart
  const removeItem = useCallback((lineId: string) => {
    if (!lineId) {
      console.error('[useCart] No line ID provided for removal');
      return;
    }

    try {
      linesRemove([lineId]);
    } catch (error) {
      console.error('[useCart] Error removing from cart:', error);
      toast.error('Failed to remove item');
    }
  }, [linesRemove]);

  // Clear all items from cart
  const clearCart = useCallback(() => {
    if (!lines || lines.length === 0) return;
    
    try {
      const lineIds = lines.map((line: any) => line.id);
      linesRemove(lineIds);
    } catch (error) {
      console.error('[useCart] Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  }, [lines, linesRemove]);

  // Memoized cart object for stable reference
  const cart = useMemo(() => ({
    lines,
    cost,
    checkoutUrl,
    totalQuantity
  }), [lines, cost, checkoutUrl, totalQuantity]);

  // Return unified interface
  return {
    // Cart state
    cart,
    lines,
    cost,
    checkoutUrl,
    totalQuantity,
    totalItems,
    cartReady,
    status,
    error,
    
    // Loading states
    isLoading,
    isEmpty,
    
    // Cart actions
    addItem,
    updateItem,
    removeItem,
    clearCart,
    
    // Additional Hydrogen React actions (if needed)
    buyerIdentityUpdate,
    cartAttributesUpdate,
    discountCodesUpdate,
    noteUpdate,
  };
}

// Re-export Cart type from Hydrogen React
export type { Cart } from '@shopify/hydrogen-react';