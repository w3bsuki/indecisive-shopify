import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import type { Product } from '@/app/data/products'

interface ProductSectionProps {
  title: string
  subtitle: string
  products: Product[]
  isDark?: boolean
  addToCartAction: (productId: string, productData: { name: string; price: number }) => Promise<void>
}

export function ProductSection({ 
  title, 
  subtitle, 
  products, 
  isDark = false,
  addToCartAction 
}: ProductSectionProps) {
  return (
    <section className={`py-6 md:py-12 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-4 md:mb-8">
          <div>
            <h2 className={`text-xl md:text-5xl font-bold tracking-tight mb-1 ${isDark ? 'text-white' : 'text-black'}`}>
              {title}
            </h2>
            <p className={`text-xs md:text-xl font-mono ${isDark ? 'text-white/70' : 'text-black/60'}`}>
              {subtitle}
            </p>
          </div>
          <Button
            variant="outline"
            className={`font-mono text-xs md:text-base px-3 md:px-6 ${
              isDark 
                ? 'bg-white/10 hover:bg-white hover:text-black text-white' 
                : 'bg-black/5 hover:bg-black hover:text-white'
            }`}
          >
            VIEW ALL
          </Button>
        </div>

        <div className="flex gap-3 md:gap-8 overflow-x-auto pb-4 scrollbar-hide">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isDark={isDark}
              addToCartAction={addToCartAction}
            />
          ))}
        </div>
      </div>
    </section>
  )
}