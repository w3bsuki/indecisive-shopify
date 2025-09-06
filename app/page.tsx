import Link from 'next/link'
import { getProducts } from '@/lib/shopify'
import { getTranslations } from 'next-intl/server'
import { Hero } from '@/components/layout/hero'
import { ProductCarousel } from '@/components/commerce/product-carousel'
import { ProductCardMinimalServer } from '@/components/commerce/product-card-minimal-server'
import { ClubSection } from '@/components/layout/club-section'
import { Footer } from '@/components/layout/footer'
import { Navigation } from '@/components/layout/navigation'
import { CommunityCarousel } from '@/components/commerce/community-carousel'
import { TshirtsCarousel } from '@/components/commerce/tshirts-carousel'
import { BagsCarousel } from '@/components/commerce/bags-carousel'
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

        {/* FEATURED DROP Section - Modern Seamless Style */}
        <section className="relative py-12 md:py-16 bg-white overflow-hidden">
          {/* Subtle background texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 to-transparent" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header - Modern Typography */}
            <div className="text-center mb-12">
              {/* Collection Label */}
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-12 h-px bg-black/30" />
                <span className="text-black/70 text-xs font-medium tracking-[0.2em] uppercase">
                  FEATURED
                </span>
                <div className="w-12 h-px bg-black/30" />
              </div>
              
              {/* Main Title */}
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-black mb-4 tracking-tight leading-[0.9]">
                {t('featured.subtitle')}
              </h2>
              
              {/* Description */}
              <p className="text-black/70 text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed">
                {t('featured.description')}
              </p>
            </div>
            
            {/* Mobile: Horizontal Carousel */}
            <div className="md:hidden mb-8">
              <ProductCarousel products={products} />
            </div>
            
            {/* Desktop: Modern Grid Layout */}
            <div className="hidden md:block mb-12">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
                {products.map((product, index) => (
                  <ProductCardMinimalServer 
                    key={product.id} 
                    product={product} 
                    priority={index < 4}
                    size="default"
                  />
                ))}
              </div>
            </div>
            
            {/* Modern Glass CTA Section */}
            <div className="text-center">
              <Link href="/products?category=bucket-hats">
                <button className="group inline-flex items-center gap-3 bg-black/10 backdrop-blur-md border border-black/20 text-black px-8 py-4 rounded-full font-medium text-sm tracking-wide hover:bg-black hover:text-white transition-all duration-500">
                  <span>{t('featured.viewAll')}</span>
                  <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                </button>
              </Link>
              <p className="mt-4 text-sm font-light text-black/60">
                {tp('viewAllCount', { count: productsData.edges.length > 8 ? `${productsData.edges.length}+` : productsData.edges.length })}
              </p>
            </div>
            
          </div>
        </section>

        {/* T-shirts Section */}
        <TshirtsCarousel />

        {/* Bags Section */}
        <BagsCarousel />

        {/* Community Section with Instagram/TikTok Tabs */}
        <CommunityCarousel />

        {/* Club Section */}
        <ClubSection />

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