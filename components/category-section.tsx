import Image from 'next/image'
import type { Category } from '@/app/data/products'

interface CategorySectionProps {
  categories: Category[]
}

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="py-6 md:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <h2 className="text-xl md:text-4xl font-bold tracking-tight mb-4 md:mb-12 text-center">SHOP BY CATEGORY</h2>
        <div className="flex gap-3 md:gap-8 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <div key={category.name} className="min-w-[140px] sm:min-w-[180px] md:min-w-[280px] group cursor-pointer">
              <div className="relative overflow-hidden mb-2">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 140px, (max-width: 768px) 180px, 280px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-2 sm:p-4 md:p-6">
                    <h3 className="text-white font-mono font-bold text-xs sm:text-sm md:text-xl mb-1">
                      {category.name}
                    </h3>
                    <p className="text-white/90 font-mono text-[10px] sm:text-xs">{category.count}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}