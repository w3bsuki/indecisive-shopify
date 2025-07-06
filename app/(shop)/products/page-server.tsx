import { getTranslations } from 'next-intl/server'

export async function ProductsPageContent({ products }: { products: any[] }) {
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