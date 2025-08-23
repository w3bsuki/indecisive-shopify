import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Product Card Skeleton
function ProductCardSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full" />
      
      {/* Title skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      {/* Price skeleton */}
      <Skeleton className="h-6 w-1/3" />
      
      {/* Button skeleton */}
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

// Collection Header Skeleton
function CollectionHeaderSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-12 w-64 mb-2" />
      <Skeleton className="h-4 w-96 mb-6" />
      <Skeleton className="aspect-[21/9] w-full rounded-lg" />
    </div>
  )
}

// Product Grid Skeleton
function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Account Sidebar Skeleton
function AccountSidebarSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-lg" />
      ))}
    </div>
  )
}

// Order Card Skeleton
function OrderCardSkeleton() {
  return (
    <div className="p-6 border-2 border-gray-200 rounded-lg space-y-4">
      {/* Order Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Order Items Preview */}
      <div className="border-t pt-3 space-y-2">
        <Skeleton className="h-4 w-32" />
        <div className="space-y-1">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-3 border-t">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  )
}

export { 
  Skeleton, 
  ProductCardSkeleton, 
  CollectionHeaderSkeleton, 
  ProductGridSkeleton,
  AccountSidebarSkeleton,
  OrderCardSkeleton
}
