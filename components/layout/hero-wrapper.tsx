'use client'

import { Hero2 } from './hero-2'
import { HeroEnhanced } from './hero-enhanced'
import { useABTest } from '@/hooks/use-ab-test'

export function HeroWrapper() {
  const variant = useABTest({
    testName: 'hero-conversion',
    variants: ['original', 'enhanced'],
    defaultVariant: 'enhanced' // Start with enhanced version
  })
  
  if (variant === 'enhanced') {
    return <HeroEnhanced />
  }
  
  return <Hero2 />
}