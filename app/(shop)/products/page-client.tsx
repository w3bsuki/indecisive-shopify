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
        <div className="mb-6 text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">{t('products.title')}</h1>
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
    <div className="text-center py-20">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 max-w-md mx-auto shadow-lg">
        <div className="text-6xl mb-6 animate-pulse">🤔</div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('products.noProductsFound') || 'NO PRODUCTS FOUND'}</h2>
        <p className="text-gray-600 mb-8">{t('products.tryAdjustingFilters') || 'Try adjusting your filters'}</p>
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <span>View All Products</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}