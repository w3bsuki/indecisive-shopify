import { getProducts } from '@/lib/shopify'
import { ProductCardPerfect } from '@/components/commerce/product-card-perfect'
import { ProductCardRefined } from '@/components/commerce/product-card-refined'
import { ProductCard } from '@/components/commerce/product-card'

export default async function DemoCardsMobilePage() {
  const productsData = await getProducts(12)
  const products = productsData.edges.map(edge => edge.node)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile View Simulator */}
      <div className="max-w-md mx-auto py-8">
        <h1 className="text-2xl font-bold mb-8 text-center px-4">Mobile Product Cards</h1>

        {/* Perfect Cards - Mobile Optimized */}
        <section className="mb-12">
          <div className="px-4 mb-4">
            <h2 className="text-xl font-bold text-purple-900">Perfect Cards (Mobile)</h2>
            <p className="text-sm text-gray-600">Optimized for mobile with great readability</p>
          </div>
          <div className="grid grid-cols-2 gap-3 px-4">
            {products.slice(0, 4).map((product) => (
              <ProductCardPerfect key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Desktop Comparison */}
        <div className="px-4 mb-8">
          <h2 className="text-xl font-bold mb-4">Desktop View (3 columns)</h2>
          <p className="text-sm text-gray-600 mb-4">Better proportions with 3 columns max</p>
        </div>
      </div>

      {/* Desktop View - Better proportions */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product) => (
            <ProductCardPerfect key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Comparison Section */}
      <div className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Side by Side Comparison</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Original */}
            <div>
              <h3 className="font-semibold mb-4">Original</h3>
              <ProductCard product={products[0]} />
            </div>
            
            {/* Refined */}
            <div>
              <h3 className="font-semibold mb-4">Refined</h3>
              <ProductCardRefined product={products[0]} />
            </div>
            
            {/* Perfect */}
            <div>
              <h3 className="font-semibold mb-4">Perfect</h3>
              <ProductCardPerfect product={products[0]} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Scroll Test */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-6 px-4">Mobile Scroll Experience</h2>
          <div className="space-y-4 px-4">
            {products.slice(0, 3).map((product) => (
              <ProductCardPerfect key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}