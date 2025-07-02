import { getProducts } from '@/lib/shopify/api'
import { ProductCard } from '@/components/commerce/product-card'
import { SearchFilters } from '@/app/(shop)/search/search-filters'

export const metadata = {
  title: 'DROP 1: ХУЛИГАНКА | Indecisive Wear',
  description: 'Shop our first drop - limited edition bucket hats for the indecisive. ХУЛИГАНКА collection available now.',
}

export default async function NewArrivalsPage() {
  // Fetch newest products (sorted by created date)
  const productsData = await getProducts(24, 'created_at:desc')
  const products = productsData.edges.map(edge => edge.node)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8 text-center lg:text-left">
        <div className="inline-block bg-black text-white px-4 py-1 font-mono text-sm mb-4">FIRST DROP</div>
        <h1 className="text-4xl lg:text-5xl font-bold font-mono mb-2">DROP 1: ХУЛИГАНКА</h1>
        <p className="text-gray-600 text-lg">Limited edition bucket hats for the indecisive</p>
        <div className="mt-4 flex flex-wrap gap-4 justify-center lg:justify-start">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-mono text-sm">AVAILABLE NOW</span>
          </div>
          <div className="font-mono text-sm text-gray-600">
            LIMITED QUANTITIES
          </div>
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
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  priority={index < 6} // Priority for first 6 products
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-mono mb-4">DROP SOLD OUT</h2>
              <p className="text-gray-600">Subscribe to be notified about restocks</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}