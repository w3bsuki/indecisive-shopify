'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function ProductsPageHeader({ productCount }: { productCount: number }) {
  const t = useTranslations()
  
  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-black transition-colors font-medium">
            {t('nav.home') || 'Home'}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-black font-medium">{t('products.title')}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold font-mono mb-2">{t('products.title')}</h1>
          <p className="text-gray-600 text-lg">
            {t('products.itemCount', { count: productCount }) || `${productCount} items to help you decide (or not)`}
          </p>
        </div>
      </div>
    </>
  )
}

export function NoProductsFound() {
  const t = useTranslations()
  
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-mono mb-4">{t('products.noProductsFound') || 'NO PRODUCTS FOUND'}</h2>
      <p className="text-gray-600">{t('products.tryAdjustingFilters') || 'Try adjusting your filters'}</p>
    </div>
  )
}