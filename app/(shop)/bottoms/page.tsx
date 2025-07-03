import { getProducts } from '@/lib/shopify/api'
import { ProductCardServer } from '@/components/commerce/product-card-server'
import { SearchFilters } from '@/app/(shop)/search/search-filters'

export const metadata = {
  title: 'Bottoms | Indecisive Wear',
  description: 'Shop pants, jeans, shorts, and skirts. Find the perfect bottoms for any occasion.',
}

export default async function BottomsPage() {
  // Fetch products with bottoms-related tags/types
  const productsData = await getProducts(24, 'product_type:Pants OR product_type:Jeans OR product_type:Shorts OR product_type:Skirts OR product_type:Bottoms OR tag:bottoms OR tag:pants OR tag:denim')
  const products = productsData.edges.map(edge => edge.node)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-mono mb-2">BOTTOMS</h1>
        <p className="text-gray-600">Pants, jeans, shorts & more</p>
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
              <h2 className="text-2xl font-mono mb-4">Bottoms collection loading</h2>
              <p className="text-gray-600">Premium bottoms coming your way.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}