'use client';

import { useCallback, useMemo, useEffect } from 'react';
import { useCart as useHydrogenCart, type Cart } from '@shopify/hydrogen-react';
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
  
  // Handle cart errors
  useEffect(() => {
    if (error) {
      // Silently handle cart errors, only show toast to user
      toast.error('Cart error occurred', {
        id: 'cart-error',
        description: 'Please refresh and try again',
      });
    }
  }, [error]);
  
  // Memoized computed values to prevent unnecessary recalculations
  const totalItems = useMemo(() => totalQuantity || 0, [totalQuantity]);
  const isLoading = useMemo(
    () => status === 'updating' || status === 'creating' || status === 'fetching',
    [status]
  );
  const isEmpty = useMemo(() => !lines || lines.length === 0, [lines]);
  

  // Add item to cart - Hydrogen React pattern with smart quantity handling
  const addItem = useCallback((merchandiseId: string, quantity: number = 1) => {
    if (!merchandiseId) {
      toast.error('Invalid product variant', { id: 'cart-error' });
      return;
    }

    if (!linesAdd || !linesUpdate) {
      toast.error('Cart not properly initialized', { id: 'cart-error' });
      return;
    }

    if (!cartReady) {
      toast.error('Cart is loading, please try again', { id: 'cart-error' });
      return;
    }

    try {
      // Check if item already exists in cart
      const existingLine = lines?.find(
        (line) => line?.merchandise?.id === merchandiseId
      );
      
      if (existingLine && existingLine.id) {
        // Update existing line quantity
        const newQuantity = (existingLine.quantity || 0) + quantity;
        linesUpdate([{ id: existingLine.id, quantity: newQuantity }]);
        
        toast.success('Updated quantity', {
          id: 'cart-add-success',
          description: `Now ${newQuantity} in cart`,
          duration: 3000,
        });
      } else {
        // Add new line
        linesAdd([{ merchandiseId, quantity }]);
        
        toast.success('Added to cart', {
          id: 'cart-add-success',
          description: `${quantity} item${quantity > 1 ? 's' : ''} added`,
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error('Failed to add item to cart', { id: 'cart-error' });
    }
  }, [linesAdd, linesUpdate, lines, cartReady]);

  // Update cart item quantity
  const updateItem = useCallback((lineId: string, quantity: number) => {
    if (!lineId) {
      return;
    }

    if (!cartReady) {
      toast.error('Cart is loading, please try again', { id: 'cart-error' });
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
      toast.error('Failed to update cart', { id: 'cart-error' });
    }
  }, [linesUpdate, linesRemove, cartReady]);

  // Remove item from cart
  const removeItem = useCallback((lineId: string) => {
    if (!lineId) {
      return;
    }

    try {
      linesRemove([lineId]);
      toast.success('Removed from cart', { id: 'cart-update-success' });
    } catch (error) {
      toast.error('Failed to remove item', { id: 'cart-error' });
    }
  }, [linesRemove]);

  // Clear all items from cart
  const clearCart = useCallback(() => {
    if (!lines || lines.length === 0) return;
    
    try {
      const lineIds = lines.map((line) => line?.id).filter((id): id is string => !!id);
      linesRemove(lineIds);
    } catch (error) {
      toast.error('Failed to clear cart', { id: 'cart-error' });
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