import { storefront, type Product, type Collection } from './storefront-client';

// WORKING GraphQL queries as strings - NO gql tags
const PRODUCTS_QUERY = `
  query getProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          handle
          title
          description
          availableForSale
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          options {
            id
            name
            values
          }
          variants(first: 5) {
            edges {
              node {
                id
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

const COLLECTIONS_QUERY = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

const PRODUCT_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      options {
        id
        name
        values
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
      seo {
        title
        description
      }
      tags
    }
  }
`;

// Product APIs
export async function getProducts(first: number = 12, query?: string) {
  try {
    const data = await storefront<{
      products: {
        edges: Array<{ node: Product }>;
        pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
      };
    }>(PRODUCTS_QUERY, { first, query });

    return data.products;
  } catch (_error) {
    // Return empty structure to prevent crashes
    return { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } };
  }
}

export async function getProduct(handle: string) {
  try {
    const data = await storefront<{ product: Product }>(
      PRODUCT_QUERY,
      { handle }
    );

    return data.product;
  } catch (_error) {
    return null;
  }
}

// Collection APIs
export async function getCollections(first: number = 10) {
  try {
    const data = await storefront<{
      collections: {
        edges: Array<{ node: Collection }>;
      };
    }>(COLLECTIONS_QUERY, { first });

    return data.collections;
  } catch (_error) {
    // Return empty structure to prevent crashes
    return { edges: [] };
  }
}

export async function getCollection(handle: string, productsFirst: number = 24) {
  const COLLECTION_QUERY = `
    query getCollection($handle: String!, $productsFirst: Int!) {
      collection(handle: $handle) {
        id
        title
        handle
        description
        image {
          url
          altText
        }
        products(first: $productsFirst) {
          edges {
            node {
              id
              title
              handle
              featuredImage {
                url
                altText
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              variants(first: 5) {
                edges {
                  node {
                    id
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await storefront<{
      collection: Collection & {
        products: {
          edges: Array<{ node: Product }>;
        };
      };
    }>(COLLECTION_QUERY, { handle, productsFirst });

    return data.collection;
  } catch (_error) {
    return null;
  }
}

// NOTE: Cart operations are handled by Hydrogen React CartProvider
// These functions are kept for compatibility but not used directly

// Utility functions
export function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}