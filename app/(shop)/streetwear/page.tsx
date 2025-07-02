import { getProducts } from '@/lib/shopify/api'
import { ProductCard } from '@/components/commerce/product-card'
import { SearchFilters } from '@/app/(shop)/search/search-filters'

export const metadata = {
  title: 'Streetwear | Indecisive Wear',
  description: 'Explore urban streetwear fashion. Shop hoodies, tees, sneakers and street style essentials.',
}

export default async function StreetwearPage() {
  // Fetch products with streetwear-related tags
  const productsData = await getProducts(24, 'tag:streetwear OR tag:urban OR tag:street OR product_type:Hoodies OR product_type:Sneakers')
  const products = productsData.edges.map(edge => edge.node)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-mono mb-2">STREETWEAR</h1>
        <p className="text-gray-600">Urban culture meets contemporary style</p>
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
              <h2 className="text-2xl font-mono mb-4">Streetwear collection loading</h2>
              <p className="text-gray-600">Fresh street styles dropping soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}