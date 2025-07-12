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
import { Badge } from '@/components/ui/badge'

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
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with Modern Typography */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-xs font-mono font-bold px-3 py-1 border-black">
              {t('featured.title')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-tight text-center">
              {t('featured.subtitle')}
            </h2>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
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
              href="/products" 
              className="inline-flex items-center gap-2 font-mono font-medium text-sm hover:underline"
            >
              {tp('viewAll')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
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