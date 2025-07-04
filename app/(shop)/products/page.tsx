import { getProducts } from '@/lib/shopify/api'
import { VirtualProductGrid } from '@/components/commerce/virtual-product-grid'
import { SearchFiltersTranslated } from '@/app/(shop)/search/search-filters-translated'
import { ProductsPageHeader, NoProductsFound } from './page-client'

export const metadata = {
  title: 'All Products | Indecisive Wear',
  description: 'Browse our complete collection of fashion for the indecisive.',
}

export default async function ProductsPage() {
  // Fetch all products (in a real app, this would be paginated)
  const productsData = await getProducts(100) // Get more products for virtual scrolling demo
  const products = productsData.edges.map(edge => edge.node)

  return (
    <div className="pt-4 md:pt-8">
      <ProductsPageHeader productCount={products.length} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

      {/* Collapsible Filters */}
      <SearchFiltersTranslated />

      {/* Products Grid - Full Width */}
      <div className="mt-6">
        {products.length > 0 ? (
          <VirtualProductGrid products={products} />
        ) : (
          <NoProductsFound />
        )}
      </div>
      </div>
    </div>
  )
}