import { getProducts } from '@/lib/shopify/api'
import { ProductCardServer } from '@/components/commerce/product-card-server'
import { NoProductsFound } from './page-client'
import { ProductsPromoBanner } from '@/components/commerce/products-promo-banner'
import { BreadcrumbStructuredData } from '@/components/layout/breadcrumb-navigation'
import { ProductFiltersAdvanced } from '@/components/commerce/product-filters-advanced'
import { getTranslations } from 'next-intl/server'

export const metadata = {
  title: 'All Products | Indecisive Wear',
  description: 'Browse our complete collection of fashion for the indecisive.',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    sort?: string
    category?: string
    colors?: string
    sizes?: string
    availability?: string
    minPrice?: string
    maxPrice?: string
  }>
}) {
  // Get translations
  const t = await getTranslations('products')
  const params = await searchParams
  
  // Debug: Log received params (remove in production)
  console.log('Products page received params:', params)
  
  // Build Shopify search query from filters
  let searchQuery = ''
  const queryParts: string[] = []
  
  // Category filter - using product_type
  if (params.category) {
    queryParts.push(`product_type:${params.category}`)
  }
  
  // Note: Shopify's search API has limitations. Complex filters like price ranges,
  // colors, and sizes need to be handled differently or filtered client-side
  // For now, we'll use basic category filtering and handle the rest in post-processing
  
  // Combine query parts
  searchQuery = queryParts.join(' ')
  
  // Fetch products with search query
  const productsData = await getProducts(100, searchQuery) // Get more products for filtering
  let products = productsData.edges.map(edge => edge.node)
  
  // Apply client-side filtering for features not supported by Shopify search
  
  // Price range filter
  if (params.minPrice || params.maxPrice) {
    const minPrice = parseFloat(params.minPrice || '0')
    const maxPrice = parseFloat(params.maxPrice || '999999')
    products = products.filter(product => {
      const price = parseFloat(product.priceRange.minVariantPrice.amount)
      return price >= minPrice && price <= maxPrice
    })
  }
  
  // Color filter
  if (params.colors) {
    const selectedColors = params.colors.split(',').map(c => c.toLowerCase())
    products = products.filter(product => {
      // Check if any variant has the selected color
      return product.variants?.edges?.some(edge => {
        const variant = edge.node
        return variant.selectedOptions?.some(option => 
          option.name.toLowerCase() === 'color' && 
          selectedColors.includes(option.value.toLowerCase())
        )
      })
    })
  }
  
  // Size filter
  if (params.sizes) {
    const selectedSizes = params.sizes.split(',').map(s => s.toUpperCase())
    products = products.filter(product => {
      // Check if any variant has the selected size
      return product.variants?.edges?.some(edge => {
        const variant = edge.node
        return variant.selectedOptions?.some(option => 
          option.name.toLowerCase() === 'size' && 
          selectedSizes.includes(option.value.toUpperCase())
        )
      })
    })
  }
  
  // Availability filter
  if (params.availability) {
    const availabilityTypes = params.availability.split(',')
    if (availabilityTypes.includes('in-stock')) {
      products = products.filter(product => product.availableForSale)
    }
  }
  
  // Apply sorting
  if (params.sort) {
    products = [...products]
    switch (params.sort) {
      case 'price-asc':
        products.sort((a, b) => 
          parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount)
        )
        break
      case 'price-desc':
        products.sort((a, b) => 
          parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount)
        )
        break
      case 'name-asc':
        products.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'name-desc':
        products.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'created-desc':
        // Keep default order (newest first)
        break
    }
  }

  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: t('breadcrumb.home'), href: '/' },
    { label: t('breadcrumb.collections'), href: '/products' },
    { label: t('breadcrumb.allProducts'), href: '#', current: true }
  ]

  return (
    <div>
      {/* Structured Data for SEO */}
      <BreadcrumbStructuredData items={breadcrumbItems} />
      
      {/* Simple Promotional Banner */}
      <ProductsPromoBanner />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold font-mono mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="font-mono text-sm text-gray-600">
              {t('itemCount', { count: products.length })}
              {(searchQuery || params.sort || params.minPrice || params.maxPrice || params.colors || params.sizes || params.availability) && (
                <span className="ml-2 text-xs text-gray-500">
                  (filtered)
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Advanced Filters */}
        <ProductFiltersAdvanced />

        {/* Products Grid - Full Width */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 lg:gap-4">
            {products.map((product, index) => (
              <ProductCardServer 
                key={product.id} 
                product={product} 
                priority={index < 8} // Priority for first 8 products
              />
            ))}
          </div>
        ) : (
          <NoProductsFound />
        )}
      </div>
    </div>
  )
}