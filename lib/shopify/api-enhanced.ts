import { storefront, type Product } from './storefront-client';
import { getMarketFromCookies } from './server-market';
import type { Market } from './markets';
import { extractNodes } from './flatten-connection';
import { mapStorefrontProductsToShopifyProducts } from './type-mappers';

// Enhanced product query with proper filtering support
const PRODUCTS_ENHANCED_QUERY = `
  query GetProductsEnhanced(
    $first: Int!
    $after: String
    $query: String
    $reverse: Boolean = false
    $sortKey: ProductSortKeys = CREATED_AT
    $country: CountryCode!
    $language: LanguageCode!
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      after: $after
      query: $query
      reverse: $reverse
      sortKey: $sortKey
    ) {
      edges {
        node {
          id
          handle
          title
          description
          availableForSale
          tags
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
          compareAtPriceRange {
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
                compareAtPrice {
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
          options {
            id
            name
            values
          }
          seo {
            title
            description
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

interface ProductsFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  availability?: string[];
  sort?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'created-desc';
  tags?: string[]; // For filtering by tags like 'new', 'sale', etc.
}

interface PaginatedProducts {
  products: Product[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
}

export async function getProductsPaginated(
  page: number = 1,
  perPage: number = 20,
  filters: ProductsFilter = {},
  market?: Market
): Promise<PaginatedProducts> {
  try {
    // Get market context
    const marketContext = market || (await getMarketFromCookies());
    const buyerContext = {
      country: marketContext.countryCode,
      language: marketContext.languageCode
    };

    // Build search query from filters
    const queryParts: string[] = [];
    
    // Category filter (using collections, tags, and product type)
    if (filters.category) {
      let categoryQueries: string[] = [];
      
      if (filters.category === 'hats') {
        // For hats: collection "Bucket-hats" OR tag "hats"
        categoryQueries = [
          'collection:Bucket-hats',
          'tag:hats'
        ];
      } else if (filters.category === 'tshirts') {
        // For tshirts: collection "Tees" OR product_type "crop top"
        categoryQueries = [
          'collection:Tees',
          'product_type:"crop top"',
          'tag:tshirts'
        ];
      } else {
        // Fallback for other categories
        categoryQueries = [
          `tag:${filters.category}`,
          `collection:${filters.category}`,
          `product_type:${filters.category}`
        ];
      }
      
      queryParts.push(`(${categoryQueries.join(' OR ')})`);
    }
    
    // Price range filter (Shopify supports variants.price)
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const min = filters.minPrice || 0;
      const max = filters.maxPrice || 999999;
      queryParts.push(`variants.price:>${min} variants.price:<${max}`);
    }
    
    // Availability filter
    if (filters.availability?.includes('in-stock')) {
      queryParts.push('available_for_sale:true');
    }
    
    // Tags for colors/sizes (if products are tagged)
    if (filters.colors && filters.colors.length > 0) {
      const colorQuery = filters.colors.map(c => `tag:color-${c.toLowerCase()}`).join(' OR ');
      queryParts.push(`(${colorQuery})`);
    }
    
    if (filters.sizes && filters.sizes.length > 0) {
      const sizeQuery = filters.sizes.map(s => `tag:size-${s.toUpperCase()}`).join(' OR ');
      queryParts.push(`(${sizeQuery})`);
    }
    
    // General tags filter (for new, sale, etc.)
    if (filters.tags && filters.tags.length > 0) {
      const tagQuery = filters.tags.map(tag => `tag:${tag}`).join(' OR ');
      queryParts.push(`(${tagQuery})`);
    }
    
    const searchQuery = queryParts.join(' ');
    
    // Determine sort parameters
    let sortKey: string = 'CREATED_AT';
    let reverse = true; // Default newest first
    
    switch (filters.sort) {
      case 'price-asc':
        sortKey = 'PRICE';
        reverse = false;
        break;
      case 'price-desc':
        sortKey = 'PRICE';
        reverse = true;
        break;
      case 'name-asc':
        sortKey = 'TITLE';
        reverse = false;
        break;
      case 'name-desc':
        sortKey = 'TITLE';
        reverse = true;
        break;
      case 'created-desc':
      default:
        sortKey = 'CREATED_AT';
        reverse = true;
        break;
    }
    
    // Calculate cursor for pagination
    const skip = (page - 1) * perPage;
    let after: string | undefined;
    
    // For pagination beyond first page, we need to fetch previous pages to get cursor
    // This is a limitation of cursor-based pagination
    // For now, we'll fetch more products and slice
    const fetchLimit = skip > 0 ? skip + perPage : perPage;
    
    const data = await storefront<{
      products: {
        edges: Array<{ 
          node: Product;
          cursor: string;
        }>;
        pageInfo: {
          hasNextPage: boolean;
          hasPreviousPage: boolean;
          startCursor?: string;
          endCursor?: string;
        };
      };
    }>(
      PRODUCTS_ENHANCED_QUERY,
      {
        first: fetchLimit,
        after,
        query: searchQuery || undefined,
        reverse,
        sortKey,
        country: buyerContext.country,
        language: buyerContext.language
      },
      buyerContext
    );
    
    // Extract products for current page using flattenConnection
    const allProducts = extractNodes(data?.products);
    const pageProducts = skip > 0 ? allProducts.slice(skip) : allProducts;
    const products = pageProducts.slice(0, perPage);
    
    // Apply client-side filtering for complex filters not supported by Shopify
    let filteredProducts = products;
    
    // Color filter (if not using tags)
    if (filters.colors && filters.colors.length > 0 && !searchQuery.includes('tag:color')) {
      const selectedColors = filters.colors.map(c => c.toLowerCase());
      filteredProducts = (filteredProducts as Product[]).filter((product: Product) => {
        return product.variants?.edges?.some((edge: any) => {
          const variant = edge.node;
          return variant.selectedOptions?.some((option: any) => 
            option.name.toLowerCase() === 'color' && 
            selectedColors.includes(option.value.toLowerCase())
          );
        });
      });
    }
    
    // Size filter (if not using tags)
    if (filters.sizes && filters.sizes.length > 0 && !searchQuery.includes('tag:size')) {
      const selectedSizes = filters.sizes.map(s => s.toUpperCase());
      filteredProducts = (filteredProducts as Product[]).filter((product: Product) => {
        return product.variants?.edges?.some((edge: any) => {
          const variant = edge.node;
          return variant.selectedOptions?.some((option: any) => 
            option.name.toLowerCase() === 'size' && 
            selectedSizes.includes(option.value.toUpperCase())
          );
        });
      });
    }
    
    return {
      products: mapStorefrontProductsToShopifyProducts(filteredProducts as Product[]),
      pageInfo: {
        hasNextPage: data?.products?.pageInfo?.hasNextPage || false,
        hasPreviousPage: page > 1,
        startCursor: data?.products?.pageInfo?.startCursor,
        endCursor: data?.products?.pageInfo?.endCursor
      },
      totalCount: allProducts.length // Approximate count
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false
      },
      totalCount: 0
    };
  }
}

// Extract unique filter values from products
export function extractFilterOptions(products: Product[]) {
  const categories = new Set<string>();
  const colors = new Set<string>();
  const sizes = new Set<string>();
  let minPrice = Infinity;
  let maxPrice = 0;
  
  products.forEach(product => {
    // Categories from tags (e.g., "category:tshirts")
    if (product.tags) {
      product.tags.forEach(tag => {
        if (tag.startsWith('category:')) {
          categories.add(tag.replace('category:', ''));
        }
      });
    }
    
    // Price range
    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    minPrice = Math.min(minPrice, price);
    maxPrice = Math.max(maxPrice, price);
    
    // Colors and sizes from variants
    product.variants?.edges?.forEach(edge => {
      const variant = edge.node;
      variant.selectedOptions?.forEach(option => {
        if (option.name.toLowerCase() === 'color') {
          colors.add(option.value);
        } else if (option.name.toLowerCase() === 'size') {
          sizes.add(option.value);
        }
      });
    });
  });
  
  return {
    categories: Array.from(categories).sort(),
    colors: Array.from(colors).sort(),
    sizes: Array.from(sizes).sort(),
    priceRange: {
      min: minPrice === Infinity ? 0 : minPrice,
      max: maxPrice
    }
  };
}