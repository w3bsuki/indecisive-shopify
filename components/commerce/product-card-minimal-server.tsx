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
  variant?: 'default' | 'borderless'
}

export async function ProductCardMinimalServer({ 
  product, 
  priority: _priority = false, 
  size = 'default',
  variant = 'default'
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
        "group relative",
        "transition-all duration-300",
        "overflow-hidden",
        variant === 'default' && "bg-white rounded-2xl",
        variant === 'borderless' && "bg-transparent",
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
              className="w-full h-auto object-contain"
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
      <div className={cn("px-3 pt-2 pb-3", variant === 'borderless' && "px-0 pt-2 pb-2") }>
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
          "text-base sm:text-lg font-semibold text-gray-900 text-center leading-snug mb-2 transition-colors duration-300",
          variant === 'borderless' && "text-sm sm:text-base font-medium mb-1",
          size === 'mobile' && variant !== 'borderless' ? "text-sm" : ""
        )}>
          <Link 
            href={`/products/${product.handle}`} 
            className="hover:text-black block truncate"
          >
            {product.title}
          </Link>
        </h3>
        
        {/* Modern Price Section */}
        <div className={cn(
          "text-center mt-auto",
          variant === 'default' && "bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl py-2.5 px-3",
          variant === 'borderless' && "py-0.5"
        )} style={{ fontFamily: 'var(--font-mono)' }}>
          {isOnSale ? (
            <SalePriceServer 
              price={price}
              compareAtPrice={compareAtPrice}
              showDualCurrency={market.countryCode === 'BG'}
              marketCountryCode={market.countryCode}
              className={cn(
                "font-semibold tracking-tight text-black",
                variant === 'borderless' ? "text-xs sm:text-sm" : (size === 'mobile' ? "text-sm" : "text-base")
              )}
              compareClassName={cn(
                "line-through text-gray-400 font-normal",
                variant === 'borderless' ? "text-[11px] sm:text-xs" : (size === 'mobile' ? "text-xs" : "text-sm")
              )}
            />
          ) : (
            <MoneyServer 
              data={price} 
              showDualCurrency={market.countryCode === 'BG'}
              marketCountryCode={market.countryCode}
              className={cn(
                "font-semibold tracking-tight text-black",
                variant === 'borderless' ? "text-xs sm:text-sm" : (size === 'mobile' ? "text-sm" : "text-base")
              )}
            />
          )}
        </div>
      </div>
    </div>
  )
}
