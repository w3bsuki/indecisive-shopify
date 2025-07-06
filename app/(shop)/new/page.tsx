import { getProducts } from '@/lib/shopify/api'
import { ProductCardServer } from '@/components/commerce/product-card-server'
import { SearchFilters } from '@/app/(shop)/search/search-filters'

export const metadata = {
  title: 'New Products | Indecisive Wear',
  description: 'Shop our newest arrivals at Indecisive Wear. Fresh styles for the indecisive.',
}

export default async function NewArrivalsPage() {
  // For now, show all products since they're all new
  const productsData = await getProducts(24)
  const products = productsData.edges.map(edge => edge.node)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-mono mb-2">NEW ARRIVALS</h1>
        <p className="text-gray-600">Fresh styles for the indecisive</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="font-mono text-sm">JUST DROPPED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <SearchFilters />
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 lg:gap-4">
              {products.map((product, index) => (
                <ProductCardServer 
                  key={product.id} 
                  product={product} 
                  priority={index < 6} // Priority for first 6 products
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-mono mb-4">NO NEW PRODUCTS</h2>
              <p className="text-gray-600">Check back soon for fresh drops</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}