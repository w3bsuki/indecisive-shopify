"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface ProductGridModernProps {
  products: ShopifyProduct[]
}

export function ProductGridModern({ products }: ProductGridModernProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
      {products.map((product, index) => {
        const mainImage = product.images.edges[0]?.node
        const hoverImage = product.images.edges[1]?.node || mainImage
        const price = product.priceRange.minVariantPrice

        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link href={`/products/${product.handle}`} className="group block">
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                {mainImage && (
                  <>
                    <Image
                      src={mainImage.url}
                      alt={mainImage.altText || product.title}
                      fill
                      className={`object-cover transition-opacity duration-500 ${
                        hoveredIndex === index ? 'opacity-0' : 'opacity-100'
                      }`}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {hoverImage && (
                      <Image
                        src={hoverImage.url}
                        alt={hoverImage.altText || product.title}
                        fill
                        className={`object-cover transition-opacity duration-500 ${
                          hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                        }`}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    )}
                  </>
                )}

                {/* Quick Add Button */}
                <div className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-300 ${
                  hoveredIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}>
                  <button className="w-full py-3 bg-white/95 backdrop-blur-sm text-black text-sm font-medium tracking-wide hover:bg-white transition-colors">
                    Quick Add
                  </button>
                </div>

                {/* Sale Badge */}
                {product.tags.includes('sale') && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-medium tracking-wide">
                    SALE
                  </span>
                )}

                {/* New Badge */}
                {product.tags.includes('new') && !product.tags.includes('sale') && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-xs font-medium tracking-wide">
                    NEW
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {product.productType}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-sm font-medium text-gray-900">
                    {price.currencyCode} {parseFloat(price.amount).toFixed(0)}
                  </span>
                  {product.compareAtPriceRange?.minVariantPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      {product.compareAtPriceRange.minVariantPrice.currencyCode} {parseFloat(product.compareAtPriceRange.minVariantPrice.amount).toFixed(0)}
                    </span>
                  )}
                </div>

                {/* Color Options (if available) */}
                {product.options.find((opt: any) => opt.name.toLowerCase() === 'color') && (
                  <div className="flex gap-1 pt-2">
                    {product.options
                      .find((opt: any) => opt.name.toLowerCase() === 'color')
                      ?.values.slice(0, 4).map((color: any, idx: any) => (
                        <span
                          key={idx}
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ 
                            backgroundColor: color.toLowerCase().replace(' ', ''),
                            ...(color.toLowerCase().includes('white') && { borderColor: '#e5e5e5' })
                          }}
                          title={color}
                        />
                      ))}
                    {product.options.find((opt: any) => opt.name.toLowerCase() === 'color')?.values.length > 4 && (
                      <span className="text-xs text-gray-500">
                        +{product.options.find((opt: any) => opt.name.toLowerCase() === 'color')?.values.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}