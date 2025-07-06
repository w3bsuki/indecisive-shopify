'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getCustomerMetafield, upsertCustomerMetafield } from '@/lib/shopify/customer-auth';

// Wishlist configuration constants
const WISHLIST_NAMESPACE = 'indecisive_wear';
const WISHLIST_KEY = 'wishlist';
const WISHLIST_TYPE = 'json';
const LOCALSTORAGE_KEY = 'wishlist';

interface WishlistItem {
  id: string;
  handle: string;
  title: string;
  image?: string;
  price?: string;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  isAuthenticated: boolean;
  isSyncing: boolean;
  lastSyncAt?: string;
}

// Client-side helper functions
async function getCustomerTokenFromAPI(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/customer-token', { credentials: 'include' });
    const data = await response.json();
    return data.success ? data.token : null;
  } catch {
    return null;
  }
}

async function checkAuthenticationStatus(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/status', { credentials: 'include' });
    const data = await response.json();
    return data.authenticated || false;
  } catch {
    return false;
  }
}

export function useWishlistEnhanced() {
  const [state, setState] = useState<WishlistState>({
    items: [],
    isLoading: true,
    isAuthenticated: false,
    isSyncing: false
  });

  // Initialize wishlist: check auth, load from server or localStorage
  useEffect(() => {
    let mounted = true;

    const initializeWishlist = async () => {
      try {
        // Check if user is authenticated
        const isAuthenticated = await checkAuthenticationStatus();

        if (isAuthenticated) {
          // Load from Shopify metafields for authenticated users
          try {
            const token = await getCustomerTokenFromAPI();
            if (token) {
              const result = await getCustomerMetafield(token, WISHLIST_NAMESPACE, WISHLIST_KEY);
              if (result.success && result.metafield?.value) {
                const items = JSON.parse(result.metafield.value) as WishlistItem[];
                if (mounted) {
                  setState(prev => ({ 
                    ...prev, 
                    items, 
                    lastSyncAt: result.metafield?.updatedAt,
                    isAuthenticated,
                    isLoading: false
                  }));
                }
                return;
              }
            }
          } catch (error) {
            // Fall through to localStorage
          }
        }
        
        // Load from localStorage for anonymous users or as fallback
        try {
          const saved = localStorage.getItem(LOCALSTORAGE_KEY);
          if (saved) {
            const items = JSON.parse(saved) as WishlistItem[];
            if (mounted) {
              setState(prev => ({ ...prev, items, isAuthenticated, isLoading: false }));
            }
          } else {
            if (mounted) {
              setState(prev => ({ ...prev, isAuthenticated, isLoading: false }));
            }
          }
        } catch (error) {
          if (mounted) {
            setState(prev => ({ ...prev, isAuthenticated, isLoading: false }));
          }
        }
      } catch (error) {
        // Final fallback
        if (mounted) {
          setState(prev => ({ 
            ...prev, 
            isAuthenticated: false, 
            isLoading: false 
          }));
        }
      }
    };

    initializeWishlist();

    return () => {
      mounted = false;
    };
  }, []);

  // Load wishlist from localStorage
  const loadFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(LOCALSTORAGE_KEY);
      if (saved) {
        const items = JSON.parse(saved) as WishlistItem[];
        setState(prev => ({ ...prev, items, isLoading: false }));
        return items;
      }
      setState(prev => ({ ...prev, isLoading: false }));
      return [];
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      return [];
    }
  }, []);

  // Save wishlist to localStorage
  const saveToLocalStorage = useCallback((items: WishlistItem[]) => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      // Silent error - localStorage save failed
    }
  }, []);

  // Load wishlist from Shopify metafields
  const loadFromShopify = useCallback(async (): Promise<WishlistItem[]> => {
    try {
      const token = await getCustomerTokenFromAPI();
      if (!token) {
        throw new Error('No customer token available');
      }

      const result = await getCustomerMetafield(token, WISHLIST_NAMESPACE, WISHLIST_KEY);
      
      if (result.success && result.metafield?.value) {
        const items = JSON.parse(result.metafield.value) as WishlistItem[];
        setState(prev => ({ 
          ...prev, 
          items, 
          lastSyncAt: result.metafield?.updatedAt 
        }));
        return items;
      }
      
      return [];
    } catch (error) {
      // Re-throw to trigger localStorage fallback
      throw error;
    }
  }, []);

  // Save wishlist to Shopify metafields
  const saveToShopify = useCallback(async (items: WishlistItem[]): Promise<void> => {
    try {
      const token = await getCustomerTokenFromAPI();
      if (!token) {
        throw new Error('No customer token available');
      }

      setState(prev => ({ ...prev, isSyncing: true }));

      const result = await upsertCustomerMetafield(token, {
        namespace: WISHLIST_NAMESPACE,
        key: WISHLIST_KEY,
        value: JSON.stringify(items),
        type: WISHLIST_TYPE
      });

      if (!result.success) {
        throw new Error(result.errors?.[0]?.message || 'Failed to save wishlist');
      }

      setState(prev => ({ 
        ...prev, 
        isSyncing: false, 
        lastSyncAt: result.metafield?.updatedAt 
      }));
    } catch (error) {
      setState(prev => ({ ...prev, isSyncing: false }));
      throw error;
    }
  }, []);

  // Sync items to persistent storage
  const syncItems = useCallback(async (newItems: WishlistItem[], isAuthenticated: boolean) => {
    // Always save to localStorage as fallback
    saveToLocalStorage(newItems);

    // Save to Shopify if authenticated
    if (isAuthenticated) {
      try {
        await saveToShopify(newItems);
      } catch (error) {
        // Non-blocking error - localStorage serves as fallback
      }
    }
  }, [saveToLocalStorage, saveToShopify]);

  // Add item to wishlist
  const addItem = useCallback(async (item: WishlistItem) => {
    setState(prev => {
      const exists = prev.items.some(i => i.id === item.id);
      if (exists) {
        toast.info('Already in wishlist', { id: 'wishlist-update' });
        return prev;
      }

      const newItems = [...prev.items, item];
      
      // Optimistic update
      toast.success('Added to wishlist', {
        id: 'wishlist-update',
        description: item.title,
      });

      // Sync in background
      syncItems(newItems, prev.isAuthenticated);

      return { ...prev, items: newItems };
    });
  }, [syncItems]);

  // Remove item from wishlist
  const removeItem = useCallback(async (id: string) => {
    setState(prev => {
      const item = prev.items.find(i => i.id === id);
      if (!item) return prev;

      const newItems = prev.items.filter(i => i.id !== id);
      
      toast.success('Removed from wishlist', {
        id: 'wishlist-update',
        description: item.title,
      });

      // Sync in background
      syncItems(newItems, prev.isAuthenticated);

      return { ...prev, items: newItems };
    });
  }, [syncItems]);

  // Toggle item in wishlist
  const toggleItem = useCallback(async (item: WishlistItem) => {
    setState(prev => {
      const exists = prev.items.some(i => i.id === item.id);
      let newItems: WishlistItem[];
      
      if (exists) {
        newItems = prev.items.filter(i => i.id !== item.id);
        toast.success('Removed from wishlist', { id: 'wishlist-update' });
      } else {
        newItems = [...prev.items, item];
        toast.success('Added to wishlist', { id: 'wishlist-update' });
      }

      // Sync in background
      syncItems(newItems, prev.isAuthenticated);

      return { ...prev, items: newItems };
    });
  }, [syncItems]);

  // Check if item is in wishlist
  const isInWishlist = useCallback((id: string) => {
    return state.items.some(item => item.id === id);
  }, [state.items]);

  // Clear entire wishlist
  const clearWishlist = useCallback(async () => {
    setState(prev => ({ ...prev, items: [] }));
    toast.success('Wishlist cleared', { id: 'wishlist-update' });
    
    // Sync empty wishlist
    await syncItems([], state.isAuthenticated);
  }, [syncItems, state.isAuthenticated]);

  // Migrate localStorage to Shopify when user logs in
  const migrateToShopify = useCallback(async () => {
    try {
      if (!state.isAuthenticated || state.items.length === 0) return;

      setState(prev => ({ ...prev, isSyncing: true }));

      // Get current Shopify wishlist
      const shopifyItems = await loadFromShopify();
      
      // Merge with localStorage items (avoid duplicates)
      const mergedItems = [...state.items];
      shopifyItems.forEach(shopifyItem => {
        if (!mergedItems.some(item => item.id === shopifyItem.id)) {
          mergedItems.push(shopifyItem);
        }
      });

      // Save merged result to Shopify
      if (mergedItems.length !== shopifyItems.length) {
        await saveToShopify(mergedItems);
        setState(prev => ({ ...prev, items: mergedItems, isSyncing: false }));
        
        if (mergedItems.length > state.items.length) {
          toast.success('Wishlist synced with your account', {
            description: `${mergedItems.length - state.items.length} items added from other devices`
          });
        }
      }
    } catch (error) {
      setState(prev => ({ ...prev, isSyncing: false }));
      // Silent error - migration failed but non-blocking
    }
  }, [state.isAuthenticated, state.items, loadFromShopify, saveToShopify]);

  return {
    items: state.items,
    totalItems: state.items.length,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    isSyncing: state.isSyncing,
    lastSyncAt: state.lastSyncAt,
    addItem,
    removeItem,
    toggleItem,
    isInWishlist,
    clearWishlist,
    migrateToShopify,
    // Legacy methods for backward compatibility
    loadFromShopify,
    saveToShopify
  };
}