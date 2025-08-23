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
        "group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-300",
        "shadow-sm hover:shadow-2xl transform transition-all duration-500 hover:scale-[1.02]",
        "overflow-hidden",
        size === 'large' && 'min-w-[280px] md:min-w-[320px]',
        size === 'mobile' && 'w-full'
      )}
    >
      {/* Modern Sale Badge */}
      {isOnSale && (
        <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 text-xs font-bold uppercase rounded-full shadow-lg animate-pulse">
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
              className="w-full h-auto object-contain transition-all duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-32 flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2 animate-pulse">👕</div>
                <div className="text-xs font-medium">No image</div>
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

      {/* Modern Product Information */}
      <div className="px-4 pt-3 pb-4">
        {/* Modern Color Variants Display */}
        {availableColors.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {availableColors.slice(0, 4).map((color, index) => {
              const bgColor = getColorFromName(color)
              return (
                <div
                  key={`${color}-${index}`}
                  className={cn(
                    "rounded-full ring-2 ring-offset-1 ring-transparent hover:ring-gray-300 transition-all cursor-pointer",
                    size === 'mobile' ? "w-3 h-3" : "w-3.5 h-3.5"
                  )}
                  style={{ 
                    backgroundColor: bgColor,
                    border: bgColor === '#FFFFFF' ? '1px solid #e5e7eb' : 'none'
                  }}
                  title={color}
                />
              )
            })}
            {availableColors.length > 4 && (
              <span className="text-[11px] text-gray-600 font-medium bg-gray-100 px-1.5 py-0.5 rounded-full ml-0.5">
                +{availableColors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Modern Product Title */}
        <h3 className={cn(
          "text-base sm:text-lg font-semibold text-gray-900 text-center leading-snug mb-3 transition-colors duration-300",
          size === 'mobile' ? "text-sm" : ""
        )}>
          <Link 
            href={`/products/${product.handle}`} 
            className="hover:text-black block truncate"
          >
            {product.title}
          </Link>
        </h3>
        
        {/* Modern Price Section */}
        <div className="text-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl py-2.5 px-3 mt-auto" style={{ fontFamily: 'var(--font-mono)' }}>
          {isOnSale ? (
            <SalePriceServer 
              price={price}
              compareAtPrice={compareAtPrice}
              showDualCurrency={market.countryCode === 'BG'}
              marketCountryCode={market.countryCode}
              className={cn(
                "font-bold tracking-tight text-black",
                size === 'mobile' ? "text-sm" : "text-base"
              )}
              compareClassName={cn(
                "line-through text-gray-400 font-normal",
                size === 'mobile' ? "text-xs" : "text-sm"
              )}
            />
          ) : (
            <MoneyServer 
              data={price} 
              showDualCurrency={market.countryCode === 'BG'}
              marketCountryCode={market.countryCode}
              className={cn(
                "font-bold tracking-tight text-black",
                size === 'mobile' ? "text-sm" : "text-base"
              )}
            />
          )}
        </div>
      </div>
    </div>
  )
}