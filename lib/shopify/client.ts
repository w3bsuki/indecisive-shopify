import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!;
const publicAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-01';

if (!domain || !publicAccessToken) {
  throw new Error('Missing Shopify environment variables');
}

export const shopifyClient = createStorefrontApiClient({
  domain,
  publicAccessToken,
  apiVersion,
});

// Helper function to handle GraphQL requests
export async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache',
}: {
  query: string;
  variables?: Record<string, any>;
  cache?: RequestCache;
}): Promise<T> {
  try {
    const response = await shopifyClient.request(query, {
      variables,
    });

    return response.data as T;
  } catch (error) {
    console.error('Shopify API Error:', error);
    throw error;
  }
}