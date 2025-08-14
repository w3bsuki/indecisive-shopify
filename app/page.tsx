import Link from 'next/link'
import { getProducts } from '@/lib/shopify'
import { getTranslations } from 'next-intl/server'
import { Hero } from '@/components/layout/hero'
import { ProductCarousel } from '@/components/commerce/product-carousel'
import { ProductCardMinimalServer } from '@/components/commerce/product-card-minimal-server'
import { NewsletterSection } from '@/components/layout/newsletter-section'
import { Footer } from '@/components/layout/footer'
import { Navigation } from '@/components/layout/navigation'
import { CommunityCarousel } from '@/components/commerce/community-carousel'
import { TshirtsCarousel } from '@/components/commerce/tshirts-carousel'
import { ErrorRefreshButton } from '@/components/ui/error-refresh-button'

export default async function HomePage() {
  // Get translations for the home page
  const t = await getTranslations('home')
  const tp = await getTranslations('products')
  
  // Fetch data from Shopify with error handling
  try {
    const productsData = await getProducts(8) // Reduced to 8 featured products

    const products = productsData.edges.map(edge => edge.node)

    return (
    <div className="min-h-screen-dynamic bg-white font-mono">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero />

      {/* FEATURED DROP Section - Enhanced for 2025 */}
      <section className="py-12 md:py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with Modern Typography */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-handwritten text-black mb-6 transform -rotate-1 relative inline-block">
              {t('featured.subtitle')}
              {/* Rough underline effect */}
              <svg className="absolute -bottom-3 left-0 w-full" height="8" viewBox="0 0 300 8" preserveAspectRatio="none">
                <path 
                  d="M0,4 Q75,2 150,4 T300,4" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none"
                  className="text-black"
                  style={{ strokeDasharray: '0', strokeLinecap: 'round' }}
                />
              </svg>
            </h2>
            <p className="text-gray-700 text-sm md:text-base font-medium max-w-xl mx-auto">
              {t('featured.description')}
            </p>
          </div>
          
          {/* Mobile: Horizontal Carousel */}
          <div className="md:hidden">
            <ProductCarousel products={products} />
          </div>
          
          {/* Desktop: Grid Layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product, index) => (
                <ProductCardMinimalServer 
                  key={product.id} 
                  product={product} 
                  priority={index < 4}
                  size="large"
                />
              ))}
            </div>
          </div>
          
          {/* Enhanced CTA Section */}
          <div className="mt-8 md:mt-12 text-center">
            <Link 
              href="/products?category=bucket-hats" 
              className="inline-flex items-center gap-3 px-6 py-3 bg-black text-white font-mono font-bold text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors"
            >
              VIEW ALL HATS
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="mt-4 text-xs font-mono text-gray-600 uppercase tracking-wide">
              {tp('viewAllCount', { count: productsData.edges.length > 8 ? `${productsData.edges.length}+` : productsData.edges.length })}
            </p>
          </div>
        </div>
      </section>

      {/* T-shirts Section */}
      <TshirtsCarousel />

      {/* Community Section with Instagram/TikTok Tabs */}
      <CommunityCarousel />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Footer */}
      <Footer />
    </div>
  )
  } catch (_error) {
    // Fallback UI when data fetching fails
    return (
      <div className="min-h-screen-dynamic bg-white font-mono">
        <Navigation />
        
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">We&apos;re having trouble loading the products. Please try refreshing the page.</p>
            <ErrorRefreshButton />
          </div>
        </div>
        
        <Footer />
      </div>
    )
  }
}