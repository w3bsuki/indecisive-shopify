'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to error reporting service
    console.error('Global error caught:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
          <div className="text-center space-y-6 max-w-md">
            <div className="space-y-2">
              <h1 className="text-4xl font-mono font-bold text-destructive">
                Something went wrong!
              </h1>
              <p className="text-muted-foreground">
                An unexpected error has occurred. Please try again or contact support if the problem persists.
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground font-mono">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={reset}
                variant="default" 
                size="lg"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline" 
                size="lg"
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}