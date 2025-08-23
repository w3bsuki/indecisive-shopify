import { Skeleton } from '@/components/ui/skeleton'

export default function CheckoutLoading() {
  return (
    <>
      {/* Header Skeleton */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-32" />
              <div className="hidden sm:flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Progress Indicator Skeleton */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="w-12 h-0.5" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="w-12 h-0.5" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-4 w-18" />
              </div>
            </div>
          </div>

          {/* Back Button and Title */}
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-6 w-32" />
            <div className="hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Summary Skeleton */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg -m-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>

                {/* Cart Items Skeleton */}
                <div className="space-y-3 max-h-64 overflow-hidden">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                      <Skeleton className="w-16 h-16 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals Skeleton */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <Skeleton className="h-5 w-14" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Status Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg -m-6 mb-6">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-28" />
                </div>

                {/* Loading Animation Skeleton */}
                <div className="flex flex-col items-center py-8">
                  <Skeleton className="w-16 h-16 rounded-full mb-6" />
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>

                {/* Trust Badges Skeleton */}
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-5 w-5" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Skeleton */}
          <div className="mt-12 text-center space-y-4">
            <div className="flex items-center justify-center gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-1">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}