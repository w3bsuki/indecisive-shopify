interface SaleHeroProps {
  totalCount: number
}

export function SaleHero({ totalCount }: SaleHeroProps) {
  return (
    <section className="relative py-16 md:py-20 bg-white overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-50/40 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Collection Label */}
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-px bg-red-400/60" />
            <span className="text-red-600/80 text-xs font-medium tracking-[0.2em] uppercase">
              LIMITED TIME
            </span>
            <div className="w-12 h-px bg-red-400/60" />
          </div>
          
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-black mb-6 tracking-tight leading-[0.85]">
            SALE
          </h1>
          
          {/* Count Badge */}
          <div className="inline-flex items-center gap-3 bg-black/5 backdrop-blur-sm rounded-full px-6 py-3 border border-black/10 mb-8">
            <span className="text-black font-medium text-lg">
              {totalCount} {totalCount === 1 ? 'Item' : 'Items'}
            </span>
            <span className="text-black/40">•</span>
            <span className="text-red-600 font-medium text-sm">
              UP TO 75% OFF
            </span>
          </div>
          
          {/* Description */}
          <p className="text-black/70 text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed mb-10">
            Discover discounted fashion pieces with original prices shown. Limited time offers with automatic savings calculation.
          </p>

          {/* Key Features - Horizontal Layout */}
          <div className="flex flex-row justify-center items-center gap-6 md:gap-8 text-sm text-black/70 flex-wrap">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500/60 rounded-full"></div>
              <span className="font-medium">Original prices shown</span>
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500/60 rounded-full"></div>
              <span className="font-medium">Automatic discounts</span>
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500/60 rounded-full"></div>
              <span className="font-medium">Limited stock</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}