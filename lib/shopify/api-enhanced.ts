import { storefront, type Product, type ProductVariant } from './storefront-client';
import { getMarketFromCookies } from './server-market';
import type { Market } from './markets';
import { extractNodes } from './flatten-connection';
import { mapStorefrontProductsToShopifyProducts } from './type-mappers';
import { logger } from '../logger';

// Collection products query for fetching products from a specific collection
const COLLECTION_PRODUCTS_QUERY = `
  query GetCollectionProducts(
    $handle: String!
    $first: Int!
    $after: String
    $country: CountryCode!
    $language: LanguageCode!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      products(first: $first, after: $after) {
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
  }
`;

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

// GraphQL response type interfaces
interface VariantEdge {
  node: ProductVariant;
  cursor?: string;
}

interface SelectedOption {
  name: string;
  value: string;
}

interface ProductsFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  availability?: string[];
  sort?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'created-desc';
  tags?: string[]; // For filtering by tags like 'new', 'sale', etc.
  excludeTags?: string[]; // For excluding products with specific tags
  keyword?: string; // free text search query
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

    // Map certain "virtual" categories to tag-based filters (no Shopify collection needed)
    const TAG_CATEGORY_MAP: Record<string, string[]> = {
      // Virtual/tag-driven categories (ensure we don't use collection query for these)
      'crop-tops': ['crop top'],
      // Normalize all tees/tshirts handles to tag-based filtering using Shopify tag `tee`
      'tees': ['tee'],
      'tshirts': ['tee'],
      'tees-1': ['tee']
    };
    const isTagCategory = !!(filters.category && TAG_CATEGORY_MAP[filters.category]);

    // Check if we need to use collection-specific query (skip when it's a tag-based category)
    if (filters.category && filters.category !== 'all' && !isTagCategory) {
      
      // Calculate cursor for pagination
      const skip = (page - 1) * perPage;
      
      // Use collection products query
      const data = await storefront<{
        collection: {
          id: string;
          handle: string;
          title: string;
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
        };
      }>(
        COLLECTION_PRODUCTS_QUERY,
        {
          handle: filters.category,
          first: perPage,
          after: skip > 0 ? btoa(`arrayconnection:${skip - 1}`) : undefined,
          country: buyerContext.country,
          language: buyerContext.language
        },
        buyerContext
      );

      if (!data?.collection) {
        return {
          products: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false
          },
          totalCount: 0
        };
      }

      const products = extractNodes(data.collection.products);
      
      // Map to ShopifyProduct type
      const mappedProducts = mapStorefrontProductsToShopifyProducts(products as Product[]);
      
      return {
        products: mappedProducts,
        pageInfo: data.collection.products.pageInfo,
        totalCount: products.length * (data.collection.products.pageInfo.hasNextPage ? 5 : 1) // Approximate
      };
    }

    // Build search query from filters for general product search
    const queryParts: string[] = [];
    
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
    
    // General tags filter (for new, sale, etc.) including tag-based categories like crop-tops
    const combinedTags: string[] = [];
    if (isTagCategory) {
      combinedTags.push(...(TAG_CATEGORY_MAP[filters.category as string] || []));
    }
    
    // Keyword search (title, product_type, tag)
    if (filters.keyword && filters.keyword.trim().length > 0) {
      const q = filters.keyword.trim().replace(/\s+/g, ' ')
      const isMulti = /\s/.test(q)
      const quoted = isMulti ? `"${q.replace(/"/g, '\\"')}"` : q
      const titlePart = `title:*${q}*`
      const tagPart = `tag:${quoted}`
      const typePart = `product_type:${quoted}`
      queryParts.push(`(${titlePart} OR ${tagPart} OR ${typePart})`)
    }
    if (filters.tags && filters.tags.length > 0) {
      combinedTags.push(...filters.tags);
    }
    if (combinedTags.length > 0) {
      const encodeTag = (tag: string) => {
        const escaped = tag.replace(/"/g, '\\"')
        const needsQuotes = /\s|[():]/.test(tag)
        return needsQuotes ? `tag:"${escaped}"` : `tag:${tag}`
      }
      const tagQuery = Array.from(new Set(combinedTags)).map(encodeTag).join(' OR ')
      queryParts.push(`(${tagQuery})`)
    }
    
    // Tag exclusion (for filtering out specific product types)
    if (filters.excludeTags && filters.excludeTags.length > 0) {
      const encodeTag = (tag: string) => {
        const escaped = tag.replace(/"/g, '\\"')
        const needsQuotes = /\s|[():]/.test(tag)
        return needsQuotes ? `-tag:"${escaped}"` : `-tag:${tag}`
      }
      const excludeQuery = filters.excludeTags.map(encodeTag).join(' ')
      queryParts.push(excludeQuery)
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
    if (allProducts.length === 0) {
    }
    const pageProducts = skip > 0 ? allProducts.slice(skip) : allProducts;
    const products = pageProducts.slice(0, perPage);
    
    // Apply client-side filtering for complex filters not supported by Shopify
    let filteredProducts = products;
    
    // Color filter (if not using tags)
    if (filters.colors && filters.colors.length > 0 && !searchQuery.includes('tag:color')) {
      const selectedColors = filters.colors.map(c => c.toLowerCase());
      filteredProducts = (filteredProducts as Product[]).filter((product: Product) => {
        return product.variants?.edges?.some((edge: VariantEdge) => {
          const variant = edge.node;
          return variant.selectedOptions?.some((option: SelectedOption) => 
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
        return product.variants?.edges?.some((edge: VariantEdge) => {
          const variant = edge.node;
          return variant.selectedOptions?.some((option: SelectedOption) => 
            option.name.toLowerCase() === 'size' && 
            selectedSizes.includes(option.value.toUpperCase())
          );
        });
      });
    }
    
    // Tag exclusion filter (client-side to ensure products with excluded tags are filtered out)
    if (filters.excludeTags && filters.excludeTags.length > 0) {
      const excludedTags = filters.excludeTags.map(tag => tag.toLowerCase());
      filteredProducts = (filteredProducts as Product[]).filter((product: Product) => {
        const productTags = (product.tags || []).map(tag => tag.toLowerCase());
        return !excludedTags.some(excludedTag => productTags.includes(excludedTag));
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
    logger.error('Error fetching products:', error);
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
    
