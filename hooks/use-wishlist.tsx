'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  handle: string;
  title: string;
  image?: string;
  price?: string;
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('wishlist', JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save wishlist:', error);
      }
    }
  }, [items, isLoading]);

  const addItem = useCallback((item: WishlistItem) => {
    setItems(prev => {
      const exists = prev.some(i => i.id === item.id);
      if (exists) {
        toast.info('Already in wishlist', { id: 'wishlist-update' });
        return prev;
      }
      toast.success('Added to wishlist', {
        id: 'wishlist-update',
        description: item.title,
      });
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item) {
        toast.success('Removed from wishlist', {
          id: 'wishlist-update',
          description: item.title,
        });
      }
      return prev.filter(i => i.id !== id);
    });
  }, []);

  const toggleItem = useCallback((item: WishlistItem) => {
    setItems(prev => {
      const exists = prev.some(i => i.id === item.id);
      if (exists) {
        toast.success('Removed from wishlist', { id: 'wishlist-update' });
        return prev.filter(i => i.id !== item.id);
      } else {
        toast.success('Added to wishlist', { id: 'wishlist-update' });
        return [...prev, item];
      }
    });
  }, []);

  const isInWishlist = useCallback((id: string) => {
    return items.some(item => item.id === id);
  }, [items]);

  const clearWishlist = useCallback(() => {
    setItems([]);
    toast.success('Wishlist cleared', { id: 'wishlist-update' });
  }, []);

  return {
    items,
    totalItems: items.length,
    addItem,
    removeItem,
    toggleItem,
    isInWishlist,
    clearWishlist,
    isLoading,
  };
}