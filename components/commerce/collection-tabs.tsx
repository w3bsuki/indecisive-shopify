import { getCollections } from '@/lib/shopify/api'
import Link from 'next/link'

interface CollectionTabsProps {
  currentCategory?: string
}

export async function CollectionTabs({ currentCategory = '' }: CollectionTabsProps) {
  try {
    const collectionsData = await getCollections(20)
    const collections = collectionsData.edges
      .map(edge => edge.node)
      .filter(collection => collection.handle !== 'frontpage')
    
    return (
      <div className="mb-6">
        <div className="overflow-x-auto scrollbar-hide px-4">
          <div className="inline-flex gap-2 min-w-max pb-2">
            <Link 
              href="/products" 
              className={`font-mono font-bold text-sm uppercase tracking-wider px-4 py-3 min-w-[80px] text-center border-b-2 transition-all duration-200 whitespace-nowrap ${
                (currentCategory === 'all' || !currentCategory) 
                  ? 'border-black text-black bg-gray-50' 
                  : 'border-transparent text-gray-600 hover:text-black hover:border-gray-300'
              }`}
            >
              ALL
            </Link>
            {collections.map((collection) => (
              <Link 
                key={collection.id}
                href={`/products?category=${collection.handle}`}
                className={`font-mono font-bold text-sm uppercase tracking-wider px-4 py-3 min-w-[80px] text-center border-b-2 transition-all duration-200 whitespace-nowrap ${
                  currentCategory === collection.handle 
                    ? 'border-black text-black bg-gray-50' 
                    : 'border-transparent text-gray-600 hover:text-black hover:border-gray-300'
                }`}
              >
                {collection.title.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  } catch (_error) {
    return (
      <div className="mb-6">
        <div className="overflow-x-auto scrollbar-hide px-4">
          <div className="inline-flex gap-2 min-w-max pb-2">
            <Link 
              href="/products" 
              className="font-mono font-bold text-sm uppercase tracking-wider px-4 py-3 min-w-[80px] text-center border-b-2 border-black text-black bg-gray-50 transition-all duration-200 whitespace-nowrap"
            >
              ALL
            </Link>
          </div>
        </div>
      </div>
    )
  }
}