import { getProducts } from '@/lib/shopify/api'
import { ProductCard } from '@/components/commerce/product-card'
import { SearchFilters } from '@/app/(shop)/search/search-filters'

export const metadata = {
  title: 'Essentials | Indecisive Wear',
  description: 'Shop essential wardrobe pieces. Timeless basics and everyday essentials for your closet.',
}

export default async function EssentialsPage() {
  // Fetch products with "essentials" tag
  const productsData = await getProducts(24, 'tag:essentials OR tag:basic OR tag:essential')
  const products = productsData.edges.map(edge => edge.node)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-mono mb-2">ESSENTIALS</h1>
        <p className="text-gray-600">Timeless pieces for everyday wear</p>
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
              <h2 className="text-2xl font-mono mb-4">Essentials coming soon</h2>
              <p className="text-gray-600">We&apos;re curating the perfect essential pieces for you.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}