import { Suspense } from 'react'
import { getProducts, getCollections } from '@/lib/shopify'
import { HeroSection } from '@/components/layout/hero-section'
import { CategorySection } from '@/components/commerce/category-section'
import { ProductGrid } from '@/components/commerce/product-grid'
import { NewsletterSection } from '@/components/layout/newsletter-section'
import { Footer } from '@/components/layout/footer'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { ProductSkeleton } from '@/components/commerce/product-skeleton'

export default async function HomePage() {
  // Fetch data from Shopify
  const [collections, productsData] = await Promise.all([
    getCollections(10),
    getProducts(12)
  ])

  const products = productsData.edges.map(edge => edge.node)

  return (
    <div className="min-h-screen bg-white font-mono">
      {/* Enhanced Mobile Navigation */}
      <MobileNavigation />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Hero Section */}
      <HeroSection />

      {/* Categories */}
      <section className="py-6 md:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">SHOP BY CATEGORY</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {collections.edges.slice(0, 4).map(({ node: collection }) => (
              <a
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group relative aspect-square overflow-hidden bg-gray-100 rounded-lg"
              >
                {collection.image && (
                  <img
                    src={collection.image.url}
                    alt={collection.image.altText || collection.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-lg md:text-xl font-bold text-center px-4">
                    {collection.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-6 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">FEATURED PRODUCTS</h2>
          <p className="text-gray-600 text-center mb-8">Curated for the indecisive</p>
          
          <Suspense fallback={<ProductSkeleton count={12} />}>
            <ProductGrid products={products} />
          </Suspense>
        </div>
      </section>

      {/* Community Section - Placeholder for future social features */}
      <section className="py-6 md:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">COMMUNITY STYLE</h2>
          <p className="text-gray-600 mb-8">Coming soon - showcase your style with #IndecisiveWear</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">Coming Soon</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}