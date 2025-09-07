import { Suspense } from 'react'
import { SearchResults } from './search-results'
import { SearchFiltersResponsive } from './search-filters-responsive'

export const metadata = {
  title: 'Search | Indecisive Wear',
  description: 'Search our collection of minimal streetwear',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; category?: string }>
}) {
  const params = await searchParams;
  return (
    <div className="container-safe py-4 sm:py-8 pb-20 sm:pb-8">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-h2 font-bold font-mono text-center sm:text-left">
          {params.q ? `Search results for "${params.q}"` : 'Search'}
        </h1>
      </div>

      {/* Filters - Full width responsive */}
      <SearchFiltersResponsive />

      <div className="mt-4 sm:mt-6">
        {/* Results - Server Component with Suspense */}
        <main>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-square bg-gray-200 animate-pulse rounded-radius-lg" />
                    <div className="h-4 bg-gray-200 animate-pulse w-3/4 rounded-radius-sm" />
                    <div className="h-4 bg-gray-200 animate-pulse w-1/2 rounded-radius-sm" />
                  </div>
                ))}
              </div>
            }
          >
            <SearchResults
              query={params.q}
              sort={params.sort}
              category={params.category}
            />
          </Suspense>
        </main>
      </div>
    </div>
  )
}