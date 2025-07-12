import { flattenConnection as hydrogenFlattenConnection } from '@shopify/hydrogen-react'

// Re-export hydrogen-react's flattenConnection with our types
export { flattenConnection } from '@shopify/hydrogen-react'

// Extended utility for our specific use cases
export function flattenConnectionWithMetadata<T>(
  connection: {
    edges?: Array<{
      node: T
      cursor?: string
    }> | null
    pageInfo?: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor?: string
      endCursor?: string
    }
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

  const nodes = hydrogenFlattenConnection(connection as any)
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
  connection: {
    edges?: Array<{ node: T }> | null
  } | null | undefined | string | any
): T[] {
  // Handle invalid inputs
  if (!connection || typeof connection === 'string' || !connection.edges) {
    return []
  }
  
  return (hydrogenFlattenConnection(connection as any) || []) as T[]
}

// Type-safe helper for product connections
export function flattenProducts(
  connection: {
    edges?: Array<{
      node: any // Will be typed as Product in usage
      cursor?: string
    }> | null
    pageInfo?: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor?: string
      endCursor?: string
    }
  } | null | undefined
) {
  return flattenConnectionWithMetadata(connection)
}

// Type-safe helper for collection connections  
export function flattenCollections(
  connection: {
    edges?: Array<{
      node: any // Will be typed as Collection in usage
      cursor?: string
    }> | null
    pageInfo?: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor?: string
      endCursor?: string
    }
  } | null | undefined
) {
  return flattenConnectionWithMetadata(connection)
}

// Type-safe helper for cart line connections
export function flattenCartLines(
  connection: {
    edges?: Array<{
      node: any // Will be typed as CartLine in usage
      cursor?: string
    }> | null
    pageInfo?: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor?: string
      endCursor?: string
    }
  } | null | undefined
) {
  return flattenConnectionWithMetadata(connection)
}