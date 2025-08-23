import { Skeleton, AccountSidebarSkeleton } from '@/components/ui/skeleton'

export default function AccountLoading() {
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
            <div>
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-4 w-96" />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-6 border-2 border-gray-200 rounded-lg space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}