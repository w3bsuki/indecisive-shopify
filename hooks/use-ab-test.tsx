'use client'

import { useEffect, useState } from 'react'

interface ABTestConfig {
  testName: string
  variants: string[]
  defaultVariant?: string
}

export function useABTest({ testName, variants, defaultVariant }: ABTestConfig) {
  const [variant, setVariant] = useState<string>(defaultVariant || variants[0])
  
  useEffect(() => {
    // Skip on server
    if (typeof window === 'undefined') return
    
    // Check if user already has a variant assigned
    const storageKey = `ab-test-${testName}`
    const storedVariant = localStorage.getItem(storageKey)
    
    if (storedVariant && variants.includes(storedVariant)) {
      setVariant(storedVariant)
    } else {
      // Randomly assign a variant
      const randomIndex = Math.floor(Math.random() * variants.length)
      const selectedVariant = variants[randomIndex]
      setVariant(selectedVariant)
      localStorage.setItem(storageKey, selectedVariant)
    }
  }, [testName, variants])
  
  return variant
}