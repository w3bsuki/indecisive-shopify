import { getProducts } from '@/lib/shopify/api'
import { ProductCardServer } from '@/components/commerce/product-card-server'
import { SearchFilters } from '@/app/(shop)/search/search-filters'

export const metadata = {
  title: 'Sale | Indecisive Wear',
  description: 'Shop sale items and special offers. Get the best deals on fashion at Indecisive Wear.',
}

export default async function SalePage() {
  // Fetch products with sale tag or compare at price
  const productsData = await getProducts(24, 'tag:sale OR tag:discount OR tag:clearance')
  const products = productsData.edges.map(edge => edge.node)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-mono mb-2">SALE</h1>
        <p className="text-gray-600">Limited time offers</p>
        <div className="mt-4 p-4 bg-red-50 border-2 border-red-200">
          <p className="text-sm text-red-800 font-medium">
            🔥 Up to 50% off selected items. While stocks last!
          </p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCardServer key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-mono mb-4">Sale starting soon</h2>
              <p className="text-gray-600">Check back for amazing deals!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}