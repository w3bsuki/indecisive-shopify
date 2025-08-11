import { getProducts } from '@/lib/shopify'
import Link from 'next/link'
import { ModernHero } from '@/components/demo/modern-hero'
import { FeaturesBanner } from '@/components/demo/features-banner'
import { CollectionShowcase } from '@/components/demo/collection-showcase'
import { ProductGridModern } from '@/components/demo/product-grid-modern'

export default async function DemoPage() {
  try {
    const productsData = await getProducts(12)
    const products = productsData.edges.map(edge => edge.node)

    return (
      <div className="min-h-screen bg-white">
        {/* Modern Hero Section */}
        <ModernHero />
        
        {/* E-commerce Features Banner */}
        <FeaturesBanner />
        
        {/* Collection Showcase */}
        <CollectionShowcase />
        
        {/* Product Grid with Modern Styling */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-16 text-center">
              <p className="text-sm font-medium tracking-[0.2em] text-gray-500 uppercase mb-3">
                New Arrivals
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
                Latest Collection
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our carefully curated selection of premium fashion pieces
              </p>
            </div>
            
            <ProductGridModern products={products} />
            
            <div className="mt-16 text-center">
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-gray-900 hover:text-gray-600 transition-colors group"
              >
                View All Products
                <svg 
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  } catch (_error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-light mb-4">Something went wrong</h1>
            <p className="text-gray-600">Please refresh the page to try again.</p>
          </div>
        </div>
      </div>
    )
  }
}