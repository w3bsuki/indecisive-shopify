import { ProductCardServer } from '@/components/commerce/product-card-server'
import { NoProductsFound } from '@/app/(shop)/products/page-client'
import { ProductPageBanner } from '@/components/commerce/product-page-banner'
import { ProductsPagination } from '@/components/commerce/products-pagination'
import { ProductsToolbar } from '@/components/commerce/products-toolbar'
import { InlineProductsSearch } from '@/components/commerce/inline-products-search'
import { ActiveFiltersBar } from '@/components/commerce/active-filters-bar'
import { BreadcrumbStructuredData } from '@/components/layout/breadcrumb-navigation'
import { CollectionsPillsServer } from '@/components/commerce/collections-pills-server'
import { MobileRefineBar } from '@/components/commerce/mobile-refine-bar'
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
  showFilters: _showFilters = true,
  currentCategory = 'all',
  breadcrumbItems,
  className = '',
  gridClassName = '',
  showBanner = true
}: ProductPageLayoutProps) {
  const totalCount = _totalCount
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
      
      {/* Category Pills + Toolbar (sticky) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-8 px-safe">
        <div className="sticky top-14 md:top-0 z-20 bg-transparent backdrop-blur-0 shadow-none">
          <div className="pt-4">
            <CollectionsPillsServer variant={variant} currentCategory={currentCategory} />
          </div>
          {/* Inline search (desktop only to reduce mobile header height) */}
          <div className="hidden sm:block">
            <InlineProductsSearch />
          </div>
        </div>
        {/* Below-the-fold controls (reduce sticky header noise) */}
        <div className="mt-0">
          {/* Show toolbar only on desktop; mobile uses bottom refine bar */}
          <div className="px-1 hidden sm:block">
            <ProductsToolbar totalCount={totalCount} />
          </div>
          <div className="px-1">
            <ActiveFiltersBar />
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6 lg:gap-8 mt-2 ${gridClassName}`}>
              {products.map((product, index) => (
                product && typeof product !== 'string' ? (
                  <ProductCardServer 
                    key={product.id} 
                    product={product} 
                    priority={index < 8} // Priority for first 8 products (above fold)
                  />
                ) : null
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
      {/* Mobile bottom refine bar for Filters/Sort */}
      <MobileRefineBar totalCount={totalCount} />
    </div>
  )
}
