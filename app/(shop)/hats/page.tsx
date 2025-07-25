import { getProductsPaginated } from '@/lib/shopify/api-enhanced'
import { getTranslations } from 'next-intl/server'
import { ProductPageLayout } from '@/components/layouts/product-page-layout'

export const metadata = {
  title: 'Hats | Indecisive Wear',
  description: 'Shop our collection of stylish hats and caps. Premium headwear with unique designs at Indecisive Wear.',
}

export default async function HatsPage({
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
  
  // Build filters object with Hats filter
  const filters = {
    category: params.category,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    colors: params.colors ? params.colors.split(',') : undefined,
    sizes: params.sizes ? params.sizes.split(',') : undefined,
    availability: params.availability ? params.availability.split(',') : undefined,
    sort: params.sort as 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'created-desc' | undefined,
    // Use comprehensive hat/cap tags
    tags: ['hat', 'hats', 'cap', 'caps', 'headwear']
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
    { label: 'Hats', href: '#', current: true }
  ]

  return (
    <ProductPageLayout
      title="Hats"
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