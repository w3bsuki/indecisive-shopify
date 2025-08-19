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

export { Skeleton, ProductCardSkeleton }
