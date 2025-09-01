import { getTranslations } from 'next-intl/server'

import type { ShopifyProduct } from '@/lib/shopify/types'

export async function ProductsPageContent({ products }: { products: ShopifyProduct[] }) {
  const t = await getTranslations('products')
  
  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold font-mono mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="font-mono text-sm text-gray-600">
            {t('itemCount', { count: products.length })}
          </span>
        </div>
      </div>
    </>
  )
}