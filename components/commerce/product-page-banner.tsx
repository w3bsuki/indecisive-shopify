import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

interface ProductPageBannerProps {
  title: string
  showStats?: boolean
  currentPage?: number
  totalPages?: number
  totalCount?: number
  showingCount?: number
  hasFilters?: boolean
  className?: string
  variant?: 'all' | 'new' | 'sale' | 'collection'
  showTabs?: boolean
  currentCategory?: string
}

export function ProductPageBanner({
  title,
  showStats = true,
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  showingCount = 0,
  hasFilters = false,
  className = '',
  variant = 'all',
  showTabs = true,
  currentCategory = 'all'
}: ProductPageBannerProps) {
  const t = useTranslations('products')
  const common = useTranslations('common')

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
    { id: 'all', label: 'All', href: variant === 'new' ? '/new' : variant === 'sale' ? '/sale' : '/products' },
    { id: 'hats', label: 'Hats', href: `${variant === 'new' ? '/new' : variant === 'sale' ? '/sale' : '/products'}?category=hats` },
    { id: 'tshirts', label: 'T-shirts', href: `${variant === 'new' ? '/new' : variant === 'sale' ? '/sale' : '/products'}?category=tshirts` },
    { id: 'accessories', label: 'Accessories', href: `${variant === 'new' ? '/new' : variant === 'sale' ? '/sale' : '/products'}?category=accessories` }
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
          <Tabs value={currentCategory} className="w-full max-w-lg">
            <TabsList className="grid w-full grid-cols-4 bg-white/95 backdrop-blur-sm shadow-lg border border-white/20 rounded-lg p-1">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  asChild
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium rounded-md",
                    "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
                    "data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-sm",
                    "data-[state=active]:hover:bg-gray-800",
                    "min-h-[40px] touch-optimized flex items-center justify-center",
                    "transform active:scale-95 transition-transform duration-75"
                  )}
                >
                  <Link href={category.href} className="w-full h-full flex items-center justify-center">
                    {category.label}
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>
    </div>
  )
}