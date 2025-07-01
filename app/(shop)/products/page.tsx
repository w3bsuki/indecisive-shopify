import { getProducts } from '@/lib/shopify/api'
import { VirtualProductGrid } from '@/components/commerce/virtual-product-grid'
import { SearchFilters } from '@/app/(shop)/search/search-filters'

export const metadata = {
  title: 'All Products | Indecisive Wear',
  description: 'Browse our complete collection of fashion for the indecisive.',
}

export default async function ProductsPage() {
  // Fetch all products (in a real app, this would be paginated)
  const productsData = await getProducts(100) // Get more products for virtual scrolling demo
  const products = productsData.edges.map(edge => edge.node)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-4xl lg:text-5xl font-bold font-mono mb-2">ALL PRODUCTS</h1>
        <p className="text-gray-600 text-lg">
          {products.length} items to help you decide (or not)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <SearchFilters />
        </aside>

        {/* Virtual Scrolling Products Grid */}
        <main className="lg:col-span-3">
          {products.length > 0 ? (
            <VirtualProductGrid products={products} />
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-mono mb-4">NO PRODUCTS FOUND</h2>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}