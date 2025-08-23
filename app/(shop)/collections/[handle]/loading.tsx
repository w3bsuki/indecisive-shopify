import { Skeleton, CollectionHeaderSkeleton, ProductGridSkeleton } from '@/components/ui/skeleton'

export default function CollectionLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Collection Header Skeleton */}
      <CollectionHeaderSkeleton />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar Skeleton */}
        <aside className="lg:col-span-1">
          <div className="space-y-6">
            <div>
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Skeleton className="h-6 w-20 mb-4" />
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Skeleton className="h-6 w-16 mb-4" />
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-16 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid Skeleton */}
        <main className="lg:col-span-3">
          <ProductGridSkeleton count={12} />
        </main>
      </div>
    </div>
  )
}