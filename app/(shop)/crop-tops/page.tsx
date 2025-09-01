import { getProductsPaginated } from '@/lib/shopify/api-enhanced'
import { getTranslations } from 'next-intl/server'
import { ProductPageLayout } from '@/components/layouts/product-page-layout'

export const metadata = {
  title: 'Crop Tops | Indecisive Wear',
  description: 'Shop our collection of crop tops. Cropped tees with unique designs at Indecisive Wear.',
}

export default async function CropTopsPage({
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
  const t = await getTranslations('products')
  const _nav = await getTranslations('nav')
  const params = await searchParams

  const currentPage = parseInt(params.page || '1', 10)
  const perPage = 20

  // Filter only "crop top" tagged products
  const filters = {
    category: params.category,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    colors: params.colors ? params.colors.split(',') : undefined,
    sizes: params.sizes ? params.sizes.split(',') : undefined,
    availability: params.availability ? params.availability.split(',') : undefined,
    sort: params.sort as 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'created-desc' | undefined,
    tags: ['crop top']
  }

  const { products, pageInfo, totalCount } = await getProductsPaginated(
    currentPage,
    perPage,
    filters
  )

  const totalPages = Math.ceil(totalCount / perPage)

  const hasFilters = !!(
    params.category || 
    params.sort || 
    params.minPrice || 
    params.maxPrice || 
    params.colors || 
    params.sizes || 
    params.availability
  )

  const breadcrumbItems = [
    { label: t('breadcrumb.home'), href: '/' },
    { label: t('breadcrumb.collections'), href: '/products' },
    { label: 'Crop Tops', href: '#', current: true }
  ]

  return (
    <ProductPageLayout
      title="Crop Tops"
      variant="collection"
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
