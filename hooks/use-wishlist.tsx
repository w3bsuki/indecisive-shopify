'use client';

// Re-export enhanced wishlist hook for production use
// This maintains backward compatibility while adding Shopify metafield support

import { useWishlistEnhanced } from './use-wishlist-enhanced';

// Export the enhanced hook as the default wishlist hook
export function useWishlist() {
  const enhanced = useWishlistEnhanced();
  
  // Return compatible interface (hide enhanced features for now)
  return {
    items: enhanced.items,
    totalItems: enhanced.totalItems,
    addItem: enhanced.addItem,
    removeItem: enhanced.removeItem,
    toggleItem: enhanced.toggleItem,
    isInWishlist: enhanced.isInWishlist,
    clearWishlist: enhanced.clearWishlist,
    isLoading: enhanced.isLoading,
    // Additional features for enhanced usage
    isAuthenticated: enhanced.isAuthenticated,
    isSyncing: enhanced.isSyncing,
    migrateToShopify: enhanced.migrateToShopify
  };
}

// Export types for external use
export interface WishlistItem {
  id: string;
  handle: string;
  title: string;
  image?: string;
  price?: string;
}