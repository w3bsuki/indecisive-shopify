'use client'

import { useState, useTransition } from 'react'
import { Heart, Plus, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuickViewDialog } from '@/components/commerce/quick-view-dialog'
import type { Product } from '@/app/data/products'

interface ProductCardActionsProps {
  product: Product
  isDark?: boolean
  addToCartAction: (productId: string, productData: { name: string; price: number }) => Promise<void>
}

export function ProductCardActions({ product, isDark = false, addToCartAction }: ProductCardActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [isWishlisted, setIsWishlisted] = useState(false)
  
  const handleAddToCart = () => {
    startTransition(async () => {
      await addToCartAction(product.id, {
        name: product.name,
        price: product.price
      })
    })
  }
  
  return (
    <>
      {/* Mobile action buttons */}
      <div className="absolute bottom-2 left-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 md:opacity-100">
        <Button
          onClick={handleAddToCart}
          disabled={isPending}
          size="sm"
          className={`flex-1 font-mono text-xs py-3 min-h-[44px] ${
            isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"
          }`}
          aria-label={`Add ${product.name} to cart`}
        >
          {isPending ? (
            'ADDING...'
          ) : (
            <>
              <Plus className="h-2 w-2 mr-1" />
              ADD
            </>
          )}
        </Button>
        <QuickViewDialog product={product} isDark={isDark}>
          <Button
            size="sm"
            className={`font-mono text-xs px-3 py-3 min-h-[44px] min-w-[44px] ${
              isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"
            }`}
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </QuickViewDialog>
      </div>

      {/* Wishlist button */}
      <Button
        onClick={() => setIsWishlisted(!isWishlisted)}
        size="sm"
        className={`absolute top-2 right-2 min-h-[44px] min-w-[44px] p-0 opacity-0 group-hover:opacity-100 md:opacity-100 ${
          isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"
        }`}
        aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={isWishlisted}
      >
        <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
      </Button>
    </>
  )
}