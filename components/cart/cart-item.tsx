'use client'

import { Minus, Plus, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Money } from '@/components/commerce/money'
import type { CartLine } from '@/lib/shopify/types'

interface CartItemProps {
  item: CartLine
  updateItem: (lineId: string, quantity: number) => void
  removeItem: (lineId: string) => void
  isLoading?: boolean
  variant?: 'default' | 'compact'
}

export function CartItem({ item, updateItem, removeItem, isLoading, variant = 'default' }: CartItemProps) {
  if (!item?.merchandise?.product) return null

  const { product } = item.merchandise
  const imageUrl = product.featuredImage?.url
  const imageAlt = product.featuredImage?.altText || product.title || 'Product image'
  const variantTitle = item.merchandise.title !== 'Default Title' ? item.merchandise.title : null
  const quantity = item.quantity || 1

  const isCompact = variant === 'compact'

  return (
    <div className={`flex gap-3 ${isCompact ? 'py-3' : 'p-4 border border-gray-200'}`}>
      {/* Product Image */}
      <Link 
        href={`/products/${product.handle}`}
        className={`relative bg-gray-50 flex-shrink-0 ${isCompact ? 'w-20 h-20' : 'w-24 h-24'}`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes={isCompact ? '80px' : '96px'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-xs">No image</span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div className="pr-2">
            <Link 
              href={`/products/${product.handle}`}
              className="text-sm font-medium hover:underline line-clamp-1"
            >
              {product.title}
            </Link>
            {variantTitle && (
              <p className="text-xs text-gray-600 mt-0.5">{variantTitle}</p>
            )}
          </div>
          <button
            onClick={() => item.id && removeItem(item.id)}
            disabled={isLoading}
            className="p-1.5 -mr-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50"
            aria-label={`Remove ${product.title}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-200">
            <button
              onClick={() => item.id && updateItem(item.id, Math.max(1, quantity - 1))}
              disabled={isLoading || quantity <= 1}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-10 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => item.id && updateItem(item.id, quantity + 1)}
              disabled={isLoading}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Price */}
          <div className="text-sm font-semibold">
            {item.cost?.totalAmount ? (
              <Money data={item.cost.totalAmount} />
            ) : (
              '$0.00'
            )}
          </div>
        </div>
      </div>
    </div>
  )
}