import { getProducts } from '@/lib/shopify'
import { ProductCard } from '@/components/commerce/product-card'
import { ProductCardV2 } from '@/components/commerce/product-card-v2'
import { ProductCardModern } from '@/components/commerce/product-card-modern'
import { ProductCardRefined } from '@/components/commerce/product-card-refined'
import { ProductCardSimple } from '@/components/commerce/product-card-simple'
import { ProductCardPerfect } from '@/components/commerce/product-card-perfect'
import { ProductGridModern } from '@/components/commerce/product-grid-modern'

export default async function DemoCardsPage() {
  const productsData = await getProducts(12)
  const products = productsData.edges.map(edge => edge.node)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12 text-center">Product Card Comparison</h1>

        {/* PERFECT Card - THE ONE */}
        <section className="mb-16 bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl border-2 border-purple-200">
          <h2 className="text-3xl font-bold mb-2 text-purple-900">🎯 PERFECT Product Cards</h2>
          <p className="text-purple-700 mb-6">The best of all worlds - great readability, clean design, perfect for mobile</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((product) => (
              <ProductCardPerfect key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Original Card */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Original Product Cards</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Simple Card - Original with Ratings */}
        <section className="mb-16 bg-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Simple Cards (Original + Ratings)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((product) => (
              <ProductCardSimple key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Refined Card */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Refined Cards (Clean + Ratings)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((product) => (
              <ProductCardRefined key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* V2 Card */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">V2 Product Cards (Improved)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((product) => (
              <ProductCardV2 key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Modern Card - Default */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Modern Product Cards (Default)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCardModern key={product.id} product={product} variant="default" />
            ))}
          </div>
        </section>

        {/* Modern Card - Minimal */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Modern Product Cards (Minimal)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((product) => (
              <ProductCardModern key={product.id} product={product} variant="minimal" />
            ))}
          </div>
        </section>

        {/* Modern Card - Detailed */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Modern Product Cards (Detailed)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCardModern key={product.id} product={product} variant="detailed" />
            ))}
          </div>
        </section>

        {/* Full Grid Demo */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Modern Product Grid</h2>
          <ProductGridModern products={products} />
        </section>
      </div>
    </div>
  )
}