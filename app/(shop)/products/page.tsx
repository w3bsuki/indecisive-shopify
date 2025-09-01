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
    q?: string
    tags?: string
    minPrice?: string
    maxPrice?: string
    page?: string
  }>
}) {
  try {
  // Get translations
  const t = await getTranslations('products')
  const params = await searchParams
  
  // Parse pagination
  const currentPage = parseInt(params.page || '1', 10)
  const perPage = 20 // Show 20 products per page
  
  // Normalize category handle (unify tees/tshirts variants)
  const normalizeCategory = (handle?: string) => {
    if (!handle) return undefined
    const h = handle.toLowerCase()
    if (h === 'tees' || h === 'tshirts' || h === 'tees-1') return 'tshirts'
    return h
  }

  const normalizedCategory = normalizeCategory(params.category)

  // Build filters object with category-specific tag filtering
  const filters = {
    category: normalizedCategory,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    colors: params.colors ? params.colors.split(',') : undefined,
    sizes: params.sizes ? params.sizes.split(',') : undefined,
    availability: params.availability ? params.availability.split(',') : undefined,
    sort: params.sort as any,
    tags: params.tags ? params.tags.split(',') : undefined,
    keyword: params.q || undefined,
    // Simple tag mapping: crop-tops -> 'crop top', tees/tshirts -> 'tee'
    ...(normalizedCategory === 'crop-tops' && {
      tags: ['crop top']
    }),
    ...(normalizedCategory === 'tshirts' && {
      tags: ['tee']
    })
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
      showBanner={false}
      products={products}
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
      pageInfo={pageInfo}
      hasFilters={hasFilters}
      currentCategory={normalizedCategory || 'all'}
      breadcrumbItems={breadcrumbItems}
    />
  )
  } catch (error) {
    console.error('Error loading products page:', error)
    // Return a fallback UI or re-throw to show error boundary
    return (
      <ProductPageLayout
        title="Products"
        variant="all"
        products={[]}
        currentPage={1}
        totalPages={0}
        totalCount={0}
        pageInfo={{ hasNextPage: false, hasPreviousPage: false }}
        hasFilters={false}
        currentCategory="all"
        breadcrumbItems={[]}
      />
    )
  }
}
