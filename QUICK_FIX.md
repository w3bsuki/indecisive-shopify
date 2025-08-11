# QUICK FIX FOR COLLECTIONS

The issue is likely that your collections have different handles than expected.

## Immediate Fix:

1. **Check your actual Shopify collection handles:**
   - Go to your Shopify admin
   - Collections > [Your Collection] > Search engine listing preview
   - The URL shows the actual handle (e.g., `/collections/actual-handle`)

2. **Replace this file:** `components/commerce/collections-pills-server.tsx`

```tsx
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
  className = ''
}: CollectionsPillsServerProps) {
  let collections: Collection[] = []
  try {
    const collectionsData = await getCollections(50) // Get more collections
    collections = collectionsData.edges
      .map(edge => ({
        id: edge.node.id,
        handle: edge.node.handle,
        title: edge.node.title
      }))
      .filter(collection => {
        // Only filter out obvious non-product collections
        const excludeHandles = ['frontpage', 'homepage', 'main-menu', 'footer']
        return !excludeHandles.includes(collection.handle.toLowerCase())
      })
    
    console.log('Available collections:', collections.map(c => c.handle))
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
```

3. **Check the browser dev tools console for the log of available collections**

4. **The URLs should match your Shopify collection handles exactly**

That's it. This should work now.