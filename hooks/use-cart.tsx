'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createCart, addToCart, updateCart, removeFromCart, getCart } from '@/lib/shopify';
import type { ShopifyCart, CartLine } from '@/lib/shopify/types';
import { useToast } from './use-toast';

interface CartContextType {
  cart: ShopifyCart | null;
  isLoading: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = 'shopify_cart_id';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartId = localStorage.getItem(CART_ID_KEY);
        if (cartId) {
          const existingCart = await getCart(cartId);
          if (existingCart) {
            setCart(existingCart);
          } else {
            // Cart no longer exists, clear localStorage
            localStorage.removeItem(CART_ID_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem(CART_ID_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart ID to localStorage whenever cart changes
  useEffect(() => {
    if (cart?.id) {
      localStorage.setItem(CART_ID_KEY, cart.id);
    }
  }, [cart?.id]);

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    try {
      setIsLoading(true);
      
      let updatedCart: ShopifyCart;
      
      if (!cart) {
        // Create new cart with item
        updatedCart = await createCart([{ merchandiseId: variantId, quantity }]);
      } else {
        // Add to existing cart
        updatedCart = await addToCart(cart.id, [{ merchandiseId: variantId, quantity }]);
      }
      
      setCart(updatedCart);
      toast({
        title: 'Added to cart',
        description: 'Item has been added to your cart.',
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [cart, toast]);

  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return;

    try {
      setIsLoading(true);
      
      if (quantity === 0) {
        await removeItem(lineId);
        return;
      }
      
      const updatedCart = await updateCart(cart.id, [{ id: lineId, quantity }]);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to update cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [cart, toast]);

  const removeItem = useCallback(async (lineId: string) => {
    if (!cart) return;

    try {
      setIsLoading(true);
      const updatedCart = await removeFromCart(cart.id, [lineId]);
      setCart(updatedCart);
      toast({
        title: 'Removed from cart',
        description: 'Item has been removed from your cart.',
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item from cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [cart, toast]);

  const clearCart = useCallback(async () => {
    if (!cart) return;

    try {
      setIsLoading(true);
      // Remove all items from cart
      const lineIds = cart.lines.edges.map(edge => edge.node.id);
      if (lineIds.length > 0) {
        const updatedCart = await removeFromCart(cart.id, lineIds);
        setCart(updatedCart);
      }
      toast({
        title: 'Cart cleared',
        description: 'All items have been removed from your cart.',
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [cart, toast]);

  const totalItems = cart?.totalQuantity || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}