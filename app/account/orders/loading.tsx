import { Skeleton, AccountSidebarSkeleton, OrderCardSkeleton } from '@/components/ui/skeleton'

export default function OrdersLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Skeleton */}
        <aside className="lg:col-span-1">
          <AccountSidebarSkeleton />
        </aside>

        {/* Main Content Skeleton */}
        <main className="lg:col-span-3">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Order Cards */}
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <OrderCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}