'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useLocale } from 'next-intl'

interface ProductPageBannerProps {
  title: string
  className?: string
  variant?: 'all' | 'new' | 'sale' | 'collection'
  showTabs?: boolean
  currentCategory?: string
}

export function ProductPageBanner({
  title,
  className = '',
  variant = 'all',
  showTabs = true,
  currentCategory = 'all'
}: ProductPageBannerProps) {
  const locale = useLocale()
  const isBulgarian = locale === 'bg'

  const getBannerStyles = () => {
    switch (variant) {
      case 'new':
        // Use design token gradient for new items - more subtle
        return 'bg-gradient-to-br from-blue-600 to-blue-800 text-white'
      case 'sale':
        // Use design token destructive color for sales - more subtle
        return 'bg-gradient-to-br from-red-600 to-red-800 text-white'
      case 'collection':
        return 'bg-gradient-to-br from-purple-600 to-purple-800 text-white'
      default:
        // Use design token primary color
        return 'bg-primary text-primary-foreground'
    }
  }

  const categories = [
    { 
      id: 'all', 
      label: isBulgarian ? 'ВСИЧКИ' : 'ALL', 
      href: variant === 'new' ? '/new' : variant === 'sale' ? '/sale' : '/products' 
    },
    { 
      id: 'hats', 
      label: isBulgarian ? '#1 ХУЛИГАНКА' : '#1 HATS', 
      href: `${variant === 'new' ? '/new' : variant === 'sale' ? '/sale' : '/products'}?category=hats` 
    },
    { 
      id: 'tshirts', 
      label: isBulgarian ? '#2 БУНТАРКА' : '#2 T-SHIRTS', 
      href: `${variant === 'new' ? '/new' : variant === 'sale' ? '/sale' : '/products'}?category=tshirts` 
    }
  ]

  return (
    <div className={cn(getBannerStyles(), 'shadow-card relative overflow-hidden min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]', className)}>
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono tracking-tight text-center mb-4 sm:mb-6">
          {title}
        </h1>
        
        {showTabs && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={category.href}
                  className={cn(
                    "relative px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3",
                    "text-sm sm:text-base lg:text-lg font-black tracking-wider",
                    "transition-all duration-200",
                    "border-2 border-transparent",
                    "hover:scale-105 active:scale-95",
                    currentCategory === category.id ? [
                      "bg-white text-black",
                      "shadow-[0_0_20px_rgba(255,255,255,0.5)]",
                      "border-white"
                    ] : [
                      "bg-black/20 text-white",
                      "hover:bg-black/30",
                      "hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    ]
                  )}
                >
                  <span className="relative z-10">{category.label}</span>
                  {currentCategory === category.id && (
                    <div className="absolute inset-0 bg-white animate-pulse opacity-20" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}