'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // FUTURE: Integrate error reporting (Sentry, LogRocket, etc.)
    // console.error('Product page error:', error)
  }, [error])

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Something went wrong!</h1>
        <p className="text-gray-600 mb-6 max-w-md">
          We couldn&apos;t load this product. This might be a temporary issue, please try again.
        </p>
        <div className="flex gap-4">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go back
          </Button>
        </div>
      </div>
    </div>
  )
}