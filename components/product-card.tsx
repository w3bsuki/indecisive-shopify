import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { ReviewSummary } from '@/components/review-summary'
import { ProductCardActions } from '@/components/product-card-actions'
import type { Product } from '@/app/data/products'

interface ProductCardProps {
  product: Product
  isDark?: boolean
  addToCartAction: (productId: string, productData: { name: string; price: number }) => Promise<void>
}

export function ProductCard({ product, isDark = false, addToCartAction }: ProductCardProps) {
  return (
    <div className="group min-w-[160px] sm:min-w-[200px] md:min-w-[280px] flex-shrink-0">
      <div className="relative overflow-hidden mb-2">
        <div className="aspect-[3/4] relative">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={`${product.name} - ${product.category} product image showing the item in detail`}
            fill
            sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, 280px"
            className="object-cover"
          />
          {product.isNew && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white font-mono text-[10px] px-2 py-1 border-0">
              NEW
            </Badge>
          )}
          {product.isBestSeller && (
            <Badge className="absolute top-2 left-2 bg-yellow-400 text-black font-mono text-[10px] px-2 py-1 border-0">
              BEST
            </Badge>
          )}

          {/* Client Component for interactive elements */}
          <ProductCardActions 
            product={product} 
            isDark={isDark} 
            addToCartAction={addToCartAction} 
          />
        </div>
      </div>

      <div className="space-y-1 px-1">
        <div className="hidden sm:block">
          <ReviewSummary rating={product.rating} reviewCount={product.reviews} isDark={isDark} size="sm" />
        </div>

        <div>
          <h3
            className={`font-mono text-xs sm:text-sm font-medium mb-1 line-clamp-2 ${isDark ? "text-white" : "text-black"}`}
          >
            {product.name}
          </h3>
          <p className={`text-[10px] sm:text-xs font-mono ${isDark ? "text-white/80" : "text-black/70"}`}>
            {product.category}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`font-mono font-bold text-sm sm:text-base ${isDark ? "text-white" : "text-black"}`}>
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className={`text-xs font-mono line-through ${isDark ? "text-white/70" : "text-black/60"}`}>
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}