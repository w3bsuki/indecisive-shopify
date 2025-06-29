import { shopifyFetch } from './client';
import {
  PRODUCTS_QUERY,
  PRODUCT_QUERY,
  COLLECTIONS_QUERY,
  COLLECTION_PRODUCTS_QUERY,
} from './queries/products';
import {
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_LINES_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  GET_CART_QUERY,
} from './mutations/cart';
import type {
  ShopifyProduct,
  ProductsResponse,
  ProductResponse,
  CollectionsResponse,
  CollectionProductsResponse,
  ShopifyCart,
  CartCreateResponse,
  CartMutationResponse,
} from './types';

// Product functions
export async function getProducts(limit = 20, cursor?: string) {
  const data = await shopifyFetch<ProductsResponse>({
    query: PRODUCTS_QUERY,
    variables: { first: limit, after: cursor },
  });
  return data.products;
}

export async function getProduct(handle: string) {
  const data = await shopifyFetch<ProductResponse>({
    query: PRODUCT_QUERY,
    variables: { handle },
  });
  return data.product;
}

export async function getCollections(limit = 10) {
  const data = await shopifyFetch<CollectionsResponse>({
    query: COLLECTIONS_QUERY,
    variables: { first: limit },
  });
  return data.collections;
}

export async function getCollectionProducts(
  handle: string,
  limit = 20,
  cursor?: string,
  filters?: any[]
) {
  const data = await shopifyFetch<CollectionProductsResponse>({
    query: COLLECTION_PRODUCTS_QUERY,
    variables: { handle, first: limit, after: cursor, filters },
  });
  return data.collection;
}

// Cart functions
export async function createCart(lineItems?: Array<{ merchandiseId: string; quantity: number }>) {
  const data = await shopifyFetch<CartCreateResponse>({
    query: CREATE_CART_MUTATION,
    variables: { lineItems },
    cache: 'no-store',
  });
  
  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }
  
  return data.cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
) {
  const data = await shopifyFetch<{ cartLinesAdd: CartMutationResponse }>({
    query: ADD_TO_CART_MUTATION,
    variables: { cartId, lines },
    cache: 'no-store',
  });
  
  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }
  
  return data.cartLinesAdd.cart;
}

export async function updateCart(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
) {
  const data = await shopifyFetch<{ cartLinesUpdate: CartMutationResponse }>({
    query: UPDATE_CART_LINES_MUTATION,
    variables: { cartId, lines },
    cache: 'no-store',
  });
  
  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message);
  }
  
  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]) {
  const data = await shopifyFetch<{ cartLinesRemove: CartMutationResponse }>({
    query: REMOVE_FROM_CART_MUTATION,
    variables: { cartId, lineIds },
    cache: 'no-store',
  });
  
  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors[0].message);
  }
  
  return data.cartLinesRemove.cart;
}

export async function getCart(cartId: string) {
  const data = await shopifyFetch<{ cart: ShopifyCart }>({
    query: GET_CART_QUERY,
    variables: { cartId },
    cache: 'no-store',
  });
  
  return data.cart;
}

// Helper functions
export function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export function getProductImageUrl(product: ShopifyProduct, index = 0): string | null {
  const image = product.images.edges[index]?.node;
  return image?.url || null;
}

export function getProductImageAlt(product: ShopifyProduct, index = 0): string {
  const image = product.images.edges[index]?.node;
  return image?.altText || product.title;
}

export function isProductOnSale(product: ShopifyProduct): boolean {
  if (!product.compareAtPriceRange) return false;
  
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAtPrice = parseFloat(product.compareAtPriceRange.minVariantPrice.amount);
  
  return compareAtPrice > price;
}

export function calculateDiscountPercentage(product: ShopifyProduct): number {
  if (!isProductOnSale(product)) return 0;
  
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAtPrice = parseFloat(product.compareAtPriceRange!.minVariantPrice.amount);
  
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}