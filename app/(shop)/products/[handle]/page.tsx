import { Suspense } from 'react'
import { getProduct, getProducts } from '@/lib/shopify'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ProductImageGallery } from '@/components/commerce/product-image-gallery'
import { AddToCartForm } from '@/components/commerce/add-to-cart-form'
import { ProductCardMinimalServer } from '@/components/commerce/product-card-minimal-server'
import { RecentlyViewedSection } from '@/components/commerce/recently-viewed-section'
import { ProductTabs } from '@/components/commerce/product-tabs'
import { ProductPageClient } from './product-page-client'
import { ProductDetailsSection } from '@/components/commerce/product-details-section'
import { ProductRating } from '@/components/commerce/product-rating'
import { Money } from '@/components/commerce/money'
import { ArrowLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { BreadcrumbNavigation, BreadcrumbStructuredData } from '@/components/layout/breadcrumb-navigation'
import { BreadcrumbHelpers } from '@/lib/breadcrumb-helpers'
import { getCategoryTranslationKey } from '@/lib/translate-category'
import { getMarketFromCookies } from '@/lib/shopify/server-market'

interface ProductPageProps {
  params: Promise<{ handle: string }>
}

// Generate static paths for all products at build time
export async function generateStaticParams() {
  try {
    const products = await getProducts(100) // Fetch up to 100 products
    
    return products.edges.map(({ node }) => ({
      handle: node.handle,
    }))
  } catch (error) {
    console.error('Error generating static params:', error);
    return []
  }
}

// Revalidate product pages every hour to keep them fresh
export const revalidate = 3600 // 1 hour

// Import ProductImageGallery normally since dynamic imports with ssr: false don't work in server components

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params
  const market = await getMarketFromCookies()
  const product = await getProduct(handle, market)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.description,
    openGraph: {
      title: product.seo?.title || product.title,
      description: product.seo?.description || product.description,
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params
  const market = await getMarketFromCookies()
  const product = await getProduct(handle, market)
  const t = await getTranslations('products')
  const tc = await getTranslations('common')
  const tf = await getTranslations('products.filters.category')
  
  if (!product) {
    notFound()
  }

  // Get related products
  const relatedProductsData = await getProducts(8, undefined, market)
  const relatedProducts = relatedProductsData.edges
    .map(edge => edge.node)
    .filter(p => p.handle !== product.handle)
    .slice(0, 8)

  // Prepare images for gallery
  const images = product.images?.edges.map(edge => edge.node) || 
    (product.featuredImage ? [product.featuredImage] : [])

  // Generate breadcrumb items with translated category
  const categoryTag = product.tags?.[0]
  const translatedCategory = categoryTag ? tf(getCategoryTranslationKey(categoryTag)) : undefined
  
  const breadcrumbT = await getTranslations('products.breadcrumb')
  const breadcrumbItems = BreadcrumbHelpers.product(
    product.title,
    translatedCategory || categoryTag || undefined,
    undefined, // No vendor field available
    {
      home: breadcrumbT('home'),
      products: breadcrumbT('allProducts')
    }
  )

  return (
    <>
      {/* Structured Data for SEO */}
      <BreadcrumbStructuredData items={breadcrumbItems} />
      
      {/* Client-side tracking and mobile footer */}
      <ProductPageClient product={product} />
      
      <div className="pt-4 md:pt-6">
        {/* Professional Breadcrumb Navigation */}
        <BreadcrumbNavigation 
          items={breadcrumbItems}
          showBackButton={true}
          backButtonLabel={tc('backToProducts')}
          backButtonHref="/products"
          variant="compact"
        />
          
        {/* Product Header - Desktop Only */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-end justify-between">
            <div className="min-w-0 flex-1">
              {/* Category label */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-px bg-black/20" />
                {translatedCategory ? (
                  <span className="text-black/70 text-xs font-medium tracking-[0.2em] uppercase">{translatedCategory}</span>
                ) : null}
                <div className="w-8 h-px bg-black/20" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-light text-black tracking-tight leading-[0.95] truncate">
                {product.title}
              </h1>
            </div>
            
            {/* Product Navigation - Previous/Next placeholder for future */}
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50" disabled>
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50" disabled>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-white">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 to-transparent pointer-events-none" />
        {/* Main Content */}
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="md:sticky md:top-20 md:self-start">
              <div className="px-4 md:px-0">
                <Suspense fallback={
                  <div className="aspect-square bg-gray-50 animate-pulse rounded-2xl" />
                }>
                  <div className="rounded-2xl overflow-hidden border border-black/10 bg-white">
                    <ProductImageGallery 
                      images={images} 
                      productTitle={product.title} 
                    />
                  </div>
                </Suspense>
              </div>
            </div>

            {/* Product Details - Desktop */}
            <div className="hidden md:block px-4 md:px-0 py-6">
              {/* Product Info */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{product.title}</h1>
                  <ProductRating product={product} size="sm" />
                </div>
                
                {/* Price */}
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {product.priceRange.minVariantPrice.amount === product.priceRange.maxVariantPrice.amount ? (
                      <Money data={product.priceRange.minVariantPrice} />
                    ) : (
                      <>
                        <span className="text-base text-gray-600 font-normal">{t('priceFrom')}&nbsp;</span>
                        <Money data={product.priceRange.minVariantPrice} />
                      </>
                    )}
                  </p>
                </div>
                
                {/* Add to Cart Form */}
                <AddToCartForm product={product} showProductInfo={false} />

                {/* Product Details */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <ProductDetailsSection 
                    product={product} 
                    description={product.description}
                  />
                </div>
              </div>
            </div>


            {/* Mobile Content Above Bottom Sheet */}
            <div className="md:hidden px-4 py-4 pb-20">
              {/* Clean Mobile Product Info */}
              <div className="space-y-4">
                <div className="space-y-3 text-center">
                  {/* Category label */}
                  {translatedCategory ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-px bg-black/20" />
                      <span className="text-black/70 text-[10px] font-medium tracking-[0.25em] uppercase">{translatedCategory}</span>
                      <div className="w-8 h-px bg-black/20" />
                    </div>
                  ) : null}
                  <h1 className="text-2xl font-light text-black tracking-tight">{product.title}</h1>
                  <div className="flex justify-center">
                    <ProductRating product={product} size="sm" />
                  </div>
                </div>
                
                {/* Mobile Options Selector Only */}
                <div className="space-y-4">
                  {/* Size/Color selectors will be handled by AddToCartForm but hidden add to cart button */}
                  <div className="[&_.md\:flex]:!hidden">
                    <AddToCartForm product={product} showProductInfo={false} />
                  </div>
                </div>
                
                {/* Mobile Tabs for Details */}
                <div className="mt-4">
                  <ProductTabs description={product.description} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed Products - Compact */}
      <RecentlyViewedSection />
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-2 md:py-3">
            <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-900">{t('youMayAlsoLike')}</h2>
            
            {/* Mobile: Horizontal scroll */}
            <div className="md:hidden -mx-4">
              <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 snap-x snap-mandatory">
                {relatedProducts.slice(0, 6).map((product) => (
                  <div key={product.id} className="flex-none snap-start w-36">
                    <ProductCardMinimalServer product={product} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Grid */}
            <div className="hidden md:grid grid-cols-4 gap-3">
              {relatedProducts.slice(0, 4).map((product) => (
                <ProductCardMinimalServer key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
