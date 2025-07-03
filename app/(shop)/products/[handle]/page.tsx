import { Suspense } from 'react'
import { getProduct, getProducts } from '@/lib/shopify'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ProductImageGallery } from '@/components/commerce/product-image-gallery'
import { AddToCartForm } from '@/components/commerce/add-to-cart-form'
import { ProductInfo } from '@/components/commerce/product-info'
import { ProductCardMinimalServer } from '@/components/commerce/product-card-minimal-server'
import { RecentlyViewedSection } from '@/components/commerce/recently-viewed-section'
import { ProductTabs } from '@/components/commerce/product-tabs'
import { ProductPageClient } from './product-page-client'
import Link from 'next/link'
import { ArrowLeft, Truck, RotateCcw, Shield } from 'lucide-react'

interface ProductPageProps {
  params: Promise<{ handle: string }>
}

// Generate static paths for all products at build time
export async function generateStaticParams() {
  const products = await getProducts(100) // Fetch up to 100 products
  
  return products.edges.map(({ node }) => ({
    handle: node.handle,
  }))
}

// Revalidate product pages every hour to keep them fresh
export const revalidate = 3600 // 1 hour

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

  return (
    <>
      {/* Client-side tracking and mobile footer */}
      <ProductPageClient product={product} />
      
      <div className="pt-20 md:pt-8">
        {/* Breadcrumb Navigation with Return Arrow */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link 
              href="/products"
              className="flex items-center gap-1 hover:text-black transition-colors"
              aria-label="Back to products"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link href="/" className="hover:text-black transition-colors font-medium">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="hover:text-black transition-colors font-medium">
              All Products
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-black font-medium">{product.title}</span>
          </nav>
          
          {/* Product Header - Desktop Only */}
          <div className="hidden md:flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-black">{product.title}</h1>
              <p className="text-sm text-gray-600">Premium collection</p>
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
            {/* Product Images - Full width on mobile */}
            <div className="md:sticky md:top-20 md:self-start">
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
            <div className="px-4 md:px-0 py-6 md:py-0 pb-8 md:pb-6">
              {/* Product Info */}
              <ProductInfo product={product} />
              
              {/* Add to Cart Form */}
              <div className="mt-6">
                <AddToCartForm product={product} showProductInfo={false} />
              </div>

              {/* Product Benefits */}
              <div className="grid grid-cols-3 gap-4 mt-8 py-6 border-t">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-xs">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders over $50</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-xs">Easy Returns</p>
                  <p className="text-xs text-gray-600">30 days return</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-xs">Secure Payment</p>
                  <p className="text-xs text-gray-600">100% secure</p>
                </div>
              </div>

              {/* Product Information - Mobile Tabs, Desktop Collapsible */}
              <div className="mt-8">
                {/* Mobile: Enhanced Tabs */}
                <div className="md:hidden">
                  <ProductTabs description={product.description} />
                </div>

                {/* Desktop: Collapsible Sections */}
                {product.description && (
                  <div className="hidden md:block space-y-4">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer py-4 border-t">
                        <span className="font-medium">Description</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <div className="pb-6 text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                        <div className="prose prose-sm md:prose-base max-w-none">
                          {product.description}
                        </div>
                      </div>
                    </details>

                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer py-4 border-t">
                        <span className="font-medium">Shipping & Returns</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <div className="pb-6 text-sm md:text-base text-gray-700 leading-relaxed space-y-3">
                        <p>• Free standard shipping on orders over $50</p>
                        <p>• Express shipping available at checkout</p>
                        <p>• 30-day return policy</p>
                        <p>• Items must be unworn with tags attached</p>
                      </div>
                    </details>

                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer py-4 border-t">
                        <span className="font-medium">Size Guide</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <div className="pb-6 text-sm md:text-base text-gray-700 leading-relaxed">
                        <p className="mb-4">Bucket hats run true to size.</p>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Size</th>
                              <th className="text-center py-2">Head Circumference</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-2">S/M</td>
                              <td className="text-center py-2">56-58 cm</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">L/XL</td>
                              <td className="text-center py-2">58-60 cm</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </details>
                  </div>
                )}
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
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">You May Also Like</h2>
              
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
      </div>
    </>
  )
}