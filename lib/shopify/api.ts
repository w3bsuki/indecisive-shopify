import { storefront, type Product, type Collection } from './storefront-client';
import { PRODUCTS_QUERY, PRODUCT_QUERY, COLLECTIONS_QUERY, COLLECTION_QUERY } from './queries';
import type { Market } from './markets';
import { mapStorefrontProductToShopifyProduct } from './type-mappers';

// Product APIs with market context
export async function getProducts(
  first: number = 12, 
  query?: string,
  market?: Market
) {
  try {
    // Always provide buyer context, use US defaults if no market specified
    const buyerContext = market ? {
      country: market.countryCode,
      language: market.languageCode
    } : {
      country: 'US',
      language: 'EN'
    };

    const data = await storefront<{
      products: {
        edges: Array<{ node: Product }>;
        pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
      };
    }>(
      PRODUCTS_QUERY, 
      { 
        first, 
        query,
        country: buyerContext.country,
        language: buyerContext.language
      },
      buyerContext
    );

    return data?.products || { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } };
  } catch (_error) {
    // Return empty structure to prevent crashes
    return { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } };
  }
}

export async function getProduct(handle: string, market?: Market) {
  try {
    // Always provide buyer context, use US defaults if no market specified
    const buyerContext = market ? {
      country: market.countryCode,
      language: market.languageCode
    } : {
      country: 'US',
      language: 'EN'
    };

    const data = await storefront<{ product: Product }>(
      PRODUCT_QUERY,
      { 
        handle,
        country: buyerContext.country,
        language: buyerContext.language
      },
      buyerContext
    );

    return data.product ? mapStorefrontProductToShopifyProduct(data.product) : null;
  } catch (_error) {
    return null;
  }
}

// Collection APIs with market context
export async function getCollections(first: number = 10, market?: Market) {
  try {
    // Always provide buyer context, use US defaults if no market specified
    const buyerContext = market ? {
      country: market.countryCode,
      language: market.languageCode
    } : {
      country: 'US',
      language: 'EN'
    };

    const data = await storefront<{
      collections: {
        edges: Array<{ node: Collection }>;
      };
    }>(
      COLLECTIONS_QUERY, 
      { 
        first,
        country: buyerContext.country,
        language: buyerContext.language
      },
      buyerContext
    );

    return data.collections;
  } catch (_error) {
    // Return empty structure to prevent crashes
    return { edges: [] };
  }
}

export async function getCollection(
  handle: string, 
  productsFirst: number = 24,
  market?: Market
) {
  try {
    // Always provide buyer context, use US defaults if no market specified
    const buyerContext = market ? {
      country: market.countryCode,
      language: market.languageCode
    } : {
      country: 'US',
      language: 'EN'
    };

    const data = await storefront<{
      collection: Collection & {
        products: {
          edges: Array<{ node: Product }>;
        };
      };
    }>(
      COLLECTION_QUERY, 
      { 
        handle, 
        productsFirst,
        country: buyerContext.country,
        language: buyerContext.language
      },
      buyerContext
    );

    return data.collection;
  } catch (_error) {
    return null;
  }
}

// NOTE: Cart operations are handled by Hydrogen React CartProvider
// These functions are kept for compatibility but not used directly

// Utility functions
export function formatPrice(
  amount: string, 
  currencyCode: string,
  locale: string = 'en-US'
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
    maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
  }).format(parseFloat(amount));
}