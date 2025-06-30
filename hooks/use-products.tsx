'use client';

import type { Product } from '@/lib/shopify/storefront-client';

// Deprecated hooks - use server-side API functions instead

export function useProducts(first: number = 12, query?: string) {
  // This hook is deprecated - use getProducts from API instead
  throw new Error('useProducts hook is deprecated. Use getProducts API function instead.');
}

export function useProduct(handle: string) {
  // This hook is deprecated - use getProduct from API instead
  throw new Error('useProduct hook is deprecated. Use getProduct API function instead.');
}