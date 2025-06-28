import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-white font-mono">
      {/* Navigation skeleton */}
      <div className="h-20 border-b border-black/10 flex items-center px-6">
        <Skeleton className="h-8 w-32" />
      </div>
      
      {/* Hero skeleton */}
      <div className="h-screen flex">
        <div className="w-1/2 bg-gray-50" />
        <div className="w-1/2 bg-gray-100" />
      </div>
      
      {/* Product sections skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="py-12 px-6">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="min-w-[280px]">
                <Skeleton className="aspect-[3/4] mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
