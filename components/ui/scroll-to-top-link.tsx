'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ComponentProps } from 'react'

interface ScrollToTopLinkProps extends ComponentProps<typeof Link> {
  children: React.ReactNode
}

export function ScrollToTopLink({ children, href, ...props }: ScrollToTopLinkProps) {
  const router = useRouter()
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' })
    // Then navigate
    router.push(href.toString())
  }
  
  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}