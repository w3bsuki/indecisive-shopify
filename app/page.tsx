import { Suspense } from 'react'
import { getCart, addToCart } from './actions/cart'
import { 
  getCategories, 
  getBestSellers, 
  getEssentialsProducts, 
  getStreetwearProducts 
} from './data/products'
import { HeroSection } from '@/components/hero-section'
import { CategorySection } from '@/components/category-section'
import { ProductSection } from '@/components/product-section'
import { NewsletterSection } from '@/components/newsletter-section'
import { Footer } from '@/components/footer'
import { MobileNavigation } from '@/components/mobile-navigation'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'
import { SocialMediaFeed } from '@/components/social-media-feed'

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

      {/* Social Media Section */}
      <section className="py-6 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
            <SocialMediaFeed title="COMMUNITY STYLE" showHeader={true} maxPosts={8} />
          </Suspense>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
