import { getProductsPaginated } from '@/lib/shopify/api-enhanced'
import { ProductCarousel } from '@/components/commerce/product-carousel'
import { ProductCardMinimalServer } from '@/components/commerce/product-card-minimal-server'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export async function TshirtsCarousel() {
  const t = await getTranslations('home')
  const tp = await getTranslations('products')
  
  try {
    // Fetch T-shirt products with proper tag filtering including crop tops
    const { products } = await getProductsPaginated(1, 12, {
      tags: ['tshirt', 't-shirt', 'tshirts', 't-shirts', 'tee', 'tees', 'crop top', 'crop-top', 'croptop']
    })
    
    // If no T-shirts found, show a message
    if (products.length === 0) {
      return (
        <section className="py-12 md:py-16 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-handwritten text-black mb-6 transform rotate-1">
                {t('tshirts.title')}
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto mb-8">
                {t('tshirts.emptyMessage')}
              </p>
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 font-mono font-medium text-sm hover:underline"
              >
                {t('tshirts.browseAll')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )
    }
    
    return (
      <section className="py-12 md:py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-handwritten text-black mb-6 transform rotate-1 relative inline-block">
              {t('tshirts.title')}
              {/* Rough underline effect */}
              <svg className="absolute -bottom-3 left-0 w-full" height="8" viewBox="0 0 300 8" preserveAspectRatio="none">
                <path 
                  d="M0,4 Q75,6 150,4 T300,4" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none"
                  className="text-black"
                  style={{ strokeDasharray: '0', strokeLinecap: 'round' }}
                />
              </svg>
            </h2>
            <p className="text-gray-700 text-sm md:text-base font-medium max-w-xl mx-auto">
              {t('tshirts.subtitle')}
            </p>
          </div>
          
          {/* Mobile: Horizontal Carousel */}
          <div className="md:hidden">
            <ProductCarousel products={products} />
          </div>
          
          {/* Desktop: Grid Layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {products.slice(0, 8).map((product, index) => (
                <ProductCardMinimalServer 
                  key={product.id} 
                  product={product} 
                  priority={index < 4}
                  size="large"
                />
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="mt-8 md:mt-12 text-center">
            <Link 
              href="/products?category=tshirts" 
              className="inline-flex items-center gap-3 px-6 py-3 bg-black text-white font-mono font-bold text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors"
            >
              {t('tshirts.viewAll')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="mt-4 text-xs font-mono text-gray-600 uppercase tracking-wide">
              {tp('viewAllCount', { count: products.length > 8 ? `${products.length}+` : products.length })}
            </p>
          </div>
        </div>
      </section>
    )
  } catch (_error) {
    // Return null if there's an error fetching products
    return null
  }
}