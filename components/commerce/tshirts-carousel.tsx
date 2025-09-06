import { getProductsPaginated } from '@/lib/shopify/api-enhanced'
import { ProductCarousel } from '@/components/commerce/product-carousel'
import { ProductCardMinimalServer } from '@/components/commerce/product-card-minimal-server'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export async function TshirtsCarousel() {
  const t = await getTranslations('home')
  const tp = await getTranslations('products')
  const tn = await getTranslations('nav')
  
  try {
    // Fetch T-shirt products with proper tag filtering including crop tops
    const { products } = await getProductsPaginated(1, 12, {
      tags: ['tshirt', 't-shirt', 'tshirts', 't-shirts', 'tee', 'tees', 'crop top', 'crop-top', 'croptop']
    })
    
    // If no T-shirts found, show a message
    if (products.length === 0) {
      return (
        <section className="relative py-12 md:py-16 bg-white overflow-hidden">
          {/* Subtle background texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/20 to-transparent" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-12 h-px bg-black/30" />
                <span className="text-black/70 text-xs font-medium tracking-[0.2em] uppercase">{tn('tshirts')}</span>
                <div className="w-12 h-px bg-black/30" />
              </div>
              
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-black mb-4 tracking-tight leading-[0.9]">
                {t('tshirts.title')}
              </h2>
              
              <p className="text-black/70 text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed mb-8">
                {t('tshirts.emptyMessage')}
              </p>
              
              <Link href="/products">
                <button className="group inline-flex items-center gap-3 bg-black/10 backdrop-blur-md border border-black/20 text-black px-8 py-4 rounded-full font-medium text-sm tracking-wide hover:bg-black hover:text-white transition-all duration-500">
                  <span>{t('tshirts.browseAll')}</span>
                  <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </section>
      )
    }
    
    return (
      <section className="relative py-12 md:py-16 bg-white overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/20 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header - Modern Typography */}
          <div className="text-center mb-12">
            {/* Collection Label */}
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-px bg-black/30" />
              <span className="text-black/70 text-xs font-medium tracking-[0.2em] uppercase">{tn('tshirts')}</span>
              <div className="w-12 h-px bg-black/30" />
            </div>
            
            {/* Main Title */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-black mb-4 tracking-tight leading-[0.9]">
              {t('tshirts.title')}
            </h2>
            
            {/* Description */}
            <p className="text-black/70 text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed">
              {t('tshirts.subtitle')}
            </p>
          </div>
          
          {/* Mobile: Horizontal Carousel */}
          <div className="md:hidden mb-8">
            <ProductCarousel products={products} />
          </div>
          
          {/* Desktop: Modern Grid Layout */}
          <div className="hidden md:block mb-12">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
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
          
          {/* Modern Glass CTA Section */}
          <div className="text-center">
            <Link href="/products?category=tees">
              <button className="group inline-flex items-center gap-3 bg-black/10 backdrop-blur-md border border-black/20 text-black px-8 py-4 rounded-full font-medium text-sm tracking-wide hover:bg-black hover:text-white transition-all duration-500">
                <span>{t('tshirts.viewAll')}</span>
                <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
              </button>
            </Link>
            <p className="mt-4 text-sm font-light text-black/60">
              👕 {tp('viewAllCount', { count: products.length > 8 ? `${products.length}+` : products.length })}
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
