import { getProductsPaginated } from '@/lib/shopify/api-enhanced'
import { getTranslations } from 'next-intl/server'
import { ProductPageLayout } from '@/components/layouts/product-page-layout'

export const metadata = {
  title: 'T-shirts | Indecisive Wear',
  description: 'Shop our collection of premium t-shirts. Quality cotton tees with unique designs at Indecisive Wear.',
}

export default async function TshirtsPage({
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
  const _nav = await getTranslations('nav')
  const params = await searchParams
  
  // Parse pagination
  const currentPage = parseInt(params.page || '1', 10)
  const perPage = 20 // Show 20 products per page
  
  // Build filters object with T-shirts filter (exclude crop tops)
  const filters = {
    category: params.category,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    colors: params.colors ? params.colors.split(',') : undefined,
    sizes: params.sizes ? params.sizes.split(',') : undefined,
    availability: params.availability ? params.availability.split(',') : undefined,
    sort: params.sort as 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'created-desc' | undefined,
    tags: ['tshirt', 't-shirt', 'tshirts', 't-shirts', 'tee', 'tees'],
    excludeTags: ['crop top'] // Exclude crop tops from T-shirts page
  }
  
  // Fetch products with server-side filtering and pagination
  const { products, pageInfo, totalCount } = await getProductsPaginated(
    currentPage,
    perPage,
    filters
  )
  
  // Calculate total pages
  const totalPages = Math.ceil(totalCount / perPage)
  
  // Check if filters are applied
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
    { label: 'T-shirts', href: '#', current: true }
  ]

  return (
    <ProductPageLayout
      title="T-shirts"
      variant="new" // Show as new collection with blue gradient
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
