import { getCollections } from '@/lib/shopify/api'
import { CollectionsPills } from './collections-pills'

interface Collection {
  id: string
  handle: string
  title: string
}

interface CollectionsPillsServerProps {
  variant?: 'all' | 'new' | 'sale' | 'collection'
  currentCategory?: string
  className?: string
  useDynamicCollections?: boolean
}

export async function CollectionsPillsServer({
  variant = 'all',
  currentCategory = 'all',
  className = '',
  useDynamicCollections: _useDynamicCollections = true
}: CollectionsPillsServerProps) {
  // Fetch actual Shopify collections
  let collections: Collection[] = []
  try {
    const collectionsData = await getCollections(20)
    collections = collectionsData.edges
      .map(edge => ({
        id: edge.node.id,
        handle: edge.node.handle,
        title: edge.node.title
      }))
      .filter(collection => 
        collection.handle !== 'frontpage' && 
        collection.handle !== 'homepage' &&
        collection.handle !== 'all'
      )
    console.log('SHOPIFY COLLECTIONS:', collections.map(c => `${c.handle} (${c.title})`))
  } catch (error) {
    console.error('Failed to fetch collections:', error)
  }

  return (
    <CollectionsPills
      variant={variant}
      currentCategory={currentCategory}
      className={className}
      collections={collections}
      useDynamicCollections={true}
    />
  )
}