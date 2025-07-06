'use client'

import { useTranslations } from 'next-intl'

export function ProductsPromoBanner() {
  const t = useTranslations('products')
  
  return (
    <div className="bg-black text-white py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium">
          {t('promoBanner')}
        </p>
      </div>
    </div>
  )
}