import { Suspense } from 'react'
import { getCart, addToCart } from './actions/cart'
import { 
  getCategories, 
  getBestSellers, 
  getEssentialsProducts, 
  getStreetwearProducts 
} from './data/products'
import { HeroSection } from '@/components/layout/hero-section'
import { CategorySection } from '@/components/commerce/category-section'
import { ProductSection } from '@/components/commerce/product-section'
import { NewsletterSection } from '@/components/layout/newsletter-section'
import { Footer } from '@/components/layout/footer'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'

export default async function HomePage() {
  // Fetch data in parallel
  const [cart, categories, bestSellers, essentials, streetwear] = await Promise.all([
    getCart(),
    getCategories(),
    getBestSellers(),
    getEssentialsProducts(),
    getStreetwearProducts()
  ])


  return (
    <div className="min-h-screen bg-white font-mono">
      {/* Enhanced Mobile Navigation */}
      <MobileNavigation cartCount={cart.count} />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav cartCount={cart.count} wishlistCount={3} />

      {/* Hero Section */}
      <HeroSection />

      {/* Categories */}
      <CategorySection categories={categories} />

      {/* Best Sellers */}
      <ProductSection
        title="BEST SELLERS"
        subtitle="Most loved by our community"
        products={bestSellers}
        isDark={false}
        addToCartAction={addToCart}
      />

      {/* Essentials */}
      <ProductSection
        title="ESSENTIALS"
        subtitle="Minimalist pieces for the undecided"
        products={essentials}
        isDark={false}
        addToCartAction={addToCart}
      />

      {/* Streetwear */}
      <ProductSection
        title="STREETWEAR"
        subtitle="Urban pieces for the bold"
        products={streetwear}
        isDark={true}
        addToCartAction={addToCart}
      />

      {/* Community Section - Placeholder for future social features */}
      <section className="py-6 md:py-12 bg-gray-50">
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
