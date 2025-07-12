import type { Product as StorefrontProduct } from './storefront-client'
import type { ShopifyProduct } from './types'

/**
 * Maps a Product from the storefront client to a ShopifyProduct type
 * This ensures type compatibility between the GraphQL response and our internal types
 */
export function mapStorefrontProductToShopifyProduct(product: StorefrontProduct): ShopifyProduct {
  if (!product) {
    throw new Error('Product is undefined')
  }

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    availableForSale: product.availableForSale,
    priceRange: product.priceRange,
    compareAtPriceRange: product.compareAtPriceRange,
    images: product.images,
    variants: product.variants,
    options: product.options || [],
    seo: product.seo,
    tags: product.tags,
    featuredImage: product.featuredImage,
    metafields: product.metafields,
    totalInventory: product.totalInventory
  }
}

/**
 * Maps an array of products
 */
export function mapStorefrontProductsToShopifyProducts(products: StorefrontProduct[]): ShopifyProduct[] {
  return products.map(mapStorefrontProductToShopifyProduct)
}