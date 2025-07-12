// Product fragment for reusability (embedded in queries as plain string)
// Updated to include @inContext directive for market-aware pricing
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
  tags
  options {
    id
    name
    values
  }
`;

// Get products query with @inContext for market-specific data
export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String, $country: CountryCode!, $language: LanguageCode!) @inContext(country: $country, language: $language) {
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

// Get single product with @inContext
export const PRODUCT_QUERY = `
  query GetProduct($handle: String!, $country: CountryCode!, $language: LanguageCode!) @inContext(country: $country, language: $language) {
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
      metafields(identifiers: [
        {namespace: "custom", key: "materials"},
        {namespace: "custom", key: "care_instructions"},
        {namespace: "custom", key: "fit_guide"},
        {namespace: "custom", key: "size_chart"},
        {namespace: "reviews", key: "rating"},
        {namespace: "reviews", key: "rating_count"},
        {namespace: "inventory", key: "low_stock_threshold"}
      ]) {
        key
        namespace
        value
        type
      }
      totalInventory
    }
  }
`;

// Get collections with @inContext
export const COLLECTIONS_QUERY = `
  query GetCollections($first: Int!, $country: CountryCode!, $language: LanguageCode!) @inContext(country: $country, language: $language) {
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

// Get collection with products with @inContext
export const COLLECTION_QUERY = `
  query GetCollection($handle: String!, $productsFirst: Int!, $country: CountryCode!, $language: LanguageCode!) @inContext(country: $country, language: $language) {
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

// Cart query with @inContext for market-specific pricing
export const CART_QUERY = `
  query GetCart($cartId: ID!, $country: CountryCode!, $language: LanguageCode!) @inContext(country: $country, language: $language) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
      }
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  id
                  handle
                  title
                  featuredImage {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Note: Cart operations are handled by Hydrogen React
// No cart mutations are included here - use @shopify/hydrogen-react for cart management