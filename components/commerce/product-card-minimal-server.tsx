import Link from 'next/link'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'
import { ProductCardMinimalActions } from './product-card-minimal-actions'
import { MoneyServer, SalePriceServer } from './money-server'
import { getProductColors, getColorFromName } from '@/lib/utils/product'
import { getMarketFromCookies } from '@/lib/shopify/server-market'

interface ProductCardMinimalServerProps {
  product: ShopifyProduct
  priority?: boolean
  size?: 'default' | 'large' | 'mobile'
}

export async function ProductCardMinimalServer({ 
  product, 
  priority: _priority = false, 
  size = 'default' 
}: ProductCardMinimalServerProps) {
  const price = product.priceRange.minVariantPrice
  const compareAtPrice = product.compareAtPriceRange?.maxVariantPrice || null
  
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount)

  // Get market from server-side cookies
  const market = await getMarketFromCookies()
  
  // Extract color variants for display
  const availableColors = getProductColors(product)

  return (
    <div 
      className={cn(
        "group relative bg-white border border-gray-100 hover:border-gray-200 transition-all duration-200",
        size === 'large' && 'min-w-[280px] md:min-w-[320px]',
        size === 'mobile' && 'w-full'
      )}
    >
      {/* Sale Badge */}
      {isOnSale && (
        <div className="absolute top-2 left-2 z-20 bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase">
          Sale
        </div>
      )}

      {/* Product Image with Actions */}
      <div className="relative">
        <Link 
          href={`/products/${product.handle}`}
          className="block"
        >
          {product.featuredImage ? (
            <img
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              className="w-full h-auto object-contain transition-all duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-32 flex items-center justify-center text-gray-400 bg-gray-100">
              <div className="text-center">
                <div className="text-2xl mb-1">👕</div>
                <div className="text-xs">No image</div>
              </div>
            </div>
          )}
        </Link>

        {/* Client-side Actions Overlay */}
        <ProductCardMinimalActions 
          product={product} 
          size={size}
        />
      </div>

      {/* Product Information */}
      <div className="px-2 pt-0 pb-2">
        {/* Color Variants Display - Above Title */}
        {availableColors.length > 0 && (
          <div className="flex items-center justify-center gap-1 mb-2">
            {availableColors.slice(0, 4).map((color, index) => {
              const bgColor = getColorFromName(color)
              return (
                <div
                  key={`${color}-${index}`}
                  className={cn(
                    "rounded-full",
                    size === 'mobile' ? "w-2.5 h-2.5" : "w-3 h-3"
                  )}
                  style={{ 
                    backgroundColor: bgColor,
                    border: bgColor === '#FFFFFF' ? '1px solid #ccc' : 'none'
                  }}
                  title={color}
                />
              )
            })}
            {availableColors.length > 4 && (
              <span className="text-[10px] text-gray-500 ml-1">
                +{availableColors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Product Title */}
        <h3 className={cn(
          "text-base sm:text-lg font-medium text-gray-900 text-center leading-tight mb-2",
          size === 'mobile' ? "text-sm" : ""
        )}>
          <Link 
            href={`/products/${product.handle}`} 
            className="hover:text-black transition-colors duration-200 block truncate"
          >
            {product.title}
          </Link>
        </h3>
        
        {/* Price */}
        <div className="text-center" style={{ fontFamily: 'var(--font-mono)' }}>
          {isOnSale ? (
            <SalePriceServer 
              price={price}
              compareAtPrice={compareAtPrice}
              showDualCurrency={market.countryCode === 'BG'}
              marketCountryCode={market.countryCode}
              className={cn(
                "font-normal tracking-tight text-black",
                size === 'mobile' ? "text-xs" : "text-sm"
              )}
              compareClassName={cn(
                "line-through text-gray-400",
                size === 'mobile' ? "text-[10px]" : "text-xs"
              )}
            />
          ) : (
            <MoneyServer 
              data={price} 
              showDualCurrency={market.countryCode === 'BG'}
              marketCountryCode={market.countryCode}
              className={cn(
                "font-normal tracking-tight text-black",
                size === 'mobile' ? "text-xs" : "text-sm"
              )}
            />
          )}
        </div>
      </div>
    </div>
  )
}