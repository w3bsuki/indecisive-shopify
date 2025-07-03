import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'
import { Badge } from '@/components/ui/badge'
import { formatPriceServer } from '@/lib/shopify/server-market'
import { getTranslations } from 'next-intl/server'

interface ProductInfoProps {
  product: ShopifyProduct
  selectedVariant?: ShopifyProductVariant
}

export async function ProductInfo({ product, selectedVariant }: ProductInfoProps) {
  const t = await getTranslations('products')
  
  // Use selected variant price if available, otherwise show price range
  const price = selectedVariant
    ? await formatPriceServer(selectedVariant.price.amount, selectedVariant.price.currencyCode)
    : product.priceRange.minVariantPrice.amount === product.priceRange.maxVariantPrice.amount
    ? await formatPriceServer(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)
    : `${await formatPriceServer(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)} - ${await formatPriceServer(product.priceRange.maxVariantPrice.amount, product.priceRange.maxVariantPrice.currencyCode)}`

  const inStock = selectedVariant ? selectedVariant.availableForSale : true

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <div className="mt-2 flex items-center gap-4">
          <p className="text-2xl font-semibold">{price}</p>
          {!inStock && (
            <Badge variant="destructive">{t('soldOut')}</Badge>
          )}
        </div>
      </div>

      {product.description && (
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-600">{product.description}</p>
        </div>
      )}

      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}