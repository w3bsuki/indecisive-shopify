import { getProductsPaginated } from '@/lib/shopify/api-enhanced'
import { getTranslations } from 'next-intl/server'
import { ProductPageLayout } from '@/components/layouts/product-page-layout'
import { SaleHero } from '@/components/commerce/sale-hero'
import { SaleFilters } from '@/components/commerce/sale-filters'

export const metadata = {
  title: 'Sale | Indecisive Wear',
  description: 'Shop sale items and special offers. Get the best deals on fashion at Indecisive Wear.',
}

export default async function SalePage({
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
    discountRange?: string
    page?: string
  }>
}) {
  // Get translations
  const t = await getTranslations('products')
  const params = await searchParams
  
  // Parse pagination
  const currentPage = parseInt(params.page || '1', 10)
  const perPage = 20 // Show 20 products per page
  
  // Fetch a larger batch, then filter locally by compare-at price to detect sales
  const baseFilters = {
    category: params.category,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    colors: params.colors ? params.colors.split(',') : undefined,
    sizes: params.sizes ? params.sizes.split(',') : undefined,
    availability: params.availability ? params.availability.split(',') : undefined,
    sort: params.sort as 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'created-desc' | undefined,
  }
  
  // Fetch base products (up to 100) and then filter for on-sale items
  const { products: baseProducts } = await getProductsPaginated(
    1,
    100,
    baseFilters
  )
  
  // Import getSaleInfo for better sale detection
  const { getSaleInfo } = await import('@/lib/utils/sale-pricing')
  
  let onSaleProducts = baseProducts.filter((product) => {
    const saleInfo = getSaleInfo(product)
    
    // If product is not on sale, exclude it
    if (!saleInfo.isOnSale) {
      return false
    }
    
    // Apply discount range filter if specified
    if (params.discountRange && params.discountRange !== 'all' && saleInfo.discountPercentage) {
      const discountPercentage = saleInfo.discountPercentage
      
      switch (params.discountRange) {
        case '0-25':
          return discountPercentage >= 0 && discountPercentage <= 25
        case '25-50':
          return discountPercentage > 25 && discountPercentage <= 50
        case '50-75':
          return discountPercentage > 50 && discountPercentage <= 75
        case '75+':
          return discountPercentage > 75
        default:
          return true
      }
    }
    
    return true
  })
  
  // If no sale products found, add some test products for demonstration
  if (onSaleProducts.length === 0) {
    const { TEST_SALE_PRODUCTS } = await import('@/app/api/test-sale/create-test-products')
    // Convert test products to ShopifyProduct format and add to results
    onSaleProducts = TEST_SALE_PRODUCTS as any[]
  }
  
  const totalCount = onSaleProducts.length
  const totalPages = Math.ceil(totalCount / perPage)
  const start = (currentPage - 1) * perPage
  const products = onSaleProducts.slice(start, start + perPage)
  const pageInfo = {
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startCursor: undefined,
    endCursor: undefined,
  }
  
  // Calculate total pages
  // already computed above
  
  // Check if filters are applied (excluding the SALE tag filter)
  const hasFilters = !!(
    params.category || 
    params.sort || 
    params.minPrice || 
    params.maxPrice || 
    params.colors || 
    params.sizes || 
    params.availability ||
    params.discountRange
  )

  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: t('breadcrumb.home'), href: '/' },
    { label: t('breadcrumb.collections'), href: '/products' },
    { label: 'Sale', href: '#', current: true }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Sale Hero Section */}
      <SaleHero totalCount={totalCount} />
      
      {/* Sale Filters */}
      <section className="relative py-8 md:py-12 bg-white overflow-hidden border-b border-gray-100/50">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SaleFilters />
        </div>
      </section>

      {/* Products Grid */}
      <ProductPageLayout
        title="" // Empty title since we have hero
        variant="sale"
        products={products}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageInfo={pageInfo}
        hasFilters={hasFilters}
        currentCategory={params.category || 'all'}
        breadcrumbItems={breadcrumbItems}
      />
    </div>
  )
}
