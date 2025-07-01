import { notFound } from 'next/navigation'
import { getCollection, getCollections } from '@/lib/shopify/api'
import { ProductCard } from '@/components/commerce/product-card'
import { SearchFilters } from '@/app/(shop)/search/search-filters'

export async function generateStaticParams() {
  const collections = await getCollections(20)
  
  return collections.edges.map((edge) => ({
    handle: edge.node.handle,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const collection = await getCollection(handle)
  
  if (!collection) {
    return {
      title: 'Collection Not Found | Indecisive Wear',
    }
  }

  return {
    title: `${collection.title} | Indecisive Wear`,
    description: collection.description || `Shop the ${collection.title} collection at Indecisive Wear.`,
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const collection = await getCollection(handle, 24)

  if (!collection) {
    notFound()
  }

  const products = collection.products?.edges.map(edge => edge.node) || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Collection Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-mono mb-2">{collection.title.toUpperCase()}</h1>
        {collection.description && (
          <p className="text-gray-600 max-w-3xl">{collection.description}</p>
        )}
        {collection.image && (
          <div className="mt-6 aspect-[21/9] relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={collection.image.url}
              alt={collection.image.altText || collection.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <SearchFilters />
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-mono mb-4">No products in this collection</h2>
              <p className="text-gray-600">Check back soon for updates!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}