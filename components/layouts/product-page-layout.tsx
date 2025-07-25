import { ProductCardServer } from '@/components/commerce/product-card-server'
import { NoProductsFound } from '@/app/(shop)/products/page-client'
import { ProductPageBanner } from '@/components/commerce/product-page-banner'
import { ProductFiltersAdvanced } from '@/components/commerce/product-filters-advanced'
import { ProductsPagination } from '@/components/commerce/products-pagination'
import { BreadcrumbStructuredData } from '@/components/layout/breadcrumb-navigation'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface ProductPageLayoutProps {
  // Page content
  title: string
  variant?: 'all' | 'new' | 'sale' | 'collection'
  
  // Products data
  products: ShopifyProduct[]
  
  // Pagination
  currentPage: number
  totalPages: number
  totalCount: number
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  
  // Filters
  hasFilters?: boolean
  showFilters?: boolean
  currentCategory?: string
  
  // SEO & Navigation
  breadcrumbItems?: Array<{
    label: string
    href: string
    current?: boolean
  }>
  
  // Customization
  className?: string
  gridClassName?: string
  showBanner?: boolean
}

export function ProductPageLayout({
  title,
  variant = 'all',
  products,
  currentPage,
  totalPages,
  totalCount: _totalCount,
  pageInfo,
  hasFilters: _hasFilters = false,
  showFilters = true,
  currentCategory = 'all',
  breadcrumbItems,
  className = '',
  gridClassName = '',
  showBanner = true
}: ProductPageLayoutProps) {
  return (
    <div className={className}>
      {/* SEO Breadcrumbs */}
      {breadcrumbItems && (
        <BreadcrumbStructuredData items={breadcrumbItems} />
      )}
      
      {/* Banner Header */}
      {showBanner && (
        <ProductPageBanner
          title={title}
          variant={variant}
          currentCategory={currentCategory}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 px-safe">
        {/* Advanced Filters */}
        {showFilters && <ProductFiltersAdvanced />}

        {/* Products Grid - Standardized 4-column responsive */}
        {products.length > 0 ? (
          <>
            <div className={`grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6 touch-optimized ${gridClassName}`}>
              {products.map((product, index) => (
                <ProductCardServer 
                  key={product.id} 
                  product={product} 
                  priority={index < 8} // Priority for first 8 products (above fold)
                />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <ProductsPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                hasNextPage={pageInfo.hasNextPage}
                hasPreviousPage={pageInfo.hasPreviousPage}
              />
            )}
          </>
        ) : (
          <NoProductsFound />
        )}
      </div>
    </div>
  )
}