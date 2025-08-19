import { flattenConnection as hydrogenFlattenConnection } from '@shopify/hydrogen-react'
import type { ShopifyProduct, ShopifyCollection, CartLine, PageInfo } from './types'

// Re-export hydrogen-react's flattenConnection with our types
export { flattenConnection } from '@shopify/hydrogen-react'

// Generic GraphQL Connection interfaces
export interface GraphQLEdge<T> {
  node: T
  cursor?: string
}

export interface GraphQLConnection<T> {
  edges?: GraphQLEdge<T>[] | null
  pageInfo?: PageInfo | null
}

export interface ExtendedPageInfo extends PageInfo {
  hasPreviousPage: boolean
  startCursor?: string
  endCursor?: string
}

// Extended utility for our specific use cases
export function flattenConnectionWithMetadata<T>(
  connection: {
    edges?: GraphQLEdge<T>[] | null
    pageInfo?: ExtendedPageInfo | null
  } | null | undefined
) {
  if (!connection?.edges) {
    return {
      nodes: [] as T[],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: undefined,
        endCursor: undefined
      },
      cursors: [] as string[]
    }
  }

  // Type-safe conversion for hydrogen's flattenConnection
  const hydrogenConnection = {
    edges: connection.edges
  }
  const nodes = hydrogenFlattenConnection(hydrogenConnection) as T[]
  
  const cursors = connection.edges
    .map(edge => edge.cursor)
    .filter((cursor): cursor is string => Boolean(cursor))

  return {
    nodes,
    pageInfo: connection.pageInfo || {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: undefined,
      endCursor: undefined
    },
    cursors
  }
}

// Utility for extracting just the nodes (most common use case)
export function extractNodes<T>(
  connection: GraphQLConnection<T> | null | undefined | string
): T[] {
  // Handle invalid inputs
  if (!connection || typeof connection === 'string' || !connection.edges) {
    return []
  }
  
  // Type-safe conversion for hydrogen's flattenConnection
  const hydrogenConnection = {
    edges: connection.edges
  }
  return (hydrogenFlattenConnection(hydrogenConnection) as T[]) || []
}

// Type-safe helper for product connections
export function flattenProducts(
  connection: {
    edges?: GraphQLEdge<ShopifyProduct>[] | null
    pageInfo?: ExtendedPageInfo | null
  } | null | undefined
) {
  return flattenConnectionWithMetadata<ShopifyProduct>(connection)
}

// Type-safe helper for collection connections  
export function flattenCollections(
  connection: {
    edges?: GraphQLEdge<ShopifyCollection>[] | null
    pageInfo?: ExtendedPageInfo | null
  } | null | undefined
) {
  return flattenConnectionWithMetadata<ShopifyCollection>(connection)
}

// Type-safe helper for cart line connections
export function flattenCartLines(
  connection: {
    edges?: GraphQLEdge<CartLine>[] | null
    pageInfo?: ExtendedPageInfo | null
  } | null | undefined
) {
  return flattenConnectionWithMetadata<CartLine>(connection)
}