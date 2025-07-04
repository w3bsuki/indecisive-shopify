'use client';

import { useCallback, useMemo, useEffect, useOptimistic, useState } from 'react';
import { useCart as useHydrogenCart, type Cart } from '@shopify/hydrogen-react';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics/events';

// Types for optimistic updates
type OptimisticCartLine = {
  id: string;
  quantity: number;
  merchandise?: {
    id: string;
    product?: any;
    price?: any;
  };
  cost?: any;
};

type OptimisticAction = 
  | { type: 'ADD_LINE'; merchandiseId: string; quantity: number; tempId: string }
  | { type: 'UPDATE_LINE'; lineId: string; quantity: number; previousQuantity: number }
  | { type: 'REMOVE_LINE'; lineId: string; line: OptimisticCartLine }
  | { type: 'REVERT' };

// Export for external use
export let cartNotificationCallback: ((product: any) => void) | null = null;

export function setCartNotificationCallback(callback: ((product: any) => void) | null) {
  cartNotificationCallback = callback;
}

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

  // Optimistic updates for instant feedback
  const [optimisticLines, dispatchOptimistic] = useOptimistic(
    lines || [],
    (state: any[], action: OptimisticAction) => {
      switch (action.type) {
        case 'ADD_LINE': {
          // Check if item already exists
          const existingIndex = state.findIndex(
            (line) => line?.merchandise?.id === action.merchandiseId
          );
          
          if (existingIndex >= 0) {
            // Update existing line optimistically
            const newState = [...state];
            newState[existingIndex] = {
              ...newState[existingIndex],
              quantity: (newState[existingIndex].quantity || 0) + action.quantity
            };
            return newState;
          }
          
          // Add new line optimistically
          return [...state, {
            id: action.tempId,
            quantity: action.quantity,
            merchandise: { id: action.merchandiseId },
            cost: { totalAmount: { amount: '0', currencyCode: 'USD' } }
          }];
        }
        
        case 'UPDATE_LINE': {
          return state.map(line => 
            line?.id === action.lineId 
              ? { ...line, quantity: action.quantity }
              : line
          );
        }
        
        case 'REMOVE_LINE': {
          return state.filter(line => line?.id !== action.lineId);
        }
        
        case 'REVERT':
        default:
          return lines || [];
      }
    }
  );

  // Optimistic total quantity
  const [optimisticTotalQuantity, dispatchOptimisticQuantity] = useOptimistic(
    totalQuantity || 0,
    (state: number, action: OptimisticAction) => {
      switch (action.type) {
        case 'ADD_LINE':
          return state + action.quantity;
        case 'UPDATE_LINE':
          return state - action.previousQuantity + action.quantity;
        case 'REMOVE_LINE':
          return Math.max(0, state - (action.line.quantity || 0));
        case 'REVERT':
        default:
          return totalQuantity || 0;
      }
    }
  );
  
  // Handle cart errors
  useEffect(() => {
    if (error) {
      // Revert optimistic updates on error
      dispatchOptimistic({ type: 'REVERT' });
      dispatchOptimisticQuantity({ type: 'REVERT' });
      
      // Show error toast
      toast.error('Cart error occurred', {
        id: 'cart-error',
        description: 'Please refresh and try again',
      });
    }
  }, [error, dispatchOptimistic, dispatchOptimisticQuantity]);
  
  // Memoized computed values to prevent unnecessary recalculations
  const totalItems = useMemo(() => optimisticTotalQuantity || 0, [optimisticTotalQuantity]);
  const isLoading = useMemo(
    () => status === 'updating' || status === 'creating' || status === 'fetching',
    [status]
  );
  const isEmpty = useMemo(() => !optimisticLines || optimisticLines.length === 0, [optimisticLines]);
  

  // Add item to cart with optimistic updates
  const addItem = useCallback(async (merchandiseId: string, quantity: number = 1) => {
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

    // Generate temp ID for optimistic update
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    
    // Apply optimistic update immediately
    dispatchOptimistic({ type: 'ADD_LINE', merchandiseId, quantity, tempId });
    dispatchOptimisticQuantity({ type: 'ADD_LINE', merchandiseId, quantity, tempId });
    
    // Show instant success feedback
    // Check if mobile and use custom notification
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    if (isMobile && cartNotificationCallback) {
      // Find product info for notification
      const line = lines?.find(l => l?.merchandise?.id === merchandiseId);
      if (line?.merchandise?.product) {
        cartNotificationCallback({
          title: line.merchandise.product.title || 'Product',
          image: line.merchandise.product.featuredImage?.url,
          price: `${line.merchandise.price?.amount} ${line.merchandise.price?.currencyCode}`,
          quantity
        });
      } else {
        // Fallback if product not found
        cartNotificationCallback({
          title: 'Product added',
          price: '',
          quantity
        });
      }
    } else {
      // Desktop toast
      toast.success('Added to cart', {
        id: 'cart-add-success',
        description: `${quantity} item${quantity > 1 ? 's' : ''} added`,
        duration: 3000,
      });
    }

    try {
      // Check if item already exists in cart
      const existingLine = lines?.find(
        (line) => line?.merchandise?.id === merchandiseId
      );
      
      if (existingLine && existingLine.id) {
        // Update existing line quantity
        const newQuantity = (existingLine.quantity || 0) + quantity;
        await linesUpdate([{ id: existingLine.id, quantity: newQuantity }]);
      } else {
        // Add new line
        await linesAdd([{ merchandiseId, quantity }]);
      }
      
      // Track add to cart event
      const line = lines?.find(l => l?.merchandise?.id === merchandiseId)
      if (line?.merchandise?.product && line.merchandise.product.id) {
        analytics.addToCart({
          id: line.merchandise.product.id,
          name: line.merchandise.product.title || 'Unknown Product',
          price: parseFloat(line.merchandise.price?.amount || '0'),
          quantity
        })
      }
    } catch (_error) {
      // Error will trigger revert via useEffect
      toast.error('Failed to add item to cart', { id: 'cart-error' });
    }
  }, [linesAdd, linesUpdate, lines, cartReady, dispatchOptimistic, dispatchOptimisticQuantity]);

  // Update cart item quantity with optimistic updates
  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    if (!lineId) {
      return;
    }

    if (!cartReady) {
      toast.error('Cart is loading, please try again', { id: 'cart-error' });
      return;
    }

    // Find current line for previous quantity
    const currentLine = optimisticLines.find(line => line?.id === lineId);
    const previousQuantity = currentLine?.quantity || 0;

    // Apply optimistic update immediately
    if (quantity === 0) {
      // Optimistic remove
      dispatchOptimistic({ type: 'REMOVE_LINE', lineId, line: currentLine });
      dispatchOptimisticQuantity({ type: 'REMOVE_LINE', lineId, line: currentLine });
    } else {
      // Optimistic update
      dispatchOptimistic({ type: 'UPDATE_LINE', lineId, quantity, previousQuantity });
      dispatchOptimisticQuantity({ type: 'UPDATE_LINE', lineId, quantity, previousQuantity });
    }

    try {
      if (quantity === 0) {
        // Remove item if quantity is 0
        await linesRemove([lineId]);
      } else {
        // Update quantity
        await linesUpdate([{ id: lineId, quantity }]);
      }
    } catch (_error) {
      // Error will trigger revert via useEffect
      toast.error('Failed to update cart', { id: 'cart-error' });
    }
  }, [linesUpdate, linesRemove, cartReady, optimisticLines, dispatchOptimistic, dispatchOptimisticQuantity]);

  // Remove item from cart with optimistic updates
  const removeItem = useCallback(async (lineId: string) => {
    if (!lineId) {
      return;
    }

    // Find line for optimistic update
    const lineToRemove = optimisticLines.find(l => l?.id === lineId);
    if (!lineToRemove) return;

    // Apply optimistic update immediately
    dispatchOptimistic({ type: 'REMOVE_LINE', lineId, line: lineToRemove });
    dispatchOptimisticQuantity({ type: 'REMOVE_LINE', lineId, line: lineToRemove });
    
    // Show instant feedback
    toast.success('Removed from cart', { id: 'cart-update-success' });

    try {
      // Track remove from cart event
      const line = lines?.find(l => l?.id === lineId)
      if (line?.merchandise?.product && line.merchandise.product.id) {
        analytics.removeFromCart({
          id: line.merchandise.product.id,
          name: line.merchandise.product.title || 'Unknown Product',
          price: parseFloat(line.merchandise.price?.amount || '0'),
          quantity: line.quantity || 1
        })
      }
      
      await linesRemove([lineId]);
    } catch (_error) {
      // Error will trigger revert via useEffect
      toast.error('Failed to remove item', { id: 'cart-error' });
    }
  }, [linesRemove, lines, optimisticLines, dispatchOptimistic, dispatchOptimisticQuantity]);

  // Clear all items from cart
  const clearCart = useCallback(async () => {
    if (!optimisticLines || optimisticLines.length === 0) return;
    
    // Apply optimistic clear immediately
    optimisticLines.forEach(line => {
      if (line?.id) {
        dispatchOptimistic({ type: 'REMOVE_LINE', lineId: line.id, line });
        dispatchOptimisticQuantity({ type: 'REMOVE_LINE', lineId: line.id, line });
      }
    });
    
    try {
      const lineIds = lines?.map((line) => line?.id).filter((id): id is string => !!id) || [];
      if (lineIds.length > 0) {
        await linesRemove(lineIds);
      }
    } catch (_error) {
      // Error will trigger revert via useEffect
      toast.error('Failed to clear cart', { id: 'cart-error' });
    }
  }, [lines, linesRemove, optimisticLines, dispatchOptimistic, dispatchOptimisticQuantity]);

  // Memoized cart object for stable reference with optimistic data
  const cart = useMemo(() => ({
    lines: optimisticLines,
    cost,
    checkoutUrl,
    totalQuantity: optimisticTotalQuantity
  }), [optimisticLines, cost, checkoutUrl, optimisticTotalQuantity]);

  // Return unified interface with optimistic state
  return {
    // Cart state (with optimistic updates)
    cart,
    lines: optimisticLines,
    cost,
    checkoutUrl,
    totalQuantity: optimisticTotalQuantity,
    totalItems,
    cartReady,
    status,
    error,
    
    // Loading states
    isLoading,
    isEmpty,
    
    // Cart actions (all optimistic)
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