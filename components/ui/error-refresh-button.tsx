'use client'

import { Button } from '@/components/ui/button'

export function ErrorRefreshButton() {
  return (
    <Button 
      onClick={() => window.location.reload()} 
      className="px-6 py-3"
    >
      Refresh Page
    </Button>
  )
}