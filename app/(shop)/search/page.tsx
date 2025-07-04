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
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-mono">
          {params.q ? `Search results for "${params.q}"` : 'Search'}
        </h1>
      </div>

      {/* Filters - Full width responsive */}
      <SearchFiltersResponsive />

      <div className="mt-6">
        {/* Results - Server Component with Suspense */}
        <main>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-square bg-gray-200 animate-pulse" />
                    <div className="h-4 bg-gray-200 animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-200 animate-pulse w-1/2" />
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