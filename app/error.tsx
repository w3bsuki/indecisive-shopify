'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-mono">SOMETHING WENT WRONG</h1>
          <p className="text-black/60 font-mono">
            We couldn't load this page. Don't worry, it's not you - it's us.
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-black text-white hover:bg-black/80 font-mono"
          >
            TRY AGAIN
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="font-mono"
          >
            GO HOME
          </Button>
        </div>
      </div>
    </div>
  )
}