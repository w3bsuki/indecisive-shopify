'use client'

import { Hero2 } from './hero-2'
import { HeroEnhancedServer } from './hero-enhanced-server'
import { useABTest } from '@/hooks/use-ab-test'

export function HeroWrapper() {
  const variant = useABTest({
    testName: 'hero-conversion',
    variants: ['original', 'enhanced'],
    defaultVariant: 'enhanced' // Start with enhanced version
  })
  
  if (variant === 'enhanced') {
    return <HeroEnhancedServer />
  }
  
  return <Hero2 />
}