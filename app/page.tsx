import Image from 'next/image'
import { getProducts, getCollections } from '@/lib/shopify'
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
import { ErrorRefreshButton } from '@/components/ui/error-refresh-button'

export default async function HomePage() {
  // Fetch data from Shopify with error handling
  try {
    const [collections, productsData] = await Promise.all([
      getCollections(10),
      getProducts(12)
    ])

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

      {/* Categories */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="px-3 sm:px-6 lg:px-8 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center">SHOP BY CATEGORY</h2>
          </div>
          
          {/* Horizontal Scrolling Categories */}
          <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth">
            <div className="flex gap-4 px-3 sm:px-6 lg:px-8 pb-2">
              {collections.edges.map(({ node: collection }) => (
                <a
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className="group relative flex-shrink-0 w-48 md:w-56 aspect-[4/5] overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-black transition-all duration-300 snap-start"
                >
                  {collection.image ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 200px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <div className="text-2xl mb-2">📁</div>
                        <div className="text-sm">No Image</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Sharp overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  
                  {/* Category title */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 group-hover:border-black transition-all duration-300">
                    <div className="p-4">
                      <h3 className="font-bold text-sm md:text-base text-center text-black group-hover:text-black transition-colors duration-300">
                        {collection.title.toUpperCase()}
                      </h3>
                      {collection.description && (
                        <p className="text-xs text-gray-600 text-center mt-1 line-clamp-2">
                          {collection.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
              
              {/* View All Categories Card */}
              <a
                href="/collections"
                className="group relative flex-shrink-0 w-48 md:w-56 aspect-[4/5] border-2 border-dashed border-gray-300 hover:border-black transition-all duration-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 snap-start"
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 border-2 border-gray-300 group-hover:border-black transition-colors duration-300 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-sm text-gray-600 group-hover:text-black transition-colors duration-300">
                    VIEW ALL
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Explore everything
                  </p>
                </div>
              </a>
            </div>
          </div>
          
          {/* Scroll hint */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">← Scroll to explore categories →</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-6 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">FEATURED PRODUCTS</h2>
          <p className="text-gray-600 text-center mb-4">Curated for the indecisive</p>
          
          {/* Search Button */}
          <div className="flex justify-center mb-8">
            <SearchButton />
          </div>
          
          <ProductGrid products={products} />
        </div>
      </section>

      {/* Community Section with Instagram/TikTok Tabs */}
      <CommunitySection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Footer */}
      <Footer />
    </div>
  )
  } catch (error) {
    console.error('❌ HomePage: Data fetch failed:', error)
    
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