// Direct configuration using environment variables - OFFICIAL SHOPIFY PATTERN
const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
const API_VERSION = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-10';

// Validate configuration
if (!SHOPIFY_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
  // Environment variables will be validated at runtime
}

// Helper function for GraphQL queries with proper error handling
export async function storefront<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  buyerContext?: {
    country: string
    language: string
  }
): Promise<T> {
  if (!SHOPIFY_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
    throw new Error('Missing required Shopify environment variables. Please check your .env.local file.');
  }

  const endpoint = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;
  
  if (!SHOPIFY_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
    throw new Error(`Missing Shopify configuration. Domain: ${!!SHOPIFY_DOMAIN}, Token: ${!!STOREFRONT_ACCESS_TOKEN}`);
  }
  
  try {
    // If buyer context is provided, merge it with variables
    const requestVariables = buyerContext 
      ? { ...variables, country: buyerContext.country, language: buyerContext.language }
      : variables;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
        // Add buyer IP header if available (for geo-location)
        ...(buyerContext && { 'Shopify-Storefront-Buyer-IP': '::1' }),
      },
      body: JSON.stringify({
        query,
        variables: requestVariables,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const json = await response.json();
    
    if (json.errors) {
      throw new Error(
        `GraphQL errors: ${json.errors.map((e: { message: string }) => e.message).join(', ')}`
      );
    }
    
    return json.data as T;
  } catch (error) {
    throw error;
  }
}

// Export configuration for other uses  
export const shopifyConfig = {
  domain: SHOPIFY_DOMAIN,
  storefrontAccessToken: STOREFRONT_ACCESS_TOKEN,
  apiVersion: API_VERSION,
};

// Types for common Shopify objects
export interface Money {
  amount: string;
  currencyCode: string;
}

export interface Image {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  price: Money;
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: Image;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale?: boolean;
  featuredImage?: Image;
  images?: {
    edges: Array<{
      node: Image;
    }>;
  };
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange?: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  options: ProductOption[];
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
  seo?: {
    title?: string;
    description?: string;
  };
  tags?: string[];
  metafields?: Array<{
    key: string;
    namespace: string;
    value: string;
    type: string;
  }>;
  totalInventory?: number;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: Image;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount?: Money;
  };
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        cost: {
          totalAmount: Money;
        };
        merchandise: {
          id: string;
          title: string;
          product: {
            id: string;
            title: string;
            handle: string;
            featuredImage?: Image;
          };
        };
      };
    }>;
  };
}