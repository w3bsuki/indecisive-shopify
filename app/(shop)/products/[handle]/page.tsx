import { Suspense } from 'react'
import { getProduct, getProducts } from '@/lib/shopify'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ProductImageGallery } from '@/components/commerce/product-image-gallery'
import { AddToCartForm } from '@/components/commerce/add-to-cart-form'
// import { ProductInfo } from '@/components/commerce/product-info'
import { ProductCardMinimalServer } from '@/components/commerce/product-card-minimal-server'
// import { MobileProductLayoutV2 } from './mobile-product-layout-v2'
import { RecentlyViewedSection } from '@/components/commerce/recently-viewed-section'
import { ProductTabs } from '@/components/commerce/product-tabs'
import { ProductPageClient } from './product-page-client'
import { ProductDetailsSection } from '@/components/commerce/product-details-section'
import { ProductInfoWrapper } from '@/components/commerce/product-info-wrapper'
import { ArrowLeft, Truck, RotateCcw, Shield } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { BreadcrumbNavigation, BreadcrumbStructuredData } from '@/components/layout/breadcrumb-navigation'
import { BreadcrumbHelpers } from '@/lib/breadcrumb-helpers'
import { getCategoryTranslationKey } from '@/lib/translate-category'

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
  const product = await getProduct(handle)

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
  const product = await getProduct(handle)
  const t = await getTranslations('products')
  const tc = await getTranslations('common')
  const tf = await getTranslations('products.filters.category')
  
  if (!product) {
    notFound()
  }

  // Get related products
  const relatedProductsData = await getProducts(8)
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
  
  const breadcrumbItems = BreadcrumbHelpers.product(
    product.title,
    translatedCategory || categoryTag || undefined,
    undefined // No vendor field available
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
          <div className="hidden md:flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-black truncate">{product.title}</h1>
                <span className="text-sm text-gray-600 whitespace-nowrap">Premium collection</span>
              </div>
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

      <div className="min-h-screen bg-white">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto md:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="md:sticky md:top-20 md:self-start px-4 md:px-0">
              <Suspense fallback={
                <div className="aspect-square bg-gray-100 animate-pulse" />
              }>
                <ProductImageGallery 
                  images={images} 
                  productTitle={product.title} 
                />
              </Suspense>
            </div>

            {/* Product Details */}
            <div className="px-4 md:px-0 pb-6 md:pb-6">
              {/* Enhanced Product Info with ratings and inventory */}
              <ProductInfoWrapper product={product} />
              
              {/* Add to Cart Form */}
              <div className="mt-6">
                <AddToCartForm product={product} showProductInfo={false} />
              </div>

              {/* Product Benefits - Compact Horizontal */}
              <div className="flex items-center justify-around py-4 mt-6 border-y text-sm">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span className="hidden sm:inline">Free Shipping</span>
                  <span className="sm:hidden">Free Ship</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>30 Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Secure Payment</span>
                  <span className="sm:hidden">Secure</span>
                </div>
              </div>

              {/* Product Information - Mobile Tabs, Desktop Collapsible */}
              <div className="mt-8">
                {/* Mobile: Enhanced Tabs */}
                <div className="md:hidden">
                  <ProductTabs description={product.description} />
                </div>

                {/* Desktop: Product Details with Metafields */}
                <div className="hidden md:block">
                  <ProductDetailsSection 
                    product={product} 
                    description={product.description}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed Products */}
      <RecentlyViewedSection />
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-8 md:mt-12 border-t">
          <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
            <h2 className="text-lg md:text-xl font-medium mb-4 md:mb-6 text-gray-800">{t('youMayAlsoLike')}</h2>
            
            {/* Mobile: Horizontal scroll */}
            <div className="md:hidden -mx-4">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 snap-x snap-mandatory">
                {relatedProducts.map((product) => (
                  <div key={product.id} className="flex-none snap-start" style={{ width: 'calc(50% - 4px)' }}>
                    <ProductCardMinimalServer product={product} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Grid */}
            <div className="hidden md:grid grid-cols-4 gap-4">
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