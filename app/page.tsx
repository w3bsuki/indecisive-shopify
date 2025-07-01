import Link from 'next/link'
import { getProducts } from '@/lib/shopify'
// import { HeroSection } from '@/components/layout/hero-section'
import { Hero2 } from '@/components/layout/hero-2'
import { ProductGrid } from '@/components/commerce/product-grid'
import { NewsletterSection } from '@/components/layout/newsletter-section'
import { Footer } from '@/components/layout/footer'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { DesktopNavigation } from '@/components/layout/desktop-navigation'
import { SearchButton } from '@/components/commerce/search-button'
import { CommunitySection } from '@/components/commerce/community-section'
import { ComingSoonCarousel } from '@/components/commerce/coming-soon-carousel'
import { ErrorRefreshButton } from '@/components/ui/error-refresh-button'

export default async function HomePage() {
  // Fetch data from Shopify with error handling
  try {
    const productsData = await getProducts(12)

    const products = productsData.edges.map(edge => edge.node)

    return (
    <div className="min-h-screen bg-white font-mono">
      {/* Desktop Navigation */}
      <DesktopNavigation />
      
      {/* Enhanced Mobile Navigation */}
      <MobileNavigation />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Hero Section - no margin needed, hero handles its own positioning */}
      {/* <HeroSection /> */}
      <Hero2 />

      {/* DROP 1: ХУЛИГАНКА */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 font-mono tracking-wide">DROP 1: ХУЛИГАНКА</h2>
            <p className="text-gray-600">Limited edition bucket hats for the indecisive</p>
            
            {/* Search Button */}
            <div className="flex justify-center mt-6">
              <SearchButton />
            </div>
          </div>
          
          <ProductGrid products={products} />
          
          {/* View All Link */}
          <div className="text-center mt-8">
            <Link href="/new" className="inline-flex items-center gap-2 font-mono font-medium text-sm hover:underline">
              VIEW ENTIRE DROP
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Section with Instagram/TikTok Tabs */}
      <CommunitySection />

      {/* Coming Soon Carousel */}
      <ComingSoonCarousel />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Footer */}
      <Footer />
    </div>
  )
  } catch (_error) {
    // Fallback UI when data fetching fails
    return (
      <div className="min-h-screen bg-white font-mono">
        <DesktopNavigation />
        <MobileNavigation />
        <MobileBottomNav />
        
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