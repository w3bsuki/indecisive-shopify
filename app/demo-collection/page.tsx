import { getProducts } from '@/lib/shopify'
import { ProductGridPerfect } from '@/components/commerce/product-grid-perfect'

export default async function DemoCollectionPage() {
  const productsData = await getProducts(24)
  const products = productsData.edges.map(edge => edge.node)

  return (
    <div className="min-h-screen bg-white">
      {/* Collection Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-2">STREETWEAR COLLECTION</h1>
          <p className="text-gray-600 max-w-3xl">
            Essential streetwear pieces that blend comfort with urban style. 
            From oversized tees to technical fabrics.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">{products.length} products</p>
          <select className="border border-gray-300 rounded px-3 py-2 text-sm">
            <option>Best Selling</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>

        {/* Product Grid - 3 columns max for better proportions */}
        <ProductGridPerfect 
          products={products}
          columns={{
            mobile: 2,
            tablet: 3,
            desktop: 3
          }}
        />
      </div>
    </div>
  )
}