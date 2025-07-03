import { getProducts } from '@/lib/shopify/api'
import { ProductCardServer } from '@/components/commerce/product-card-server'
import { SearchFilters } from '@/app/(shop)/search/search-filters'

export const metadata = {
  title: 'Outerwear | Indecisive Wear',
  description: 'Shop jackets, coats, and outerwear. Stay stylish in any weather with our outerwear collection.',
}

export default async function OuterwearPage() {
  // Fetch products with outerwear-related tags/types
  const productsData = await getProducts(24, 'product_type:Jackets OR product_type:Coats OR product_type:Outerwear OR tag:outerwear OR tag:jacket OR tag:coat')
  const products = productsData.edges.map(edge => edge.node)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-mono mb-2">OUTERWEAR</h1>
        <p className="text-gray-600">Layer up in style</p>
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
              <h2 className="text-2xl font-mono mb-4">Outerwear collection coming</h2>
              <p className="text-gray-600">Premium jackets and coats arriving soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}