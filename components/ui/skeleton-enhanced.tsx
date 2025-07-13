import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton animate-pulse bg-gray-200 rounded-md",
        className
      )}
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

// Cart Item Skeleton
function CartItemSkeleton() {
  return (
    <div className="flex gap-3 p-3">
      {/* Image skeleton */}
      <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
      
      {/* Content skeleton */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  )
}

// Search Results Skeleton
function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search header skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      
      {/* Grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

// Collection Page Skeleton
function CollectionPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>
      
      {/* Filters skeleton */}
      <div className="flex gap-2 overflow-x-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 flex-shrink-0" />
        ))}
      </div>
      
      {/* Products grid skeleton */}
      <SearchResultsSkeleton />
    </div>
  )
}

// Account Page Skeleton
function AccountPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2 p-4 border rounded">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 border rounded space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Generic List Skeleton
function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex gap-3 p-3 border rounded">
          <Skeleton className="w-12 h-12 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="w-8 h-8" />
        </div>
      ))}
    </div>
  )
}

// Form Skeleton
function FormSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32" />
    </div>
  )
}

export {
  Skeleton,
  ProductCardSkeleton,
  CartItemSkeleton,
  SearchResultsSkeleton,
  CollectionPageSkeleton,
  AccountPageSkeleton,
  ListSkeleton,
  FormSkeleton
}