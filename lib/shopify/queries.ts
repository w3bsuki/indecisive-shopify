// Product fragment for reusability (embedded in queries as plain string)
const PRODUCT_FRAGMENT = `
  id
  handle
  title
  description
  availableForSale
  featuredImage {
    url
    altText
    width
    height
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
      }
    }
  }
  seo {
    title
    description
  }
`;

// Get products query
export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          ${PRODUCT_FRAGMENT}
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

// Get single product
export const PRODUCT_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      ${PRODUCT_FRAGMENT}
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
    }
  }
`;

// Get collections
export const COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

// Get collection with products
export const COLLECTION_QUERY = `
  query GetCollection($handle: String!, $productsFirst: Int!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        url
        altText
        width
        height
      }
      products(first: $productsFirst) {
        edges {
          node {
            ${PRODUCT_FRAGMENT}
          }
        }
      }
    }
  }
`;

// Note: Cart operations are handled by Hydrogen React
// No cart mutations are included here - use @shopify/hydrogen-react for cart management