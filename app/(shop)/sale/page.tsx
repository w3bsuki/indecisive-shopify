import { getProductsPaginated } from '@/lib/shopify/api-enhanced'
import { getTranslations } from 'next-intl/server'
import { ProductPageLayout } from '@/components/layouts/product-page-layout'

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
    page?: string
  }>
}) {
  // Get translations
  const t = await getTranslations('products')
  const nav = await getTranslations('nav')
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
  
  const onSaleProducts = baseProducts.filter((product) => {
    const minPrice = parseFloat(product.priceRange?.minVariantPrice?.amount || '0')
    const maxCompareAt = parseFloat(product.compareAtPriceRange?.maxVariantPrice?.amount || '0')
    return !!(maxCompareAt && minPrice && maxCompareAt > minPrice)
  })
  
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
    params.availability
  )

  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: t('breadcrumb.home'), href: '/' },
    { label: t('breadcrumb.collections'), href: '/products' },
    { label: 'Sale', href: '#', current: true }
  ]

  return (
    <ProductPageLayout
      title={nav('sale')}
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
  )
}
