// This file contains sample products with sale data for testing the sale page
// In a real application, these would come from Shopify with proper compare-at prices or sale tags

export const TEST_SALE_PRODUCTS = [
  {
    id: 'test-sale-1',
    handle: 'test-bucket-hat-sale',
    title: 'Premium Bucket Hat - Black',
    description: 'Classic black bucket hat with minimalist design',
    availableForSale: true,
    tags: ['sale-25', 'hat', 'bucket-hat', 'black'],
    featuredImage: {
      url: '/images/placeholder-hat.jpg',
      altText: 'Black bucket hat',
      width: 500,
      height: 500
    },
    priceRange: {
      minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '29.99', currencyCode: 'USD' }
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '39.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '39.99', currencyCode: 'USD' }
    },
    variants: {
      edges: [
        {
          node: {
            id: 'test-variant-1',
            title: 'Default',
            availableForSale: true,
            selectedOptions: [],
            price: { amount: '29.99', currencyCode: 'USD' },
            compareAtPrice: { amount: '39.99', currencyCode: 'USD' }
          }
        }
      ]
    }
  },
  {
    id: 'test-sale-2', 
    handle: 'test-tote-bag-sale',
    title: 'Canvas Tote Bag - Natural',
    description: 'Sustainable canvas tote bag perfect for everyday use',
    availableForSale: true,
    tags: ['discount-40', 'bag', 'tote', 'canvas'],
    featuredImage: {
      url: '/images/placeholder-bag.jpg',
      altText: 'Natural canvas tote bag',
      width: 500,
      height: 500
    },
    priceRange: {
      minVariantPrice: { amount: '24.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '24.99', currencyCode: 'USD' }
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '41.65', currencyCode: 'USD' },
      maxVariantPrice: { amount: '41.65', currencyCode: 'USD' }
    },
    variants: {
      edges: [
        {
          node: {
            id: 'test-variant-2',
            title: 'Default',
            availableForSale: true,
            selectedOptions: [],
            price: { amount: '24.99', currencyCode: 'USD' },
            compareAtPrice: { amount: '41.65', currencyCode: 'USD' }
          }
        }
      ]
    }
  }
]