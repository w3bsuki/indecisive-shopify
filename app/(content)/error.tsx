'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ContentError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4 font-mono">Content Error</h1>
        <p className="text-muted-foreground mb-6">
          We&apos;re having trouble loading this content. Please try refreshing or go back to the homepage.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default">
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline">
              Go Home
            </Button>
          </Link>
        </div>
        
        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}