'use client'

import { useEffect } from 'react'

export function ToolbarSetup() {
  useEffect(() => {
    // Only initialize in development mode
    if (process.env.NODE_ENV === 'development') {
      // Dynamic import to avoid including in production bundle
      import('@21st-extension/toolbar').then(({ initToolbar }) => {
        const stagewiseConfig = {
          plugins: [],
        }
        
        initToolbar(stagewiseConfig)
      }).catch((error) => {
        console.warn('21st Extension Toolbar not available:', error)
      })
    }
  }, [])

  // This component renders nothing - it's just for side effects
  // ToolbarSetup is now deprecated and replaced by TwentyFirstToolbar in layout.tsx
  return null
}