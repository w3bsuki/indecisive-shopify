export default function ContentLoading() {
  return (
    <div className="min-h-screen bg-white font-mono">
      {/* Header skeleton */}
      <header className="border-b-2 border-black py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="text-center">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="h-12 w-96 bg-gray-200 rounded animate-pulse mx-auto" />
            <div className="h-6 w-128 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[3/4] bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}