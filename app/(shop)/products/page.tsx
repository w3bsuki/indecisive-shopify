import { getProductsPaginated } from '@/lib/shopify/api-enhanced'
import { getTranslations } from 'next-intl/server'
import { ProductPageLayout } from '@/components/layouts/product-page-layout'

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
    page?: string
  }>
}) {
  // Get translations
  const t = await getTranslations('products')
  const params = await searchParams
  
  // Parse pagination
  const currentPage = parseInt(params.page || '1', 10)
  const perPage = 20 // Show 20 products per page
  
  // Build filters object
  const filters = {
    category: params.category,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    colors: params.colors ? params.colors.split(',') : undefined,
    sizes: params.sizes ? params.sizes.split(',') : undefined,
    availability: params.availability ? params.availability.split(',') : undefined,
    sort: params.sort as any
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
    { label: t('breadcrumb.allProducts'), href: '#', current: true }
  ]

  return (
    <ProductPageLayout
      title={t('title')}
      variant="all"
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