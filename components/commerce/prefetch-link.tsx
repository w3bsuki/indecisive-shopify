'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useRef } from 'react'
import Link, { LinkProps } from 'next/link'
import { cn } from '@/lib/utils'

interface PrefetchLinkProps extends LinkProps {
  children: React.ReactNode
  className?: string
  prefetchDelay?: number
}

/**
 * Enhanced Link component that prefetches on hover/focus for instant navigation
 * Similar to Shopify's performance optimizations
 */
export function PrefetchLink({ 
  children, 
  className, 
  prefetchDelay = 150,
  ...props 
}: PrefetchLinkProps) {
  const router = useRouter()
  const prefetchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasPrefetched = useRef(false)

  const handlePrefetch = useCallback(() => {
    if (!hasPrefetched.current && typeof props.href === 'string') {
      prefetchTimeoutRef.current = setTimeout(() => {
        router.prefetch(props.href as string)
        hasPrefetched.current = true
      }, prefetchDelay)
    }
  }, [router, props.href, prefetchDelay])

  const handleMouseLeave = useCallback(() => {
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current)
    }
  }, [])

  const handleClick = useCallback(() => {
    // Clear any pending prefetch on click
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current)
    }
  }, [])

  return (
    <Link
      {...props}
      className={cn('prefetch-link', className)}
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      prefetch={false} // Disable Next.js default prefetch
    >
      {children}
    </Link>
  )
}