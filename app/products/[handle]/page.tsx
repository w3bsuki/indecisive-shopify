import { Suspense } from 'react'
import { getProduct, getProducts } from '@/lib/shopify'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ProductImageGallery } from '@/components/commerce/product-image-gallery'
import { AddToCartForm } from '@/components/commerce/add-to-cart-form'
import { ProductTabs } from '@/components/commerce/product-tabs'
import { ProductGrid } from '@/components/commerce/product-grid'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

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

  // Get related products (just fetch some products for now)
  const relatedProductsData = await getProducts(4)
  const relatedProducts = relatedProductsData.edges
    .map(edge => edge.node)
    .filter(p => p.handle !== product.handle)
    .slice(0, 4)

  // Prepare images for gallery
  const images = product.images?.edges.map(edge => edge.node) || 
    (product.featuredImage ? [product.featuredImage] : [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-black transition-colors">
          Products
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-black font-medium">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <Suspense fallback={<div className="aspect-square bg-gray-100 animate-pulse rounded-lg" />}>
          <ProductImageGallery 
            images={images} 
            productTitle={product.title} 
          />
        </Suspense>

        {/* Product Details */}
        <div className="space-y-6">
          <AddToCartForm product={product} />
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">SKU:</span>
              <span className="text-gray-600">{product.id.split('/').pop()}</span>
            </div>
            {product.tags && product.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Categories:</span>
                <span className="text-gray-600">{product.tags.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12">
        <ProductTabs description={product.description} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <Suspense fallback={
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          }>
            <ProductGrid products={relatedProducts} />
          </Suspense>
        </div>
      )}
    </div>
  )
}